#!/usr/bin/env bash
# StudEx Valley OS — skill installer
#
# Symlinks every vendored skill into ~/.claude/skills/ so Claude Code picks
# them up on its NEXT start. (Claude Code loads skills at session startup —
# already-running sessions will not see them until restarted.)
#
# Usage:
#   ./skills/install.sh            # install into ~/.claude/skills
#   SKILLS_DIR=/path ./skills/install.sh   # custom target
#
# Idempotent: re-running re-points symlinks, never duplicates.

set -euo pipefail

REPO_SKILLS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${SKILLS_DIR:-$HOME/.claude/skills}"
mkdir -p "$TARGET"

link() {
  # link <source-abs> <name>
  local src="$1" name="$2"
  if [ ! -e "$src" ]; then
    echo "  skip $name (missing: $src)"
    return
  fi
  ln -sfn "$src" "$TARGET/$name"
  echo "  linked $name -> $src"
}

echo "Installing StudEx skills into: $TARGET"
echo

# 1. claude-goal  (/goal command + Stop hook)
echo "claude-goal:"
link "$REPO_SKILLS/claude-goal/goal" "goal"
if [ -x "$REPO_SKILLS/claude-goal/install.sh" ]; then
  echo "  running claude-goal native installer (adds Stop hook to ~/.claude/settings.json)"
  ( cd "$REPO_SKILLS/claude-goal" && ./install.sh ) || echo "  (native installer reported a non-zero exit — symlink still in place)"
fi
echo

# 2. gstack  (methodology: plan/review/ship/deploy + browser QA)
echo "gstack:"
link "$REPO_SKILLS/gstack" "gstack"
echo

# 3. remotion-best-practices  (video creation in React)
echo "remotion-best-practices:"
link "$REPO_SKILLS/remotion-best-practices" "remotion-best-practices"
echo

# 4. graphify  (/graphify — any folder -> knowledge graph)
echo "graphify:"
# python package (extraction/clustering/report)
if command -v pip3 >/dev/null 2>&1; then
  pip3 install -e "$REPO_SKILLS/graphify" --quiet 2>/dev/null && echo "  pip installed graphify package" \
    || echo "  (pip install skipped/failed — skill md still linked)"
fi
# Claude Code wants SKILL.md (uppercase); upstream ships skill.md
if [ -f "$REPO_SKILLS/graphify/graphify/skill.md" ] && [ ! -e "$REPO_SKILLS/graphify/graphify/SKILL.md" ]; then
  ln -sfn "skill.md" "$REPO_SKILLS/graphify/graphify/SKILL.md"
fi
link "$REPO_SKILLS/graphify/graphify" "graphify"
echo

# 5. superpowers  (14 sub-skills incl. verification-before-completion, writing-plans, TDD)
echo "superpowers:"
if [ -d "$REPO_SKILLS/superpowers/skills" ]; then
  for s in "$REPO_SKILLS/superpowers/skills"/*/; do
    name="$(basename "$s")"
    link "$s" "sp-$name"
  done
fi
echo

# 6. ui-ux-pro-max  (design / brand / design-system / slides)
echo "ui-ux-pro-max:"
if [ -d "$REPO_SKILLS/ui-ux-pro-max/.claude/skills" ]; then
  for s in "$REPO_SKILLS/ui-ux-pro-max/.claude/skills"/*/; do
    name="$(basename "$s")"
    link "$s" "uiux-$name"
  done
else
  link "$REPO_SKILLS/ui-ux-pro-max" "ui-ux-pro-max"
fi
echo

echo "Done. Restart Claude Code (or start a new session) for the skills to load."
echo "Verify with /help — you should see /goal, /graphify, and the gstack + superpowers skills."
