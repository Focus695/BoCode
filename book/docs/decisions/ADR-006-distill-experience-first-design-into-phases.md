---
description: Jobs's experience-first craft is woven in beside ADR-005 — the request is a proxy for an experience, design is how it works, focus is saying no, and gates are the polish point
---

# ADR-006: Distill experience-first design into the phases

## Status

Accepted — 2026-11-05. Ships with the template.

## Context

[ADR-005](ADR-005-distill-first-principles-into-design-phases.md) wired first-principles reasoning into the phases — physics tests, bottom-up estimates, delete before optimize. That method reasons from constraints inward. The complementary direction was missing: reasoning from the user's experience outward.

The distilled material is Steve Jobs's public product philosophy (interviews and talks, gathered 2026-11):

- **Technology alone is not enough** — "it's technology married with liberal arts... that makes our hearts sing": the deliverable is judged by the experience it produces, not the mechanism it uses.
- **Design is how it works, not how it looks** — the surfaces a person touches are the design.
- **It's not the customer's job to know what they want** — the stated request is a proxy for an experience; taste builds what people can't leave once they've had it (Macintosh, iPod, iPhone, iPad).
- **Focus is saying no; polish to near-perfection before release** — simplicity, concentration, finishing before shipping.

## Decision

Weave the method into the same phase boundaries as ADR-005. The two philosophies pair rather than collide: Musk reasons from physics inward, Jobs from experience outward; both converge on ruthless deletion — ADR-005 calls it the algorithm's second step, Jobs calls it focus. The apparent tension — iterate fast (Musk) versus polish before release (Jobs) — resolves at the phase boundary: iterate fast inside a phase, cross the gate polished.

- **Step 0** (boscope): duty D — the stated request is a proxy; the experience is the requirement; the brief records the felt result. Focus is saying no — the exclusions slot gives the feature its shape.
- **Phase 2**: design is how it works — experience surfaces (defaults, empty states, error messages) join the design artifacts; a design that needs explaining gets simplified, not documented.
- **Phase 4**: the gate is the polish point — what crosses a gate is finished.
- `guidelines/workflow.md` carries the what/why sentences; `guidelines/review-checklist.md` gains the tenth check: experience seams treated as design.

What stays out, deliberately: product secrecy, the reality-distortion field, and launch-event theater — persuasion and staging, not method; the same line ADR-005 drew between method and attitude.

## Consequences

- Step 0 now carries four duties; if briefs get heavy, D folds into B — they share the "design beyond the literal ask" move
- "Design beyond the literal ask, never against it" keeps duty D consistent with duty C: the user's WHAT stays physics; the HOW serves an experience
- Review now catches unworded errors and untouched defaults explicitly, instead of folding them into "complexity added"
- Re-audit with model generations per ADR-003: a model with reliable product taste may let the experience-surface checks shrink
