# StudEx Valley OS

A Hive Mind wrapper on the Claude Agent SDK. Eleven role-based agents run
StudEx's businesses (Studex Meat, SGM, Studex Coffee) on local Ollama by
default, escalating to Claude only when the Cost Footer gate requires it.

## One picture

```
VAULT (Obsidian 2nd Brain)  — single source of truth
HIVE MIND                   — classifier · 3-layer memory · audit · kill switches
AGENTS                      — 6 roles · 11 codenames · one voice each
BRIDGES                     — Slack · Discord · Voice (ElevenLabs)
MUSCLE                      — Ollama on your Macs · Claude only on escalation
```

## Daily rituals (SAST)

- **08:00** Robusca standup → `daily/<today>.md`
- **09:00** StudEx Agent Council → `meetings/<date>-council.md`
- **22:00–02:00** Night Build — two sandboxed prototypes/night, local Ollama only

## Quick start

```bash
cp dot-env.example .env        # then fill in keys
./skills/install.sh            # install vendored skills into ~/.claude/skills
npm install
npm run doctor                 # verify Ollama, keys, SQLite, vault path
npm run smoke                  # boot core, dry-route a test mission
npm run dashboard:dev          # http://localhost:3141
```

All schedulers default **off**. Flip `SCHEDULER_ENABLED`, `COUNCIL_ENABLED`,
`NIGHT_BUILD_ENABLED`, `CURSOR_BACKGROUND_AGENTS_ENABLED` to `true` only after
acceptance tests pass.

## Build

This repo is built by running `docs/MEGA_PROMPT.md` in a Claude Code session.
See `docs/superpowers/plans/2026-05-19-valley-os-build.md` for the verified
13-chunk task plan with per-chunk acceptance evidence.

## Safety

- Kill phrase `studex stop the world` from an allowlisted user halts everything.
- Exfil-guard scans every outbound tool call.
- Append-only audit log, 90-day retention, correlation IDs.
- Night Build cannot call Claude or touch real money.
