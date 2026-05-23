import { memoryStore } from "./stores/memory.mjs";

/**
 * Pick a VectorStore from env. Default = sqlite-vec (local, private, free).
 *   VECTOR_STORE = sqlite | pinecone | memory
 * `namespace` isolates a business: sqlite -> its own db file; pinecone -> its
 * own namespace; memory -> ignored (single process).
 * @param {{dim:number, namespace?:string, path?:string}} opts
 * @returns {Promise<import('./types.mjs').VectorStore>}
 */
export async function makeStore(opts) {
  const kind = (process.env.VECTOR_STORE ?? "sqlite").toLowerCase();
  const ns = opts.namespace;
  if (kind === "memory") return memoryStore();
  if (kind === "pinecone") {
    const { pineconeStore } = await import("./stores/pinecone.mjs");
    return pineconeStore({ dim: opts.dim, namespace: ns });
  }
  // default sqlite — one db file per namespace so businesses stay isolated
  const { sqliteStore } = await import("./stores/sqlite.mjs");
  const path = opts.path ?? (ns ? `rag-index-${ns}.sqlite` : undefined);
  return sqliteStore({ dim: opts.dim, path });
}
