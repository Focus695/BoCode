---
description: The upgrade path ships as tooling — bocode-upgrade check/apply/verify diffs the stamp mechanically, a single manifest owns template-vs-project paths, doctor reports staleness, and UPGRADE.md self-refreshes; prose-only guidance is rejected
---

# ADR-012: Upgrade sync becomes a tool gate

## Status

Accepted — 2026-11-07. Self-tested by `code/tools/bocode-upgrade.test.mjs` (`npm run bocode:selftest`).

## Context

ADR-007 made template updates *reachable* by adopters — a CHANGELOG, an agent-facing UPGRADE playbook, a `.bocode-version` stamp — but the upgrade path itself stayed prose. Downstream evidence (adopter session, 2026-11-07): an agent claimed "all major new specs incorporated" while missing ADR-011's added `boscope/references/automation-tools.md` — a miss the CHANGELOG entry had warned about in plain text. Four structural holes, in severity order:

1. **No verification** — nothing checks that every template-owned delta since the stamp is applied or consciously kept; overclaiming costs zero (ADR-007's own words: a rule that can't be checked against a diff is a wish).
2. **The playbook vanishes on install** — init-project.sh deleted UPGRADE.md, and the only pointer (AGENTS.md's Staying-current section) is project-owned, frozen at adoption time.
3. **Skills never re-install** — the four skills live in the agent's directory outside the repo; the upgrade path refreshed the repo's `skills/` but never the copies the agent actually loads. An upgraded repo still behaved old.
4. **No staleness signal** — the stamp was written once and compared against nothing.

The ownership knowledge itself lived in three copies (UPGRADE.md's table, check-release-changelog.mjs's prefix list, ADOPT.md's manifest) — exactly the drift ADR-007's consequences predicted.

## Decision

- **`code/tools/bocode-upgrade.mjs`** — `--check` lists every template-owned delta since the stamp with a disposition (`stale`/`new-file`/`stale-delete`/`pkg-stale` = mechanically safe; `merged` = conscious local state; `diverged-delete`/`missing` = human decision, recorded via `--keep`); `--apply` performs the safe actions, re-verifies from disk, advances the stamp only on green, writes a report into the adopter's `book/changelogs/YYYY-MM/`, and regenerates the index; `--verify` is the gate — exit 0 or the sync is not done. `--skills-dir` re-installs the four skills and joins the gate. Idempotent: a synced repo is a green no-op.
- **A single manifest** — `MANIFEST` in the tool is the one source of truth. It carries two facets with different semantics: `upgradeOwned` (what the tool may touch in an adopter; default-deny — everything unmatched is project-owned) and `releaseSignal` (what a template-repo change owes a CHANGELOG entry; wider on purpose). `check-release-changelog.mjs` imports the latter; UPGRADE.md's human table derives from the former.
- **`code/tools/bocode-doctor.mjs`** — read-only staleness checkup: tool presence, stamp validity, upstream HEAD via `git ls-remote` (offline degrades to unknown), skills freshness. Informational by default, `--strict` to gate.
- **UPGRADE.md becomes template-owned** — it ships with every install (init-project.sh no longer deletes it; ADOPT.md installs it) and refreshes itself through the tool it documents. AGENTS.md's Staying-current section and the `bocode` skill's upgrade contract now point at the local tooling, which survives adoption freezing because the tool, not the prose, carries the procedure.
- **Selftest ships too** — `bocode-upgrade.test.mjs` builds a fake upstream and adopters in a temp dir and drives every disposition state with no network; adopters can rerun it after any upgrade to prove their gate still gates.

Rejected: semver/npm packaging (ADR-007's stance stands — install-by-copy means the tooling must be boring files); keeping the procedure prose-only with stricter wording (the failure was structural, not literary); forcing skills auto-detection (guessing a global skills directory is worse than an explicit `--skills-dir`).

## Consequences

- A sync claim is checkable: "done" means `--verify` exits 0, and the generated report is the human's review artifact
- Pre-ADR-012 adopters bootstrap once by hand: fetch `code/tools/bocode-*.mjs` + UPGRADE.md from upstream, then the tool upgrades itself (documented in UPGRADE.md's bootstrap section and this release's CHANGELOG entry)
- Adding a template file now means adding it to `MANIFEST` — a file missing there is silently skipped by every future upgrade; UPGRADE.md's what-not-to-do says so
- `code/package.json` is never byte-compared: only script entries merge, the project's `name` and local-only entries are untouchable
- The doctor's network check stays optional (offline is a warning, never a failure) — no session-start nagging
- The template repo itself never runs `--apply` (it *is* upstream); the selftest covers the tool with fixtures instead
