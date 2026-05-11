# StudEx Valley OS — Client Briefing

**Upload this entire file to NotebookLM as a source. It contains the full story, structure, and emphasis NotebookLM needs to generate an excellent audio or video overview.**

---

## What it is, in one sentence

StudEx Valley OS is an **AI operating system for small businesses** that handles sales, customer support, content, research, and code — running on the founder's own Mac, with local AI models by default, and using cloud models like Claude only when necessary.

It is not another chatbot. It is the operating layer that wraps a whole company: the agents, their memory, their meetings, their daily rituals, the live dashboard with eight world clocks, and the knowledge they share.

## The brand image

The Studex Global Markets brand is grounded in a single hero painting — Michelangelo's *Creation of Adam*, with the Sistine Chapel scene reframed: between God and Man sits the **Studex bull-and-circuit medallion**, glowing like a sun. Two hands almost touch the medallion. Underneath, the line: **"A private, future-first AI global trading community. Where vision meets intelligence. Where legacy meets technology. Where tomorrow's markets are created today."**

This image is the backdrop of the dashboard, the opening shot of the promo video, and the cover of the PDF. The whole product visually says: *we are the bridge between human ambition and machine intelligence.*

---

## The problem we solve

Running a small business in 2026 means doing a hundred jobs at once. The founder replies to customers at 11pm. Forgets where they saved the deck. Watches costs climb without knowing why. Can't afford to hire a team yet.

AI tools exist, but they are scattered: one tab for ChatGPT, another for Claude, a CRM in a third tab, a Notion vault in a fourth, automation in Zapier somewhere. Nothing connects. Nothing remembers. Nothing happens unless the founder pushes a button.

**StudEx Valley OS connects them.** It turns the founder's existing tools — their Obsidian vault, their Slack, their Discord, their Mac — into one cohesive operating system run by a fleet of small AI agents that each do one job, all reporting through a single morning standup and an all-hands council meeting at 9am.

---

## The architecture, in one picture

There are five layers. Each one stacks on the one below.

**1. The Vault.** The founder's existing Obsidian "2nd Brain" vault is the single source of truth. Every decision, every customer message, every cost line, every meeting transcript ends up here. The vault is canonical. If it isn't in the vault, it didn't happen.

**2. The Hive Mind.** The wrapper around the vault. It contains:
- A classifier that reads any incoming task and routes it to the right agent
- A three-layer memory (keyword search, semantic embeddings, salience scoring)
- An append-only audit log so nothing happens without a trace
- Kill switches the founder can flip to pause anything
- A scheduler that fires the daily rituals

**3. The Agents.** Six roles, eleven codenamed personas. Each agent is a folder with two files: a YAML config (which model, which tools, which voice) and a CLAUDE.md persona file (who they are, how they speak).

**4. The Bridges.** Slack and Discord, with voice via ElevenLabs. Every channel funnels into one unified chat history. The founder can talk to any agent from anywhere.

**5. The Muscle.** Ollama running local AI models on the founder's Mac (free, private, fast). Mesh-LLM optionally spreads heavy models across multiple machines. Claude is reserved for escalation — when local models can't handle a task.

The brain is replaceable. Today it's Claude. Tomorrow when something better exists, the founder swaps it. The vault and the wrapper stay.

---

## The six roles and their agents

| Role | Codenames | What they do |
|---|---|---|
| **Chief of Staff** | Robusca | Female persona with a warm South African voice. Runs the 8am standup. Reads yesterday's notes, the ledger, and overnight proposals. Writes today's note. Keeps the day on the rails. |
| **Sales** | CashClaw — codename **Adam** | Confident male persona. Anchored to Studex Meat. Closes deals, manages the pipeline, posts CRM updates. |
| **Customer** | DenchClaw, Charlie | Friendly South African personas. Charlie is the Studex Meat customer agent — replies on WhatsApp, books calls, escalates complex issues. |
| **Research** | Research, OpenFang | Curious, analytical. Owns the overnight research loop. Scrapes RSS, socials, and the web for what's new and useful. |
| **DevOps** | CTO, Skunk Works, Dr Fix-It | The CTO writes code in Cursor IDE using local Ollama models, delegates short tasks to the Cursor CLI, and spawns Cursor Background Agents via API for long parallel work. Skunk Works runs builds and CI. Dr Fix-It is the heartbeat — pings every agent hourly, restarts whatever died. |
| **Media** | The Lady | Female persona. Posts the content, tracks what works, reports audience reactions at the morning council. |

