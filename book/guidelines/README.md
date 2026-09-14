---
description: Index of the five guidelines and the input pointer table — which guideline to read for which kind of task, with no blanket pre-reading
---

# Guidelines

The project's development rules. Every contributor — including AI agents — follows them.

| File | Content |
|------|---------|
| `workflow.md` | Six-phase gate workflow and the code↔book interaction rules |
| `writing-style.md` | Plain-language standard for every book document |
| `git-workflow.md` | Clean Commit format and Clean Flow branch/PR/merge rules |
| `review-checklist.md` | The eight code-review checks |
| `architecture.md` | Long-term architecture rules (template — replace per project) |
| `coding-style.md` | Language-specific coding baseline (template — replace per project) |

## Input pointers — consult on demand, never blanket-read

| When the task touches… | Read first |
|--------|-----------|
| Phases, gates, book sync | `workflow.md` |
| Module boundaries, data ownership, tech swaps | `architecture.md` |
| The current shape of modules and data flow | `../docs/architecture/` snapshots |
| Interface contracts | `../docs/api/` |
| Writing any book document | `writing-style.md` |
| Commits, branches, PRs, releases | `git-workflow.md` |
| Language-level code rules | `coding-style.md` |
| Reviewing a diff | `review-checklist.md` |
| Prior experience with this symptom or tech | search `../notes/learn/` by tag |

First contact with the repo: read `workflow.md` once. After that, jump straight to the guideline the task touches — the table above routes you.
