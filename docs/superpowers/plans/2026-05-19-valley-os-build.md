# StudEx Valley OS Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute `docs/MEGA_PROMPT.md` inside `TumeloRamaphosa/agents-dr.fixit` so the StudEx Valley OS ships with all 13 chunks verified.

**Architecture:** Hive Mind wrapper on the Claude Agent SDK. 11 role-based agents default to local Ollama, escalate to Claude only via the Cost Footer gate. Daily rituals (08:00 standup, 09:00 Council, 22:00–02:00 Night Build) driven by cron/launchd. Hono dashboard at :3141. Existing Obsidian 2nd Brain is the only vault.

**Tech Stack:** Node 20 ESM, TypeScript 5, `@anthropic-ai/claude-agent-sdk`, Ollama, better-sqlite3 + FTS5 + sqlite-vec, ElevenLabs, Groq Whisper, Slack Bolt, discord.js, Hono + Vite + React 18, node-cron + launchd.

**Verification contract:** No chunk may be marked done until `superpowers:verification-before-completion` passes for it — the listed acceptance command must be run and its real output pasted into the chunk's commit message. Claims without command output are plan failures.

---

## Pre-build (Task 0)

**Files:**
- Modify: repo root (clone state)
- Create: `.env` (from `.env.example`, not committed)

- [ ] **Step 1: Clone + branch**

```bash
gh repo clone TumeloRamaphosa/agents-dr.fixit
cd agents-dr.fixit
git checkout -b feat/valley-os-bootstrap
```

- [ ] **Step 2: Confirm vault path exists**

Run: `ls "/Users/tumeloramaphosa/Documents/Obsidian Vault/2nd Brain"`
Expected: directory listing (not "No such file"). If different, set `VAULT_PATH` in `.env`.

- [ ] **Step 3: Install skills**

Run: `./skills/install.sh`
Expected: lines reading `linked goal`, `linked gstack`, `linked sp-verification-before-completion`, … and "Done."
Verify: `ls ~/.claude/skills | grep -E 'goal|gstack|sp-verification'` returns matches.

- [ ] **Step 4: Verify Cursor key (gate for chunk 3.5)**

Run: `curl -s -H "Authorization: Bearer $CURSOR_API_KEY" https://api.cursor.com/v0/agents | head -c 400`
Expected: JSON (not 401). If 401 → STOP, rotate key.

---

## Task 1 — Chunk 1: Scaffold

**Files:**
- Create: `package.json`, `tsconfig.base.json`, `.env.example`, `.gitignore`, `README.md`

- [ ] **Step 1:** Generate the files per the mega prompt "Repo file tree" + ".env.example" sections.
- [ ] **Step 2: Verify** — Run: `node -e "require('./package.json')"` Expected: no error. `test -f .env.example && echo OK` → `OK`.
- [ ] **Step 3: Verification gate** — invoke `superpowers:verification-before-completion`; confirm `.gitignore` contains `.env` and `node_modules`.
- [ ] **Step 4: Commit** — `git add -A && git commit -m "chore: scaffold (verified: package.json parses, .env.example present)"`

## Task 2 — Chunk 2: Config

**Files:**
- Create: `factory/config/{inventory,subscriptions,agents,schedule,composio,meetings,roles}.json`

- [ ] **Step 1:** Write all seven JSON files. `meetings.json` MUST include the `council` template (Robusca→CTO→Skunk Works→Dr Fix-It→Adam→DenchClaw→Charlie→Research→OpenFang→The Lady→Robusca-close).
- [ ] **Step 2: Verify** — Run: `for f in factory/config/*.json; do node -e "JSON.parse(require('fs').readFileSync('$f'))" || echo "BAD $f"; done` Expected: no `BAD` lines.
- [ ] **Step 3: Verify count** — `ls factory/config/*.json | wc -l` → `7`.
- [ ] **Step 4: Gate + commit** — verification-before-completion; commit with the parse-check output in the message.

## Task 3 — Chunk 3: Core

**Files:**
- Create: `valley/src/core/{kill-switches,vault,model,classifier,memory,audit,exfil-guard,cost-footer}.ts`, `valley/src/core/memory.schema.sql`

- [ ] **Step 1:** Implement multi-provider `model.ts` (ollama|mesh-llm|openai|groq|openrouter|anthropic|custom). `memory.ts` = FTS5 + sqlite-vec(768d) + salience + decay + pin.
- [ ] **Step 2: Write failing test** — `valley/test/core.test.ts`: classifier routes a known task to `cashclaw`; memory round-trips a pinned row.
- [ ] **Step 3: Run** — `npm test -- core` Expected: FAIL (not implemented).
- [ ] **Step 4: Implement to green** — re-run, Expected: PASS.
- [ ] **Step 5: Gate + push** — verification-before-completion; `git commit`; **push** (`git push -u origin feat/valley-os-bootstrap`).

