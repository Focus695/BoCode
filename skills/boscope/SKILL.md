---
name: boscope
description: BoCode's feature-development skill（中文名：薄界）— scope it thin, gate it hard, grade it first. First move inside: grade the task S/M/L (guidelines/task-tiers.md) — S exits to a light channel (one-sentence motive → change → self-test → single commit); M/L run a Step-0 structured requirements brief plus six hard-gated phases (analysis, design, implementation, testing, review, wrap-up). Use when the user asks to implement/add/support/change a feature and the request is sparse — missing background, scope, or detailed logic. Do not use for one-line fixes outside the always-L list, typos, pure questions, or tasks whose scope the user has already fully specified.
---

# BoScope（薄界）

Scope it thin. Gate it hard.

薄界：把界画清——范围、排除、边界先说死，再动代码；阶段一关一关过，不许跳。与 BoWrite 成对：薄写把书写薄，薄界把界画薄——内容薄、边界也薄，薄到一眼见底。

## Goal

Grade the task first (tier first, below). An M/L feature then splits into **brief → six phases**, each phase a hard gate. Fill a structured requirements brief before touching code, and proactively raise the design axes the user didn't mention. Then move phase by phase — no skipping.

**Core principle:** a request that says *what* but not *why / scope / boundaries* is not ready for code. Fill the gaps first; then surface the axes the user didn't know were missing.

## Tier first — grade before anything (REQUIRED — before Step 0)

Grade the task against the tier table in `book/guidelines/task-tiers.md` (the criteria live there, not here — this project's copy, with its always-L list). The tier is a fact about the change, not a preference; it lands in the first commit's motive.

- **S** — the light channel; this skill's phases never start: one-sentence motive (why + how verified) → change → self-test green → single commit. No brief, no phase docs — the changelog line is the only paperwork owed.
- **M / L** — continue to Step 0 and the six phases below.
- **Upgrade is one-way.** Hitting a higher tier's criteria mid-task: stop, re-tier, run the missing gates now — finished analysis and design carry over.
- Grading is an obligation, not a right: review finding the tier too low records an issue (`book/guidelines/review-checklist.md`), never a quiet backfill.

## Step 0: the requirements brief (REQUIRED — before any code)

Render the brief below and fill every slot. For empty slots you have two duties:

**A. Missing → ask.** Real gaps go to the user as questions. Don't guess background or scope — they change what gets built. Ask once, completely.

**B. Sufficient → recommend.** Once enough is known to start, don't stop — raise the design axes the user didn't mention (permissions, notifications, idempotency, caching, transactions, boundaries, regression, generated-artifact sync…). Mark each as `[recommended — confirm or reject]`. Fill the gaps the user didn't know were there.

**C. Inherited → question.** Every requirement is a suggestion until it shows its law — physics is the law, everything else negotiates. Physics here: correctness, data integrity, the user's explicit hard constraints, real resource limits. Suggestions wearing physics clothes: "how it's done", industry habit, past practice, third-party defaults. The user's WHAT is physics; the HOW is suggestion — question what was inherited, never what was asked.

**D. Stated → experienced.** The stated request is a proxy; the experience behind it is the requirement — it's not the customer's job to know what they want. Record the felt result in the brief: what the user will see, do, and get when it works. Design beyond the literal ask; never against it.

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

> The **exclusions** slot is REQUIRED. An empty "does not affect" list is the number-one cause of out-of-scope changes in Phase 3. Focus is saying no — the exclusions slot is where the feature gets its shape.

**Axes checklist (review every time, raise the relevant ones):** permissions/auth · notifications · idempotency · cache invalidation · transaction boundaries · concurrency/races · rate limits · data migration · regression impact · generated-artifact sync (codegen / schema / proto — refresh per the project's build scripts after changes).

---

## The six phases (each a hard gate; an unfinished gate blocks the next)

### Phase 1: Analysis

Understand the requirement → find the relevant code → trace the call chain → map the impact → flag risks. **No code changes.**

**Output:** impact map + risk list.

### Phase 2: Design

**Output:** data flow, sequence diagram (optional), file change list, new interfaces, permission design, notification design, experience surfaces (defaults, empty states, error messages), test points.

**Derive, don't analogize.** Design and estimate bottom-up: decompose to primitives — what the data actually is, what the code actually does, measured costs — and reason up from there. An analogy ("the last similar feature took three days") is a data point, not an estimate. A gap between the bottom-up answer and the received number marks the real problem.

**Delete before you optimize.** Question every part against its requirement: delete what nothing calls for, simplify what remains, and only then optimize or speed up. If nothing ever gets added back, you're deleting too little; optimizing a part that shouldn't exist is waste, faster.

**Design is how it works.** The surfaces the user touches — defaults, empty states, error messages — are the design itself, not decoration on the data flow. A design that needs explaining before it works gets simplified, not documented.

**Stop and wait for approval.** Do not enter Phase 3 until the user explicitly approves. (A kickoff message that clearly orders implementation and sets the technical context counts as approval — record that basis in the plan.)

> **Permissions + notifications** are the two slots agents forget most. Even when the answer is "not needed this time", state it explicitly.

**On approval:** write the plan into `book/plans/YYYY-MM-DD-<feature>.md` (template in that directory's README). The plan is the construction blueprint — this file, not memory, is what Phase 3 builds from.

### Phase 3: Implementation

Strictly per the approved design. **No changes outside scope, no refactors, no new abstractions.** Match the existing code's style.

### Phase 4: Testing (test-first)

Write a failing test → write the minimal implementation that passes → refactor with tests green. This loop is the iteration engine — run it fast and let it fail: a red test is data, not a setback. Iterate freely inside the phase, never past the gate. What crosses the gate crosses it polished — defaults chosen, errors worded, edges handled.

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

- Tier before Step 0, the tier riding in the first commit's motive — S runs the light channel and never enters the phases; M/L skip none
- Step 0 before any code, every brief slot filled
- No skipping phases; every REQUIRED gate met before the next
- Phase 2 design and Phase 3 scope boundaries advance only with explicit user approval
- Phase 5 records without fixing; Phase 6 records without fixing
- The writeback target is this project's `book/` — never bypass the project's own document conventions
