---
description: We distill shuorenhua plus our own review patterns into bowrite (薄写), an in-repo writing skill — write thin, write well
---

# ADR-002: Adopt the bowrite writing skill (薄写)

## Status

Accepted — ships with the template.

## Context

Every book document is held to a plain-language standard (see [ADR-001](ADR-001-adopt-bocode.md) and `guidelines/writing-style.md`). The full ruleset we drew on, [shuorenhua](https://github.com/MrGeDiao/shuorenhua), is an external MIT project — deeper than our needs for Chinese, but not ours, and the project's policy is to reference third-party skills, never bundle them.

Meanwhile, the project's own document reviews kept catching the same expression problems that neither the guideline nor the upstream skill names explicitly: cleverness that makes the reader guess (bet-table metaphors, double-metaphors), over-compression that decodes to nothing ("不信也对"), emphasis formulas ("不是X，而是Y" / "正是……的原因"), colloquial words crossing into written text ("根子" → "根源"), terms borrowed from other fields ("工作记忆" for task tracking), and translation-ese in multilingual documents. These patterns accumulate with every review.

## Decision

Add a fourth skill, `bowrite`（中文名：薄写 — write thin, write well: 内容变少，核心没变）：

- **Thin**: fewer words, zero information lost — 把书读薄 happens at writing time
- **Well**: natural, direct, the reader's language — never clever at the cost of clear
- It carries a **living pattern ledger**: every new expression problem caught in review is added as a before/after entry, so the skill grows with the project
- It distills shuorenhua's principles with attribution kept; the upstream skill remains the reference for deep Chinese cleanup and is never bundled
- `guidelines/writing-style.md` stays as the prose fallback for environments without skills

## Consequences

- Agents installing the skills get an executable writing standard in every project, not just prose rules
- The project's review findings now compound into the skill instead of living in one-off fixes
- Three layers must stay distinct: skill = when/how for agents, guideline = what/why for humans, upstream = deep Chinese ruleset — duplication gets reconciled on sight
- The ledger needs curation; entries with no recurrences eventually get folded into the general rules
