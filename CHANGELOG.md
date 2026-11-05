# Changelog

Releases of the BoCode template itself. Adopting projects upgrade by handing [UPGRADE.md](UPGRADE.md) to an agent; each entry lists what changed and what an adopting project must do. History before 2026-11-05 lives in git log and [book/docs/decisions/](book/docs/decisions/) (ADR-001..ADR-004).

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
