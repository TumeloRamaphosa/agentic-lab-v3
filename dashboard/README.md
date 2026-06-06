# StudEx Valley OS — dashboard preview

A runnable **preview** of the Hono `:3141` dashboard the build agent ships in
`agents-dr.fixit`. Vanilla HTML + ES modules + a tiny Node static server.
**Zero deps to run** (Playwright only for the verify smoke).

Reads the configs we already have:
- `factory/config/businesses.json` → Businesses tab (each one its own card, machine residence, agents)
- `valley/agents/roster.json` → Agents + Council tabs
- `rag/status.json` → 2nd Brain tab (vault ↔ Pinecone sync health, per-business chunk counts)
- `valley/mission.json` → Mission kanban (falls back to a small demo board if no missions yet)

## Run it

```bash
cd dashboard
node server.mjs              # http://localhost:3141
```

To populate the 2nd Brain tab with real data, run the sync first:
```bash
VAULT_PATH="…/2nd Brain" node ../rag/sync.mjs
```

## Tabs (all live)

| Tab | What it shows |
|---|---|
| **Mission** | three orange/yellow kanban bands (Queued · Running · Done) with cards |
| **2nd Brain** | vault path · last-sync time (green < 25h, amber < 49h, red beyond) · backend (sqlite/Pinecone) · per-namespace table with chunk counts + machine |
| **Businesses** | one card per business: machine residence, vault folder, vector namespace, agents, channels, colour stripe |
| **Agents** | grid of 10 roster agents: role, voice, task class, model candidates |
| **Council** | 10 seats in council order — Robusca first, business agents in sequence |
| **Ledger / Night Build** | stubs (wire to cost-footer summary and `proposals/INDEX.md` when those exist) |

Top: transparent bold-white world-clock strip (8 cities, ticks every 30s).
Bottom: status bar (agents online · open missions · Night Build ETA · today's local-vs-Claude token split).

## Verified

```
PASS: 8 clocks · 3 kanban bands · 7 cards · 7 tabs render · 0 console errors
```
Screenshots of every tab in `verify/out/` after `npm run verify`.

## Honest scope

- This is a **preview / reference**. The production dashboard in `agents-dr.fixit`
  uses Hono + Vite + React + SSE per the mega prompt — but the *contracts* (endpoints,
  configs, page layout, design system) are identical. The build agent ports this UI.
- World clocks are real (`Intl.DateTimeFormat`); cards/numbers reflect real configs.
- "1.2M local · 0 Claude" status numbers are placeholders until the cost-footer
  daily journal lands.
