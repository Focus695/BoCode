---
description: We classify workflow gates by justification — intent gates stay hard, distrust gates soften as models improve; Phase 2 approval becomes gap-based stopping
---

# ADR-003: Separate intent gates from distrust gates

## Status

Accepted — applied 2026-09-14 in the capable-model workflow calibration. Amends the Phase 2 gate from ADR-001; the six-phase structure itself stands.

## Context

The workflow's gates were written when agent models needed firm rails: blanket pre-reading, prescribed step sequences, stops for confirmation. Capable models invert the economics — OpenAI's "Rethinking skills and prompts for GPT-6 Astra" (audit: `notes/learn/2026-09/gpt6-astra-scaffold-audit.md`) documents the shift: scaffolding that helped weaker models now causes wrong routing, consumed context, premature stops, and halts on approvals the environment already allows.

The gates had mixed justifications. Some exist because a human owns the decision (review integrity, scope discipline, production safety). Others exist only because weaker models couldn't be trusted to act (blanket design approval, prescribed coding loops, ask-before-running defaults). Only the second kind ages with model capability.

## Decision

Gates are classified by justification, and each class gets different maintenance:

- **Intent gates — stay hard, model-independent**: Phase 5/6 record-never-fix (review must review what was built); Phase 3 scope discipline; production and credential safety; `main` merge-only.
- **Distrust-shaped rules — become defaults**: Phase 4's red-green-refactor loop is the default path; the mandatory part is the gate (all green, no weakened assertions, coverage matrix). Guideline reading is pointer-based (the input table in `guidelines/README.md`), never blanket.
- **Approval gates — become gap-based stops**: Phase 2 produces the full design and proceeds to Phase 3; it stops for the user only on real gaps — scope conflict, undetermined data shape, unclear external dependency — never just for confirmation.
- **Permissions flip to grant**: local commands are pre-approved (the safe-by-default block in AGENTS.md); agents run, fix, and rerun without asking.
- **Plans carry explicit done criteria** — the finish line that prevents premature stops.
- **Standing re-audit**: when the agent's model generation changes, re-audit AGENTS.md, `guidelines/`, and skills against this taxonomy.

## Consequences

- Capable agents move without halting on pre-approved actions or confirmations; tentative ones get an explicit finish line from the plan
- The human review point moves from "before any code exists" to "the delivered design plus the recorded review" — cheaper per feature, but a wrong design direction surfaces after implementation; Step 0 and the requirements brief carry more of the intent weight
- Weaker models lose some rails — projects pinned to a weak model may prefer stricter phrasing and should record that in their own ADR
- The re-audit rule is a recurring maintenance task; skipping it lets distrust gates quietly grow back
