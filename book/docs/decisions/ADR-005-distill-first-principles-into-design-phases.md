---
description: Musk's first-principles engineering method is woven into the design phases — requirements face a physics test, estimates derive bottom-up, deletion precedes optimization
---

# ADR-005: Distill first principles into the design phases

## Status

Accepted — 2026-11-05. Ships with the template.

## Context

The workflow's weakest spot sits upstream of code: requirements, estimates, and designs arrive by analogy — "how it's done", "the last similar feature took three days", a vendor's defaults — and get inherited without a challenge. Nothing in the six phases asked whether a requirement was law or habit.

The distilled material is Elon Musk's public engineering reasoning (interviews and talks, gathered 2026-11):

- **Physics is the law; everything else is a suggestion.** Battery packs "had to" cost about $600/kWh — until the materials (cobalt, nickel, aluminum, carbon) were priced at London Metal Exchange spot rates, giving a theoretical floor near $80/kWh. The gap was in manufacturing, not materials. Rockets built from raw materials running 1–2% of the traditional price pointed at the process, not the physics.
- **The five-step algorithm, in order**: question every requirement → delete (if you never add back ~10%, you're not deleting enough) → simplify → accelerate → automate — automating a wasteful process is faster waste.
- **Iterate fast, let it fail**: "if things aren't failing, you aren't innovating enough" — rapid, public iteration beats polishing in private.

## Decision

Weave the method into the existing design-development flow rather than shipping a fifth skill. The method fires at phase boundaries — Step 0, Phase 2, Phase 4 — and a standalone skill would trigger beside the workflow instead of inside it.

- **Step 0** (boscope): every requirement faces the physics test. Correctness, data integrity, the user's explicit hard constraints, and real resource limits don't negotiate; convention and inherited HOWs do. The user's WHAT is physics; the HOW is suggestion.
- **Phase 2**: designs and estimates derive bottom-up from primitives, never by analogy; the gap between the bottom-up answer and the received number marks the real problem. Delete what no requirement calls for, then simplify, and only then optimize.
- **Phase 4**: the test-first loop is the iteration engine — a red test is data, not a setback. Iterate freely inside the phase, never past the gate.
- `guidelines/workflow.md` carries the what/why sentences; `guidelines/review-checklist.md` gains the ninth check — parts that trace to no requirement.

What stays out, deliberately: the attitude layer (extreme work hours, ego reduction, "be useful before impressive"), management practices, and Ad Astra — engineering method only, and the skills and guidelines stay thin.

## Consequences

- boscope gains about ten lines of method; adopters maintaining translated or local variants of the skill sync the same insertions
- "Question the requirement" never licenses overriding the user — it separates the user's WHAT (physics) from inherited HOWs (suggestions); the Phase 2 approval gate is unchanged
- Review now catches gold-plating explicitly instead of folding it into "complexity added"
- Re-audit with model generations per ADR-003: a model that questions inherited requirements reliably on its own may let the Step-0 duty shrink
