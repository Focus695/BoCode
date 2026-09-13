---
description: Template for your project's long-term architecture rules — boundary invariants, module map, tech baseline, with a worked example of boundary-style rules
---

# Architecture

> **This file is a template — replace it in your project.** It holds the long-term architecture truth: boundary invariants, the module map, the technology baseline, and data ownership. What exists *today* belongs in `docs/architecture/` snapshots; what must stay true *forever* belongs here.

## What to define here

1. **Boundary invariants** — the "X ≠ Y" rules (see the worked example below). Two concerns that must never fuse, each with the reason it exists.
2. **Module map** — the top-level modules/processes, their responsibilities, and who talks to whom. One sentence per module is enough; details live in snapshots.
3. **Technology baseline** — languages, frameworks, storage, and the rule for swapping any of them (usually: via an adapter, never via a rewrite).
4. **Data ownership** — for each store or dataset, the single module allowed to write it.

## Worked example: boundary invariants

A boundary rule names two concerns and keeps them apart, with the reason a reviewer can check:

| Rule | Why |
|------|-----|
| Provider ≠ Domain | An external provider's structure must not leak into domain logic; swapping providers then touches adapters only |
| Raw Data ≠ Derived View | Raw inputs and computed views have different lifecycles and different owners; fusing them couples ingestion to presentation |
| Primary DB ≠ Cache | A cache may speed things up but never own truth; everything in it must be rebuildable |

Write rules you can enforce in review. If a rule can't be checked against a diff, it's a wish, not a boundary.

## Maintenance

- Boundary rules change only through an ADR in `docs/decisions/`.
- When reality drifts from this file, fix reality or fix the file — never let them disagree silently.
