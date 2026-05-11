# StudEx Valley OS — Bootstrap Mission (FINAL · paste-and-go)

Paste this entire document as the first message in a fresh Claude Code session running on the MBP M1 inside a clone of `TumeloRamaphosa/agents-dr.fixit`.

---

## Repo consolidation note (read first)

**`TumeloRamaphosa/agents-dr.fixit` is the only repo.** All Valley OS code, configs, agents, docs, promo pack and vault seed live here. The earlier `agentic-lab-v3` work has been deprecated; Tumelo will have copied any reference material across before invoking you.

Before starting chunk 1, list the repo root. If you see a `promo/` folder already present (PDF + Remotion + NotebookLM), leave it untouched — it is the client-facing promo pack and is intentionally pre-built. Do NOT regenerate it. Do NOT delete it. Treat it as read-only artefact during this build.

---

You are the build agent. Human: Tumelo. Build the StudEx Valley OS on top of THIS repo (`TumeloRamaphosa/agents-dr.fixit`) AND seed the existing 2nd Brain Obsidian vault. One focused 2–3 hour pass. Act on the spec below without mid-build clarifications. Pause only at the explicit 🛑 STOP gates.

## Mission (one sentence)
Wrap Claude Code in a Hive Mind so role-based agents run Tumelo's businesses (Studex Meat, SGM, Studex Coffee) on local Ollama by default, escalating to Claude only when needed, with daily voice rituals (08:00 Robusca standup, 09:00 StudEx Agent Council Meeting), an overnight Night Build that ships two prototypes per night, and the existing 2nd Brain Obsidian vault as the single source of truth.

## Architecture (one picture)
Vault (2nd Brain) = brain · Hive Mind = wrapper · Agents = hands · Slack+Discord+Voice = steering wheel · Ollama (+ optional mesh-llm) = muscle · Claude = escalation. Reference pattern: ClaudeClaw V3 (engine/brain/bridge; 3-layer memory; append-only audit; kanban Mission Control; War Room).

## Repo
- Target: `TumeloRamaphosa/agents-dr.fixit`
- Branch: `feat/valley-os-bootstrap` (create if missing; commit there; push after chunks 3, 6, 9, 13)
- Do NOT touch `main`. Do NOT force-push. Do NOT add Claude co-author trailers. Conventional commits.

## Vault (existing 2nd Brain — DO NOT create a new vault)
- Path: `${VAULT_PATH}` → default `/Users/tumeloramaphosa/Documents/Obsidian Vault/2nd Brain`
- Create subtree `${VAULT_PATH}/StudEx-Valley-OS/` (idempotent — skip if exists, never overwrite existing notes).
- If `${VAULT_PATH}` is a git repo, snapshot cron commits + pushes there. If not, snapshot writes filesystem only and logs.
- Seed tree:
  ```
  ${VAULT_PATH}/StudEx-Valley-OS/
  ├─ 00-Valley-OS.md
  ├─ 01-Machines.md
  ├─ 02-Agents.md
  ├─ 03-Costs.md
  ├─ 04-Studex-Meat.md
  ├─ 05-SGM.md
  ├─ 06-Studex-Coffee.md
  ├─ daily/.gitkeep
  ├─ proposals/.gitkeep
  ├─ meetings/.gitkeep
  ├─ partners/.gitkeep
  └─ ledger/.gitkeep
  ```

