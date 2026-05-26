# Valley OS — core engine (reference)

A **runnable, tested** core of the StudEx Valley OS Hive Mind. Plain ESM (matches
`rag/` + `factory/scripts`), so it runs offline with no Ollama/Claude/network via
a built-in **fake model provider**. The build agent ports this to TypeScript +
the Claude Agent SDK in `agents-dr.fixit`; the contracts are identical.

> This is the engine that was previously **0 files** — the spec made real and tested.

## Run it offline

```bash
node valley/test/valley.test.mjs        # 10/10 — full loop with fake provider
VALLEY_FAKE_MODEL=1 node valley/cli.mjs standup     # 08:00 Robusca standup
VALLEY_FAKE_MODEL=1 node valley/cli.mjs council      # 09:00 Agent Council
node valley/cli.mjs route "a customer asks about a beef order"   # → charlie
node valley/cli.mjs mission add "Reply to meat customer"          # auto-assigns
```

With real models, drop `VALLEY_FAKE_MODEL` and set `ANTHROPIC_API_KEY` / run Ollama.

## What's implemented

| Module | Role |
|---|---|
| `core/killswitches.mjs` | env flags (default-safe) + kill-phrase detection |
| `core/audit.mjs` | append-only JSONL log, correlation ids, integrity check |
| `core/model.mjs` | multi-provider client (ollama, mesh-llm, openai, groq, openrouter, anthropic) + offline `fake` |
| `core/cost-footer.mjs` | optimization-scored router — **cheapest model clearing the task's quality bar** ($ is the goal; local wins; escalates only when quality demands) |
| `core/exfil-guard.mjs` | secret scan before outbound (pinecone/cursor/anthropic/openai/slack/aws keys) |
| `core/classifier.mjs` | route a task → agent (model-assisted; keyword fallback) |
| `core/mission.mjs` | Queued/Running/Done store, auto-assign |
| `agents/loader.mjs` | load the roster (`valley/agents/roster.json`, 10 agents) |
| `agents/runner.mjs` | one agent turn: route model → complete → exfil-scan → audit |
| `rituals/standup.mjs` | 08:00 Robusca standup (Morning Digest structure) |
| `rituals/council.mjs` | 09:00 council — 9 reports + Robusca consolidation |

## Verified (real output)

```
PASS 10/10 — Valley OS core engine runs end-to-end offline
```
Covers: kill switches + kill phrase · fake model · cost-routing (local default,
escalation when quality demands) · exfil guard · audit integrity · classifier
(meat→Charlie, code→DevOps) · agent turn · mission auto-assign · standup · council.

## Not here (needs your hardware)
Live Slack/Discord/ElevenLabs/Composio/Pinecone, the Hono `:3141` dashboard, the
Night Build sandboxing, and the 5-machine mesh — those run on the Mac via the
full `docs/MEGA_PROMPT.md` build. This engine is the brain they plug into.
