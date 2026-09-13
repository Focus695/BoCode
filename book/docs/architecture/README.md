---
description: Architecture snapshots — dated documents describing the current state of modules and data flow
---

# Architecture snapshots

Each snapshot describes how the system actually looks at a point in time: processes, modules, data flow, deployment shape. The long-term rules live in `guidelines/architecture.md`; this directory holds what is true today.

## Conventions

- One document per process, module, or cross-cutting concern; for a dated view, name it `YYYY-MM-DD-<topic>.md`
- A snapshot superseded by a newer one gets a `superseded by <link>` line at the top — never delete history silently
- Every snapshot starts with a one-paragraph orientation: what runs where, and what talks to what
