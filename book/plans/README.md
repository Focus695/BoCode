---
description: Plans directory usage — implementation plans land here after Phase 2 approval, with naming and the plan template
---

# Plans

Implementation plans live here. Each feature's detailed plan lands in this folder once its Phase 2 design is approved — the plan is the construction blueprint the agent builds from.

## Naming

`YYYY-MM-DD-<feature-name>.md`

## Template

```markdown
---
description: <one plain-language line about the content>
status: draft | approved | in_progress | completed
---

# <feature> — plan

## Requirements brief
<the essentials from Step 0 — background, scope, exclusions>

## Impact range
<Phase 1 output: files, modules, data flows affected>

## Design
<Phase 2 output: data flow, file list, interfaces>

## Build order
1. <step, each with its verification>
2. ...

## Test plan
<Phase 4 coverage dimensions>
```

A plan is executable as written: each step small enough to verify on its own. When the build finishes, flip `status` to `completed` — the plan then doubles as the record of what was intended, next to the summary of what happened.
