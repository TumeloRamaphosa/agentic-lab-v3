#!/usr/bin/env node
/**
 * StudEx RAG CLI — index your 2nd Brain vault and query it for agent context.
 *
 *   node rag/cli.mjs ingest "<vault-path>"      # default vault = $VAULT_PATH
 *   node rag/cli.mjs query  "<question>"        # retrieve context
 *   node rag/cli.mjs count                       # how many chunks indexed
 *
 * Embedder: Ollama nomic-embed-text (local, free). Set RAG_FAKE=1 to use the
 * offline deterministic embedder (smoke tests only — not semantic).
 * Store: $VECTOR_STORE = sqlite (default) | pinecone | memory.
 */
import { ollamaEmbedder, fakeEmbedder } from "./src/embed.mjs";
import { makeStore } from "./src/store.mjs";
import { ingestVault } from "./src/ingest.mjs";
import { retrieveContext } from "./src/query.mjs";

const [cmd, arg] = process.argv.slice(2);
const embedder = process.env.RAG_FAKE ? fakeEmbedder() : ollamaEmbedder();

const vault = () =>
  arg || process.env.VAULT_PATH || (() => { throw new Error("pass a vault path or set VAULT_PATH"); })();

async function main() {
  const store = await makeStore({ dim: embedder.dim });
  if (cmd === "ingest") {
    const root = vault();
    process.stdout.write(`Ingesting ${root} (store=${process.env.VECTOR_STORE ?? "sqlite"})\n`);
    const res = await ingestVault({
      root, embedder, store,
      onProgress: (n, t) => process.stdout.write(`\r  ${n}/${t} chunks`),
    });
    process.stdout.write(`\nDone: ${res.files} notes -> ${res.chunks} chunks. Indexed: ${await store.count()}\n`);
  } else if (cmd === "query") {
    if (!arg) throw new Error('usage: query "your question"');
    const { context, sources } = await retrieveContext({ question: arg, embedder, store });
    console.log("=== CONTEXT ===\n" + context);
    console.log("\n=== SOURCES ===\n" + sources.join("\n"));
  } else if (cmd === "count") {
    console.log(`${await store.count()} chunks indexed`);
  } else {
    console.log("usage: node rag/cli.mjs <ingest|query|count> [arg]");
    process.exit(1);
  }
  await store.close?.();
}
main().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