## Task 3.5 — Chunk 3.5: Cursor tool 🛑 STOP #1

**Files:**
- Create: `valley/src/tools/cursor.ts`, `valley/test/cursor-smoke.ts`

- [ ] **Step 1:** Implement `openProject`, `runCli`, `spawnBackgroundAgent`, `getAgent`.
- [ ] **Step 2: Smoke** — Run: `node valley/dist/test/cursor-smoke.js` (hits `GET /v0/agents`). Expected: prints schema JSON.
- [ ] **Step 3:** If schema ≠ `POST /v0/agents {repo,branch,prompt,model}` → **STOP**, document actual shape in `docs/CURSOR_INTEGRATION.md`, ask Tumelo.
- [ ] **Step 4: Gate + commit** — verification-before-completion with the printed schema as evidence.

## Task 4 — Chunk 4: Agents

**Files:**
- Create: `agents/_template/{agent.yaml,CLAUDE.md}` + 11 agent folders (exec/robusca, sales/cashclaw, customer/{denchclaw,charlie}, research/{research,openfang}, devops/{cto,skunkworks,drfixit}, media/the-lady)

- [ ] **Step 1:** Write each `agent.yaml` (model.primary=ollama, escalate=anthropic) + one-paragraph `CLAUDE.md`. CTO uses the special Cursor spec.
- [ ] **Step 2: Verify** — Run: `find agents -name agent.yaml | wc -l` Expected: `12` (11 + _template). `node -e "const y=require('yaml');require('fs').readdirSync('agents',{recursive:true}).filter(f=>f.endsWith('agent.yaml')).forEach(f=>y.parse(require('fs').readFileSync('agents/'+f,'utf8')))"` Expected: no throw.
- [ ] **Step 3: Gate + commit.**

## Task 5 — Chunk 5: Runtime

**Files:**
- Create: `valley/src/agents/{loader,runner}.ts`; Test: `valley/test/loader.test.ts`

- [ ] **Step 1: Failing test** — loader returns 11 agents, runner executes one dry turn.
- [ ] **Step 2:** Run `npm test -- loader` → FAIL → implement → PASS.
- [ ] **Step 3: Gate + commit.**

## Task 6 — Chunk 6: War Room

**Files:**
- Create: `valley/src/warroom/{room,roster,doc-drop,transcript,commands}.ts`, `factory/scripts/warroom.mjs`

- [ ] **Step 1:** Implement roster templates (council, studex-meat, devops, sales-review, media-drop, all-hands).
- [ ] **Step 2: Verify** — Run: `node factory/scripts/warroom.mjs start council --dry-run` Expected: prints the 11-seat order.
- [ ] **Step 3: Gate + commit + push.**

## Task 7 — Chunk 7: Day rituals

**Files:**
- Create: `valley/src/ritual/{morning,council,snapshot}.ts`; Modify: `valley/src/index.ts` (cron wiring)

- [ ] **Step 1:** Implement; cron entries 0 7/8/9/12/17/0 per the schedule.
- [ ] **Step 2: Verify** — `node factory/scripts/snapshot.mjs --dry-run` Expected: prints intended vault writes, writes nothing. `node factory/scripts/council.mjs --dry-run` Expected: agenda order.
- [ ] **Step 3: Gate + commit.**

## Task 8 — Chunk 8: Night rituals

**Files:**
- Create: `valley/src/ritual/{night-build,problem-picker,build-sandbox,test-loop,proposals}.ts`, `factory/scripts/night-build.mjs`, `factory/templates/sandbox-{node,python}/`

- [ ] **Step 1:** `test-loop.ts` MUST call `superpowers:verification-before-completion` before writing any ✅ into `proposals/<date>/INDEX.md`.
- [ ] **Step 2: Verify** — `node factory/scripts/night-build.mjs --dry-run` Expected: picks 2 problems, drafts 2 plans, generates NO code, makes NO Claude calls (log shows provider=ollama only).
- [ ] **Step 3: Gate + commit.**

## Task 9 — Chunk 9: Voice

**Files:**
- Create: `valley/src/voice/{elevenlabs,whisper}.ts`; Test: `valley/test/voice.test.ts`

- [ ] **Step 1: Failing test** — voice map resolves a codename → voice_id; whisper stub returns text.
- [ ] **Step 2:** FAIL → implement → PASS.
- [ ] **Step 3: Gate + commit + push.**