Each agent has its own ElevenLabs voice. When you talk to Charlie on WhatsApp, you hear Charlie. When Robusca opens the 9am council, you hear Robusca. When the CTO reports on infra health, you hear the CTO. The personalities are real and distinct.

**Each agent also has a face.** Inside the dashboard and the promo video, every agent appears as a painted-pixel character — Avenger-style, high-definition, generated with NanoBanana from the prompts in the asset library. Robusca looks like Robusca. Adam looks like Adam. Charlie looks like Charlie. The founder — Tumelo — appears as the Commander at the centre of the Factory, dressed as Iron Man in red-and-gold armour with the arc reactor glowing cyan. The agents work around him in numbered workstations, conveyor belts running between them.

## The dashboard

The live dashboard runs at `localhost:3141` on the founder's Mac and is tunnelled out via Cloudflare so it works from any browser, anywhere.

**Top strip — eight world clocks.** Transparent and bold-white. Cape Town, Dubai, London, Shanghai, Beijing, Hong Kong, New York, San Francisco. The founder always knows what time it is at every desk that matters — whether that's a partner in the UAE, a buyer in Hong Kong, or a content creator in San Francisco.

**Tabs across the top.** Council, Mission, War Room, Agents, Ledger, Night Build. Each tab is a full view. The active tab fills in orange; inactive tabs have yellow borders and yellow text. Nothing is hidden in menus.

**The kanban — the heart of Mission Control.** Three vertical columns with the StudEx signature look: *Queued* and *Done* use the yellow band treatment, *Running* uses the orange band. Each band has a header chip showing the task count. Each task card carries the agent's pixel face on the left and the task title on the right, with a small mono caption underneath showing context like "PR #42" or "14d avg gap". Cards drag from one band to the next.

**Status bar across the bottom.** A single mono-font line: agents online, errors today, PRs waiting on you, time until the Night Build starts, and a running cost split showing local tokens spent today versus Claude tokens spent today. In a normal day this reads something like "11 agents online · 0 errors · 2 PRs awaiting review · Night Build ready in 9h 28m · Local tokens today: 1.2M · Claude: 0". The founder can see at a glance whether they spent zero rand on cloud AI today.

**The painting behind it all.** The Studex Genesis painting sits as a faint backdrop at 18% opacity, blurred slightly. The brand is always present without ever competing with the data.

---

## The daily ritual

This is the heartbeat of the company. It runs whether the founder is at the desk or on a flight to Mozambique.

**07:00 SAST** — Snapshot. The vault is committed to git and pushed to backup.

**08:00 SAST** — Robusca Standup. Robusca reads yesterday's daily note, the ledger (costs vs revenue), the open missions in the kanban, and any overnight proposals from the Night Build. She writes today's note: yesterday's wins and misses, the sales/social/costs delta, today's three priorities, and a clearly labelled block of items that need the founder's yes/no.

**09:00 SAST** — StudEx Agent Council Meeting. Every agent reports in order, each report under 90 seconds, all in voice via ElevenLabs:
- Robusca opens with the agenda
- CTO reports on infra health, agent uptime, token spend, last night's Night Build status, and any Cursor Background Agents still running
- Skunk Works reports on client project progress, Linear tickets, and bugs
- Dr Fix-It gives the heartbeat report
- Adam (CashClaw) reports sales and pipeline numbers
- DenchClaw reports customer signups and support tickets
- Charlie reports the Studex Meat customer queue
- Research reports findings from the ledger and the world
- OpenFang reports what social media and partners are doing
- The Lady reports content performance and audience reactions
- Robusca closes by synthesising the top three decisions the founder must make today

The transcript streams to the vault. Action items append to the kanban. The founder can interject at any point: "@Charlie, more on that complaint", "@Adam, show me the Mozambique pipeline", "/decide ship the new landing page on Tuesday".

**12:00 SAST** — Midday snapshot.

**17:00 SAST** — End-of-day wrap and snapshot.

**22:00 SAST** — Night Build begins.

**00:00 SAST** — Midnight snapshot.

**02:00 SAST** — Night Build hard stop.

**Every hour** — Dr Fix-It pings every agent. Anything dead gets restarted.

---

## The Night Build — what happens while the founder sleeps

Between 22:00 and 02:00 every night, agents stop chatting and start building. The system runs in a special mode:
- No Claude API calls (zero cloud spend)
- No outbound messages (no 3am Slack to clients)
- No real-money operations (Stripe is blocked)
- Only local Ollama models, only the founder's own machine

In this 4-hour window, two real prototypes get built. Strictly two. Every night.

