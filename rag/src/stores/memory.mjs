/**
 * In-memory cosine store. Zero dependencies. Good for tests and tiny vaults.
 * Not persistent — rebuilt on each run.
 * @returns {import('../types.mjs').VectorStore}
 */
export function memoryStore() {
  /** @type {import('../types.mjs').EmbeddedChunk[]} */
  let rows = [];
  const dot = (a, b) => {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
  };
  const norm = (a) => Math.hypot(...a) || 1;
  return {
    async upsert(chunks) {
      const byId = new Map(rows.map((r) => [r.id, r]));
      for (const c of chunks) byId.set(c.id, c);
      rows = [...byId.values()];
    },
    async query(vector, topK) {
      const qn = norm(vector);
      return rows
        .map((r) => ({
          id: r.id,
          text: r.text,
          source: r.source,
          heading: r.heading,
          score: dot(vector, r.vector) / (qn * (norm(r.vector) || 1)),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
    },
    async count() {
      return rows.length;
    },
  };
}
