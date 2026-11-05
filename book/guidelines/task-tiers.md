---
description: S/M/L task grading — criteria per tier, which channel a change runs, the four hard rules, and the always-L list each adopting project declares
---

# Task tiers

Tier first. Grade every task **before any work** — before Step 0, never as a slot inside the brief (a tier filled in during the brief means the small task already paid the brief tax). The tier is a fact about the change, not a preference; it lands in the first commit's motive and stays auditable from the repository alone.

S is not "an M with gates skipped" — it is a separate channel with no gates; its one-sentence motive **is** the gate. M and L run the full pipeline in `workflow.md`; gates may pass within one session, never be skipped.

| Tier | Criteria — any one means at least this tier | Required gates | Doc weight |
|------|---------------------------------------------|----------------|------------|
| **S** small | single file or surface-only change; touches no contract, permission, or funds; no data migration; regression surface visible at a glance | one-sentence motive (why + how verified) → change → self-test green → single commit | none beyond a changelog line |
| **M** medium | a feature or defect inside one functional area; adds or changes API behavior; touches a UI flow; needs new tests | Step 0 brief (half a page is fine) → all six phases | brief + summary, half a page to one page |
| **L** large | crosses functional areas or changes architecture; hits anything on the always-L list below; changes a shared contract; deletes a whole feature area | Step 0 brief, every slot filled in full → all six phases + review checklist + an ADR when the change trips the triggers in `../docs/decisions/README.md` (expensive to reverse · a reasonable person could have made differently · an architecture boundary rule) | full; execution plan into `plans/` |

## Hard rules

1. **Correctness-critical domains are always ≥ L, one line of change included.** The list sits in its own section below.
2. **S's one-sentence motive is required, not an exemption.** Why the change + how it will be verified. Can't state it means haven't thought it through — go back. It is the anti-drift replacement for the brief's exclusions slot.
3. **Upgrade is one-way.** Hitting a higher tier's criteria mid-task: stop, re-tier, run the missing gates now — finished analysis and design carry over, missing gates don't. Never "start as S and grow". Catching it yourself owes nothing; that is the rule working.
4. **Under-grading found in review or wrap-up is an issue, never a quiet backfill.** Review checks the tier (`review-checklist.md`); a change that met a higher tier's criteria but ran the lower channel gets recorded in `notes/issue/`.

## Always-L list — each adopting project declares its own

Funds/ledger · authn/authz/permissions · verification semantics · schema/data migration · shared contracts — the baseline's generic list. Adopting projects replace or extend it here with their correctness-critical domains; declared once, enforced every time, one line of change included.

## What stays hard at every tier

S still owes a single-purpose commit, nothing outside the change, and an honest self-test. For S, the book interaction rules (`workflow.md`) shrink to the changelog line — no learn search, no plan status, no summary owed. Record-never-fix and scope discipline are intent gates (ADR-003) — they exist for the work's sake, not from distrust of the agent, so no tier softens them. S corresponds to the small-fix direct-commit path in `git-workflow.md`; M and L branch per the same file.

Distilled from adopter feedback (Lighthouse3.0, 2026-11-05); the reasoning lives in ADR-008, in the BoCode repository's `book/docs/decisions/`.
