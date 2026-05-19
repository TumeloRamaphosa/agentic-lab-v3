# Staging — copy-ready files for agents-dr.fixit

Pre-built, verified chunk-1 scaffold. The build agent (or you) drops these
into the freshly cloned `agents-dr.fixit` so chunk 1 is done before the
mega prompt even starts — shrinking the build.

## Use

```bash
cd agents-dr.fixit
git checkout -b feat/valley-os-bootstrap

S=../agentic-lab-v3/staging/agents-dr-fixit-bootstrap
cp "$S/package.json"        ./package.json
cp "$S/tsconfig.base.json"  ./tsconfig.base.json
cp "$S/dot-env.example"     ./.env.example
cp "$S/dot-gitignore"       ./.gitignore
cp "$S/REPO-README.md"      ./README.md
cp ../agentic-lab-v3/docs/MEGA_PROMPT.md ./docs/MEGA_PROMPT.md
cp -r ../agentic-lab-v3/skills ./skills
cp -r ../agentic-lab-v3/promo  ./promo

cp .env.example .env          # then fill keys
git add -A && git commit -m "chore: chunk-1 scaffold + skills + promo (pre-staged)"
git push -u origin feat/valley-os-bootstrap
```

Then start `claude`, paste `docs/MEGA_PROMPT.md`, and tell it chunk 1 is
already done — begin at chunk 2.

## Verified

- `package.json` parses (`node -e "require('./package.json')"` → no error)
- workspaces + scripts match the mega-prompt file tree
- `.env.example` carries every key + kill switch from the mega prompt
- `.gitignore` excludes `.env`, `node_modules`, `dist`, db, graphify-out
