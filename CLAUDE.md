# CLAUDE.md - StudEx Dark Factory

**Repository**: agentic-lab-v3  
**Version**: 0.1.0  
**Purpose**: Orchestration layer for multi-agent service delivery using Cursor, AionUi, CashClaw, Ollama, Mesh-LLM, Linear, GitHub, and Docker  
**Owner**: Tumelo Ramaphosa  
**Updated**: 2026-07-08

---

## Quick Start

```bash
# Verify local environment
npm run factory:doctor

# Refresh model routing (after pulling latest models)
npm run factory:models

# Process a client request
npm run factory:intake -- --file factory/inbox/example-intake.json

# Create a project sandbox
npm run factory:project:create -- --slug client-project
npm run factory:project:start -- --slug client-project

# Start with dry-run; add --live after approval
npm run factory:project:start -- --slug client-project --live
```

---

## Project Overview

**Dark Factory** is an orchestration layer that coordinates multiple systems to deliver AI-powered services to clients. It manages:

- **Client intake** → **scope generation** → **project sandbox creation** → **delivery**
- **Approval gates** on money, deployment, repos, and client deliverables
- **Model routing** between Ollama (single-machine) and Mesh-LLM (multi-machine GPU)
- **Integration** with Linear (work ledger), GitHub (repos), and CashClaw (lead/opportunity agent)

The factory is designed as a **dry-run first** system: all operations have safe defaults and require explicit `--live` and `--approved` flags to take real-world actions.

---

## Architecture & Component Roles

### Core Roles

| Component | Role | Status |
|-----------|------|--------|
| **AionUi** | Office UI, cowork sessions, client/operator dashboard | External (at `AIONUI_PATH`) |
| **CashClaw/OpenClaw** | Lead/opportunity agent, service catalog | External (at `CASHCLAW_PATH`) |
| **Cursor** | Factory floor for coding and review | Local IDE |
| **Linear** | Command ledger and progress updates | Requires `LINEAR_API_KEY`, `LINEAR_TEAM_ID`, `LINEAR_PROJECT_ID` |
| **GitHub** | Client project repos | Requires `gh` CLI authenticated |
| **Ollama** | Local single-machine model provider | Runs at `OLLAMA_BASE_URL` (default: `http://localhost:11434`) |
| **Mesh-LLM** | Multi-machine local model mesh for large models | Runs at `MESH_LLM_BASE_URL` (default: `http://localhost:9337/v1`) |
| **Docker** | Day-one project isolation via OrbStack or Docker Desktop | Required for `--live` project runs |
| **Tailscale** | Private networking for Mesh-LLM GPU machines | Recommended for security |

### Factory Components (This Repository)

- **Intake pipeline**: Accepts client requests, validates against schema, generates Linear payload
- **Project manager**: Creates Docker sandboxes with isolated workspaces and deliverables directories
- **Model router**: Detects available Ollama and Mesh-LLM models, selects by task type
- **GitHub provisioner**: Creates repos, checks approval gates
- **Health checker ("doctor")**: Verifies local tools and model availability

---

## Directory Structure

