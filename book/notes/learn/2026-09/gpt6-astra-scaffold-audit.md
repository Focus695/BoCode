---
description: BoCode audited against OpenAI's "Rethinking skills and prompts for GPT-6 Astra" — index-first routing and intent gates hold, five gaps worth closing
tags: [agent-workflow, prompts, skills, agents-md, model-capability, audit]
---
# Capable-model guidance mostly vindicates BoCode's routing; the gaps are permission grants, input pointers, done-criteria in plans, gate-vs-recipe separation, and a standing re-audit

- **Scenario**: applies when AGENTS.md, guidelines, or skills are revised, and whenever the agent's model generation changes.
- **Why**: scaffolding written for weaker models — blanket pre-reading, distrust-driven ask-first gates, prescribed coding itineraries — taxes capable models with wrong routing, consumed context, premature stops, and redundant work.
- **How to apply**: the alignment table below says what to keep; the five deltas are candidates that change guidelines and need an explicit decision.

Source: OpenAI developers blog, "Rethinking skills and prompts for GPT-6 Astra" (https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra), read 2026-09-14. Four sections: better skills, up-to-date AGENTS.md, decision boundaries, persistence.

## Where BoCode already aligns

| Article principle | BoCode practice |
|------|------|
| Skills/docs as minimal routers, not manuals | `book/README.md` is a generated master index of one-line descriptions; agents read it first and follow links only where needed |
| Keep descriptions short and specific | Frontmatter `description` must state content, not genre (`Module overview: responsibilities and boundaries of web, api, and worker`) |
| Reading costs context and can trigger compaction | Month folders are physical grouping only; retrieval goes through the index, frontmatter, and `tags` — never "read everything" |
| Don't let review mutate what was reviewed | Phase 5/6 record-never-fix is review integrity, not model distrust — keep regardless of model capability |
| Define completion upfront to avoid premature stops | The six phases already encode done: Phase 4 all green → Phase 6 book synced and index rebuilt |
| Rules must be checkable | architecture.md: "if a rule can't be checked against a diff, it's a wish" |

The structured-feature-implementation skill also follows the article's skill hygiene: its description scopes both when to trigger and when not to (one-line fixes, typos, pure questions, already-scoped requests).

## Five gaps worth closing (each needs a decision — they change guidelines)

> 2026-09-14: all five applied, plus one step further — Phase 2 approval became gap-based stopping, matching the skill's own edit. Decisions recorded in ADR-003; see `changelogs/2026-09/2026-09-14-capable-model-workflow-calibration.md`.

1. **No safe-permissions grant in AGENTS.md.** The article's most practical tip: state what is safe so the model doesn't halt on approvals the environment already allows. Add a block like "local runs and tests are disposable and have no production access — run, fix, and rerun without asking."
2. **Input routing is implied, not tabulated.** Rule 1 says "read `guidelines/` for the baseline" — close to the blanket pre-reading the article warns against. Replace with a contextual pointer table mirroring the output routing table: service boundaries → `guidelines/architecture.md`; prose → `guidelines/writing-style.md`; commits → `guidelines/git-workflow.md`; related experience → search `notes/learn/`.
3. **Phase 4 prescribes the TDD itinerary** (red → green → refactor). The durable part is the gate: all green, no weakened assertions, the coverage matrix (normal / boundary / error / regression). As models improve, the loop should read as a default, not a mandate.
4. **Plans should restate done-criteria explicitly.** Phase 2 approval is an intent gate — keep it. But tentative models stop early mid-phase; a plan-level "done" line (tests green + review recorded + book synced + index rebuilt) is the article's persistence fix at feature granularity.
5. **No standing re-audit rule.** Scaffolding ages with model capability. Adopt the article's closing move as a periodic task: whenever the agent's model generation changes, have the current model audit AGENTS.md, guidelines, and skills against these principles.

## Calibration note

The article's claim is not "remove gates" but "remove gates justified by distrust of the model; keep gates justified by human intent". Record-never-fix (review integrity) and scope discipline are pure intent gates — they survive capable models. Phase 2 approval sat on the fence: design direction is a human concern, but a blanket pre-implementation stop also punishes capable models with premature halts; the 2026-09-14 decision (ADR-003) keeps the full design output and stops only on real gaps.
