---
name: bocode
description: Entry skill（中文名：薄码）for repositories running the BoCode workflow (code/ + book/ layout). Use when a session starts in such a repo, or when deciding where a document goes, how the book index works, or what the code↔book rules require. Teaches the structure map and the discipline; feature development itself is handled by boscope.
---

# bocode（薄码）

This repository runs BoCode: `code/` is the source, `book/` is the documentation stream and knowledge base. They drive each other in both directions. Your job in every session: keep the flywheel spinning — read from the book before coding, write back to the book after.

## The map

```
book/
├── README.md          master index (script-generated — read this first)
├── guidelines/        the rules: workflow, writing style, git, review
├── docs/              architecture snapshots, API contracts, ADRs
├── notes/
│   ├── learn/         experience entries — search before coding
│   ├── summary/       feature reports, written for humans
│   ├── task/          task tracking
│   └── issue/         recorded problems — never fixed in passing
├── plans/             implementation blueprints — the input to coding
└── changelogs/        dated change records
```

## Session discipline

**Starting work:**
1. Read `book/README.md` for the full map.
2. Read `AGENTS.md` for the repository's rules and hard constraints.
3. Before coding anything: check `book/guidelines/` for the baseline, and search `book/notes/learn/` for related experience.

**While coding:** a new lesson or pitfall goes straight into the current month's `notes/learn/YYYY-MM/` — don't wait for wrap-up to remember it.

**Finishing work:** sync the book — plan status, summary, new issues, changelog entry — then regenerate the index. Details of what to write where are in the **book-writeback** skill.

## The two contracts

1. **Index contract**: every new book document starts with frontmatter `description` — one plain-language line about the *content* (not the genre). After any book change, run `cd code && npm run book:index`; the build fails on a missing description, and that's the point.
2. **Record-only contract**: problems found during review or wrap-up are recorded to `notes/issue/`, never fixed in passing. A recorded problem becomes a task; fixing is separate work.

## What not to do

- Don't edit `book/README.md` by hand — it's generated.
- Don't archive by feature: `summary/`, `learn/`, `issue/`, `changelogs/` group by `YYYY-MM/` only; features are found through the index, frontmatter, and links.
- Don't write book documents in template-speak — write them thin and well (the **bowrite** skill, 薄写), per `book/guidelines/writing-style.md`: plain language, facts locked.
- Don't treat a plan in `book/plans/` as a suggestion: it is the input to implementation, and deviations go back through design, not silently into code.
