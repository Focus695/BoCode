---
description: Six-phase gate workflow with the seven code↔book interaction rules and the document routing table
---

# Workflow

## Development process — six phases, hard gates

Every feature moves through these phases in order. **No skipping.**

| Phase | Name | Output | Gate |
|------|------|--------|------|
| Step 0 | Structured requirements brief | Requirements brief | Every slot filled |
| Phase 1 | Analysis | Impact map + risk list | No code changed |
| Phase 2 | Design | Data flow, file list, interfaces | **User approval required before Phase 3** |
| Phase 3 | Implementation | Code | Strictly per design; nothing outside scope |
| Phase 4 | Testing | Test cases | All green; no weakened assertions |
| Phase 5 | Code review | Review findings | Record only — no fixes |
| Phase 6 | Wrap-up | Docs, learnings, issues | Record only — no fixes |

Step 0 comes before any code. Fill the brief: background, scope (what it affects, what it explicitly does **not** affect, and the boundaries), and the requirement itself. An empty "does not affect" list is the number-one cause of out-of-scope changes in Phase 3 — the exclusions slot is required.

Phase 4 runs test-first: write a failing test, write the minimum implementation that passes it, refactor with the test staying green. Coverage must include the normal path, boundary inputs (ranges, empty, extremes), error paths, and a regression check that existing behavior didn't break.

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

1. **Before coding** — read `guidelines/` for the baseline; search `notes/learn/` for related experience.
2. **While coding** — something new learned or tripped over? Write it to `notes/learn/` immediately; future sessions (human or agent) benefit.
3. **After coding** — sync the book: plan status, summary, new issues, changelog, index.
4. **Plans drive code** — `book/plans/` is the input to implementation. The agent reads the plan, builds in `code/`, writes back to `book/`.
5. **Issues feed code** — `notes/issue/` records problems that become the direction of later iterations.
6. **The book compounds** — every feature should leave the book more complete than it found it. The book is both the agent's context and the human's reference manual.
7. **Refresh the index** — after any book change, run `cd code && npm run book:index` before wrapping up. New files must carry a frontmatter `description`; missing ones fail the build.

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
