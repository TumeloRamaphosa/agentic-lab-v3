# OpenJarvis → StudEx Valley OS — fit & what to steal

**Source:** `github.com/open-jarvis/OpenJarvis` (Apache 2.0, v1.0.0 · May 2026).
A local-first personal-agent framework — a sibling of Valley OS. We do **not**
adopt its codebase (Python + Rust + Tauri = a second, competing brain). We
harvest its proven patterns into our Claude-Agent-SDK build.

> Apache 2.0: copying code is allowed with attribution + a NOTICE entry. Do not
> use the OpenJarvis name/marks for our product. If we lift any source file,
> keep its header and add it to a `NOTICES` file.

## Concept map

| OpenJarvis | Valley OS equivalent | Action |
|---|---|---|
| Local Ollama default, cloud on demand | Provider abstraction (`model.ts`) | already aligned — no change |
| 8 agents · on-demand / scheduled / continuous | Classifier + cron rituals + Dr Fix-It heartbeat | already aligned |
| **Morning Digest** (email+calendar+health+news → TTS) | Robusca 08:00 standup | **STEAL: briefing structure** |
| Deep Research (multi-hop, citations, web+local) | Research / OpenFang + `rag/` | enrich Research's prompt with multi-hop + citation discipline |
| Skills via `agentskills.io` standard | Vendored skills bundle | **STEAL: conform to the standard** |
| **Optimization framework** (energy/FLOPs/latency/$ as first-class) | Cost Footer (currently logs only) | **STEAL: make it a scored gate** |
| Learning loop from local traces | Idle Hours + L0–L3 memory | already covered |
| `jarvis` CLI / Tauri desktop | `mission`/`warroom` CLIs + Hono dashboard | no change |

## The three steals (highest value)

### 1. Optimization-scored Cost Footer  ← biggest win
Today our Cost Footer just records spend. OpenJarvis treats **energy, latency,
$ cost** as first-class constraints evaluated *alongside accuracy*. Upgrade the
Cost Footer into the **routing gate**: when the classifier chooses local-vs-Claude
(or which alternate), it scores each candidate on a weighted objective and picks
the cheapest model that clears the quality bar. This makes "minimize token spend"
(Tumelo's #1 goal) a measured decision, not a hope.

Scoring sketch (per candidate model for a task):
```
score = w_quality * expected_quality        # task class → model capability prior
      - w_dollar  * dollar_cost              # 0 for local Ollama
      - w_latency * expected_latency_s
      - w_energy  * energy_estimate          # local GPU/CPU watts × time
pick argmax(score) that meets min_quality for the task class.
```
Defaults: local Ollama wins unless the task class is flagged "needs escalation"
(by the classifier) or local output fails the `verification-before-completion`
gate — then it escalates to Claude. Log the chosen model + the runner-up + why,
into the daily journal (not per-message).

### 2. Morning Digest → richer Robusca standup
Adopt OpenJarvis's briefing skeleton for the 08:00 ritual. Robusca's
`daily/<today>.md` and spoken digest cover, in order:
1. **Inbox** — overnight email triage (via Composio Gmail): what needs a reply, what's noise.
2. **Calendar** — today's meetings + a pre-flight note per meeting (attendees, last thread, relevant vault notes).
3. **Numbers** — sales (CashClaw) · costs vs break-even (ledger) · social (The Lady).
4. **Overnight** — Night Build proposals + Idle-Hours findings.
5. **News/Research** — OpenFang's scan of partner/sector/agent news.
6. **Today's 3 priorities** + the human-ack block.
All spoken via ElevenLabs in Robusca's voice. This is a direct upgrade to the
existing standup spec.

### 3. agentskills.io skill conformance
Make our skills (and any new ones agents author during Idle Hours) conform to
the `agentskills.io` standard OpenJarvis uses, so skills are portable both ways
and we can pull from their catalog. Practically: keep `SKILL.md` frontmatter
(name, description, triggers, allowed-tools) compatible with the standard;
document the mapping in `docs/COMPOSIO_CONNECTORS.md` / a new `docs/SKILLS.md`.

## What NOT to do
- Don't run OpenJarvis and the Valley OS Hive Mind simultaneously — two brains.
- Don't vendor the Python/Rust/Tauri app wholesale.
- Don't adopt its desktop UI — we have the Hono `:3141` dashboard.

## Optional pragmatic bridge
If a working local agent is wanted *today* while Valley OS is built: stand up
OpenJarvis standalone on one machine (`curl … | bash; jarvis`, Apache 2.0) as a
reference + stopgap, then migrate its config/skills into Valley OS and retire it.
Plan to converge — do not maintain both long-term.
