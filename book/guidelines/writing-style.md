---
description: Plain-language writing standard for every book document — fidelity contract first, then minimal style rules, intensity levels, and a read-back check
---

# Writing style — speak human

Everything under `book/` (summary, changelog, learn, issue, task, plans, guidelines, docs) is written the same way: like a specific person speaking in a specific situation — not like a model performing writing. Professional is fine; templated is not.

The complete rule set lives in the shuorenhua skill (source: [MrGeDiao/shuorenhua](https://github.com/MrGeDiao/shuorenhua)). If it is installed in your environment, prefer it; this file is the project default and the fallback when it isn't.

## Fidelity contract — above any style

No rewrite may add facts, drop core facts, or change who is responsible. The following never move:

- Numbers, versions, dates, commands, API names, parameter names, field names, config keys, logs, error messages
- Code blocks, table data, directory structures
- System-behavior subjects, domain terms, ADR conclusions, responsibility attribution (who did what, in what state)
- When a quantitative claim is ambiguous, keep the original relationship and flag it for confirmation — never add counts, years, or measurements the source doesn't have
- Predicate strength must not drift: "improved performance" must not soften into "touches performance"; "saves time" must not grow into "saves time and money"

## Minimal rules

Work by pattern, not word-for-word substitution. Rotating synonyms to dodge repetition is itself model-speak — repeat a keyword when it is the right word.

- Cut filler openers and meta-commentary: "it's worth noting that", "let me explain", "hope this helps"
- Cut empty-summary closers: "in summary", "at the end of the day", "essentially"
- In "not X, but Y" skeletons, usually delete the first half and just say Y
- Unsourced citations ("studies show"): flag the missing source — don't delete the claim, don't invent a source
- Unpack jargon into plain actions: "empower", "leverage", "synergy", "closed loop"
- Un-nominalize: "performed an optimization" → what changed, how much faster. "perform / implement / complete + gerund" is the tell
- Shorten translationese: fewer long attributive chains, fewer passive piles, less "through X, by way of Y, to achieve Z"
- Don't call the same thing by three different names in adjacent sentences
- Filler intensifiers ("important", "key", "critical", "core"): trim only when density is clearly too high, or replace with concrete information

## Intensity levels

Book documents use the `docs` setting (priorities: searchable, reproducible, stable terminology):

| Level | When | Action |
|------|------|--------|
| minimal (default) | Text is mostly natural | Remove empty summaries, tighten tone |
| standard | Visible model-speak but sound structure | Unify register, fix performative tone, merge sentences or switch subjects where needed |
| aggressive | Almost never | Docs never go up to this level |

No structural delete-and-merge: authoritative documents (specs, architecture, ADRs) get sentence-level rewrites and empty-sentence removal only — paragraphs are never reordered.

## Positive target

The finished text should carry concrete information, a subject and an action, a consistent register, and honesty about uncertainty. "Ready to send" is the finish line — don't keep polishing toward "sounds human" until it distorts.

## Read-back (before committing)

1. **Fidelity read-back**: did protected spans drift, did information get lost, did terminology distort, does anything read broken after the cuts?
2. **Residual-slop read-back** (only if the first pass still smells): leftover openers, leftover summaries, narrator voice, vague judgments, over-even rhythm — light corrections only.

## Frontmatter convention

Every book document starts with:

```markdown
---
description: one plain-language line about the content
---
```

Good: `Module overview: responsibilities and boundaries of web, api, and worker`
Bad: `This document describes the overall architecture of the system` (that's the genre, not the content)

The master index `book/README.md` is generated from these descriptions; `cd code && npm run book:index` warns and exits 1 when one is missing.