## Stack pins
- Node 20+ ESM · TypeScript 5.x
- `@anthropic-ai/claude-agent-sdk` (used only when an agent's provider is `anthropic`)
- **Provider abstraction**: `valley/src/core/model.ts` speaks OpenAI-compatible to {ollama, mesh-llm, openai, groq, openrouter, custom} and Anthropic-native to {anthropic}. Per-agent config in `agent.yaml`. Global defaults in `.env`.
- Ollama `http://localhost:11434` (and `/v1` for OpenAI-compat). **Auto-installed by `mac-orchestrator.sh`**. Models pulled: `qwen2.5:7b`, `qwen2.5-coder:7b`, `llama3.1:8b`, `gemma2:2b`, `phi3:mini`, `nomic-embed-text`
- Mesh-LLM `http://localhost:9337/v1` (optional today)
- `better-sqlite3` + FTS5 + `sqlite-vec`
- ElevenLabs TTS · Groq Whisper STT
- Slack Bolt · discord.js
- Composio (Facebook live; track only)
- `node-cron` + macOS launchd plists
- **Cursor IDE + CLI + API** = CTO's full toolkit (see CTO section)

## Six roles → codenames → voices

| Role | Codenames | Voice | Anchors |
|---|---|---|---|
| Chief of Staff (Exec) | **Robusca** | Female · warm SA-English | Hosts 08:00 standup + 09:00 Council. NOT the CTO. |
| Sales | **CashClaw** (Adam) | Male · confident | Anchored to **Studex Meat** |
| Customer | **DenchClaw**, **Charlie** | Friendly SA-English | Charlie = Studex Meat customer agent |
| Research | **Research**, **OpenFang** | Curious · analytical | Owns Night Build problem picks |
| DevOps | **CTO**, **Skunk Works**, **Dr Fix-It** | Engineer · brief | CTO uses Cursor IDE + CLI + Background Agents; Skunk Works builds; Dr Fix-It heartbeats |
| Media | **The Lady** | Female · polished | Content + brand |

## Repo file tree

```
agents-dr.fixit/
├─ README.md                                 (rewrite: Valley OS overview + quickstart)
├─ package.json                              (workspaces: valley, bridges)
├─ tsconfig.base.json
├─ .env.example
├─ .gitignore                                (add: .env, node_modules, *.db, *.db-journal, dist/)
│
├─ valley/
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ src/
│     ├─ core/
│     │  ├─ kill-switches.ts
│     │  ├─ vault.ts                         Resolves ${VAULT_PATH}/StudEx-Valley-OS
│     │  ├─ model.ts                         Multi-provider client (ollama, mesh-llm, openai, groq, openrouter, anthropic, custom)
│     │  ├─ classifier.ts                    Routes a task to a codename using local gemma2:2b
│     │  ├─ memory.schema.sql
│     │  ├─ memory.ts                        FTS5 + sqlite-vec(768d) + salience; decay + pin
│     │  ├─ audit.ts                         Append-only, correlation IDs, 90-day prune
│     │  ├─ exfil-guard.ts
│     │  └─ cost-footer.ts                   Daily summary writer (NOT per-message)
│     ├─ tools/
│     │  └─ cursor.ts                        Cursor IDE open + cursor-agent CLI + Cursor API (background agents)
│     ├─ agents/{loader.ts, runner.ts}
│     ├─ warroom/
│     │  ├─ room.ts
│     │  ├─ roster.ts
│     │  ├─ doc-drop.ts
│     │  ├─ transcript.ts                    Streams to ${VAULT_PATH}/StudEx-Valley-OS/meetings/YYYY-MM-DD-<slug>.md
│     │  └─ commands.ts                      /standup /discuss /decide /end
│     ├─ ritual/
│     │  ├─ morning.ts                       08:00 Robusca standup
│     │  ├─ council.ts                       09:00 StudEx Agent Council
│     │  ├─ snapshot.ts                      07/12/17/00 vault flush + optional git push
│     │  ├─ night-build.ts                   22:00 Night Build orchestrator (strict 2-per-night)
│     │  ├─ problem-picker.ts
│     │  ├─ build-sandbox.ts                 Scaffolds factory/projects/<slug>/ with .cursor/ configs
│     │  ├─ test-loop.ts                     Up to 3 fix iterations
│     │  └─ proposals.ts                     Writes proposals/<tomorrow>/INDEX.md
│     ├─ voice/{elevenlabs.ts, whisper.ts}
│     ├─ bridges/{slack.ts, discord.ts}
│     └─ index.ts
│
├─ agents/
│  ├─ _template/{agent.yaml, CLAUDE.md}
│  ├─ exec/robusca/{agent.yaml, CLAUDE.md}
│  ├─ sales/cashclaw/{agent.yaml, CLAUDE.md}              (Adam, Studex Meat)
│  ├─ customer/{denchclaw,charlie}/{agent.yaml, CLAUDE.md}
│  ├─ research/{research,openfang}/{agent.yaml, CLAUDE.md}
│  ├─ devops/{cto,skunkworks,drfixit}/{agent.yaml, CLAUDE.md}
│  └─ media/the-lady/{agent.yaml, CLAUDE.md}
│
├─ factory/
│  ├─ config/
│  │  ├─ inventory.json
│  │  ├─ subscriptions.json
│  │  ├─ agents.json                         codename → voice_id, model, tools, channels
│  │  ├─ schedule.json
│  │  ├─ composio.json                       facebook: connected; others: pending
│  │  ├─ meetings.json                       Templates incl. council, studex-meat, devops, sales-review, media-drop, all-hands
│  │  └─ roles.json
│  ├─ scripts/
│  │  ├─ mission.mjs                         list | add | move | toggle | delegate <id> --to cursor-cli|cursor-bg
│  │  ├─ warroom.mjs                         start <template> | drop <file> | voice on|off
│  │  ├─ council.mjs                         manual trigger of 09:00 Council
│  │  ├─ night-build.mjs                     manual trigger + dry-run
│  │  ├─ snapshot.mjs                        Vault flush + optional git push
│  │  ├─ heartbeat.mjs
│  │  ├─ cost.mjs
│  │  └─ doctor.mjs                          Verify Ollama, all provider keys, SQLite, vault path, Cursor API
│  ├─ templates/
│  │  ├─ sandbox-node/{package.json, tsconfig.json, src/index.ts, tests/smoke.test.ts, .cursor/model-config.json, .cursor/rules, README.md}
│  │  └─ sandbox-python/{pyproject.toml, src/main.py, tests/test_smoke.py, .cursor/model-config.json, .cursor/rules, README.md}
│  └─ projects/.gitkeep                      Night Build outputs land here
│
├─ bridges/
│  ├─ slack/{server.ts, package.json}
│  └─ discord/{server.ts, package.json}
│
├─ infra/
│  ├─ scripts/{studex-install.sh, mac-orchestrator.sh, mac-nas.sh}
│  └─ launchd/
│     ├─ com.studex.morning.plist            0 8 * * *
│     ├─ com.studex.council.plist            0 9 * * *
│     ├─ com.studex.snapshot.plist           0 7,12,17,0 * * *
│     ├─ com.studex.heartbeat.plist          hourly
│     ├─ com.studex.nightbuild.plist         0 22 * * *  (hard kill at 02:00)
│     └─ com.studex.bridges.plist
│
├─ docs/
│  ├─ VALLEY_OS_OVERVIEW.md
│  ├─ DAILY_RITUALS.md                       08:00 standup · 09:00 Council · 22:00 Night Build
│  ├─ COUNCIL_MEETING.md                     Format, agent reports, action item extraction
│  ├─ NIGHT_BUILD.md                         Pipeline, output, Cursor handoff
│  ├─ WAR_ROOM.md
│  ├─ MISSION_CONTROL.md
│  ├─ MESH_SETUP.md
│  ├─ STORAGE_LAYOUT.md
│  ├─ COMPOSIO_CONNECTORS.md
│  ├─ PROVIDER_SWITCHING.md                  How to swap brains per agent / globally
│  ├─ CURSOR_INTEGRATION.md                  IDE + CLI + API surfaces
│  ├─ MEGA_PROMPT.md                         Save this prompt verbatim
│  └─ LANDING_PAGE_PROMPT.md
│
├─ reference/
│  ├─ CLAUDECLAW_V3_DIGEST.md
│  └─ SGM_PARTNER_DIGEST.md
│
└─ promo/                                    (pre-built; do not modify)
   ├─ README.md
   ├─ pdf/{business-overview.pdf, build.py, build_pdf.py, diagrams/*.png}
   ├─ remotion/                              60-second 1080p promo video project
   └─ notebooklm/{source-document.md, video-script.md, README.md}
```

## Agent file format (apply to every agent)

`agent.yaml`:
```yaml
codename: <codename>
role: <role>
display_name: <name>
description: <one line — read by classifier>

model:
  primary:
    provider: ollama                 # ollama | mesh-llm | openai | groq | openrouter | anthropic | custom
    name: qwen2.5-coder:7b
    base_url: ""                     # optional override; if empty, provider default
  escalate:
    provider: anthropic
    name: claude-sonnet-4-6
  alternates:
    - { provider: openrouter, name: anthropic/claude-sonnet-4-6 }
    - { provider: groq,       name: llama-3.1-70b-versatile }

tools:
  allow: [<verb.scope>, ...]
  deny:  [<verb.scope>, ...]

voice:
  elevenlabs_id: <SET_IN_AGENTS_JSON>

channels: [slack, discord]
schedule: []                         # optional cron entries
```

`CLAUDE.md`: one-paragraph persona + clear instruction on what they do and what they delegate.

Per-message override (any user, any channel): `@<codename> --model <provider>/<name> <prompt>`. Classifier honours for that turn only.

## CTO (special — full Cursor toolkit)

`agents/devops/cto/agent.yaml`:
```yaml
codename: cto
role: devops
display_name: CTO
description: Chief technology lead. Develops in Cursor IDE with local Ollama. Delegates short headless tasks to Cursor CLI and long parallel work to Cursor Background Agents via API. Owns infra health.

model:
  primary:
    provider: ollama
    name: qwen2.5-coder:7b
  escalate:
    provider: anthropic
    name: claude-sonnet-4-6
  alternates:
    - { provider: openrouter, name: anthropic/claude-sonnet-4-6 }
    - { provider: ollama,     name: deepseek-coder:6.7b }

tools:
  allow:
    - cursor.open_project
    - cursor.run_cli
    - cursor.spawn_background_agent
    - cursor.get_agent
    - git.read
    - git.write_branch
    - github.read
    - github.write_pr
    - shell.exec.allowlist
    - vault.read
    - vault.write_meeting_report
    - mission.read
    - mission.move
    - bridge.slack
    - bridge.discord
  deny:
    - git.push_main
    - shell.exec.unrestricted
    - real_money.*

voice:
  elevenlabs_id: SET_IN_AGENTS_JSON

channels: [slack, discord]

schedule:
  - cron: "0 9 * * *"
    task: council-report
```

`agents/devops/cto/CLAUDE.md`:
```markdown
# CTO — DevOps · Chief Technology

You are the CTO. Crisp, technical, brief. South African English.

Your workstation is **Cursor IDE** with local Ollama (`qwen2.5-coder:7b`). For headless short tasks you invoke `cursor-agent` CLI. For long multi-file work you delegate to **Cursor Background Agents** via the Cursor API.

Decision tree:
- Task ≤ 10 lines, one file → write it yourself in Cursor (local Ollama)
- Task < 10 min, one repo, no human-in-loop → `cursor.run_cli`
- Task > 10 min or multi-file/multi-repo → `cursor.spawn_background_agent`, queue a Mission Control item to poll for the PR

You report to Robusca at 09:00 Council:
- Infra health (services up · last heartbeat)
- Agent uptime since last meeting
- Tokens consumed (local vs Claude) from `cost-footer.ts`
- Last night's Night Build status (success / failure / open PRs)
- Active Cursor background agents and their state

Delegate:
- Build / CI / test pipelines → **Skunk Works**
- Monitoring / repair / restarts → **Dr Fix-It**

Push to `agents-dr.fixit` **feature branches only**. Never `main`. Never force-push.
```

## Cursor tool wrapper spec (`valley/src/tools/cursor.ts`)
Three methods:
- `cursor.openProject(slug)` → `cursor <absolute-path>` shell command, opens IDE
- `cursor.runCli(prompt, opts)` → invokes `cursor-agent --model <model> --prompt <prompt>` in a working dir; returns stdout + exit code
- `cursor.spawnBackgroundAgent({repo, branch, prompt, model})` → POSTs to Cursor Agents API (Bearer `CURSOR_API_KEY`); returns agent_id; `cursor.getAgent(id)` polls status until PR is created

Before first real call, hit `GET /v0/agents` once with the key to verify the schema. If endpoint shape differs from `POST /v0/agents { repo, branch, prompt, model }`, adjust and document in `docs/CURSOR_INTEGRATION.md`. All Cursor calls go through exfil-guard first. Spawning a background agent counts as outbound; gate behind STOP #1 until smoke passes.

## Daily rituals (SAST) — three core moments

### 1. 08:00 · Robusca Standup
Robusca reads `daily/<yesterday>.md`, `ledger/`, mission Queued, `proposals/<today>/INDEX.md`. Writes `daily/<today>.md` with: yesterday wins/misses · sales/social/costs delta · today's three priorities · items needing Tumelo's ack.

### 2. 09:00 · StudEx Agent Council Meeting
Daily all-hands in the War Room. Robusca chairs. Voice-driven (ElevenLabs per agent). Transcript streams to `meetings/<date>-council.md`. Action items append to mission control.

**Order (each report ≤90s):**
1. **Robusca** opens · today's agenda · yesterday's ack items resolved
2. **CTO** · infra health · agent uptime · tokens (local vs Claude) · last night's Night Build · active Cursor background agents + their PRs
3. **Skunk Works** · client project progress (Linear · Dark Factory) · Night Build hand-offs · bugs surfaced
4. **Dr Fix-It** · heartbeat report · restarts · anomalies in last 24h
5. **CashClaw (Adam)** · sales · pipeline · CRM updates · Studex Meat numbers
6. **DenchClaw** · customer signups · support tickets · cross-business
7. **Charlie** · Studex Meat customer-facing summary · WhatsApp queue
8. **Research** · findings · ledger insights · new agent frameworks
9. **OpenFang** · social/web scrape · partner news (SGM xlsx feeds in)
10. **The Lady** · content performance · social metrics · audience reactions
11. **Robusca closes** · synthesises top 3 decisions Tumelo must make today · drops into mission Queued

**Drop-in commands during the meeting:**
- `@<codename> more` — agent expands on their report
- `@<codename> show <thing>` — surfaces a vault link
- `/decide <text>` — Tumelo records a decision; appends to today's `daily/` note
- `/end` — Robusca writes closing summary and ends the meeting

Files: `valley/src/ritual/council.ts`, `factory/scripts/council.mjs`, `factory/config/meetings.json` template key `council`.

### 3. 22:00–02:00 · Night Build (strict 2 products per night, local Ollama only)
NO Claude calls. NO outbound writes. Local Ollama (`qwen2.5-coder:7b` code · `gemma2:2b` plan prose · `nomic-embed-text` memory).

**Strict mode:** second product ALWAYS runs. If first overran, second's test loop shrinks to 1 iteration.

**Per product (~2h):**
1. **Problem pick** (Research · 10m) — rank Queued + last 7 `daily/` + `ledger/` red flags + pinned memories
2. **3-page plan** (Research + CTO · 30m) — `proposals/<tomorrow>/<NN>-<slug>/PLAN.md` exactly three sections: Problem+Evidence, Solution+Architecture, Rollout+Cost+Risks
3. **Build** (Skunk Works · 60m) — scaffold `factory/projects/<slug>/` from `factory/templates/sandbox-{node,python}/`. Generate with Ollama `qwen2.5-coder:7b`. Write `.cursor/model-config.json` pointing at local Ollama + `qwen2.5-coder:7b` so the project opens cleanly in Cursor next morning. Write `.cursor/rules` inheriting CTO persona.
4. **Test + fix** (Dr Fix-It · 15m) — run `npm test` / `pytest`. Up to 3 fix-loop iterations (1 in throttled). Write `TEST_REPORT.md`.
5. **Demo wrap** (Skunk Works · 5m) — `DEMO.md` with one run command + one `cursor factory/projects/<slug>/` command.

Hard stop at 02:00. Unfinished builds checkpoint to `factory/projects/<slug>/.checkpoint.json`; resume next night.

**Vault output:**
```
proposals/<YYYY-MM-DD>/
├─ INDEX.md
├─ 01-<slug>/{PLAN.md, DEMO.md, TEST_REPORT.md}
└─ 02-<slug>/{...}
```

**INDEX.md format:**
```markdown
# Night Build · <date>

## 01 · <title>
- Problem: <one line>
- Status: ✅ tests 7/7 · ⚠️ 5/6 · ❌ build failed
- Open in Cursor: `cursor factory/projects/<slug>/`
- Demo: `cd factory/projects/<slug> && npm run demo`
- Impact: <hours saved/wk · $/mo>
- Tumelo action: [ ] approve · [ ] revise · [ ] discard

## 02 · <title>
...
```

## Cron schedule (SAST)
- `0 7 * * *`  snapshot + pre-standup heartbeat
- `0 8 * * *`  Robusca standup → `daily/<today>.md`
- `0 9 * * *`  StudEx Agent Council Meeting → `meetings/<date>-council.md`
- `0 12 * * *` midday snapshot
- `0 17 * * *` EOD snapshot
- `0 22 * * *` Night Build start
- `0 0 * * *`  midnight snapshot
- `0 2 * * *`  Night Build hard kill
- `0 6 * * *`  Idle window ends
- `0 * * * *`  Dr Fix-It hourly heartbeat

## Memory (3-layer)
L1 SQLite FTS5 · L2 `nomic-embed-text` 768d + `sqlite-vec` cosine · L3 salience + decay + pin. Tables: `memories`, `embeddings`, `audit_log`, `mission`, `agents_status`, `meetings`.

## Audit log
Append-only. Every tool call · kill-switch flip · mission move · meeting event · provider switch. Correlation IDs. 90-day prune; pinned rows survive.

## Kill switches (.env)
```
SCHEDULER_ENABLED=false               # default off until smoke
MISSION_AUTO_ASSIGN_ENABLED=true
EXFIL_GUARD_ENABLED=true
WAR_ROOM_ENABLED=true
COUNCIL_ENABLED=false                 # flip after first dry-run council
NIGHT_BUILD_ENABLED=false             # flip after first dry-run build
NIGHT_BUILD_PRODUCT_COUNT=2
NIGHT_BUILD_MODE=strict
CURSOR_BACKGROUND_AGENTS_ENABLED=false
IDLE_HOURS=22-02
KILL_PHRASE=studex stop the world
```
Kill phrase from allowlisted user: halt schedulers + bridges + running turns + meeting + Night Build; audit row; DM Tumelo.

## War Room (`factory/scripts/warroom.mjs`)
```
warroom start council            → ad-hoc Council Meeting
warroom start studex-meat        → Robusca + Adam + Charlie + Research
warroom start --agents <list>    → ad-hoc roster
warroom drop <file>              → chunks + injects to meeting memory
warroom voice on|off
```

## Mission Control (`factory/scripts/mission.mjs`)
```
mission list                                       → kanban (Queued / Running / Done)
mission add "title" [--agent codename]
mission move <id> <col>
mission toggle <codename> on|off                   → flips agents_status.enabled
mission delegate <id> --to cursor-cli              → headless cursor-agent in factory/projects/<slug>/
mission delegate <id> --to cursor-bg [--model X]   → spawn Cursor Background Agent; record agent_id; poll for PR
```

## Composio (`factory/config/composio.json`)
```json
{
  "facebook":  { "status": "connected", "owner": "tumelo" },
  "gmail":     { "status": "pending" },
  "calendar":  { "status": "pending" },
  "slack":     { "status": "pending" },
  "x":         { "status": "pending" },
  "instagram": { "status": "pending" }
}
```
Do not overwrite Facebook entry.

## Ollama auto-install (in `infra/scripts/mac-orchestrator.sh`)
```bash
# Install Ollama if missing
if ! command -v ollama >/dev/null 2>&1; then
  echo "Installing Ollama..."
  curl -fsSL https://ollama.com/install.sh | sh
fi

# Start Ollama service (idempotent)
brew services start ollama 2>/dev/null || (nohup ollama serve >/dev/null 2>&1 &)
sleep 2

# Pull required models
for model in qwen2.5:7b qwen2.5-coder:7b llama3.1:8b gemma2:2b phi3:mini nomic-embed-text; do
  ollama pull "$model"
done

# Optional alternates
[ -n "$ALTERNATE_MODELS" ] && for m in $ALTERNATE_MODELS; do ollama pull "$m"; done

ollama list
```

## Order of operations (commit each chunk; push after 3, 6, 9, 13)

1. `chore: scaffold` — `package.json`, workspaces, tsconfig, `.env.example`, `.gitignore`, README rewrite
2. `feat(config):` all `factory/config/*.json` (incl. `council` template in `meetings.json`)
3. `feat(core):` `valley/src/core/*` (kill-switches → vault → model (multi-provider) → classifier → memory → audit → exfil-guard → cost-footer)
3.5. `feat(tools): cursor` — `valley/src/tools/cursor.ts` + smoke that hits `GET /v0/agents` with `CURSOR_API_KEY`, prints schema, exits. **🛑 STOP #1 if schema differs from spec.**  **— push —**
4. `feat(agents):` `_template/` + six role folders, yaml + CLAUDE.md each (CTO uses the special spec above)
5. `feat(runtime):` `valley/src/agents/{loader,runner}.ts`
6. `feat(warroom):` `valley/src/warroom/*` + `factory/scripts/warroom.mjs`  **— push —**
7. `feat(ritual-day):` morning · council · snapshot + cron wiring in `valley/src/index.ts`
8. `feat(ritual-night):` night-build · problem-picker · build-sandbox · test-loop · proposals + `factory/scripts/night-build.mjs` + `factory/templates/sandbox-{node,python}/`
9. `feat(voice):` `valley/src/voice/*`  **— push —**
10. `feat(bridges):` `valley/src/bridges/*` + `bridges/{slack,discord}/`
11. `feat(scripts):` `factory/scripts/{mission,council,heartbeat,snapshot,cost,doctor}.mjs`
12. `infra:` `infra/scripts/*.sh` (with Ollama auto-install) + `infra/launchd/*.plist`
13. `docs:` all `docs/*.md` + `reference/` digests + vault seed; final `npm run doctor` smoke  **— push —**

## Acceptance tests (run before declaring done)
```bash
npm install
npm run doctor                                              # Ollama · all provider keys · SQLite · vault path · Cursor API
node valley/dist/index.js --smoke                           # core boots; dry-routes test mission
node factory/scripts/mission.mjs list                       # empty kanban
node factory/scripts/warroom.mjs start council --dry-run    # Council dry-run; shows agent order
node factory/scripts/night-build.mjs --dry-run              # picks 2 problems, drafts plans, no code gen
node factory/scripts/snapshot.mjs --dry-run                 # shows what would write to vault
node factory/scripts/heartbeat.mjs                          # all agents report
```
All pass → done. Any fail → report + 🛑 STOP.

## 🛑 STOP — human-ack gates
1. After chunk 3.5: verify Cursor API schema before any other Cursor calls.
2. Before any **outbound** call to Slack / Discord / Composio (real messages OUT).
3. Before writing **outside** `${VAULT_PATH}/StudEx-Valley-OS/`.
4. Before installing **launchd** plists.
5. Before flipping any of: `SCHEDULER_ENABLED`, `COUNCIL_ENABLED`, `NIGHT_BUILD_ENABLED`, `CURSOR_BACKGROUND_AGENTS_ENABLED` to `true`.

## What NOT to do
- Do not push to `main`.
- Do not commit `.env`.
- Do not create a new vault repo — use the existing 2nd Brain.
- Do not write outside `${VAULT_PATH}/StudEx-Valley-OS/`.
- Do not add per-message cost footers (daily summary only in `daily/<today>.md`).
- Do not run CrewAI / LangGraph / Base44.
- Do not add Telegram / WhatsApp bridges — Slack + Discord only.
- Do not invent codenames beyond the eleven listed.
- Do not couple business logic to Claude — local Ollama is default; Claude is escalation only.
- Do not let Night Build call Claude — Ollama only during 22:00–02:00.

## .env.example (to generate)
```
# Default brain (any agent without explicit model uses these)
DEFAULT_PROVIDER=ollama
DEFAULT_MODEL=qwen2.5-coder:7b
ESCALATION_PROVIDER=anthropic
ESCALATION_MODEL=claude-sonnet-4-6

# Provider keys (all optional — fill what you use)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
OPENROUTER_API_KEY=
GROQ_API_KEY=
# DeepSeek / Together / Fireworks / MiniMax → OpenAI-compat; set via custom in agent.yaml

# Local
OLLAMA_BASE_URL=http://localhost:11434
MESH_LLM_BASE_URL=http://localhost:9337/v1

# Voice
ELEVENLABS_API_KEY=

# Bridges
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
SLACK_APP_TOKEN=
DISCORD_BOT_TOKEN=
DISCORD_GUILD_ID=

# Connectors
COMPOSIO_API_KEY=

# Cursor
CURSOR_API_KEY=                                    # https://cursor.com/dashboard/integrations
CURSOR_DEFAULT_MODEL=ollama/qwen2.5-coder:7b

# GitHub
GITHUB_TOKEN=

# Vault
VAULT_PATH=/Users/tumeloramaphosa/Documents/Obsidian Vault/2nd Brain

# Kill switches
SCHEDULER_ENABLED=false
MISSION_AUTO_ASSIGN_ENABLED=true
EXFIL_GUARD_ENABLED=true
WAR_ROOM_ENABLED=true
COUNCIL_ENABLED=false
NIGHT_BUILD_ENABLED=false
NIGHT_BUILD_PRODUCT_COUNT=2
NIGHT_BUILD_MODE=strict
CURSOR_BACKGROUND_AGENTS_ENABLED=false
IDLE_HOURS=22-02
KILL_PHRASE=studex stop the world

# Allowlists
ALLOWLISTED_SLACK_USER_IDS=
ALLOWLISTED_DISCORD_USER_IDS=
```

## Begin
Start at chunk 1. After each chunk: `git add -A && git commit -m "<conventional message>"`. Push after chunks 3, 6, 9, 13. Run acceptance tests after chunk 13. Pause at any 🛑 STOP. Do not narrate; build.