The pipeline per product takes about 2 hours:
1. **Problem pick** — Research ranks the open problems from the kanban, the last week's daily notes, and the ledger's red flags. Picks the most painful one.
2. **3-page plan** — Research and the CTO write a plan: page 1 problem and evidence, page 2 solution and architecture, page 3 rollout, cost, and risks.
3. **Build** — Skunk Works scaffolds a sandboxed project folder, generates the code using qwen2.5-coder running on the Mac, and writes a Cursor configuration so the project opens cleanly in Cursor the next morning.
4. **Test and fix** — Dr Fix-It runs the tests. If they fail, up to three fix-loop iterations.
5. **Demo wrap** — A README with one run command and one "open in Cursor" command.

At 02:00 the build stops. Anything unfinished checkpoints itself and resumes tomorrow night.

At 08:00, when Robusca opens the standup, she surfaces the night's work: "Two prototypes from last night. The first one — automatic partner follow-ups — passed all seven tests and is ready to demo. The second one — a coffee landing page A/B test harness — passed five of six tests, one known issue documented. Open them in Cursor with this command. Approve, revise, or discard?"

The founder makes three decisions before their second coffee. Sometimes they approve and ship. Sometimes they say "interesting, keep iterating tonight." Sometimes they discard and the system learns what not to build.

---

## What runs where (machine plan)

- **MacBook Pro M1 (32GB)** — The orchestrator. Runs the Hive Mind, the Robusca standup, the council, and the night build.
- **Mac Mini M4 (16GB) + 6TB external drive** — The NAS. Always on. Hosts the vault, the SQLite memory, and the Cloudflare Tunnel for remote access.
- **Windows desktop with 2× 8GB GPUs** — Optional muscle. Joins the mesh-llm network for heavy models like Hermes 70B.
- **Lenovo Legion Go 2** — Roaming research and demos.
- **Windows laptop** — Voice plane. Whisper STT and ElevenLabs proxy.

Day one needs only the MacBook Pro and the Mac Mini. Other machines join the mesh later.

---

## Pricing for clients

We sell this as a managed service to South African small businesses.

| Tier | Monthly (ZAR) | Who it's for | What's included |
|---|---|---|---|
| **Starter** | R 2 999 | Solo founder, one business | 3 agents, 1 channel, cloud models only, daily standup |
| **Pro** | R 6 999 | Small team, multiple businesses | 6 agents, Slack + Discord, local models on your Mac, Night Build, weekly council |
| **Premium** | R 13 999 | Operator running several brands | All eleven agents, mesh across machines, Cursor Background Agents, daily council, white-label branding |

All tiers include a 7-day free trial. POPIA-compliant by default. Load-shedding friendly — the system survives power cuts because everything runs on the founder's own hardware. Cloud is optional.

---

## What makes this different

- **Vault-first.** Most AI tools are stateless. Every prompt starts from scratch. Valley OS reads from the founder's existing Obsidian vault on every turn. Nothing is forgotten.
- **Local-first.** Cloud AI is expensive. Valley OS defaults to local Ollama models running on the founder's own Mac. Claude is reserved for escalation. Most days, the cloud bill is zero.
- **Voice-first.** Every agent has a distinct ElevenLabs voice. The 9am council sounds like a real boardroom meeting. The founder talks back. Documents can be dropped in mid-meeting and analysed live.
- **Build-first.** Every night, two new prototypes get built. The founder wakes up to working code, not just suggestions.
- **Time-aware.** The dashboard shows eight world clocks at the top — Cape Town, Dubai, London, Shanghai, Beijing, Hong Kong, New York, San Francisco — because a global trading community lives across time zones.
- **Visual identity.** Every agent has a painted-pixel face. The founder, Tumelo, appears as Iron Man — the Commander at the centre of the Factory. The whole product looks like a Marvel movie ran into a Bloomberg terminal.
- **One picture.** Every part of the system is one of five layers: vault, hive mind, agents, bridges, muscle. New team members understand the whole company in 60 seconds.
- **Replaceable brain.** Today the orchestrator is Claude. Tomorrow it could be Gemini, GPT, or a future open-source model. The vault and the wrapper stay. The brain is a swap, not a rewrite.

---

## The call to action

If you run a small business and you're tired of being the bottleneck — if you're answering customers at midnight, forgetting where you saved that deck, watching your AI subscription bill climb with nothing to show for it — StudEx Valley OS gives you back your evenings.

Start your 7-day free trial at **studex.valley/start**.

Setup takes one afternoon. Your first morning standup runs at 8am the next day.

Let it run.
