# Adopting BoCode in an existing project

> **This file is for AI agents.** A human pointed you at the BoCode repository and asked you to retrofit their project onto this workflow. Follow it top to bottom. Where a step needs a human decision, stop and ask — don't guess.

## What you are installing

BoCode gives a project two halves: `code/` (the source) and `book/` (the documentation stream and knowledge base), driving each other in both directions. You will install: the `book/` skeleton, the index tooling, the git policy tooling (optional), the four skills, an `AGENTS.md` entry point, and a `.bocode-version` stamp so future upgrades know the baseline. You will migrate the project's existing docs into the book. You will **not** refactor any code.

Before starting, read in the BoCode repository: `AGENTS.md`, `book/guidelines/workflow.md`, and `skills/README.md` — this playbook assumes you know the target shape.

## Step 0 — Inventory and safety

1. Inventory the project: source layout, existing documentation and where it lives, build/test commands, git branch model, CI workflows.
2. Have the user commit or stash any pending work first. Adoption lands as ordinary commits on top of a clean tree.
3. Never destroy information during adoption: **move, don't delete.** Anything replaced gets moved aside or committed to history first.

## Step 1 — Introduce the `book/` skeleton

Copy from the BoCode repository into the project:

- `book/guidelines/` — all of it (README, workflow, task-tiers, writing-style, git-workflow, review-checklist, architecture, coding-style)
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

1. Copy all of `code/tools/` (the index generator plus the `bocode-upgrade` / `bocode-doctor` sync gate and its selftest) and wire the `scripts` block from BoCode's `code/package.json` into the project's `code/package.json` (keep the project's `name`). If the project has no JavaScript tooling at all, a shell wrapper calling `node` is fine — the scripts are zero-dependency.
2. Copy `UPGRADE.md` to the project root — it is the upgrade playbook, template-owned, and refreshes itself on every future sync.
3. Optional, recommended: copy `scripts/check-commit-message.mjs` and `.githooks/`, then run `git config core.hooksPath .githooks`.
4. Optional: copy `.github/workflows/git-policy.yml`. **Check the branch names** — if the project's integration branch isn't `dev`, either ask the user to adopt the branch model or adapt the workflow's branch filters. Don't silently rewrite their branch model. Also **delete the "Check template cleanliness" step** — it enforces the BoCode template repository's own cleanliness rule (its ADR-004) and would fail on a real project's notes and changelogs.
5. Run the index generator: every book file must carry a `description` and every internal link must resolve; zero warnings is the only passing state.

## Step 5 — Install the skills

Copy `skills/bocode`, `skills/boscope`, `skills/book-writeback`, and `skills/bowrite` into the agent's skills directory (see BoCode's `skills/README.md` for per-tool locations). If the user's agent can't install skills, the workflow still works — the guidelines carry the same rules in prose. Skills do not auto-update: every later BoCode sync must re-install them (`cd code && npm run bocode:upgrade -- --apply --skills-dir <dir>`), or the agent keeps running the old behavior.

## Step 6 — Write the project's `AGENTS.md`

Adapt BoCode's `AGENTS.md`: fill the project overview (what it is, in two sentences), adjust path references if the layout is Option B, keep the hard-constraints section intact. If the project already has agent instructions (`CLAUDE.md`, `AGENTS.md`), merge — don't discard their existing rules; conflicts go to the user.

## Step 7 — Verify and commit

1. Index generator: zero warnings, exit 0.
2. `git config core.hooksPath .githooks` (if adopted) and the hook fires on commit.
3. `cd code && npm run bocode:selftest` — the sync gate proves itself on a fixture; green is the only passing state.
4. Write `.bocode-version` at the project root — one line with the BoCode repository's current HEAD SHA (`git -C <bocode-clone> rev-parse HEAD`). Future upgrades diff against it.
5. `npm run bocode:doctor` — clean, or knowingly green on the warnings.
6. Commit the adoption. Follow the project's existing commit convention unless the user chooses to adopt Clean Commit — their call, not yours.
7. Don't rewrite git history. Adoption is ordinary commits on top of what exists.

## Step 8 — First writeback

1. Finalize the two draft guidelines with the user (Step 1).
2. Write the project's own `ADR-001: adopt the BoCode workflow` in `book/docs/decisions/` — context from the inventory, the Option A/B decision and why, consequences.
3. Regenerate the index. Done.

## Later upgrades

The sync tooling installed in Step 4 carries the project forward: `cd code && npm run bocode:doctor` reports staleness, `npm run bocode:upgrade -- --check` lists every template-owned delta, and `--apply` refreshes pristine files, merges script entries, re-installs the skills (with `--skills-dir`), verifies, and writes a report into the project's `book/changelogs/`. `UPGRADE.md` at the project root is the playbook — a sync is done when `--verify` exits 0.

## What not to do

- No code refactoring, renaming, or "improvements" — structure only; behavior is out of scope
- No invented architecture boundaries presented as fact — drafts, clearly marked
- No deleting the user's documents to "clean up" — everything migrates or stays
- No git history rewrites, no force pushes
