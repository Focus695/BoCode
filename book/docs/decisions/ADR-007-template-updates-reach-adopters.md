---
description: Template updates reach adopters through a root CHANGELOG, an agent-facing UPGRADE playbook, and a .bocode-version stamp — release-gated by CI; semver rejected, the commit SHA is the baseline
---

# ADR-007: Template updates reach adopters

## Status

Accepted — 2026-11-05. Enforced on dev→main PRs by `scripts/check-release-changelog.mjs`, wired into `.github/workflows/git-policy.yml`.

## Context

The template evolves (ADR-005 and ADR-006 landed within two days); adopting projects stay at the version they installed, and nothing told them otherwise — ADOPT.md covers first adoption only, the READMEs never mention upgrading, and no version concept exists anywhere in the tree (`code/package.json`'s `version` is a dead field nothing reads). ADR-004's consequences reserved this exact case: "a changelog of template changes, say, gets decided case by case."

Two constraints shaped the design. Adopters install by copying (clone-and-transform via init-project.sh, or retrofit via ADOPT.md), so update delivery is documentation an agent can follow, not a package manager. And the project's own records must be untouchable — the upgrade path has to know which files the template still owns after adoption.

## Decision

Four pieces, all shipping in the template:

- **`CHANGELOG.md` at the root** — the template's own release log: dated entries, each listing changed files and an explicit **Adopter action**. This rules ADR-004's reserved case: it is template content distributed with the repository (init-project.sh deletes it on transform), not an instance record — `book/changelogs/` stays for adopting projects only.
- **`UPGRADE.md` at the root** — the agent-facing upgrade playbook: read `.bocode-version`, diff the stamp against template HEAD, refresh untouched files, merge modified ones, never touch project-owned ones, regenerate the index, re-stamp. Its template-owned vs project-owned table is the contract; new template files must be added there.
- **`.bocode-version`** — a one-line stamp in the adopting project's root holding the BoCode commit it last synced to; written at adoption (ADOPT.md, init-project.sh), updated on every upgrade. Commit SHAs, not version numbers: the template evolves as a document stream, so semver levels carry no meaning here, and `package.json`'s version stays a dead field (no bumps, no tags, no GitHub Releases for now).
- **A release gate** — `scripts/check-release-changelog.mjs` fails a dev→main PR whose diff touches template-owned content without also touching `CHANGELOG.md`. A rule that can be checked against a diff is a gate; one that can't is a wish.

Entry points so an agent in any installed project finds its way back: a Staying-current section in AGENTS.md (survives both installation paths), an upgrade contract in the `bocode` skill, and a FAQ item in all three READMEs.

Also fixed here: real links to template ADRs inside copyable files — `guidelines/workflow.md` (ADR-005/006) and `docs/decisions/README.md` (ADR-001) — broke the index build in projects that copy only the ADOPT.md manifest. Template ADR references are plain text now, the ADR-003 precedent.

## Consequences

- Adopters upgrade by handing UPGRADE.md to an agent, the same way they adopted by handing over ADOPT.md
- Every release that changes template content now carries a changelog obligation, enforced in CI
- The ownership table doubles as a checklist when adding template files — forget it and adopters' upgrades silently skip the new file
- Projects that edited template-owned files get merges, never silent overwrites; conflicts surface to their user
- The stamp depends on the BoCode repository's git history being reachable (a full clone); the CHANGELOG-driven fallback covers stamp-less projects
