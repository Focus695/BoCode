---
description: Six-phase gate workflow with the eight code↔book interaction rules and the document routing table
---

# Workflow

## Development process — six phases, hard gates

Grade the task first — S, M, or L per `task-tiers.md`; the tier is decided before any work and lands in the first commit's motive. S runs the light channel and never enters this table. Every M/L feature moves through these phases in order. **No skipping.**

| Phase | Name | Output | Gate |
|------|------|--------|------|
| Step 0 | Structured requirements brief | Requirements brief | Every slot filled |
| Phase 1 | Analysis | Impact map + risk list | No code changed |
| Phase 2 | Design | Data flow, file list, interfaces | Design complete; stop only on real gaps — scope conflict, undetermined data shape, unclear external dependency |
| Phase 3 | Implementation | Code | Strictly per design; nothing outside scope |
| Phase 4 | Testing | Test cases | All green; no weakened assertions |
| Phase 5 | Code review | Review findings | Record only — no fixes |
| Phase 6 | Wrap-up | Docs, learnings, issues | Record only — no fixes |

Step 0 comes before any code (M and L). Fill the brief: background, scope (what it affects, what it explicitly does **not** affect, and the boundaries), and the requirement itself. An empty "does not affect" list is the number-one cause of out-of-scope changes in Phase 3 — the exclusions slot is required. Requirements arrive as suggestions; physics is the only law — correctness, data integrity, and the user's explicit hard constraints don't negotiate, while convention, past practice, and "how it's done" do. Question the inherited HOW; the user's WHAT holds (reasoning and sources in ADR-005, in the BoCode repository's `book/docs/decisions/`). The stated request is a proxy — the experience behind it is the requirement: capture what the user will see, do, and get. Focus is saying no; the exclusions slot gives the feature its shape (ADR-006).

Phase 2 produces the full design — data flow, file list, interfaces — and proceeds; it stops for the user only when a real gap appears (scope conflict, undetermined data shape, unclear external dependency), never just for confirmation. Designs and estimates derive bottom-up from primitives — what the data and code actually are — never by analogy to last time; delete what no requirement calls for before optimizing anything that remains. Design is how it works — the surfaces the user touches (defaults, empty states, error messages) are designed with the data flow, never decorated after it (ADR-006).

Phase 4's hard part is the gate, not the sequence: all relevant tests green, no assertion weakened to get there, coverage of the normal path, boundary inputs (ranges, empty, extremes), error paths, and a regression check that existing behavior didn't break. Test-first (write a failing test → minimum implementation → refactor staying green) is the default loop — sequence the work however keeps the gate honest. Iterate fast inside the phase; polish at the gate — what crosses a gate is finished: defaults chosen, errors worded, edges handled (ADR-006).

Phases 5 and 6 share one discipline: **record, never fix.** A problem found during review or wrap-up goes into `notes/issue/` — fixing it is a separate, later task. Fixing in passing feels efficient and destroys the gate: the review no longer reviews what was built.

## code ↔ book — the two halves

```
                 book/  (knowledge base + driving force)
               ┌─────────────────────────────────────┐
               │  plans/      → drives implementation │
               │  guidelines/ → provides the baseline │
               │  learn/      → provides experience   │
               │  issue/      → provides direction    │
               │  decisions/  → provides context      │
               └──────────────┬──────────────────────┘
                              │ drives
                              ▼
                          code/
                              │ produces
                              ▼
               ┌─────────────────────────────────────┐
               │  summary/    ← feature reports       │
               │  learn/      ← new experience        │
               │  issue/      ← new problems found    │
               │  changelogs/ ← change records        │
               │  plans/      ← completion status     │
               └─────────────────────────────────────┘
```

## Interaction rules

1. **Before coding** — search `notes/learn/` for related experience and consult only the guideline the task touches (the input pointers in `guidelines/README.md` route you); no blanket pre-reading.
2. **While coding** — something new learned or tripped over? Write it to `notes/learn/` immediately; future sessions (human or agent) benefit.
3. **After coding** — sync the book: plan status, summary, new issues, changelog, index.
4. **Plans drive code** — `book/plans/` is the input to implementation. The agent reads the plan, builds in `code/`, writes back to `book/`.
5. **Issues feed code** — `notes/issue/` records problems that become the direction of later iterations.
6. **The book compounds** — every feature should leave the book more complete than it found it. The book is both the agent's context and the human's reference manual.
7. **Refresh the index** — after any book change, run `cd code && npm run book:index` before wrapping up. New files must carry a frontmatter `description`, and internal links must resolve — either failing fails the build.
8. **Re-audit when the model changes** — scaffolding ages with model capability. When the agent's model generation changes, re-audit AGENTS.md, `guidelines/`, and skills against ADR-003's gate taxonomy: keep intent gates (record-never-fix, scope discipline), drop or soften gates that only exist from distrust of weaker models.

## Document routing

| Output | Location | Audience | Style |
|--------|----------|----------|-------|
| Feature report | `book/notes/summary/` | Humans first | Report: background → what → why → outcome |
| Learned experience | `book/notes/learn/` | Humans + agents | Knowledge entry: searchable, tagged, applicability stated |
| Potential problem | `book/notes/issue/` | Humans + agents | Structured: problem + reproduction + suggested direction |
| Task tracking | `book/notes/task/` | Humans + agents | Checklist |
| Architecture decision | `book/docs/decisions/` | Humans first | ADR format |
| Implementation plan | `book/plans/` | Agents first | Structured, directly executable |
| Change log | `book/changelogs/` | Humans first | Short, dated entries |

Every book document follows the plain-language standard in `guidelines/writing-style.md`.
