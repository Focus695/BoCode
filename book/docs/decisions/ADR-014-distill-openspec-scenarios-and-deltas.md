---
description: Two OpenSpec practices distilled into the brief and L-tier plans — scenario acceptance criteria and behavior deltas — with the convergences validated and the parts deliberately not copied
---

# ADR-014: Distill OpenSpec's scenarios and deltas

## Status

Accepted — 2026-11-15. Ships with the template.

## Context

[OpenSpec](https://github.com/Fission-AI/OpenSpec) (Fission-AI, MIT) is a spec-driven development framework: requirements live in versioned Markdown instead of chat history. A change is a proposal folder — why/what, delta specs, design, tasks — that a human reviews before implementation; on archive, the deltas merge into per-capability living specs that serve as the system's current behavioral truth.

Studying it against this workflow found more convergence than gap. Its progressive rigor (lightweight by default, rigor scaling with risk) is the S/M/L tiering (ADR-008). Its behavior-first boundary — specs capture observable behavior, implementation detail goes to design — is the Step-0 WHAT / Phase-2 HOW split (ADR-005, ADR-006). Its brownfield-first stance, specs written as you build rather than generated upfront, is how the book already compounds. Its explore phase is Phase 1's "no code changed" gate. The convergence validates the baseline; it is not something to copy.

Two practices are worth distilling. First, OpenSpec writes acceptance as scenarios — a requirement with a SHALL line, scenario blocks in GIVEN/WHEN/THEN — so every criterion is checkable before code exists; our brief's requirement slot is free text, and Phase 4's gate has no explicit upstream list to run down. Second, OpenSpec's proposals store only deltas — ADDED/MODIFIED/REMOVED requirements against current behavior — which makes review sharp about what changes, not just what gets built; L-tier plans can state acceptance the same way without owning a permanent spec tree. A second pass over OpenSpec's verify discipline (its `/opsx:verify` skill) added a third, smaller rule: a REMOVED requirement is verified by absence — the behavior still present in code is a critical finding — which our regression dimension ("existing behavior didn't break") did not say.

## Decision

Distill the two practices; take nothing else.

- **Scenario acceptance criteria.** In the Step-0 brief (M/L), the requirement's acceptance criteria are written as one-line scenarios — GIVEN a starting state, WHEN the user or system acts, THEN the observable outcome — covering the normal path and the error paths. Phase 4's coverage starts by running down the brief's scenarios. A criterion that cannot be phrased as an observable outcome is a design question for Phase 2, not a requirement.
- **Behavior deltas in L-tier plans.** An L plan states acceptance as a delta — which observable behaviors the system ADDED, MODIFIED, or REMOVED relative to current behavior — so review sees what changes in behavior, not only what gets built. REMOVED rows owe an absence check in Phase 4: the behavior is gone, not merely unbroken.

Not copied, with reasons:

- **The living-specs layer** (`openspec/specs/` as permanent behavioral truth): its deltas merge mechanically at archive time via their tooling; maintained by hand it rots, and BoCode already has its executable behavior truth — code and tests. A second truth source would break the routing table's one job per document.
- **Mandatory human approval of the proposal before code**: a distrust gate under ADR-003's taxonomy. This workflow stops for the user on real gaps only; Step 0 plus the Phase-2 stop rule already carry the alignment OpenSpec gets from approval.
- **Replacing the hard gates with OpenSpec's fluid no-gates loop**: the gates are the product here (ADR-003); OpenSpec's looseness is a different bet, not a missing feature.
- **The CLI, directory layout, and skills tooling**: BoCode ships as book plus scripts and is agent-agnostic through the book; the value was the methodology, not the scaffolding.

## Consequences

- The brief's requirement slot and Phase 4's gate close a loop explicitly: scenarios written before code become the first test list.
- L plans gain a delta view of acceptance at no standing maintenance cost — the delta lives in the plan, which already records intent.
- No new directory, tool, phase, gate, or truth source. The weaves land in `guidelines/workflow.md`, `plans/README.md`, and the boscope skill's brief template; the session-side structured-feature-implementation skill is aligned with the same wording.
- Credit where due: the two practices and the format inspiration come from OpenSpec (MIT, Fission-AI). The convergences above are recorded as validation of decisions this repository had already made on its own.