```
agentic-lab-v3/
├── package.json                          # Node.js project config, npm scripts
├── README.md                             # High-level overview
├── CLAUDE.md                             # This file: AI assistant guidelines
├── .env.example                          # Template for local configuration
├── .gitignore                            # Excludes local work, containers, secrets
│
├── factory/
│   ├── scripts/                          # Entry points for all operations
│   │   ├── doctor.mjs                    # Health check: git, gh, node, bun, docker, ollama, mesh-llm, tailscale
│   │   ├── models.mjs                    # Refresh model routing: detects Ollama and Mesh-LLM models
│   │   ├── intake.mjs                    # Client request intake: validates and generates Linear payload
│   │   ├── project.mjs                   # Project lifecycle: create, start, status, stop
│   │   ├── cashclaw.mjs                  # CashClaw operations (approval-gated)
│   │   ├── github.mjs                    # GitHub repo operations (approval-gated)
│   │   ├── mesh.mjs                      # Mesh-LLM operations: serve, client, status
│   │   └── test-ollama.mjs               # Ollama connectivity test
│   │
│   ├── config/                           # Configuration and metadata
│   │   ├── services.json                 # Integration endpoints and roles
│   │   ├── integrations.json             # External service paths and CLI commands
│   │   ├── model-routing.json            # Generated: detected models and selected routes
│   │   └── README.md                     # (if present)
│   │
│   ├── schemas/                          # JSON schema definitions
│   │   └── intake.schema.json            # Validates client intake payloads
│   │
│   ├── inbox/                            # Client request staging
│   │   ├── example-intake.json           # Example request (reference)
│   │   ├── live-*.json                   # Live intakes (in .gitignore)
│   │   └── .gitkeep
│   │
│   ├── intakes/                          # Generated Linear payloads
│   │   └── *-linear-dry-run.json         # Output from intake.mjs (staged for Linear)
│   │
│   └── projects/                         # Client project sandboxes
│       ├── example-client-mvp/           # Example project structure
│       │   ├── factory.project.json      # Metadata: slug, status, model endpoints
│       │   ├── Dockerfile                # Generated: Node.js 22 + build tools
│       │   ├── README.md                 # Generated: project summary
│       │   ├── workspace/                # Project code (git clones, builds)
│       │   ├── deliverables/             # Final outputs for client
│       │   └── logs/                     # Build and runtime logs (in .gitignore)
│       │
│       └── <slug>/                       # Pattern for each project sandbox
│
└── docs/
    ├── LAUNCH_TODAY.md                   # Same-day launch checklist
    └── MULTI_MACHINE_MODELS.md           # Mesh-LLM topology and commands
```

---

## Configuration Files

### `.env` / `.env.example`

Local environment overrides. Critical for operator setup:

```bash
# Core identity
FACTORY_NAME="StudEx Agent Server Warehouse"
FACTORY_OPERATOR="Tumelo"

# Model endpoints
OLLAMA_BASE_URL="http://localhost:11434"
MESH_LLM_BASE_URL="http://localhost:9337/v1"
DEFAULT_FAST_MODEL="gemma4:e4b"
DEFAULT_CODE_MODEL="deepseek-v4-pro:cloud"

# External service paths (for integration testing)
AIONUI_PATH="/path/to/AionUi"
CASHCLAW_PATH="/path/to/cashclaw"
OPENMYTHOS_PATH="/path/to/OpenMythos"

# Credentials (approval-gated in factory/config/integrations.json)
GITHUB_OWNER="TumeloRamaphosa"
GITHUB_TOKEN=""
LINEAR_API_KEY=""
LINEAR_TEAM_ID=""
LINEAR_PROJECT_ID=""

# Marketplace and payments
CASHCLAW_HYRVE_API_KEY=""
STRIPE_SECRET_KEY=""
PAYFAST_MERCHANT_ID=""
```

**Note**: Copy `.env.example` to `.env` or `.env.local` for local development. Never commit secrets.

### `factory/config/services.json`

Defines service catalog (offers, statuses):

```json
{
  "offers": [
    {
      "id": "seo-audit",
      "title": "SEO Audit Report",
      "cashclawSkill": "cashclaw-seo-auditor",
      "startingPriceUsd": 29,
      "approvalRequired": true
    },
    // ... more services
  ],
  "statuses": [
    "intake",
    "scope",
    "approved",
    "sandbox-created",
    "building",
    "review-ready",
    "delivered"
  ]
}
```

### `factory/config/integrations.json`

Maps external services (AionUi, CashClaw, Ollama, etc.) to their paths, commands, and roles:

```json
{
  "aionUi": { "path": "...", "role": "...", "webuiCommand": "..." },
  "cashclaw": { "path": "...", "role": "...", "safeCommands": [...], "gatedCommands": [...] },
  "ollama": { "baseUrl": "...", "role": "..." },
  "meshLlm": { "baseUrl": "...", "role": "..." },
  "linear": { "role": "...", "mode": "dry-run until LINEAR_API_KEY is set" },
  "github": { "owner": "TumeloRamaphosa", "role": "..." }
}
```

### `factory/config/model-routing.json`

Generated by `npm run factory:models`. Detected models and task-specific routes:

