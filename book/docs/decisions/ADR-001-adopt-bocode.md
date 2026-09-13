---
description: We run this repository on the BoCode workflow — book drives code, code writes back, six phases gate every feature
---

# ADR-001: Adopt the BoCode workflow

## Status

Accepted — the template ships with this decision made. Revisit only if the project outgrows it.

## Context

Most implementation in this project happens with AI coding agents. Agents are fast but stateless: every session starts from zero, and project knowledge either lives somewhere durable or it's gone. In projects that keep everything in chat history and memory, the same questions get re-answered, the same pitfalls get re-hit, and humans lose track of why the code looks the way it does.

The alternatives considered:

- **Convention elsewhere (ADR-only / README-only)**: too thin — it records decisions but not experience or plans
- **Issue-tracker-centric**: tasks live, but knowledge doesn't; the tracker is a queue, not a book
- **No system**: knowledge evaporates with each session

## Decision

This project keeps two top-level halves — `code/` and `book/` — in a bidirectional relationship:

- `book/` drives `code/`: plans are the construction blueprint, guidelines are the baseline, learn entries are the experience base, issues are the improvement backlog
- `code/` writes back to `book/`: every feature ends with a summary, new learnings, new issues, a changelog entry, and a regenerated index
- Every feature moves through six gated phases (Step 0 brief → analysis → design approval → implementation → testing → review/wrap-up), with design requiring user approval and review/wrap-up recording rather than fixing
- Every book document carries a one-line frontmatter description; a zero-dependency script regenerates the master index and fails when one is missing

## Consequences

- Every feature leaves written traces; agents start each session from the book, not from zero
- Humans can follow the project without reading code: summaries report, decisions explain
- Wrap-up costs a few extra minutes per feature — accepted as the price of compounding
- The discipline only pays while the index stays green and the writing stays plain; both are enforced by tooling and style rules rather than willpower
