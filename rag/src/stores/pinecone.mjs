/**
 * Pinecone store (opt-in cloud backend). Uses the REST API directly so there
 * is no SDK dependency to install. Chunks leave your Mac when this is active —
 * use only when you accept that trade-off (large vault / shared cross-machine RAG).
 *
 * Requires in .env:
 *   PINECONE_API_KEY     your key (NEVER commit it)
 *   PINECONE_INDEX_HOST  the index host, e.g. my-index-xxxx.svc.us-east-1-aws.pinecone.io
 *                        (find it in the Pinecone console; create the index at
 *                        dimension = your embedder dim, e.g. 768 for nomic-embed-text)
 *
 * @param {{apiKey?:string, host?:string, namespace?:string, dim:number}} opts
 * @returns {Promise<import('../types.mjs').VectorStore>}
 */
export async function pineconeStore(opts) {
  const apiKey = opts.apiKey ?? process.env.PINECONE_API_KEY;
  const host = opts.host ?? process.env.PINECONE_INDEX_HOST;
  const namespace = opts.namespace ?? process.env.PINECONE_NAMESPACE ?? "studex-vault";
  if (!apiKey) throw new Error("PINECONE_API_KEY not set");
  if (!host) throw new Error("PINECONE_INDEX_HOST not set (create the index at dim=" + opts.dim + ")");
  const base = host.startsWith("http") ? host : `https://${host}`;
  const headers = { "Api-Key": apiKey, "content-type": "application/json", "X-Pinecone-API-Version": "2025-01" };

  return {
    async upsert(chunks) {
      // Pinecone caps batch payload size; chunk into batches of 100.
      for (let i = 0; i < chunks.length; i += 100) {
        const batch = chunks.slice(i, i + 100).map((c) => ({
          id: c.id,
          values: c.vector,
          metadata: { text: c.text, source: c.source, heading: c.heading, idx: c.index },
        }));
        const r = await fetch(`${base}/vectors/upsert`, {
          method: "POST",
          headers,
          body: JSON.stringify({ namespace, vectors: batch }),
        });
        if (!r.ok) throw new Error(`pinecone upsert ${r.status}: ${await r.text()}`);
      }
    },
    async query(vector, topK) {
      const r = await fetch(`${base}/query`, {
        method: "POST",
        headers,
        body: JSON.stringify({ namespace, vector, topK, includeMetadata: true }),
      });
      if (!r.ok) throw new Error(`pinecone query ${r.status}: ${await r.text()}`);
      const j = await r.json();
      return (j.matches ?? []).map((m) => ({
        id: m.id,
        text: m.metadata?.text ?? "",
        source: m.metadata?.source ?? "",
        heading: m.metadata?.heading ?? "",
        score: m.score,
      }));
    },
    async count() {
      const r = await fetch(`${base}/describe_index_stats`, { method: "POST", headers, body: "{}" });
      if (!r.ok) return -1;
      const j = await r.json();
      return j.namespaces?.[namespace]?.vectorCount ?? j.totalVectorCount ?? 0;
    },
  };
}
