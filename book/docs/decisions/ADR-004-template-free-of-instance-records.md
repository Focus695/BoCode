---
description: This repository ships template content only — instance working records (notes entries, plans, changelog months) never enter it; a release check enforces the boundary
---

# ADR-004: Keep the template free of instance working records

## Status

Accepted — 2026-09-14. Enforced by `code/tools/check-template-clean.mjs` (`npm run book:release-check`), wired into `.github/workflows/git-policy.yml`.

## Context

BoCode is a template repository: adopters copy its skeleton into their projects and fill the book with their own records. The workflow this repo teaches treats `notes/{learn,summary,issue,task}/`, `plans/`, and `changelogs/YYYY-MM/` as the adopting project's knowledge base. This repository is not an adopting project — its product is the workflow itself.

The first instance records appeared on 2026-09-14 (a learn entry and a changelog month from the capable-model calibration). Carried by the next `dev → main` merge — which by ADR-001 and the git rules only ever merges — they would ship to every adopter as leftovers.

Alternative rejected: keep records on `dev`, strip them at merge time. Git merges carry the whole tree; main would receive them inside the merge commit and need a cleanup commit every release, and its history would still contain them.

## Decision

- This repository tracks **template content only**: guidelines, READMEs, `AGENTS.md`, ADRs, tooling, the generated index. ADRs double as this repo's own decision records and ship as worked examples.
- Instance working records — anything under `book/notes/{learn,summary,issue,task}/`, `book/plans/`, or `book/changelogs/` beyond the READMEs — are never committed here. This repo's experience distills into ADRs; raw process notes stay out of the tree (git history keeps anything already committed).
- `cd code && npm run book:release-check` fails when a guarded directory holds anything but its README; it runs in CI on every PR and push to `dev`/`main`, and manually before a release.
- Adopters are unaffected: `ADOPT.md` tells them not to copy the check — in a real project it would fail on the project's own notes.

## Consequences

- The released template stays clean; adopters see the conventions as instructions (READMEs), never as leftovers to delete
- This repository does not dogfood its own learn/plan/changelog conventions — accepted: its features are workflow changes, recorded as ADRs plus merge history
- The boundary needs naming when it stings: content that feels like both (a changelog of template changes, say) gets decided case by case and recorded here
