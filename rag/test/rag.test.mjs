/**
 * Verifies the RAG pipeline end-to-end with the offline fake embedder + memory
 * store (no Ollama, no Pinecone needed). Asserts chunking, ingest, and that a
 * query retrieves the topically-correct note.
 *
 * Run: node rag/test/rag.test.mjs
 */
import assert from "node:assert";
import { chunkMarkdown } from "../src/chunk.mjs";
import { fakeEmbedder } from "../src/embed.mjs";
import { memoryStore } from "../src/stores/memory.mjs";
import { retrieveContext } from "../src/query.mjs";

let pass = 0;
const ok = (name) => { console.log("  ok -", name); pass++; };

// 1. Chunker respects headings + frontmatter
const md = `---\ntitle: x\n---\n# Studex Meat\nCharlie answers WhatsApp orders for the meat business.\n\n# Pinecone\nThe vector index stores embedded vault chunks for retrieval.`;
const chunks = chunkMarkdown(md, "04-Studex-Meat.md");
assert.ok(chunks.length >= 2, "expected >=2 chunks");
assert.ok(chunks.every((c) => c.id.startsWith("04-Studex-Meat.md#")), "ids carry source");
assert.ok(chunks.some((c) => c.heading === "Studex Meat"), "heading captured");
ok("chunkMarkdown splits on headings, strips frontmatter, carries source+heading");

// 2. Ingest two distinct notes, query retrieves the right one
const store = memoryStore();
const embedder = fakeEmbedder();
const docs = [
  { source: "meat.md", text: "Charlie handles WhatsApp meat orders for Studex Meat customers." },
  { source: "infra.md", text: "Pinecone is the cloud vector store backend for RAG retrieval." },
];
const flatChunks = docs.map((d, i) => ({ id: `${d.source}#0`, text: d.text, source: d.source, heading: "(top)", index: 0 }));
const vectors = await embedder.embed(flatChunks.map((c) => c.text));
await store.upsert(flatChunks.map((c, i) => ({ ...c, vector: vectors[i] })));
assert.strictEqual(await store.count(), 2, "two chunks indexed");
ok("ingest upserts embedded chunks into the store");

// 3. Query about meat returns the meat note first
const meat = await retrieveContext({ question: "who replies to meat customers on whatsapp?", embedder, store, topK: 2 });
assert.strictEqual(meat.hits[0].source, "meat.md", `expected meat.md first, got ${meat.hits[0].source}`);
ok("query retrieves the topically-correct note (meat)");

// 4. Query about vector DB returns the infra note first
const infra = await retrieveContext({ question: "which cloud vector database do we use?", embedder, store, topK: 2 });
assert.strictEqual(infra.hits[0].source, "infra.md", `expected infra.md first, got ${infra.hits[0].source}`);
ok("query retrieves the topically-correct note (infra)");

// 5. Context block carries citations
assert.ok(infra.context.includes("[infra.md]"), "context cites source");
ok("retrieveContext emits citations back to the vault note");

console.log(`\nPASS ${pass}/5`);
