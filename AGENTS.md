# AGENTS.md

This file is the entry point for AI agents working on this repository. Humans: start at `book/README.md`.

## Project overview

<!-- Replace this paragraph in your project: what it is, who it's for, in two sentences. -->

This project runs on the **BoCode workflow**: `code/` holds the source, `book/` holds the documentation stream and knowledge base. The highest architecture guidance lives inside the repository: long-term boundaries and hard constraints in `book/guidelines/architecture.md`, implementation snapshots in `book/docs/architecture/`.

## Repository layout

```
<project>/
├── code/       # source code
└── book/       # documentation stream and knowledge base
```

**code and book are the project's two halves — neither is optional.** The relationship runs both ways:

- **book → code**: plans drive implementation; guidelines provide the baseline; learn entries supply experience to consult before coding; issues provide direction for later iterations.
- **code → book**: after code changes, check whether book needs syncing; when a feature completes, write its summary / learn / issue back into book.

**Core principle: the more complete the book, the more reference value for humans and agents.** Summaries are written for humans as reports; learn entries are written as searchable knowledge for both.

**Book entry point: `book/README.md` — the master index, script-generated. Read it before reading anything else in book.** After any book change run `cd code && npm run book:index` to refresh it; every new document must carry a frontmatter `description` (one plain-language line about the content).

## Workflow

Feature development strictly follows the six-phase gate workflow — see `book/guidelines/workflow.md`.

Git commits and branching strictly follow `book/guidelines/git-workflow.md`: every non-merge commit uses the Clean Commit format; independent big features branch from `dev`; small verified fixes may commit to `dev` directly; PRs serve multi-contributor work and the `dev → main` release, which only ever merges. Never commit or push directly to `main`.

## Document routing

| Output | Location | Audience |
|--------|----------|----------|
| Feature report | `book/notes/summary/YYYY-MM/` | Humans first |
| Experience & knowledge | `book/notes/learn/YYYY-MM/` | Humans + agents |
| Potential problems | `book/notes/issue/YYYY-MM/` | Humans + agents |
| Task tracking | `book/notes/task/` | Humans + agents |
| Architecture decisions | `book/docs/decisions/` | Humans first |
| Implementation plans | `book/plans/` | Agents first |
| Change log | `book/changelogs/YYYY-MM/` | Humans first |

**Writing style**: everything in book is written plain — see `book/guidelines/writing-style.md`.

## code ↔ book interaction rules

1. **Before coding**: search `book/notes/learn/YYYY-MM/` for related experience, and consult only the guideline the task actually touches — the input pointers in `book/guidelines/README.md` route you. No blanket pre-reading.
2. **While coding**: new experience or pitfalls go straight into the current month's `book/notes/learn/YYYY-MM/`.
3. **After coding**: check the book — is the plan's status updated, is a summary needed, do new issues exist?
4. **Plans drive code**: `book/plans/` documents are the input to implementation. Read the plan, build in `code/`, write back to `book/`.
5. **Issues feed code**: `book/notes/issue/` entries are the direction of later improvements.

`changelogs/` and `notes/{summary,learn,issue}/` archive under `YYYY-MM/`; the month is a physical grouping, retrieval happens through `book/README.md`, frontmatter, and links. `book/` opens directly as an Obsidian vault.

## Safe by default

Local commands are disposable and have no production access — npm scripts, tests, builds, `git status/diff/log`, `npm run book:index`, `node scripts/check-commit-message.mjs`. Run them, fix failures, and rerun without asking. A human still owns anything touching production data or credentials, destructive operations, and every push to `main` (which never happens directly anyway).

## Hard constraints

- Step 0 (the structured requirements brief) is required before any code
- No skipping between phases
- Phase 2 stops for the user only on real gaps — scope conflict, undetermined data shape, unclear external dependency — never just for confirmation
- Problems found in Phase 5 / Phase 6 are **recorded, never fixed**
- Feature work touches no code outside its scope: no opportunistic refactors, no new abstractions

## Tooling

- `cd code && npm run book:index` — regenerate `book/README.md` after any book change (do not edit by hand; missing frontmatter `description` warns and exits 1)
- `node scripts/check-commit-message.mjs "<subject>"` — validate a commit subject against Clean Commit
