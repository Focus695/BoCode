# Changelog

Releases of the BoCode template itself. Adopting projects upgrade by handing [UPGRADE.md](UPGRADE.md) to an agent; each entry lists what changed and what an adopting project must do. History before 2026-11-05 lives in git log and [book/docs/decisions/](book/docs/decisions/) (ADR-001..ADR-004).

When adding an entry, also refresh the collapsed What's-new block near the top of the three READMEs (`README.md`, `README.zh-CN.md`, `README.ja.md`): newest title in the summary line, latest three titles as bullets.

## 2026-11-06 — tasks and issues archive by status (ADR-010)

Handled and unhandled entries were indistinguishable from the outside; the tempting fix — a folder files move into — breaks the book's relative links. Archiving is now a status flip.

- Added: `book/docs/decisions/ADR-010-archive-by-status-flip-not-by-moving-files.md`
- Changed: `code/tools/gen-book-index.mjs` (parses a frontmatter `status` in `notes/task/` and `notes/issue/`, validates `open|done` / `open|resolved`, lists open entries first; missing or unknown status warns and exits 1); `book/notes/README.md` (status convention, wrap-up step flips statuses, `status: open` in the task and issue templates)

**Adopter action:** copy the two changed files; add a `status` line (`open`, `done`, or `resolved`) to every existing task and issue entry — the index build fails without it; rerun `cd code && npm run book:index`.

## 2026-11-06 — bowrite's voice rules on every write (ADR-009)

The skill could de-water a text but rarely made it human: voice rules were scoped to from-scratch drafts while most project writing is revision, and thinning could silently cut conditions（仅当/除非/不适用于）— facts survived, their boundaries didn't.

- Added: `book/docs/decisions/ADR-009-bowrite-voice-on-every-write.md`
- Changed: `skills/bowrite/SKILL.md` (voice rules universal; conditions join the fidelity contract; read-back gains a regular voice pass; the skill thinned by its own rules — the 把书读薄 story once, the duplicated rule merged into the ledger); `book/guidelines/writing-style.md` (same conditions clause, keeping the fallback in sync); `skills/book-writeback/SKILL.md` (names bowrite, writing-style.md as fallback); `book/notes/README.md` and `book/docs/decisions/README.md` (style stated at the templates)

**Adopter action:** copy the five changed files; if you localized bowrite, port the same four changes (voice scope, conditions clause, voice read-back pass, self-thinning); regenerate the index.

## 2026-11-05 — task tiers before the gates (ADR-008)

Small tasks were paying the full six-gate tax — agents packaged ten-minute fixes as "feature development". Grading is now explicit and comes first, before Step 0. Distilled from adopter feedback (Lighthouse3.0, verified in their repo).

- Added: `book/guidelines/task-tiers.md` (S/M/L criteria — "any one means at least this tier"; the four hard rules; the always-L mount point), `book/docs/decisions/ADR-008-grade-tasks-into-tiers-before-the-workflow.md`
- Changed: `book/guidelines/workflow.md` (tier-first paragraph; no-skipping scoped to M/L), `AGENTS.md` (hard constraints scoped to M/L; tier recorded in the first commit's motive), `skills/boscope/SKILL.md` (tier-first gate before Step 0, description, constraints), `book/guidelines/review-checklist.md` (eleventh check: task tier too low → issue, never backfill), `book/guidelines/README.md` (routing rows), `UPGRADE.md` and `ADOPT.md` (task-tiers in the template-owned lists)

**Adopter action:** copy the changed files (Lighthouse3.0 already runs a local task-tiers.md — diff and merge, then declare your always-L list in it); sync translated variants of boscope (e.g. structured-feature-implementation) with the tier-first insertion; run `cd code && npm run book:index`.

## 2026-11-05 — template updates reach adopters (ADR-007)

The upgrade mechanism itself, plus a link-integrity fix.

- Added: `CHANGELOG.md` (this file), `UPGRADE.md` (the agent-facing upgrade playbook), `scripts/check-release-changelog.mjs` (release gate, wired into `.github/workflows/git-policy.yml`), `.bocode-version` stamping (written at adoption by `ADOPT.md` / `scripts/init-project.sh`)
- Changed: `book/guidelines/workflow.md` — the four ADR-005/006 references are plain text now (as links they broke the index build in projects that copy `guidelines/` only); `book/docs/decisions/README.md` — its ADR-001 link got the same fix; `AGENTS.md` (a Staying-current section + a fourth tooling command); `book/guidelines/git-workflow.md` (release prerequisite); `ADOPT.md` and `scripts/init-project.sh` (version stamp + upgrade pointers); `README.md` / `README.zh-CN.md` / `README.ja.md` (FAQ entry); `skills/bocode/SKILL.md` (upgrade contract)

**Adopter action:** nothing to copy. Projects adopted before this entry have no `.bocode-version` — run UPGRADE.md once to stamp the baseline (its no-stamp fallback path), then stay on the normal procedure.

## 2026-11-05 — experience-first design (ADR-006)

Steve Jobs's product philosophy distilled into the design phases: the request is a proxy for an experience, design is how it works, focus is saying no, and the gate is the polish point.

- Changed: `skills/boscope/SKILL.md` (Step-0 duty D "Stated → experienced"; the exclusions note gains "focus is saying no"; Phase-2 output adds experience surfaces and a "Design is how it works" paragraph; Phase-4 gains the polish line); `book/guidelines/workflow.md` (three what/why sentences); `book/guidelines/review-checklist.md` (ninth → tenth check: experience seams treated as design); `book/guidelines/README.md` (row wording)

**Adopter action:** copy the four changed files (merge `review-checklist.md` if you customized it); sync translated variants of boscope (e.g. structured-feature-implementation) with the same four insertions.

## 2026-11-05 — first principles in the design phases (ADR-005)

Elon Musk's engineering method distilled into the design phases: requirements face a physics test, estimates derive bottom-up, deletion precedes optimization.

- Changed: `skills/boscope/SKILL.md` (Step-0 duty C "Inherited → question"; Phase-2 "Derive, don't analogize" and "Delete before you optimize"; Phase-4 iteration line); `book/guidelines/workflow.md` (Step-0 and Phase-2 sentences); `book/guidelines/review-checklist.md` (eighth → ninth check: parts that trace to no requirement); `book/guidelines/README.md` (row wording)

**Adopter action:** copy the four changed files (merge `review-checklist.md` if you customized it); sync translated variants of boscope with the same three insertions.
