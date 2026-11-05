---
description: bowrite's voice rules now run on every write, not just from-scratch drafts; conditions and exceptions join the fidelity contract's never-move list; the writeback path names bowrite explicitly
---

# ADR-009: bowrite's voice rules run on every write

## Status

Accepted — 2026-11-06. Ships as a bowrite revision plus a writing-style.md sync and writeback wiring. Found in a user-driven audit of the skill's real output.

## Context

Three defects, one root: the skill could de-water a text but rarely made it human.

- **Voice rules were scoped to from-scratch drafts** ("Voice and rhythm — for from-scratch writing") while most project writing — summaries, learn entries, issues, changelogs — is revision-path. On that path bowrite carried only negative lists (cut on sight, the pattern ledger): noise got removed, the remaining sentences kept machine rhythm.
- **The fidelity contract didn't protect conditions**（仅当 / 除非 / 不适用于）. Thinning cut them as if they were modifiers: the fact survived, its boundary vanished — and the read-back couldn't catch it, because protected spans didn't include them.
- **The main prose path never loaded the skill**: book-writeback deferred to writing-style.md only, and the notes/decisions README templates said nothing about style at the point of writing. The skill itself also failed its own compression test — the 把书读薄 story appeared three times, and one rule lived in two places.

## Decision

- **Voice rules are universal.** 主干早出, keyword discipline, length breathing, 白话打底 run on revisions and from-scratch drafts alike; only the structure pair (know who is speaking, answer the reader's next question) stays from-scratch. Read-back gains a regular **voice pass** in place of the "only if it still smells" residue check.
- **Conditions, prerequisites, exceptions, and scope of application join the never-move list** — in the skill and in the writing-style.md fallback, same wording: cutting one doesn't remove a fact, it removes the fact's boundary.
- **The writeback path carries the skill by name**: book-writeback routes through bowrite（writing-style.md as the no-skill fallback）; the notes/ and decisions/ READMEs state the standard at the templates.
- **The skill passed its own thinning**: the 把书读薄 story now appears once, the duplicated 不是X而是Y rule keeps only its more specific copy (the ledger entry with examples), golden-tail sentences cut.

## Consequences

- Revisions now humanize, not just shrink — the thinning and well mandates finally run together everywhere
- Thinning can no longer silently unbound a claim; the read-back checks conditions alongside numbers and names
- Every writeback-producing surface names its style rule at the point of writing
- The pattern ledger stays the single home for found patterns; cut-on-sight stays a bare list with no examples
