# StudEx Valley OS — Skills Bundle

Six upstream skill repos, vendored here (trimmed of `.git`, browser binaries,
screenshots and example corpora) and wired into Claude Code via `install.sh`.

## Install

```bash
./skills/install.sh
```

Symlinks every skill into `~/.claude/skills/`. **Restart Claude Code** (or
start a new session) for them to load. Re-running is safe (idempotent).

Custom target: `SKILLS_DIR=/path ./skills/install.sh`

## What's in here, and how each maps to the Valley OS

| Skill (after install) | Upstream | Valley OS role |
|---|---|---|
| `/goal` | jthack/claude-goal | **Long-term vision.** Robusca + the Chief-of-Staff loop use it to hold a persistent quarterly objective with pause/resume/audit. Also adds a Stop hook that keeps an agent working while a goal is active. |
| `gstack` | garrytan/gstack | **Methodology + browser QA.** The gstack plan→review→ship→deploy discipline becomes the Skunk Works / CTO workflow. Its headless-browser QA is how Dr Fix-It verifies a deployment and files bug evidence with screenshots. |
| `graphify` (`/graphify`) | safishamsi/graphify | **Knowledge graph.** Research + OpenFang turn the vault, the SGM partner data and any codebase into a navigable graph (interactive HTML + GraphRAG JSON + a plain-language report). Powers the dashboard's future "Graph" view. |
| `sp-verification-before-completion` | obra/superpowers | **/verification.** Hard gate before any agent claims work done — evidence before assertions. Wired into the Night Build test-loop and the Council "done" claims. |
| `sp-writing-plans` · `sp-brainstorming` · `sp-executing-plans` · `sp-subagent-driven-development` | obra/superpowers | **Super powers — planning core.** The Night Build's 3-page-plan stage and the Council's decision synthesis use these. |
| `sp-test-driven-development` · `sp-systematic-debugging` · `sp-requesting-code-review` · `sp-receiving-code-review` · `sp-finishing-a-development-branch` · `sp-using-git-worktrees` · `sp-dispatching-parallel-agents` | obra/superpowers | **Super powers — engineering core.** CTO + Skunk Works build discipline. Cursor Background Agents run inside git worktrees. |
| `sp-using-superpowers` · `sp-writing-skills` | obra/superpowers | Meta — how agents discover skills and author new ones during Idle Hours. |
| `uiux-design` · `uiux-design-system` · `uiux-brand` · `uiux-ui-styling` · `uiux-slides` · `uiux-banner-design` · `uiux-ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max | **The Lady (Media) + the dashboard.** Brand voice, design tokens, the Hono `:3141` dashboard styling, client decks, social banners. |
| `remotion-best-practices` | remotion-dev/skills | **Promo video.** Domain knowledge for the `promo/remotion/` project — The Lady regenerates promo clips with correct Remotion patterns. |

## Not vendored (frameworks, not skills — reference only)

The mega prompt notes these as optional dependencies the build agent can
clone on the Mac if/when needed:

- `kyegomez/OpenMythos` — repo-overview / architecture-explanation engine. Already referenced in `factory/config/integrations.json` as the OpenMythos path. Clone alongside, don't vendor.
- `supermemoryai/openclaw-supermemory` — a memory layer for OpenClaw. Evaluate against the built-in 3-layer SQLite memory before adopting; do not run both.
- `21st-dev` (org, e.g. `21st-dev/magic-mcp`) — Magic MCP for UI component generation. Wire as an MCP server in `.cursor/mcp.json` if the dashboard needs richer component scaffolding; not a skill.

## Upgrading a skill

Each lives in its own folder. To refresh one:

```bash
cd /tmp && git clone --depth 1 https://github.com/<owner>/<repo>.git
# copy the updated content over skills/<name>/ (keep the trims), then:
./skills/install.sh
```

## Licences

Each subfolder retains its upstream `LICENSE`. These are third-party works
vendored for convenience; respect their individual licences (MIT / Apache
in the main). `gstack` and `ui-ux-pro-max` are the largest — heavy assets
(browser binaries, screenshots, example corpora) were intentionally removed;
re-clone upstream if you need them.
