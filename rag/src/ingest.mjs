import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { chunkMarkdown } from "./chunk.mjs";

/** Recursively collect .md / .markdown / .txt files under root. */
export function collectNotes(root) {
  /** @type {string[]} */
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (name.startsWith(".")) continue; // skip .obsidian, .git, etc.
      const p = join(dir, name);
      const s = statSync(p);
      if (s.isDirectory()) walk(p);
      else if ([".md", ".markdown", ".txt"].includes(extname(name).toLowerCase())) out.push(p);
    }
  };
  walk(root);
  return out;
}

/**
 * Walk vault → chunk → embed → upsert into the store.
 * @param {{root:string, embedder:import('./types.mjs').Embedder, store:import('./types.mjs').VectorStore, batch?:number, onProgress?:(n:number,total:number)=>void}} args
 */
export async function ingestVault({ root, embedder, store, batch = 32, onProgress }) {
  const files = collectNotes(root);
  /** @type {import('./types.mjs').Chunk[]} */
  let allChunks = [];
  for (const f of files) {
    const md = readFileSync(f, "utf8");
    allChunks = allChunks.concat(chunkMarkdown(md, relative(root, f)));
  }
  let done = 0;
  for (let i = 0; i < allChunks.length; i += batch) {
    const slice = allChunks.slice(i, i + batch);
    const vectors = await embedder.embed(slice.map((c) => c.text));
    await store.upsert(slice.map((c, j) => ({ ...c, vector: vectors[j] })));
    done += slice.length;
    onProgress?.(done, allChunks.length);
  }
  return { files: files.length, chunks: allChunks.length };
}
