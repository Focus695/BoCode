# Changelog

Releases of the BoCode template itself. Adopting projects upgrade by handing [UPGRADE.md](UPGRADE.md) to an agent; each entry lists what changed and what an adopting project must do. History before 2026-11-05 lives in git log and [book/docs/decisions/](book/docs/decisions/) (ADR-001..ADR-004).

When adding an entry, also refresh the collapsed What's-new block near the top of the three READMEs (`README.md`, `README.zh-CN.md`, `README.ja.md`): newest title in the summary line, latest three titles as bullets.

## 2026-11-07 — trilingual readmes aligned with the current gates

The readme bodies predated two shipped changes: they said every feature runs the six gates (task tiers landed with ADR-008 — S runs a light channel), and they said Phase 2 waits for user approval (the stop rule has fired only on real gaps since the phase-2 alignment). The zh-CN and ja bodies also missed the what-you-gain sentence under the adoption line.

- Changed: `README.md`, `README.zh-CN.md`, `README.ja.md` (tier-first sentence before the phase table; Phase-2 gate and design-intent paragraph state the real-gaps rule with its three examples; Phase-3 gate reads per design, not approved; zh/ja gain the what-you-gain paragraph; What's-new refreshed)

**Adopter action:** none — the readmes are the template's own front page; your project's readme stays yours.

## 2026-11-06 — selected ub-mode practices (ADR-011)

Selected practices from Robert C. Martin's [ub-mode](https://github.com/unclebob/ub-mode/blob/master/SKILL.md) supplement the existing phases where useful: valid state modeling, pure business calculations, behavior-focused tests, evidence-based defect repairs, shared domain terms, and complexity review. Automation samples remain an optional boscope reference, outside the general workflow and review checklist. Project rules and user requirements take precedence over this supplementary guidance. No phases, approval gates, required review items, mandatory tools, or fixed thresholds are added. Context-management, action logs, metrics-tool dependencies, and worktree cleanup are excluded; existing validation and data-ownership rules remain.

- Added: `book/docs/decisions/ADR-011-distill-selected-ub-mode-practices.md` — the selection, adaptations, and scope boundaries; `skills/boscope/references/automation-tools.md` — the optional method and sample-storage guidance
- Changed: `skills/boscope/SKILL.md` (defect evidence and premise checks in Phase 1, state modeling, terminology and an optional reading pointer in Phase 2, calculation boundaries in Phase 3, behavior tests and repair verification in Phase 4); `skills/README.md` (entry points and reference installation); `book/guidelines/workflow.md` (matching principles); `book/guidelines/README.md` (check count and terminology pointer); `book/guidelines/writing-style.md` (use the existing domain glossary); `book/guidelines/architecture.md` (optional inline glossary guidance); `book/guidelines/coding-style.md` (optional complexity-check configuration)

**Adopter action:** sync the entire `skills/boscope/` directory, `skills/README.md`, and `book/guidelines/{workflow,README,writing-style}.md` per UPGRADE.md, preserving project edits; sync any translated boscope variants and their reference pointers. Do not copy only `SKILL.md` and leave its reference behind. `architecture.md` and `coding-style.md` are project-owned after adoption: do not overwrite them. When useful, offer the glossary and optional complexity-check guidance for manual incorporation into those documents. No new sample directory or mandatory glossary file is required; retained samples follow existing test/fixture conventions.

## 2026-11-06 — phase-2 stop rule aligned, L-tier ADR trigger decidable

The task-tiers replay (ADR-008) caught two leftovers: boscope still required Phase-2 approval while workflow.md, AGENTS.md, and the newer skill variants stop only on real gaps; and the L row's "an ADR when impact warrants" carried no criterion.

- Changed: `skills/boscope/SKILL.md` (Phase 2 stops only on a real gap — scope conflict, undetermined data shape, unclear external dependency — and goes straight to Phase 3 otherwise; the plan step no longer hangs on approval; Phase 3 builds "per the design"; the constraints bullet splits the two rules it used to merge); `book/guidelines/task-tiers.md` (the L row's ADR gate defers to the triggers in `book/docs/decisions/README.md`: expensive to reverse · a reasonable person could have made differently · an architecture boundary rule)

**Adopter action:** copy the two changed files; in translated boscope variants, replace the "stop and wait for approval" block with the real-gaps rule and drop it from any companion README's flow; regenerate the index.

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