```json
{
  "endpoints": {
    "ollama": { "baseUrl": "http://localhost:11434", "type": "ollama" },
    "meshLlm": { "baseUrl": "http://localhost:9337/v1", "type": "openai-compatible" }
  },
  "routes": {
    "intake": { "endpoint": "ollama", "model": "gemma4:e4b", "fallback": "phi4-mini:latest" },
    "planning": { "endpoint": "ollama", "model": "deepseek-v4-pro:cloud", "fallback": "nous-hermes2:latest" },
    "code": { "endpoint": "meshLlm", "model": "deepseek-r4-local", "fallbackEndpoint": "ollama", "fallback": "deepseek-v4-pro:cloud" },
    "review": { "endpoint": "ollama", "model": "deepseek-v4-pro:cloud", "fallback": "hermes3:latest" },
    "summary": { "endpoint": "ollama", "model": "gemma4:e4b", "fallback": "llama3.2:3b" }
  },
  "observed": {
    "ollamaModels": [...],
    "meshStatus": "...",
    "meshModels": "..."
  }
}
```

### `factory/schemas/intake.schema.json`

JSON Schema that validates client intake payloads. Required fields:

- `clientName` (string, non-empty)
- `serviceId` (enum: `seo-audit`, `landing-page`, `lead-list`, `competitor-analysis`, `mvp-scope`, `small-code-fix`, `custom`)
- `request` (string, min 10 chars)
- `approvalContact` (string, non-empty)

Optional fields:
- `sourceUrl`, `githubRepo`, `budgetUsd`, `dueDate`, `deliverableFormat`, `notes`

---

## Core Workflows

### 1. Client Intake → Linear Issue

**Entry**: `factory/inbox/*.json` (client request)  
**Command**: `npm run factory:intake -- --file factory/inbox/example-intake.json`  
**Output**: `factory/intakes/*-linear-dry-run.json` (Linear payload, JSON)

**Dry-run (default)**:
- Validates intake against `factory/schemas/intake.schema.json`
- Generates Linear issue payload
- Prints path to output file

**Live** (requires `--live` flag + `LINEAR_API_KEY`):
- TODO: Integrate Linear API client (currently blocked on team/project IDs)

---

### 2. Project Creation → Docker Sandbox

**Entry**: Command line: `npm run factory:project:create -- --slug <slug>`  
**Flags**:
- `--slug <slug>`: Project identifier (slugified from name)
- `--name <name>`: Alternative to `--slug`
- `--github-repo <repo>`: Link existing GitHub repo (optional)
- `--linear-issue <issue>`: Link Linear issue (optional)

**Outputs**:
- `factory/projects/<slug>/factory.project.json`: Metadata (slug, createdAt, status, model endpoints)
- `factory/projects/<slug>/Dockerfile`: Node.js 22 + build tools (git, curl, python3, make, g++)
- `factory/projects/<slug>/README.md`: Usage instructions
- Directories: `workspace/`, `deliverables/`, `logs/`

**Metadata fields**:
```json
{
  "slug": "project-id",
  "createdAt": "2026-07-08T...",
  "status": "created",
  "githubRepo": "owner/repo",
  "linearIssue": "linear-id",
  "modelEndpoints": {
    "ollama": "http://host.docker.internal:11434",
    "meshLlm": "http://host.docker.internal:9337/v1"
  }
}
```

---

### 3. Project Start → Dry-run or Container Launch

**Command**: `npm run factory:project:start -- --slug <slug> [--live]`

**Dry-run (default)**:
- Validates `factory.project.json` exists
- Prints what would happen (container image, volumes, env)
- Useful for debugging sandbox setup before Docker runs

**Live** (requires `--live` flag):
- Builds Docker image from `Dockerfile`
- Launches container with:
  - Workspace mounted: `/workspace` (host: `factory/projects/<slug>/workspace/`)
  - Deliverables mounted: `/deliverables` (host: `factory/projects/<slug>/deliverables/`)
  - Model endpoints routed via `host.docker.internal` to localhost
  - Sleep infinity (container runs until stopped)

---

### 4. Project Status & Lifecycle

