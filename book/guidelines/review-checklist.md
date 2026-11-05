---
description: The eleven code-review checks every M/L change must pass — findings are recorded, never fixed in passing
---

# Code review checklist

## Required checks

- [ ] Duplicated code
- [ ] Authorization / permission holes
- [ ] Race conditions
- [ ] Transaction boundaries
- [ ] Missed notifications (where the design calls for one)
- [ ] Missed boundaries (input ranges / empty values / extremes)
- [ ] Complexity added
- [ ] Parts that trace to no requirement (delete before optimize)
- [ ] Experience seams treated as design (defaults, empty states, error messages)
- [ ] Changes outside the approved scope
- [ ] Task tier too low (the change meets a higher tier's criteria in `task-tiers.md`) — record an issue, never backfill

## Principle

**Record, never fix.** Findings go on the list and wait for the next round or a separate task. Fixing in passing breaks the gate — the review no longer reviews what was built.
