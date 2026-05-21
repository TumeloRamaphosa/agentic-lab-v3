/**
 * RAG types (JSDoc) — kept in plain ESM so the module is runnable in Node
 * with no build step. The build agent ports these to TypeScript interfaces
 * in valley/src/core/ when it lands the OS in agents-dr.fixit.
 *
 * @typedef {Object} Chunk
 * @property {string} id            Stable id: `${relPath}#${index}`
 * @property {string} text          Chunk content
 * @property {string} source        Vault-relative path of the note
 * @property {string} heading       Nearest markdown heading (context)
 * @property {number} index         Chunk index within the note
 *
 * @typedef {Chunk & { vector: number[] }} EmbeddedChunk
 *
 * @typedef {Object} Hit
 * @property {string} id
 * @property {string} text
 * @property {string} source
 * @property {string} heading
 * @property {number} score         Cosine similarity (0..1)
 *
 * An Embedder turns text into a fixed-dim vector.
 * @typedef {Object} Embedder
 * @property {number} dim
 * @property {(texts: string[]) => Promise<number[][]>} embed
 *
 * A VectorStore indexes EmbeddedChunks and answers nearest-neighbour queries.
 * @typedef {Object} VectorStore
 * @property {(chunks: EmbeddedChunk[]) => Promise<void>} upsert
 * @property {(vector: number[], topK: number) => Promise<Hit[]>} query
 * @property {() => Promise<number>} count
 * @property {() => Promise<void>} [close]
 */

export const NOMIC_DIM = 768;
