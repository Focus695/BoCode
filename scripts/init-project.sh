#!/usr/bin/env bash
#
# init-project.sh — turn a fresh BoCode clone into YOUR project.
#
#   bash scripts/init-project.sh <project-name> "<one-line description>"
#
# What it does:
#   1. Sets the project name in code/package.json (the index title reads it)
#   2. Fills the project overview paragraph in AGENTS.md
#   3. Writes a fresh minimal README.md (the BoCode philosophy README is
#      replaced — find it in the BoCode repository itself)
#   4. Clears BoCode's own living records (plans, month archives, task files)
#   5. Regenerates the book index
#   6. Optionally resets git history for a clean start
#
# Requires: bash, node (any version from the last few years).

set -euo pipefail

NAME="${1:-}"
DESC="${2:-}"

if [ -z "$NAME" ] || [ -z "$DESC" ]; then
  if [ ! -t 0 ]; then
    echo "Usage: bash scripts/init-project.sh <project-name> \"<one-line description>\"" >&2
    exit 1
  fi
  while [ -z "$NAME" ]; do
    printf "Project name (lowercase, no spaces): "
    read -r NAME
  done
  while [ -z "$DESC" ]; do
    printf "One-line description: "
    read -r DESC
  done
fi

echo "Initializing ${NAME}: ${DESC}"

# 1. Project name in code/package.json
node -e '
  const fs = require("fs");
  const file = "code/package.json";
  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
  pkg.name = process.argv[1];
  fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
' "$NAME"

# 2. Project overview in AGENTS.md
node -e '
  const fs = require("fs");
  const file = "AGENTS.md";
  let text = fs.readFileSync(file, "utf8");
  text = text.replace(
    /<!-- Replace this paragraph in your project: what it is, who it'"'"'s for, in two sentences\. -->/,
    process.argv[1] + " — " + process.argv[2]
  );
  fs.writeFileSync(file, text);
' "$NAME" "$DESC"

# 3. Fresh README.md
cat > README.md <<EOF
# ${NAME}

${DESC}

## Layout

- \`code/\` — source code
- \`book/\` — documentation stream and knowledge base (start at \`book/README.md\`)

## Working on this project

- **AI agents**: read \`AGENTS.md\` first.
- **Humans**: start at \`book/README.md\`; the workflow rules live in \`book/guidelines/\`.

This project runs on the BoCode workflow.
EOF
rm -f README.zh-CN.md

# 4. Clear BoCode's own living records
for kind in learn summary issue; do
  if [ -d "book/notes/${kind}" ]; then
    find "book/notes/${kind}" -mindepth 1 -type d -name '20*' -exec rm -rf {} +
  fi
done
if [ -d book/notes/task ]; then
  find book/notes/task -mindepth 1 -name '*.md' ! -name 'README.md' -delete
fi
if [ -d book/changelogs ]; then
  find book/changelogs -mindepth 1 -type d -name '20*' -exec rm -rf {} +
fi
if [ -d book/plans ]; then
  find book/plans -mindepth 1 -name '*.md' ! -name 'README.md' -delete
fi

# 5. Regenerate the book index
(cd code && node tools/gen-book-index.mjs)

# 6. Optional: fresh git history
if [ -t 0 ]; then
  printf "Reset git history and start fresh? [y/N] "
  read -r RESET
  if [ "$RESET" = "y" ] || [ "$RESET" = "Y" ]; then
    rm -rf .git
    git init -b main
    git config core.hooksPath .githooks
    git add -A
    git commit -m "📦 new: initialize ${NAME} from BoCode template" -q
    echo "Git history reset; initial commit created."
  fi
fi

echo
echo "Done. Next steps:"
echo "  1. Install the skills:"
echo "       cp -r skills/bocode skills/feature-flow skills/book-writeback <your-skills-dir>/"
echo "  2. Point your AI agent at AGENTS.md (most tools pick it up automatically)."
echo "  3. Fill in book/guidelines/architecture.md and coding-style.md for your project."
echo "  4. Set your remote:"
echo "       git remote add origin <url>"
