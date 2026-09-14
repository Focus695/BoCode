---
description: Workflow calibrated to capable-model guidance — safe-by-default permissions, input pointers, gap-based Phase 2, gate-not-recipe Phase 4, plan done-criteria, and a model-change re-audit rule
---

# 2026-09-14 — capable-model workflow calibration

Applied the audit against OpenAI's "Rethinking skills and prompts for GPT-6 Astra" (`notes/learn/2026-09/gpt6-astra-scaffold-audit.md`); decisions recorded in ADR-003:

- AGENTS.md — new "Safe by default" section (local commands pre-approved); the before-coding rule routes by pointer instead of blanket-reading; the Phase 2 hard constraint becomes gap-based stopping
- `guidelines/workflow.md` — Phase 2 stops only on real gaps; Phase 4 states the gate as mandatory and red-green-refactor as the default loop; new interaction rule 8 re-audits scaffolding when the agent's model generation changes
- `guidelines/README.md` — input pointer table: which guideline to read for which kind of task
- `plans/README.md` — plan template gains a done-criteria slot (the explicit finish line)
- The structured-feature-implementation skill's Phase 4 was split the same way; its Phase 2 had already moved to gap-based stopping
