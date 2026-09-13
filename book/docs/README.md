---
description: Map of docs/ — architecture snapshots, API design, and architecture decision records
---

# Docs

Technical documentation: what the system looks like and why it looks that way.

| Directory | Content | Difference from guidelines |
|-----------|---------|---------------------------|
| `architecture/` | Implementation snapshots — the current state of modules and data flow | `guidelines/architecture.md` holds long-term rules; snapshots hold dated, current truth |
| `api/` | API design and interface contracts | Guidelines say how to review; API docs say what the interfaces are |
| `decisions/` | Architecture decision records (ADR) — why choices were made | Decisions record one choice each; guidelines accumulate the standing rules |

New documents need a frontmatter `description` (see `guidelines/writing-style.md`), and the index must be regenerated after adding them (`cd code && npm run book:index`).
