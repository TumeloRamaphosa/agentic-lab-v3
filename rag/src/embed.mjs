import { NOMIC_DIM } from "./types.mjs";

/**
 * Local embedder via Ollama `nomic-embed-text` (768-dim, free).
 * No cloud, no token cost. Requires `ollama pull nomic-embed-text`.
 * @returns {import('./types.mjs').Embedder}
 */
export function ollamaEmbedder(opts = {}) {
  const baseUrl = opts.baseUrl ?? process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const model = opts.model ?? "nomic-embed-text";
  return {
    dim: NOMIC_DIM,
    async embed(texts) {
      const out = [];
      for (const text of texts) {
        const r = await fetch(`${baseUrl}/api/embeddings`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ model, prompt: text }),
        });
        if (!r.ok) throw new Error(`ollama embeddings ${r.status}: ${await r.text()}`);
        const j = await r.json();
        out.push(j.embedding);
      }
      return out;
    },
  };
}

/**
 * Deterministic hashing embedder — NO network, NO model. Used for tests and
 * offline smoke runs so the pipeline is verifiable without Ollama/Pinecone.
 * Not semantically meaningful; do not use in production.
 * @returns {import('./types.mjs').Embedder}
 */
export function fakeEmbedder(dim = 64) {
  const hash = (s) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  };
  return {
    dim,
    async embed(texts) {
      return texts.map((t) => {
        const v = new Array(dim).fill(0);
        for (const tok of t.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)) {
          v[hash(tok) % dim] += 1;
        }
        const norm = Math.hypot(...v) || 1;
        return v.map((x) => x / norm);
      });
    },
  };
}
