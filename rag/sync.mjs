#!/usr/bin/env node
/**
 * Daily 2nd Brain sync. Reads factory/config/businesses.json and re-indexes
 * each business's vault folder into its OWN namespace (sqlite db file or
 * Pinecone namespace), plus a whole-vault "all" namespace. Writes a status
 * file the dashboard's "2nd Brain" page reads to show freshness + counts.
 *
 *   VAULT_PATH=... node rag/sync.mjs            # sync all businesses
 *   RAG_FAKE=1 node rag/sync.mjs                # offline (CI / no Ollama)
 *
 * Wire to cron at 07:00 SAST (matches businesses.json vault.sync.schedule).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { ollamaEmbedder, fakeEmbedder } from "./src/embed.mjs";
import { makeStore } from "./src/store.mjs";
import { ingestVault } from "./src/ingest.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");

function loadBusinesses() {
  const p = join(repoRoot, "factory/config/businesses.json");
  return JSON.parse(readFileSync(p, "utf8"));
}

function vaultRoot(cfg) {
  // Resolve ${VAULT_PATH}; fall back to repo docs/ for offline demo.
  let base = process.env.VAULT_PATH || "";
  if (!base || !existsSync(base)) base = join(repoRoot, "docs");
  const root = cfg.vault?.root && existsSync(join(base, cfg.vault.root))
    ? join(base, cfg.vault.root) : base;
  return root;
}

async function syncOne(folderPath, namespace, embedder) {
  if (!existsSync(folderPath)) {
    return { namespace, files: 0, chunks: 0, indexed: 0, missing: true };
  }
  const store = await makeStore({ dim: embedder.dim, namespace });
  const res = await ingestVault({ root: folderPath, embedder, store });
  const indexed = await store.count();
  await store.close?.();
  return { namespace, files: res.files, chunks: res.chunks, indexed };
}

async function main() {
  const cfg = loadBusinesses();
  const embedder = process.env.RAG_FAKE ? fakeEmbedder() : ollamaEmbedder();
  const backend = process.env.VECTOR_STORE ?? "sqlite";
  const root = vaultRoot(cfg);

  const results = [];
  // whole-vault index
  results.push({ slug: "all", name: "Whole vault", ...(await syncOne(root, "all", embedder)) });
  // per-business
  for (const b of cfg.businesses) {
    const folder = join(root, b.vaultFolder);
    const r = await syncOne(folder, b.vectorNamespace, embedder);
    results.push({ slug: b.slug, name: b.name, machine: b.machine, agents: b.agents, ...r });
  }

  const status = {
    lastSync: new Date().toISOString(),
    backend,
    vaultRoot: root,
    embedder: process.env.RAG_FAKE ? "fake" : "ollama:nomic-embed-text",
    businesses: results,
    totalChunks: results.reduce((s, r) => s + (r.chunks || 0), 0),
  };
  writeFileSync(join(here, "status.json"), JSON.stringify(status, null, 2));

  for (const r of results) {
    const tag = r.missing ? "(folder missing — create it in the vault)" : `${r.files} files → ${r.chunks} chunks`;
    process.stdout.write(`  ${r.slug.padEnd(16)} [${r.namespace}] ${tag}\n`);
  }
  process.stdout.write(`Synced ${results.length} namespaces (backend=${backend}) → rag/status.json\n`);
}
main().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