**Status** (check if running):
```bash
npm run factory:project:status -- --slug <slug>
```

**Stop** (shutdown container):
```bash
npm run factory:project:stop -- --slug <slug>
```

---

## Commands & Scripts

### Core Factory Scripts

| Script | Purpose | Flags | Approval Gate |
|--------|---------|-------|----------------|
| `factory:doctor` | Health check: git, gh, node, docker, ollama, mesh-llm, tailscale | None | — |
| `factory:models` | Refresh detected models in `model-routing.json` | None | — |
| `factory:intake` | Validate and convert intake to Linear payload | `--file`, `--live` | —dry-run / `--live` requires `LINEAR_API_KEY` |
| `factory:project:create` | Create sandbox directory structure and Dockerfile | `--slug`, `--github-repo`, `--linear-issue` | — |
| `factory:project:start` | Start dry-run simulation or launch container | `--slug`, `--live` | —dry-run / `--live` runs Docker |
| `factory:project:status` | Check container status | `--slug` | — |
| `factory:project:stop` | Stop running container | `--slug` | — |
| `factory:cashclaw` | Query CashClaw lead agent | `status`, `skills`, `help`, `init`, `hyrve-status`, `hyrve-poll`, `auto-accept` | Some actions are `--approved`-gated |
| `factory:github` | GitHub repo provisioning | `create-repo`, `delete-repo` | `--live --approved` gates repo creation |
| `factory:mesh` | Mesh-LLM operations | `gpus`, `models`, `status`, `stop`, `serve`, `client` | — |

---

## Model Routing

Models are selected based on **task type**. Each route can have a primary model and fallback.

### Task Types

| Route | Purpose | Primary | Fallback |
|-------|---------|---------|----------|
| **intake** | Parse client requests, classify service types | Ollama: `gemma4:e4b` | `phi4-mini:latest` |
| **planning** | Design scope, architecture, project plans | Ollama: `deepseek-v4-pro:cloud` | `nous-hermes2:latest` |
| **code** | Generate, review, refactor code | Mesh-LLM: `deepseek-r4-local` | Ollama: `deepseek-v4-pro:cloud` |
| **review** | Code review, security analysis, QA | Ollama: `deepseek-v4-pro:cloud` | `hermes3:latest` |
| **summary** | Generate reports, markdown, client deliverables | Ollama: `gemma4:e4b` | `llama3.2:3b` |

### Detected Models (Example)

Run `npm run factory:models` to refresh. Common models:

- **Fast inference**: `gemma4:e4b`, `qwen2.5-coder:7b`, `qwen3.5:latest`
- **Coding**: `deepseek-v4-pro:cloud`, `nous-hermes2:latest`
- **Large**: `deepseek-r4-local` (Mesh-LLM only, GPU-hosted)

---

## Local Services

### Ollama (Single-Machine)

**Default**: `http://localhost:11434`  
**Purpose**: Local model inference, fallback, development  
**Start**: `ollama serve` or `ollama serve --model <name>`

**Test connectivity**:
```bash
npm run factory:test-ollama
```

**Common models**:
- `gemma4:e4b` (small, fast)
- `deepseek-v4-pro:cloud` (code, reasoning)
- `nous-hermes2:latest` (instruction following)
- `phi4-mini:latest` (lightweight)

---

### Mesh-LLM (Multi-Machine)

**Default**: `http://localhost:9337/v1` (OpenAI-compatible API)  
**Console**: `http://localhost:3131`  
**Purpose**: Large local models shared across Cursor machines via Tailscale  
**Topology**: Cursor → localhost:9337 → Tailscale → GPU box → Model

**Start on GPU machine**:
```bash
mesh-llm serve --model Qwen3-8B-Q4_K_M
```

**Join from Cursor-only machine**:
```bash
mesh-llm --client --join <invite-token>
```

**Stop all**:
```bash
npm run factory:mesh -- stop
```

**Policy**:
- Keep client code on private meshes only (Tailscale or invite tokens)
- Do not use public mesh discovery for confidential work
- Use Ollama as fallback when Mesh-LLM is offline

---

## Safety Gates & Approval Requirements

