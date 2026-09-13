---
name: feature-flow
description: Splits a feature into a Step-0 structured requirements brief plus six hard-gated phases (analysis, design, implementation, testing, review, wrap-up). Use when the user asks to implement/add/support/change a feature and the request is sparse — missing background, scope, or detailed logic. Do not use for one-line fixes, typos, pure questions, or tasks whose scope the user has already fully specified.
---

# feature-flow

## Goal

Split a feature into **brief → six phases**, each phase a hard gate. Fill a structured requirements brief before touching code, and proactively raise the design axes the user didn't mention. Then move phase by phase — no skipping.

**Core principle:** a request that says *what* but not *why / scope / boundaries* is not ready for code. Fill the gaps first; then surface the axes the user didn't know were missing.

## Step 0: the requirements brief (REQUIRED — before any code)

Render the brief below and fill every slot. For empty slots you have two duties:

**A. Missing → ask.** Real gaps go to the user as questions. Don't guess background or scope — they change what gets built. Ask once, completely.

**B. Sufficient → recommend.** Once enough is known to start, don't stop — raise the design axes the user didn't mention (permissions, notifications, idempotency, caching, transactions, boundaries, regression, generated-artifact sync…). Mark each as `[recommended — confirm or reject]`. This is the core increment of this skill: filling gaps the user didn't know were there.

### Brief template

```
## Background
<why this feature — fill or ask>

## Scope
- Affects: <files / modules / data flows>
- Does NOT affect: <explicit exclusions — REQUIRED; an empty exclusion list means scope drift>
- Boundaries: <input ranges, error modes, data shapes>

## Requirement
<the behavior in detail — fill or ask>
```

> The **exclusions** slot is REQUIRED. An empty "does not affect" list is the number-one cause of out-of-scope changes in Phase 3.

**Axes checklist (review every time, raise the relevant ones):** permissions/auth · notifications · idempotency · cache invalidation · transaction boundaries · concurrency/races · rate limits · data migration · regression impact · generated-artifact sync (codegen / schema / proto — refresh per the project's build scripts after changes).

---

## The six phases (each a hard gate; an unfinished gate blocks the next)

### Phase 1: Analysis

Understand the requirement → find the relevant code → trace the call chain → map the impact → flag risks. **No code changes.**

**Output:** impact map + risk list.

### Phase 2: Design

**Output:** data flow, sequence diagram (optional), file change list, new interfaces, permission design, notification design, test points.

**Stop and wait for approval.** Do not enter Phase 3 until the user explicitly approves. (A kickoff message that clearly orders implementation and sets the technical context counts as approval — record that basis in the plan.)

> **Permissions + notifications** are the two slots agents forget most. Even when the answer is "not needed this time", state it explicitly.

**On approval:** write the plan into `book/plans/YYYY-MM-DD-<feature>.md` (template in that directory's README). The plan is the construction blueprint — this file, not memory, is what Phase 3 builds from.

### Phase 3: Implementation

Strictly per the approved design. **No changes outside scope, no refactors, no new abstractions.** Match the existing code's style.

### Phase 4: Testing (test-first)

Write a failing test → write the minimal implementation that passes → refactor with tests green.

**Coverage (all required):** normal path · permission checks · boundaries (input ranges / empty / extremes) · error paths · regression (existing behavior intact).

**Gate:** all relevant tests pass, and no assertion was weakened to make them pass.

### Phase 5: Code review

Structured review of the diff, checking: duplicated code · permission holes · races · transaction issues · missed notifications · missed boundaries · added complexity · out-of-scope changes.

**Record, never fix.** Fixing in passing breaks the gate — findings go to the list and wait for a separate round. Follow the project's review checklist if one exists (`book/guidelines/review-checklist.md`).

### Phase 6: Wrap-up

Write back to the book: plan status, summary, learn entries, new issues, changelog — then regenerate the index. The **book-writeback** skill covers templates and quality gates.

**Invariant:** problems found here are **recorded, never fixed**.

---

## Constraints

- Step 0 before any code, every brief slot filled
- No skipping phases; every REQUIRED gate met before the next
- Phase 2 design and Phase 3 scope boundaries advance only with explicit user approval
- Phase 5 records without fixing; Phase 6 records without fixing
- The writeback target is this project's `book/` — never bypass the project's own document conventions
