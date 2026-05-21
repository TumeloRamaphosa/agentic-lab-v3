import { memoryStore } from "./stores/memory.mjs";

/**
 * Pick a VectorStore from env. Default = sqlite-vec (local, private, free).
 *   VECTOR_STORE = sqlite | pinecone | memory
 * @param {{dim:number}} opts
 * @returns {Promise<import('./types.mjs').VectorStore>}
 */
export async function makeStore(opts) {
  const kind = (process.env.VECTOR_STORE ?? "sqlite").toLowerCase();
  if (kind === "memory") return memoryStore();
  if (kind === "pinecone") {
    const { pineconeStore } = await import("./stores/pinecone.mjs");
    return pineconeStore({ dim: opts.dim });
  }
  // default
  const { sqliteStore } = await import("./stores/sqlite.mjs");
  return sqliteStore({ dim: opts.dim });
}
