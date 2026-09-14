---
description: How to write an ADR here — sections, naming, numbering, and when a decision needs a record
---

# Decisions (ADR)

An architecture decision record answers the question future readers — humans and agents — will ask: why is it like this.

## When to write one

- A choice that's expensive to reverse
- A choice a reasonable person could have made differently
- A boundary rule in `guidelines/architecture.md` being added or changed

## Format

| Section | Content |
|---------|---------|
| Status | Proposed / Accepted / Superseded by ADR-NNN |
| Context | The forces at play when the decision was made — constraints, alternatives considered |
| Decision | What was chosen, in one or two sentences |
| Consequences | What gets better, what gets harder, what we accepted |

## Naming

`ADR-NNN-<short-slug>.md`, numbering monotonically up, never reused. A decision that reverses an earlier ADR gets a new number and flips the old one to "Superseded by ADR-NNN".

See [ADR-001](ADR-001-adopt-bocode.md) for a worked example.
