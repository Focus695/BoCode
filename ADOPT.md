# Adopting BoCode in an existing project

> **This file is for AI agents.** A human pointed you at the BoCode repository and asked you to retrofit their project onto this workflow. Follow it top to bottom. Where a step needs a human decision, stop and ask — don't guess.

## What you are installing

BoCode gives a project two half-brains: `code/` (the source) and `book/` (the documentation stream and knowledge base), driving each other in both directions. You will install: the `book/` skeleton, the index tooling, the git policy tooling (optional), the three skills, and an `AGENTS.md` entry point. You will migrate the project's existing docs into the book. You will **not** refactor any code.

Before starting, read in the BoCode repository: `AGENTS.md`, `book/guidelines/workflow.md`, and `skills/README.md` — this playbook assumes you know the target shape.

## Step 0 — Inventory and safety

1. Inventory the project: source layout, existing documentation and where it lives, build/test commands, git branch model, CI workflows.
2. Have the user commit or stash any pending work first. Adoption lands as ordinary commits on top of a clean tree.
3. Never destroy information during adoption: **move, don't delete.** Anything replaced gets moved aside or committed to history first.

## Step 1 — Introduce the `book/` skeleton

Copy from the BoCode repository into the project:

- `book/guidelines/` — all of it (README, workflow, writing-style, git-workflow, review-checklist, architecture, coding-style)
- `book/docs/README.md`, `book/docs/architecture/README.md`, `book/docs/api/README.md`, `book/docs/decisions/README.md`
- `book/notes/README.md`, `book/plans/README.md`, `book/changelogs/README.md`

Then make two files yours: `guidelines/architecture.md` and `guidelines/coding-style.md` are **templates**. Draft real content for this project from your Step 0 inventory — boundary invariants, module map, language baseline. Mark both drafts `draft — pending user confirmation`; they get finalized in Step 8.

## Step 2 — Decide the code layout (ask the user)

- **Option A — move source into `code/`**: full fidelity; the skills, templates, and tooling all assume `code/` + `book/` at the top level. Prefer this when the project can move cleanly.
- **Option B — keep source at the root, add `book/` beside it**: less invasive for projects whose CI, Dockerfiles, or tooling assume root paths. Every path reference in `AGENTS.md` and the index script must be adapted, and the deviation gets written down in the project's own `AGENTS.md`.

Present both with the trade-off; recommend A unless something concrete blocks it.

## Step 3 — Migrate existing documents

Nothing gets thrown away; everything gets a home in the book:

| Existing | Destination |
|----------|-------------|
| `docs/*` (architecture, API) | `book/docs/...` |
| Decision records, ADRs | `book/docs/decisions/` (renumber only if formats collide) |
| `CHANGELOG*` | `book/changelogs/YYYY-MM/` (split by month if it's one big file; otherwise move whole) |
| Root `README.md` | **Stays at the root** — it's the project's face, not book content |

Every migrated file gets a frontmatter `description` — one plain-language line about the content. Files that already have one keep it.

## Step 4 — Install the tooling

1. Copy `code/tools/gen-book-index.mjs` and wire the script (see the `scripts` block in BoCode's `code/package.json`). If the project has no JavaScript tooling at all, a shell wrapper calling `node` is fine — the script is zero-dependency.
2. Optional, recommended: copy `scripts/check-commit-message.mjs` and `.githooks/`, then run `git config core.hooksPath .githooks`.
3. Optional: copy `.github/workflows/git-policy.yml`. **Check the branch names** — if the project's integration branch isn't `dev`, either ask the user to adopt the branch model or adapt the workflow's branch filters. Don't silently rewrite their branch model.
4. Run the index generator: every book file must carry a `description`; zero warnings is the only passing state.

## Step 5 — Install the skills

Copy `skills/bocode`, `skills/feature-flow`, `skills/book-writeback` into the agent's skills directory (see BoCode's `skills/README.md` for per-tool locations). If the user's agent can't install skills, the workflow still works — the guidelines carry the same rules in prose.

## Step 6 — Write the project's `AGENTS.md`

Adapt BoCode's `AGENTS.md`: fill the project overview (what it is, in two sentences), adjust path references if the layout is Option B, keep the hard-constraints section intact. If the project already has agent instructions (`CLAUDE.md`, `AGENTS.md`), merge — don't discard their existing rules; conflicts go to the user.

## Step 7 — Verify and commit

1. Index generator: zero warnings, exit 0.
2. `git config core.hooksPath .githooks` (if adopted) and the hook fires on commit.
3. Commit the adoption. Follow the project's existing commit convention unless the user chooses to adopt Clean Commit — their call, not yours.
4. Don't rewrite git history. Adoption is ordinary commits on top of what exists.

## Step 8 — First writeback

1. Finalize the two draft guidelines with the user (Step 1).
2. Write the project's own `ADR-001: adopt the BoCode workflow` in `book/docs/decisions/` — context from the inventory, the Option A/B decision and why, consequences.
3. Regenerate the index. Done.

## What not to do

- No code refactoring, renaming, or "improvements" — structure only; behavior is out of scope
- No invented architecture boundaries presented as fact — drafts, clearly marked
- No deleting the user's documents to "clean up" — everything migrates or stays
- No git history rewrites, no force pushes
