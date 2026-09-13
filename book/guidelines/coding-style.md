---
description: Template for your project's coding baseline — the language-specific rules any contributor or agent must follow
---

# Coding style

> **This file is a template — replace it in your project.** It holds the coding baseline a reviewer can check against a diff. Anything that needs a tool to verify (formatting, lint) should be wired into a script or CI, and only referenced here.

## Sections to fill

- **Language & toolchain** — versions, runtime, package manager; what counts as "the standard way to run this project"
- **Naming** — files, types, functions, variables, constants; the project's one convention per kind
- **Formatting & lint** — the tool, the command, and that CI fails when it's dirty
- **Error handling** — how errors are raised, wrapped, and surfaced; what never gets swallowed
- **Testing conventions** — where tests live, how they're named, what must be covered before a change counts as done
- **Dependencies** — the policy for adding one (and the default answer: don't, unless it removes more code than it adds)

## Rule of thumb

One rule per line, each checkable in review. Prefer "we always X" over paragraphs of rationale — the *why* goes into `docs/decisions/` as an ADR when it's interesting, and stays out of the way when it's not.
