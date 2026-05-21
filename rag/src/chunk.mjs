/**
 * Markdown-aware chunker. Splits a note into chunks that respect heading
 * boundaries, then packs paragraphs up to ~maxChars with a small overlap so
 * a concept that straddles a boundary still retrieves.
 */

/** @param {string} md @param {string} source @param {{maxChars?:number, overlap?:number}} [opts] */
export function chunkMarkdown(md, source, opts = {}) {
  const maxChars = opts.maxChars ?? 1200;
  const overlap = opts.overlap ?? 150;

  // Strip YAML frontmatter
  const body = md.replace(/^---\n[\s\S]*?\n---\n/, "");

  // Split into sections by heading, carrying the heading text with each.
  const lines = body.split("\n");
  /** @type {{heading:string, text:string}[]} */
  const sections = [];
  let heading = "(top)";
  let buf = [];
  const flush = () => {
    const text = buf.join("\n").trim();
    if (text) sections.push({ heading, text });
    buf = [];
  };
  for (const line of lines) {
    const m = /^(#{1,6})\s+(.*)$/.exec(line);
    if (m) {
      flush();
      heading = m[2].trim();
    } else {
      buf.push(line);
    }
  }
  flush();

  /** @type {import('./types.mjs').Chunk[]} */
  const chunks = [];
  let index = 0;
  for (const sec of sections) {
    // Pack paragraphs up to maxChars
    const paras = sec.text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    let cur = "";
    const push = (t) => {
      const text = t.trim();
      if (!text) return;
      chunks.push({
        id: `${source}#${index}`,
        text: sec.heading === "(top)" ? text : `${sec.heading}\n\n${text}`,
        source,
        heading: sec.heading,
        index,
      });
      index += 1;
    };
    for (const p of paras) {
      if (cur && cur.length + p.length + 2 > maxChars) {
        push(cur);
        cur = cur.slice(Math.max(0, cur.length - overlap)) + "\n\n" + p;
      } else {
        cur = cur ? cur + "\n\n" + p : p;
      }
    }
    push(cur);
  }
  return chunks;
}
