# Upgrading an installed BoCode

> **This file is for AI agents.** A project adopted the BoCode workflow at some point in the past; the template has moved on. Your job: bring the installed copy up to date without touching the project's own content. Follow it top to bottom.

The BoCode repository: https://github.com/Focus695/BoCode — its `CHANGELOG.md` tells you what changed; this file tells you how to apply it.

## What is template-owned vs project-owned

The one table that decides everything. Template-owned files get refreshed; project-owned files are never touched.

| Template-owned (refresh) | Project-owned (never touch) |
|--------------------------|------------------------------|
| `book/guidelines/{README,workflow,task-tiers,writing-style,git-workflow,review-checklist}.md` | `AGENTS.md`, root `README.md` |
| the `README.md` of every `book/` directory (`docs/`, `docs/decisions/`, `docs/architecture/`, `docs/api/`, `notes/`, `plans/`, `changelogs/`) | `book/guidelines/architecture.md` and `coding-style.md` (project drafts since adoption) |
| `skills/` — all four skills plus `skills/README.md` | everything under `book/docs/decisions/`, `book/docs/architecture/`, `book/docs/api/` (the project's own records) |
| `code/tools/*.mjs`; the `scripts` block of `code/package.json` (keep the project's `name`) | everything under `book/notes/`, `book/plans/`, `book/changelogs/` |
| `scripts/check-*.mjs` (if adopted), `.githooks/` (if adopted), `.github/workflows/git-policy.yml` (if adopted — keep the template-clean step deleted, per ADOPT.md) | `book/README.md` (generated — regenerate, don't copy), `.bocode-version` |

## The procedure

1. Read `.bocode-version` at the project root: it holds the BoCode commit the project last synced to. No stamp (adopted before 2026-11-05)? Use the fallback below.
2. Clone the BoCode repository in full — not `--depth 1`, the stamp's commit must be reachable: `git clone https://github.com/Focus695/BoCode /tmp/bocode`.
3. List what changed: `git -C /tmp/bocode diff --name-status <stamp>..HEAD`, keep the rows that match the template-owned column, and read the `CHANGELOG.md` entries after the stamp for the intent and each entry's **Adopter action**.
4. Apply, per file:
   - project copy unmodified since adoption (matches the stamp's template version) → copy the new version over it
   - project copy modified → merge by hand: take the template's changes, keep the project's edits, ask the user where they collide
   - project-owned path → never touch
5. Sync translated variants of the skills (e.g. a localized boscope) with the same insertions, if the project keeps any.
6. Regenerate and verify: `cd code && npm run book:index` must end with zero warnings and all links resolving.
7. Update `.bocode-version` to the new HEAD SHA (`git -C /tmp/bocode rev-parse HEAD`).

ADR numbers referenced in the guidelines (e.g. "ADR-006") are the template's own records — read them in the BoCode repository's `book/docs/decisions/`.

## Fallback: no stamp

Projects adopted before the stamp existed have no baseline. Walk `CHANGELOG.md` top to bottom instead: every entry's **Adopter action** names the files it touched — compare each against the project's copy; identical or trivially old → apply per the rules above; project-modified → merge; conflicts → ask the user. Then stamp the current HEAD SHA and continue on the normal procedure.

## What not to do

- Never overwrite a project-owned file — records, drafts, and ADRs belong to the project
- Never re-add the "Check template cleanliness" step to a copied `git-policy.yml` (that gate is the template repo's own, per ADOPT.md)
- Don't invent version numbers: the stamp is a commit SHA, and that is the whole versioning story (ADR-007)
