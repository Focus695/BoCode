---
description: The eight code-review checks every change must pass — findings are recorded, never fixed in passing
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
- [ ] Changes outside the approved scope

## Principle

**Record, never fix.** Findings go on the list and wait for the next round or a separate task. Fixing in passing breaks the gate — the review no longer reviews what was built.
