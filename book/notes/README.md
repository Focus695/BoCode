---
description: The four note types (learn, summary, task, issue), when each is written, the retrieval order, and the template for each
---

# Notes

All running records of the project. Each subfolder has one purpose, and everything here is **recorded, never auto-fixed** — a recorded problem becomes a task; fixing it is separate work.

`summary/`, `learn/`, and `issue/` archive under `YYYY-MM/`. The month is a stable, low-maintenance physical grouping; feature relationships live in filenames, frontmatter, and links in the text — never in deeper directory nesting.

| Folder | Use | Written when |
|--------|-----|--------------|
| `learn/` | Experience and lessons | During coding, and at Phase 6 wrap-up |
| `summary/` | Feature and version reports | After each feature completes |
| `task/` | Task tracking and breakdowns | When a requirement arrives |
| `issue/` | Potential problems (recorded, never fixed) | Any phase that finds one |

## Retrieval order

1. Read `book/README.md` first; locate documents by feature name, keyword, or summary.
2. Then read the specific type and month.
3. Before coding, search `learn` first; at wrap-up, write the feature's outcome, experience, and open problems to `summary`, `learn`, and `issue` respectively.

Obsidian can open `book/` directly as a vault; existing links are plain relative Markdown.

## Templates

### summary — a report a human can read without opening the code

```markdown
---
description: <one plain-language line about the content>
---
# <feature> — summary

- **Background**: why this feature exists
- **What was done**: the changes, in plain words
- **Why these choices**: the decisions and their reasons
- **Outcome**: what works now, measured where possible
- **Follow-ups**: what's deliberately left open, linking issues
```

### learn — a searchable knowledge entry, for humans and agents

```markdown
---
description: <one plain-language line about the content>
tags: [<topic>, <tech>, <symptom>]
---
# <the conclusion in one sentence>

- **Scenario**: when this entry applies
- **Why**: the mechanism behind it
- **How to apply**: what to do differently next time
```

Tags drive retrieval — write the words you'd search for later, including symptom words ("timeout", "drift", "silent-fail").

### issue — a recorded problem, never fixed in passing

```markdown
---
description: <one plain-language line about the content>
---
# <the problem in one line>

- **Observed**: what was seen, where, when
- **Reproduction**: the steps or conditions that bring it back
- **Suggested direction**: what a fix would probably touch — recorded only
```

### task — a checklist that tracks a piece of work

```markdown
---
description: <one plain-language line about the content>
---
# <task>

- [ ] <step>
- [x] <completed step, with a one-line result>
```
