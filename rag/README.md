# StudEx RAG — vault context for agents

Index your Obsidian **2nd Brain** vault and query it for agent RAG context.

**Principle:** the vault is the source of truth. The vector store is a
*disposable index* over it. Rebuild it anytime; never treat it as canonical.

## Backends (pick in `.env` via `VECTOR_STORE`)

| Backend | `VECTOR_STORE` | When | Cost | Privacy |
|---|---|---|---|---|
| **sqlite-vec** (default) | `sqlite` | day-to-day, vault < ~100k chunks | free | fully local · POPIA-clean |
| **Pinecone** (opt-in) | `pinecone` | large vault, or shared RAG across machines | $/mo | chunks leave your Mac |
| in-memory | `memory` | tests / tiny vaults | free | ephemeral |

Embeddings are **local** via Ollama `nomic-embed-text` (768-dim, free) for all
backends — even Pinecone only pays for storage + query, not embeddings.

## Quick start

```bash
cd rag
cp .env.example .env          # set VAULT_PATH; pick VECTOR_STORE
npm install                   # only needed for the sqlite backend
ollama pull nomic-embed-text  # the embedder

# Index the vault
node cli.mjs ingest           # uses $VAULT_PATH
# Ask it something
node cli.mjs query "what does Charlie handle for Studex Meat?"
node cli.mjs count
```

## Switch to Pinecone

1. Create a Pinecone index at **dimension 768** (matches nomic-embed-text).
2. In `.env`: `VECTOR_STORE=pinecone`, set `PINECONE_API_KEY` + `PINECONE_INDEX_HOST`.
3. `node cli.mjs ingest` — same command, now upserts to Pinecone.

No code changes — the `VectorStore` interface is the same for both.

## Daily 2nd Brain sync (per-business)

`sync.mjs` re-indexes the whole vault **and** each business folder into its own
namespace, driven by `factory/config/businesses.json`. It writes `rag/status.json`
(last sync, backend, per-business chunk counts + machine) — the dashboard's
**2nd Brain page** reads this to show the live Obsidian↔Pinecone connection.

```bash
VAULT_PATH="…/2nd Brain" node sync.mjs        # all businesses → sqlite (default)
VECTOR_STORE=pinecone node sync.mjs           # mirror to Pinecone namespaces
RAG_FAKE=1 VECTOR_STORE=memory node sync.mjs  # offline smoke
```

Wire to cron at **07:00 SAST** (matches `businesses.json` → `vault.sync.schedule`)
so the index tracks the vault every day. Each business gets its own namespace
(sqlite db-per-business; Pinecone namespace) so agents query only their business's
context.

## Offline smoke (no Ollama / no Pinecone)

```bash
npm test                      # 5/5 pipeline assertions, fake embedder + memory store
RAG_FAKE=1 VECTOR_STORE=memory node cli.mjs query "..."   # deterministic, non-semantic
```

## How agents use it

```js
import { ollamaEmbedder } from "./src/embed.mjs";
import { makeStore } from "./src/store.mjs";
import { retrieveContext } from "./src/query.mjs";

const embedder = ollamaEmbedder();
const store = await makeStore({ dim: embedder.dim });
const { context, sources } = await retrieveContext({
  question: userMessage, embedder, store, topK: 6,
});
// prepend `context` to the agent prompt; cite `sources`
```

This is the **Memory Inject** step from the architecture: before an agent
answers, it pulls the most relevant vault chunks and injects them with
citations back to the note. In the Valley OS build, `valley/src/core/memory.ts`
ports this with the same `VectorStore` interface.

## Files

```
rag/
├── cli.mjs                 ingest | query | count
├── src/
│   ├── types.mjs           VectorStore / Embedder / Chunk contracts
│   ├── chunk.mjs           markdown-aware chunker (heading-respecting)
│   ├── embed.mjs           ollamaEmbedder (nomic-embed-text) + fakeEmbedder
│   ├── ingest.mjs          walk vault → chunk → embed → upsert
│   ├── query.mjs           embed question → topK → cited context block
│   ├── store.mjs           backend factory (env-driven)
│   └── stores/
│       ├── memory.mjs      in-memory cosine
│       ├── sqlite.mjs      better-sqlite3 + sqlite-vec (default)
│       └── pinecone.mjs    Pinecone REST (opt-in)
└── test/rag.test.mjs       5 offline assertions
```
