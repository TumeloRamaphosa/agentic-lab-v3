/**
 * Pinecone — opt-in cloud RAG backend. Status reflects rag/status.json
 * (per-business namespaces) when VECTOR_STORE=pinecone.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const here = dirname(fileURLToPath(import.meta.url));
const STATUS = join(here, "../../..", "rag/status.json");

export default {
  name: "pinecone",
  display: "Pinecone",
  role: "research",
  agentHint: "research",
  description: "Cloud vector index (opt-in). Mirrors the per-business sqlite-vec namespaces when VECTOR_STORE=pinecone.",
  envKey: "PINECONE_API_KEY",
  docsUrl: "https://docs.pinecone.io",
  async status() {
    const configured = !!process.env.PINECONE_API_KEY;
    let last = null, businesses = [], backend = "sqlite";
    if (existsSync(STATUS)) {
      try { const s = JSON.parse(readFileSync(STATUS, "utf8"));
        last = s.lastSync; backend = s.backend; businesses = (s.businesses || []).map((b) => ({ ns: b.namespace, chunks: b.chunks }));
      } catch {}
    }
    return {
      configured,
      lastSync: last,
      sample: { backend, namespaces: businesses, note: configured ? "key present" : "local sqlite default; set PINECONE_API_KEY + PINECONE_INDEX_HOST to mirror to cloud" },
    };
  },
};
