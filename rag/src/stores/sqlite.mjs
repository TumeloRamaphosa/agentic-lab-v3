/**
 * Local persistent store — better-sqlite3 + sqlite-vec (default backend).
 * Deps are lazy-imported so the rest of the module (and tests) run without
 * them installed. Install: `npm i better-sqlite3 sqlite-vec`.
 *
 * @param {{path?:string, dim:number}} opts
 * @returns {Promise<import('../types.mjs').VectorStore>}
 */
export async function sqliteStore(opts) {
  const dim = opts.dim;
  const path = opts.path ?? process.env.RAG_SQLITE_PATH ?? "rag-index.sqlite";
  const { default: Database } = await import("better-sqlite3");
  const sqliteVec = await import("sqlite-vec");

  const db = new Database(path);
  sqliteVec.load(db);

  db.exec(`
    CREATE TABLE IF NOT EXISTS chunks (
      id TEXT PRIMARY KEY, text TEXT, source TEXT, heading TEXT, idx INTEGER
    );
    CREATE VIRTUAL TABLE IF NOT EXISTS vec_chunks USING vec0(
      id TEXT PRIMARY KEY, embedding FLOAT[${dim}]
    );
  `);

  const upsertMeta = db.prepare(
    `INSERT INTO chunks(id,text,source,heading,idx) VALUES(@id,@text,@source,@heading,@index)
     ON CONFLICT(id) DO UPDATE SET text=@text, source=@source, heading=@heading, idx=@index`
  );
  const delVec = db.prepare(`DELETE FROM vec_chunks WHERE id = ?`);
  const insVec = db.prepare(`INSERT INTO vec_chunks(id, embedding) VALUES (?, ?)`);

  return {
    async upsert(chunks) {
      const tx = db.transaction((cs) => {
        for (const c of cs) {
          upsertMeta.run(c);
          delVec.run(c.id);
          insVec.run(c.id, new Float32Array(c.vector));
        }
      });
      tx(chunks);
    },
    async query(vector, topK) {
      const rows = db
        .prepare(
          `SELECT v.id AS id, v.distance AS distance, c.text AS text, c.source AS source, c.heading AS heading
           FROM vec_chunks v JOIN chunks c ON c.id = v.id
           WHERE v.embedding MATCH ? ORDER BY v.distance LIMIT ?`
        )
        .all(new Float32Array(vector), topK);
      // sqlite-vec returns L2 distance; map to a 0..1 similarity for display.
      return rows.map((r) => ({
        id: r.id,
        text: r.text,
        source: r.source,
        heading: r.heading,
        score: 1 / (1 + r.distance),
      }));
    },
    async count() {
      return db.prepare(`SELECT COUNT(*) AS n FROM chunks`).get().n;
    },
    async close() {
      db.close();
    },
  };
}
