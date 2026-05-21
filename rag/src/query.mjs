/**
 * Embed a question, retrieve topK chunks, and assemble an agent-ready context
 * block with citations back to the vault note.
 * @param {{question:string, embedder:import('./types.mjs').Embedder, store:import('./types.mjs').VectorStore, topK?:number, maxChars?:number}} args
 */
export async function retrieveContext({ question, embedder, store, topK = 6, maxChars = 4000 }) {
  const [qv] = await embedder.embed([question]);
  const hits = await store.query(qv, topK);

  let used = 0;
  const blocks = [];
  for (const h of hits) {
    const cite = `[${h.source}${h.heading && h.heading !== "(top)" ? " › " + h.heading : ""}]`;
    const block = `${cite}\n${h.text}`;
    if (used + block.length > maxChars) break;
    blocks.push(block);
    used += block.length;
  }

  return {
    hits,
    context: blocks.join("\n\n---\n\n"),
    sources: [...new Set(hits.map((h) => h.source))],
  };
}
