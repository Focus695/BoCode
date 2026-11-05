---
description: Tasks are graded S/M/L before any work — S runs a light channel whose only gate is a one-sentence motive, M/L run Step 0 and all six phases; the tier is decided before Step 0 and recorded in the first commit's motive
---

# ADR-008: Grade tasks into tiers before the workflow

## Status

Accepted — 2026-11-05. Ships as `guidelines/task-tiers.md` plus tier-first wording in `workflow.md`, `AGENTS.md`, and the boscope skill. First adopter-fed change: distilled from Lighthouse3.0's 2026-11-05 five-step audit (question the requirement → delete → simplify → accelerate → automate), verified in the adopter's repo before being proposed back.

## Context

The six gates were flat: any task entering boscope paid Step 0 plus six phases — a typo included. The observed failure: agents packaged ten-minute tasks as "feature development", producing excess briefs, documents, and gate overhead — process tax inversely proportional to task size. The design intent always allowed grading; the rules never said so:

- boscope's routing exclusion ("do not use for one-line fixes…") lives at skill selection — once invoked, nothing inside grades first;
- workflow.md read "Every feature moves through these phases in order. No skipping." with no tier semantics;
- "feature" had no defined boundary, so every change qualified.

## Decision

- **Tier before Step 0, never a brief slot** — grading inside the brief means the small task already paid the brief tax. The tier is decided before any work and lands in the first commit's motive: auditable from the repository alone.
- **The tier table ships as `guidelines/task-tiers.md`** — criteria are "any one means at least this tier" statements; judgment words ("as appropriate", "case by case") stay out of the criteria column.
- **S is a separate channel, not an M with gates skipped** — motive (why + how verified) → change → self-test → single commit. The one-sentence motive is required, not an exemption: it is the anti-drift replacement for the brief's exclusions slot.
- **Correctness-critical domains are always ≥ L, one line included.** task-tiers.md carries the mount point where each adopting project declares its always-L list; the baseline names generic examples only — no business domains hardcoded.
- **Upgrade is one-way** (finished analysis and design carry over, missing gates run now); **under-grading found in review or wrap-up records an issue**, never a quiet document backfill — an eleventh review-checklist check operationalizes it.
- **"No skipping" narrows to M/L** in workflow.md, AGENTS.md, and boscope. Intent gates (ADR-003) — record-never-fix, scope discipline — stay hard at every tier; they exist for the work's sake, not from distrust of the model.

## Consequences

- A typo-class task produces: one-sentence motive + fix + green self-test + one commit — no brief, no phase documents
- A one-line fix touching funds pays full L — by design, not by accident
- Adopters declare an always-L list at adoption/upgrade (the CHANGELOG entry's adopter action says so)
- Translated boscope variants need the same tier-first insertion
- Grading is the agent's obligation, not a right: under-grading is auditable from commit history and records as issues