The factory is designed with **approval gates** on high-impact actions:

### Dry-run by Default

All operations that affect external systems default to **dry-run** and require explicit flags:

| Operation | Dry-run | Live Flag | Approval Needed |
|-----------|---------|-----------|-----------------|
| Intake processing | Generates Local JSON payload | `--live` + `LINEAR_API_KEY` | Yes (scope review) |
| GitHub repo creation | Prints what would be created | `--live --approved` | Yes (repo decision) |
| Project launch | Prints Docker config | `--live` | Yes (infrastructure) |
| CashClaw actions | Status, skills only | Command + `--approved` | Yes (init, polling, auto-accept) |
| Payment processing | N/A | N/A | Yes (money) |
| Client delivery | N/A | N/A | Yes (release gate) |

### Critical Environment Variables

Actions require these to be set:

- **Linear integration**: `LINEAR_API_KEY`, `LINEAR_TEAM_ID`, `LINEAR_PROJECT_ID`
- **GitHub integration**: `gh` CLI authenticated via `gh auth login`
- **CashClaw**: `CASHCLAW_PATH` and `CASHCLAW_HYRVE_API_KEY` (if polling leads)
- **Payments**: `STRIPE_SECRET_KEY`, `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE`

---

## Integration Points

### AionUi (Office UI)

**Path**: `AIONUI_PATH` env var (e.g., `/Users/tumeloramaphosa/AionUi`)  
**Purpose**: Cowork sessions, client dashboard, multi-agent surface  
**Launch**:
```bash
cd $AIONUI_PATH
bun install
bun run webui:prod:remote
```
**Configure**: Point to Ollama (`http://localhost:11434`) and Mesh-LLM (`http://localhost:9337/v1`)

---

### CashClaw / OpenClaw (Lead Agent)

**Path**: `CASHCLAW_PATH` env var  
**Purpose**: Lead/opportunity qualification, service catalog, HYRVE integration  
**Safe commands**:
```bash
npm run factory:cashclaw -- status
npm run factory:cashclaw -- skills
npm run factory:cashclaw -- help
```
**Approval-gated**:
```bash
npm run factory:cashclaw -- init --approved
npm run factory:cashclaw -- hyrve-poll --approved
npm run factory:cashclaw -- auto-accept --approved
```

---

### Linear (Work Ledger)

**Purpose**: Track work status, progress updates, audit trail  
**Setup**: Set `LINEAR_API_KEY`, `LINEAR_TEAM_ID`, `LINEAR_PROJECT_ID` in `.env`  
**Integration**: Factory generates intake payloads; currently awaiting API client implementation

---

### GitHub (Repositories)

**Purpose**: Project repos, code reviews, CI/CD  
**Requirement**: `gh` CLI authenticated (`gh auth login`)  
**Commands**:
```bash
npm run factory:github -- create-repo --name my-project           # Dry-run
npm run factory:github -- create-repo --name my-project --live --approved  # Real
```

---

## Development Workflow for AI Assistants

### When Working in This Codebase

1. **Read this CLAUDE.md first** to understand architecture and safety gates
2. **Respect dry-run defaults**: Never add `--live --approved` unless explicitly requested
3. **Validate changes locally**: Run `npm run factory:doctor` before committing
4. **Update model-routing.json**: After model changes, run `npm run factory:models`
5. **Test intake flow**: Use `factory/inbox/example-intake.json` to validate schema changes
6. **Check .gitignore**: Do not commit `live-*.json`, `.env`, project workspace/logs/deliverables

### Common Tasks

#### Adding a New Service Offer

1. Add to `factory/config/services.json` → `offers` array with `id`, `title`, `cashclawSkill`, `startingPriceUsd`, `approvalRequired`
2. Update intake schema if new fields needed
3. Document in `CLAUDE.md` (this file)

#### Changing Model Routing

1. Edit `factory/config/model-routing.json` → `routes` section
2. Verify models exist in Ollama/Mesh-LLM (`npm run factory:models`)
3. Test with intake workflow
4. Commit with message: "Update model routing: [task] → [model]"

#### Adding a New External Integration

