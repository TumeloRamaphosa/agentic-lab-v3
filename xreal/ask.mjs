/**
 * /ask backend for the XREAL viewer — the RAG loop.
 *
 * On first call it builds an in-memory index of the vault (VAULT_PATH, or the
 * repo's docs/ as a fallback for local demo), then answers a question by
 * retrieving the most relevant vault chunks. If an Ollama LLM is reachable it
 * composes a spoken sentence; otherwise it returns the top chunk text directly
 * (still useful, and testable offline with RAG_FAKE=1).
 *
 * This ties three layers together: vault (truth) -> rag/ (retrieval) -> agent
 * answer -> the viewer speaks it via ElevenLabs (server.mjs /tts).
 */
import { ollamaEmbedder, fakeEmbedder } from "../rag/src/embed.mjs";
import { memoryStore } from "../rag/src/stores/memory.mjs";
import { ingestVault } from "../rag/src/ingest.mjs";
import { retrieveContext } from "../rag/src/query.mjs";
import { existsSync } from "node:fs";

let ready = null;

function pickVault() {
  const v = process.env.VAULT_PATH;
  if (v && existsSync(v)) return v;
  // local demo fallback: the spec docs in this repo
  for (const p of ["../docs", "docs", "../rag", "."]) if (existsSync(p)) return p;
  return ".";
}

async function init() {
  const embedder = process.env.RAG_FAKE ? fakeEmbedder() : ollamaEmbedder();
  const store = memoryStore(); // in-process; rebuilt each boot
  const root = pickVault();
  const res = await ingestVault({ root, embedder, store });
  return { embedder, store, root, ...res };
}

/** Optional Ollama composition; falls back to the top chunk if no LLM. */
async function compose(question, context, agent) {
  const base = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.ASK_MODEL || "qwen2.5:7b";
  const persona = agent ? `You are ${agent}. ` : "";
  try {
    const r = await fetch(`${base}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model, stream: false,
        prompt: `${persona}Answer the question using ONLY the context from the vault. Be brief and speak naturally (2-3 sentences). If the context does not answer it, say so.\n\nContext:\n${context}\n\nQuestion: ${question}\nAnswer:`,
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (r.ok) { const j = await r.json(); if (j.response?.trim()) return j.response.trim(); }
  } catch { /* no LLM -> fall back */ }
  // Fallback: speak the most relevant chunk, trimmed.
  const first = context.split("\n\n---\n\n")[0] || "I couldn't find anything in the vault about that.";
  return first.replace(/^\[.*?\]\n/, "").slice(0, 320);
}

/**
 * @param {{question:string, agent?:string, topK?:number}} args
 * @returns {Promise<{answer:string, sources:string[]}>}
 */
export async function ask({ question, agent, topK = 6 }) {
  if (!ready) ready = init();
  const { embedder, store } = await ready;
  const { context, sources } = await retrieveContext({ question, embedder, store, topK });
  const answer = await compose(question, context, agent);
  return { answer, sources };
}

/** Index stats for the HUD / health. */
export async function indexInfo() {
  if (!ready) ready = init();
  const r = await ready;
  return { root: r.root, files: r.files, chunks: r.chunks };
}
