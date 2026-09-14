---
name: book-writeback
description: The write-back skill（中文名：返写）— guides writing back to the book after work completes: summary reports, learn entries, issue records, changelog entries, with templates and quality gates, then regenerating the index. Use at feature wrap-up, after small fixes that taught something, or when the user asks to write a summary, learn entry, issue, or changelog.
---

# book-writeback（返写）

Development that doesn't write back to the book loses its experience. This skill covers what to write, where, and the quality bar — for the BoCode layout (`book/` with `notes/{summary,learn,issue}/`, `changelogs/`, `plans/`).

## What to write, when

| Situation | Write |
|-----------|-------|
| A feature completed | summary + learn + changelog, plan status → completed |
| Something was learned or tripped over (any phase) | learn — immediately, not at wrap-up |
| A problem was noticed but deliberately not fixed | issue |
| A small fix with nothing to teach | changelog only |

## Templates and quality gates

### summary → `book/notes/summary/YYYY-MM/YYYY-MM-DD-<feature>.md`

A report a human reads without opening the code.

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

**Gate:** a reader who has never seen the code understands what changed and why. Numbers over adjectives; state what wasn't done as plainly as what was.

### learn → `book/notes/learn/YYYY-MM/YYYY-MM-DD-<topic>.md`

A searchable knowledge entry for humans and agents.

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

**Gate:** the title alone answers the question. Tags include the words you'd search for later — including symptom words ("timeout", "drift", "silent-fail").

### issue → `book/notes/issue/YYYY-MM/YYYY-MM-DD-<topic>.md`

A recorded problem. **Never fix it as part of recording.**

```markdown
---
description: <one plain-language line about the content>
---
# <the problem in one line>

- **Observed**: what was seen, where, when
- **Reproduction**: the steps or conditions that bring it back
- **Suggested direction**: what a fix would probably touch — recorded only
```

**Gate:** someone else could confirm the problem from the record alone.

### changelog → `book/changelogs/YYYY-MM/YYYY-MM-DD-<description>.md`

Short, dated, factual: what landed. One entry per change; link the summary when one exists.

### plan status → `book/plans/YYYY-MM-DD-<feature>.md`

Flip `status:` to `completed` (or `in_progress`) so the blueprint doubles as the record of intent.

## After every writeback

1. Every new file carries frontmatter `description`.
2. Regenerate the index: `cd code && npm run book:index` — zero warnings or it didn't happen.
3. Writing follows `book/guidelines/writing-style.md`: plain language, fidelity contract above style (numbers, commands, names, and responsibility attribution never move).

## Quality bar

A writeback that fails the fidelity contract (invented facts, softened predicates, shifted blame) is worse than no writeback — future sessions build on it. If unsure of a number or a cause, write the uncertainty into the entry.