1. Add to `factory/config/integrations.json` with `path`, `role`, `command`
2. Add health check to `factory/scripts/doctor.mjs` if needed
3. Create corresponding factory script if complex
4. Document endpoint and commands in this file

#### Creating Project Templates

1. Add template to `factory/projects/` with subdirectory structure
2. Update `factory/scripts/project.mjs` to support template selection
3. Include working `.gitkeep` files to preserve empty directories

### Testing

**No test suite currently**. Manual verification:

```bash
# Health check
npm run factory:doctor

# Model detection
npm run factory:models

# Intake validation (dry-run)
npm run factory:intake -- --file factory/inbox/example-intake.json

# Project simulation
npm run factory:project:create -- --slug test-project
npm run factory:project:start -- --slug test-project  # Dry-run prints Docker config

# GitHub dry-run
npm run factory:github -- create-repo --name test-repo  # Prints what would be created
```

---

## Debugging

### Model endpoints not available

```bash
npm run factory:doctor
npm run factory:models
# Check OLLAMA_BASE_URL and MESH_LLM_BASE_URL in .env
```

### Project start fails

```bash
npm run factory:project:status -- --slug <slug>
ls -la factory/projects/<slug>/
cat factory/projects/<slug>/factory.project.json
```

### Docker errors (input/output)

Factory scripts intentionally keep dry-run available. Restart Docker Desktop or OrbStack:

```bash
npm run factory:project:start -- --slug <slug>  # Still works (dry-run)
# Restart Docker/OrbStack
npm run factory:project:start -- --slug <slug> --live  # Retry when ready
```

### GitHub authentication

```bash
gh auth status
gh auth login  # Re-authenticate if needed
```

### Linear integration pending

Linear API client not yet implemented. For now, factory generates payload in `factory/intakes/*.json` for manual review.

---

## Standards & Conventions

### Naming Conventions

- **Slugs**: Lowercase, hyphens, 80 chars max (e.g., `example-client-mvp`)
- **Filenames**: kebab-case for scripts (e.g., `test-ollama.mjs`)
- **Routes**: lowercase, underscores (e.g., `intake`, `deepseek-v4-pro:cloud`)
- **JSON keys**: camelCase (e.g., `clientName`, `modelEndpoints`)

### JSON Payload Structure

- **Intake**: Required fields are validated by `intake.schema.json`
- **Factory.project.json**: Immutable metadata (slug, createdAt, status, endpoints)
- **Linear payload**: Title, description (multiline), labels, projectSlug, nextActions
- **Model routing**: Endpoints (definitions) separate from routes (selections)

### Code Style

- Scripts are ESM (`import`/`export`)
- Use `node:` prefix for built-ins (`node:fs`, `node:path`)
- Simple error handling with try/catch; no complex abstractions
- Comments only for non-obvious intent
- No external npm dependencies (keep scripts standalone)

### Approval Pattern

Check for `--approved` and `--live` flags before taking action:

```javascript
if (gated.has(action) && !args.includes("--approved")) {
  console.log(`${action} requires approval. Re-run with --approved.`);
  process.exit(0);
}
```

---

## Future Roadmap

- [ ] Linear API client implementation (for live intake creation)
- [ ] GitHub issue → factory workflow automation
- [ ] AionUi ↔ factory sync for UI-initiated projects
- [ ] CashClaw → factory cost estimation and approval flow
- [ ] Automated model benchmarking and routing tuning
- [ ] Project completion → deliverables packaging
- [ ] Client portal for project status and file downloads
- [ ] Audit logging and cost tracking

---

## Resources

- **Quick Start**: `docs/LAUNCH_TODAY.md`
- **Multi-Machine Models**: `docs/MULTI_MACHINE_MODELS.md`
- **Example Project**: `factory/projects/example-client-mvp/`
- **Example Intake**: `factory/inbox/example-intake.json`
- **Schema Reference**: `factory/schemas/intake.schema.json`

---

## Contact & Questions

- **Operator**: Tumelo Ramaphosa (t.ramaphosa@studex.dev)
- **Repository**: https://github.com/TumeloRamaphosa/agentic-lab-v3
- **Issues**: GitHub Issues (approval-gated for external contributions)
