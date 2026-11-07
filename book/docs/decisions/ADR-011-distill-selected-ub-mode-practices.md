---
description: Selected ub-mode practices supplement project rules for modeling, calculations, testing, defects, terminology, and optional automation
---

# ADR-011: Distill selected ub-mode practices

## Status

Accepted — 2026-11-06. Ships with the template.

## Context

Robert C. Martin's [ub-mode](https://github.com/unclebob/ub-mode) provides engineering instructions for agents. Its [skill](https://github.com/unclebob/ub-mode/blob/master/SKILL.md) informs the modeling, calculation, testing, defect, terminology, and automation guidance selected here. We adapt those practices to BoCode's scope and document rules.

BoCode already covers small changes, first-principles design, test-first iteration, regression, data ownership, and knowledge writeback. Importing the whole skill would repeat those rules and introduce conflicting process requirements. Short instructions can make modeling, calculation boundaries, test assertions, and defect investigation more concrete. Easily confused business concepts need shared definitions. Worked samples can help develop automation tools, but this specific task should not add checks to ordinary feature work.

## Decision

The ub-mode-derived practices below are supplementary and apply only where useful within the current task. The user's requirements and the project's workflow, task tiers, architecture, and coding conventions take precedence; skip or adapt any conflicting practice. These practices add no phase, approval gate, or required review item. Keep automation guidance in an optional reference, with one task-specific reading pointer in boscope. Keep the current phases, skills, and eleven-item review checklist.

- **Defects:** Phase 1 establishes the cause from reproduction or checkable failure evidence. Where reproduction is unavailable, separate facts from hypotheses and specify verification. If two fixes sharing a premise fail the same verification, state and recheck that premise before another attempt. Phase 4 checks the original failure and regression; hiding an error alone is insufficient.
- **Modeling and calculations:** where practical, Phase 2 represents valid state combinations in types or data structures, and Phase 3 keeps business calculations as pure functions with explicit inputs and outputs, separate from external reads and writes. Existing scope rules still prohibit unrelated abstractions or refactors.
- **Tests:** Phase 4 checks observable results and required side effects through the caller's interface, without tying tests to private call sequences.
- **Complexity:** use the existing complexity review to consider complex conditions, deep nesting, and repeated branches when relevant. Reuse configured lint/static-analysis checks where available; adopting projects choose thresholds and warning or blocking policy. Scores identify candidates for review, not automatic refactoring. No measurement suite is required.
- **Automation tools (optional):** `skills/boscope/references/automation-tools.md` describes worked samples for batch or repetitive tasks. Use a sample when processing rules, expected results, or batch effects need confirmation; existing tools and established rules may already provide enough evidence. The agent can produce it from the requirements, clarifying unresolved business rules. It need not be a test or file. Retained regression cases follow the owning tests' conventions. Ordinary tasks do not load this reference or evaluate an automation checklist item.
- **Domain terms:** when concepts need clarification or terms are used inconsistently, maintain concise meanings, code names, and distinctions in the existing architecture document. Use existing definitions across docs, interfaces, and code; split the glossary only when it grows. This does not authorize unrelated renames.

Context-management and action-log requirements are excluded by user choice. Boundary-only validation is not introduced; existing input, authorization, and business checks remain necessary. Existing data-ownership rules stay as they are. Companion metrics tools, fixed thresholds, worktree cleanup, and upstream commit/push instructions remain outside this change. Phase 5/6 still record findings without fixing them.

## Consequences

- Defect repairs have evidence to review; terminology has a shared definition when needed; tool-development tasks can consult the sample method without burdening the general workflow.
- No new skill, sample directory, mandatory glossary file, or tool dependency is introduced. Complexity review adds no mandatory Python runtime, custom analyzer, or fixed score threshold. New tooling remains within the designed scope.
- The glossary guidance lives in the skill as well as the architecture template: adopters own their architecture documents, so upgrades offer this addition for manual incorporation rather than overwriting project content.
- The existing eleven-item review checklist is unchanged. The skills README and root changelog explain that boscope's reference is copied with its entry point, and list the optional architecture-template addition. This template's own records remain ADRs, per [ADR-004](ADR-004-template-free-of-instance-records.md).
- Verification exposed an existing portability issue: on a Windows CRLF checkout, the index generator misreads descriptions and emits backslash paths. Rebuild with the unchanged generator on an LF copy under Linux; fixing the generator is separate work.