## Task 10 — Chunk 10: Bridges

**Files:**
- Create: `valley/src/bridges/{slack,discord}.ts`, `bridges/{slack,discord}/{server.ts,package.json}`

- [ ] **Step 1:** Implement; allowlist + kill-phrase enforced before any send. 🛑 STOP #2 before first real outbound — dry-run + show payload.
- [ ] **Step 2: Verify** — start bridges with `DRY_RUN=1`; send a test message; Expected: payload logged, nothing sent.
- [ ] **Step 3: Gate + commit.**

## Task 11 — Chunk 11: Scripts

**Files:**
- Create: `factory/scripts/{mission,council,heartbeat,snapshot,cost,doctor}.mjs`

- [ ] **Step 1:** Implement Mission Control verbs incl. `delegate --to cursor-cli|cursor-bg`.
- [ ] **Step 2: Verify** — `node factory/scripts/mission.mjs list` Expected: empty kanban renders. `node factory/scripts/heartbeat.mjs` Expected: 11 agents report.
- [ ] **Step 3: Gate + commit.**

## Task 12 — Chunk 12: Dashboard

**Files:**
- Create: `valley/src/dashboard/**` (server.ts, ui/app.tsx, components/{WorldClockStrip,Tabs,KanbanBand,KanbanCard,StatusBar,GenesisBackdrop}.tsx, views/*, sprites/*, ws/realtime.ts)

- [ ] **Step 1:** Consult `uiux-design-system` + `uiux-ui-styling` skills for token architecture. Match the Remotion `Dashboard` scene: orange bands = Running, yellow = Queued/Done; transparent bold-white world-clock strip (Cape Town·Dubai·London·Shanghai·Beijing·Hong Kong·New York·San Francisco).
- [ ] **Step 2: Verify** — `npm run dashboard:dev &` then `curl -s localhost:3141 | grep -i "Mission Control"` Expected: match. Open browser → clocks tick, three bands render, empty bands render.
- [ ] **Step 3: Gate + commit + push.**

## Task 13 — Chunk 13: Infra + docs + vault seed

**Files:**
- Create: `infra/scripts/{studex-install,mac-orchestrator,mac-nas}.sh`, `infra/launchd/*.plist`, `docs/*.md`, `reference/*.md`; Seed `${VAULT_PATH}/StudEx-Valley-OS/`

- [ ] **Step 1:** `mac-orchestrator.sh` includes Ollama auto-install. 🛑 STOP #4 before installing launchd plists.
- [ ] **Step 2: Full acceptance** — run every command in the mega prompt "Acceptance tests" block. Paste all output.

```bash
npm install
npm run doctor
node valley/dist/index.js --smoke
node factory/scripts/mission.mjs list
node factory/scripts/warroom.mjs start council --dry-run
node factory/scripts/night-build.mjs --dry-run
node factory/scripts/snapshot.mjs --dry-run
node factory/scripts/heartbeat.mjs
npm run dashboard:dev
```

Expected: all pass; doctor green; dashboard serves.
- [ ] **Step 3: Final gate** — `superpowers:verification-before-completion` over the whole acceptance block. Only if every command's real output is green: commit + push.
- [ ] **Step 4:** Do NOT flip `SCHEDULER_ENABLED/COUNCIL_ENABLED/NIGHT_BUILD_ENABLED/CURSOR_BACKGROUND_AGENTS_ENABLED` to true until Tumelo approves (🛑 STOP #5).

---

## Self-Review

**Spec coverage:** All 13 mega-prompt chunks + the 3.5 Cursor gate + Pre-build mapped to tasks. Skills install added as Task 0 Step 3. ✅

**Placeholder scan:** No "TBD/TODO/handle edge cases". Every verify step has a concrete command + expected output. ✅

**Type consistency:** Agent count is `12` everywhere (11 agents + `_template`). Vault path token `${VAULT_PATH}` consistent. Kanban tint mapping (Queued/Done=yellow, Running=orange) consistent with the Remotion scene and PDF. ✅

**Verification gate:** Every task ends with `superpowers:verification-before-completion` and a real command whose output goes in the commit message. The Night Build `test-loop` and Council "done" claims also call it at runtime. ✅

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-19-valley-os-build.md`. Two execution options:

**1. Subagent-Driven (recommended)** — the build agent dispatches a fresh subagent per task, reviews between tasks. Use `superpowers:subagent-driven-development`.

**2. Inline Execution** — the build agent executes tasks in one session with checkpoints. Use `superpowers:executing-plans`.

This plan is executed by the build agent on the MBP M1 inside `agents-dr.fixit`, not in this session.
