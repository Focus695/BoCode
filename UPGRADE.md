# Upgrading an installed BoCode

> **This file is for AI agents.** A project adopted the BoCode workflow at some point in the past; the template has moved on. Your job: bring the installed copy up to date without touching the project's own content. Follow it top to bottom.
>
> **A sync is done when `--verify` exits 0 — never when you say it is.**

The sync tooling ships with the project (template-owned, refreshes itself on every sync):

```bash
cd code
npm run bocode:doctor                          # am I behind? is anything stale?
npm run bocode:upgrade -- --check              # every template-owned delta + its disposition
npm run bocode:upgrade -- --apply              # copy pristine/new files, then verify
npm run bocode:upgrade -- --verify             # the gate — exit 0 or the sync is not done
```

All three take `--repo <path>` (a local BoCode clone instead of cloning GitHub), `--skills-dir <dir>` (check or re-install the four skills), `--stamp <sha>` (set the baseline by hand), and `--keep <path>` (declare a template path consciously kept local).

## What is template-owned vs project-owned

The contract is the `MANIFEST` constant in `code/tools/bocode-upgrade.mjs` — the single source of truth; the table below is its human-readable restatement. Template-owned paths get refreshed; project-owned paths are never touched. When adding template files, update the manifest (UPGRADE.md's table follows it).

| Template-owned (refresh) | Project-owned (never touch) |
|--------------------------|------------------------------|
| `UPGRADE.md`; `book/guidelines/{README,workflow,task-tiers,writing-style,git-workflow,review-checklist}.md` | `AGENTS.md`, root `README.md` |
| the `README.md` of every `book/` directory (`docs/`, `docs/decisions/`, `docs/architecture/`, `docs/api/`, `notes/`, `plans/`, `changelogs/`) | `book/guidelines/architecture.md` and `coding-style.md` (project drafts since adoption) |
| `skills/` — all four skills plus `skills/README.md` | everything under `book/docs/decisions/`, `book/docs/architecture/`, `book/docs/api/` (the project's own records) |
| `code/tools/*.mjs`; the `scripts` block of `code/package.json` (the project's `name` and local-only entries stay) | everything under `book/notes/`, `book/plans/`, `book/changelogs/` |
| `scripts/check-*.mjs` (if adopted), `.githooks/` (if adopted), `.github/workflows/git-policy.yml` (if adopted — keep the template-clean step deleted, per ADOPT.md) | `book/README.md` (generated — regenerate, don't copy), `.bocode-version` |

## The procedure

1. Run `npm run bocode:doctor`. Behind upstream? Continue. Stamp missing? See the fallback below.
2. `npm run bocode:upgrade -- --check` — read the disposition of every template-owned delta:
   - `stale` / `new-file` / `stale-delete` / `pkg-stale` — safe, `--apply` handles them mechanically
   - `merged` — the project's copy and the template both changed; nothing to do (a conscious merge already happened or the file carries local edits the sync must keep)
   - `diverged-delete` / `missing` — a human decision: delete or restore the file, or record the deviation with `--keep <path>`
3. `npm run bocode:upgrade -- --apply`. It copies, deletes, and merges script entries, re-installs the skills when `--skills-dir` is given, re-verifies from disk, advances `.bocode-version` to the upstream HEAD, writes a report into `book/changelogs/YYYY-MM/`, and regenerates the index. If verify is not green it says exactly what is outstanding and leaves the stamp unchanged.
4. Merge the flagged files by hand: take the template's changes, keep the project's edits, ask the user where they collide. Resolve `diverged-delete` / `missing` (delete, restore, or `--keep`).
5. Re-run `--apply` (idempotent) until it prints verify green.
6. Re-install the skills if you did not pass `--skills-dir`: stale skills in the agent's directory are the number-one reason an upgraded repo still behaves old. `--skills-dir` given, `--verify` fails while any installed skill lags its `skills/` source.
7. Commit the sync in the project's own convention. The report under `book/changelogs/` is the review artifact — the user reads a generated list, not a promise.

ADR numbers referenced in the guidelines (e.g. "ADR-006") are the template's own records — read them in the BoCode repository's `book/docs/decisions/`.

## Bootstrap: the project predates the tool

Adopted before the tool existed? `bocode:doctor` will say the tool is missing. Fetch it from the BoCode repository first — copy `code/tools/bocode-upgrade.mjs`, `code/tools/bocode-doctor.mjs`, and `code/tools/bocode-upgrade.test.mjs` into the project's `code/tools/`, add the three `bocode:*` entries to the `scripts` block of `code/package.json`, then run the normal procedure. From then on the tool upgrades itself.

## Fallback: no stamp

Projects adopted before 2026-11-05 have no `.bocode-version`. Walk `CHANGELOG.md` (in the BoCode repository) top to bottom: every entry's **Adopter action** names the files it touched — compare each against the project's copy; identical or trivially old → apply; project-modified → merge; conflicts → ask the user. Then stamp the baseline for future runs:

```bash
npm run bocode:upgrade -- --check --stamp <sha-of-a-commit-the-project-matches>
```

and continue on the normal procedure.

## What not to do

- Never claim a completed sync without a green `--verify` — the tool names what is outstanding; read it
- Never overwrite a project-owned file — records, drafts, and ADRs belong to the project
- Never re-add the "Check template cleanliness" step to a copied `git-policy.yml` (that gate is the template repo's own, per ADOPT.md)
- Never let the agent-side skills lag the repo's `skills/` — re-install them on every sync
- Don't invent version numbers: the stamp is a commit SHA, and that is the whole versioning story (ADR-007)
- When adding template files, add them to `MANIFEST` in `code/tools/bocode-upgrade.mjs` — a file missing from the manifest is silently skipped by every future upgrade
