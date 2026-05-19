# Graph Report - docs  (2026-05-19)

## Corpus Check
- Corpus is ~6,394 words - fits in a single context window. You may not need a graph.

## Summary
- 71 nodes · 116 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Bridges & Build Pipeline|Bridges & Build Pipeline]]
- [[_COMMUNITY_Model Providers (Muscle)|Model Providers (Muscle)]]
- [[_COMMUNITY_Exec — Rituals & Orchestration|Exec — Rituals & Orchestration]]
- [[_COMMUNITY_Research & Vault|Research & Vault]]
- [[_COMMUNITY_Hive Mind Core|Hive Mind Core]]
- [[_COMMUNITY_System Spec & Dashboard|System Spec & Dashboard]]
- [[_COMMUNITY_Sales & Customer (Studex Meat)|Sales & Customer (Studex Meat)]]
- [[_COMMUNITY_DevOps & Cursor|DevOps & Cursor]]
- [[_COMMUNITY_Media|Media]]

## God Nodes (most connected - your core abstractions)
1. `13 build chunks (order of operations)` - 14 edges
2. `StudEx Valley OS` - 12 edges
3. `22:00-02:00 Night Build (2 products/night, Ollama only)` - 10 edges
4. `CTO (DevOps, Chief Technology)` - 9 edges
5. `Ollama (local default, :11434)` - 9 edges
6. `Chunk 3: Core (valley/src/core/*)` - 8 edges
7. `Hive Mind layer (wrapper)` - 7 edges
8. `09:00 StudEx Agent Council Meeting` - 7 edges
9. `Multi-provider model client (model.ts)` - 7 edges
10. `Robusca (Chief of Staff)` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Launch Today (StudEx Dark Factory MVP)` --semantically_similar_to--> `22:00-02:00 Night Build (2 products/night, Ollama only)`  [INFERRED] [semantically similar]
  docs/LAUNCH_TODAY.md → docs/MEGA_PROMPT.md
- `Launch Today (StudEx Dark Factory MVP)` --references--> `StudEx Valley OS`  [INFERRED]
  docs/LAUNCH_TODAY.md → docs/MEGA_PROMPT.md
- `13 build chunks (order of operations)` --conceptually_related_to--> `Chunk 12: Dashboard`  [EXTRACTED]
  docs/MEGA_PROMPT.md → docs/superpowers/plans/2026-05-19-valley-os-build.md
- `Launch Today (StudEx Dark Factory MVP)` --references--> `CashClaw (Adam, Sales)`  [EXTRACTED]
  docs/LAUNCH_TODAY.md → docs/MEGA_PROMPT.md
- `Valley OS Build Implementation Plan` --references--> `MEGA_PROMPT.md (Bootstrap Mission spec)`  [EXTRACTED]
  docs/superpowers/plans/2026-05-19-valley-os-build.md → docs/MEGA_PROMPT.md

## Hyperedges (group relationships)
- **09:00 Agent Council seated participants (all 11 agents)** — agent_robusca, agent_cto, agent_skunkworks, agent_drfixit, agent_cashclaw, agent_denchclaw, agent_charlie, agent_research, agent_openfang, agent_the_lady, ritual_council [EXTRACTED 1.00]
- **Five Valley OS architecture layers** — layer_vault, layer_hive_mind, layer_agents, layer_bridges, layer_muscle [EXTRACTED 1.00]
- **Kill switches gated before going live (STOP #5)** — component_kill_switches, ritual_council, ritual_night_build, cursor_integration [EXTRACTED 1.00]

## Communities (9 total, 1 thin omitted)

### Community 0 - "Bridges & Build Pipeline"
Cohesion: 0.18
Nodes (14): Discord bridge (discord.js), ElevenLabs voice (TTS), Slack bridge (Bolt), Whisper STT (Groq), 13 build chunks (order of operations), Chunk 1: Scaffold, Chunk 2: Config (factory/config/*.json), Chunk 3.5: Cursor tool (STOP #1) (+6 more)

### Community 1 - "Model Providers (Muscle)"
Cohesion: 0.27
Nodes (10): Multi-provider model client (model.ts), Launch Today (StudEx Dark Factory MVP), Multi-Machine Models, Muscle layer (Ollama +optional mesh-llm), Claude / Anthropic (escalation), Groq (incl. Whisper STT), Mesh-LLM (shared large local models, :9337/v1), Ollama (local default, :11434) (+2 more)

### Community 2 - "Exec — Rituals & Orchestration"
Cohesion: 0.28
Nodes (9): Robusca (Chief of Staff), Chunk 6: War Room, Chunk 7: Day rituals (morning/council/snapshot), Verification-before-completion gate, 09:00 StudEx Agent Council Meeting, 08:00 Robusca Standup, Chief of Staff (Exec) role, /goal skill (Robusca long-term vision loop) (+1 more)

### Community 3 - "Research & Vault"
Cohesion: 0.22
Nodes (9): OpenFang (Research), Research (Research role), SGM, Studex Coffee, Chunk 13: Infra + docs + vault seed, Vault layer (2nd Brain = brain), Research role, graphify skill (vault/data -> knowledge graphs) (+1 more)

### Community 4 - "Hive Mind Core"
Cohesion: 0.46
Nodes (8): Chunk 3: Core (valley/src/core/*), Append-only audit log (correlation IDs, 90-day prune), Classifier (routes task to codename via gemma2:2b), Cost-footer (daily token summary, escalation gate), Exfil-guard (outbound call gate), Kill switches + kill phrase, 3-layer memory (FTS5 + sqlite-vec 768d + salience/decay/pin), Hive Mind layer (wrapper)

### Community 5 - "System Spec & Dashboard"
Cohesion: 0.29
Nodes (7): Chunk 4: Agents (yaml + CLAUDE.md), Chunk 12: Dashboard, Hono Dashboard :3141 (world clocks, kanban bands), MEGA_PROMPT.md (Bootstrap Mission spec), Valley OS Build Implementation Plan, Agents layer (hands), StudEx Valley OS

### Community 6 - "Sales & Customer (Studex Meat)"
Cohesion: 0.33
Nodes (6): CashClaw (Adam, Sales), Charlie (Studex Meat customer agent), DenchClaw (Customer), Studex Meat, Customer role, Sales role

### Community 7 - "DevOps & Cursor"
Cohesion: 0.67
Nodes (6): CTO (DevOps, Chief Technology), Dr Fix-It (DevOps, heartbeats), Skunk Works (DevOps, builds), Cursor integration (IDE + CLI + Background Agents), 22:00-02:00 Night Build (2 products/night, Ollama only), DevOps role

## Knowledge Gaps
- **15 isolated node(s):** `Valley OS Build Implementation Plan`, `Multi-Machine Models`, `DenchClaw (Customer)`, `The Lady (Media)`, `Chief of Staff (Exec) role` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `StudEx Valley OS` connect `System Spec & Dashboard` to `Bridges & Build Pipeline`, `Model Providers (Muscle)`, `Exec — Rituals & Orchestration`, `Research & Vault`, `Hive Mind Core`, `DevOps & Cursor`?**
  _High betweenness centrality (0.296) - this node is a cross-community bridge._
- **Why does `13 build chunks (order of operations)` connect `Bridges & Build Pipeline` to `Exec — Rituals & Orchestration`, `Research & Vault`, `Hive Mind Core`, `System Spec & Dashboard`?**
  _High betweenness centrality (0.271) - this node is a cross-community bridge._
- **Why does `22:00-02:00 Night Build (2 products/night, Ollama only)` connect `DevOps & Cursor` to `Bridges & Build Pipeline`, `Model Providers (Muscle)`, `Exec — Rituals & Orchestration`, `Research & Vault`, `System Spec & Dashboard`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `22:00-02:00 Night Build (2 products/night, Ollama only)` (e.g. with `Verification-before-completion gate` and `Launch Today (StudEx Dark Factory MVP)`) actually correct?**
  _`22:00-02:00 Night Build (2 products/night, Ollama only)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Valley OS Build Implementation Plan`, `Multi-Machine Models`, `DenchClaw (Customer)` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._