---
description: Sessions open with a doctor staleness check; syncs stay consent-gated — ask by default, auto only for the conflict-free --ff-only subset and only via explicit project opt-in; skills paths are declared, never guessed
---

# ADR-013: Consent-gated automatic sync

## Status

Accepted — 2026-11-07. Self-tested in `code/tools/bocode-upgrade.test.mjs` (ff-only refusal leaves the tree untouched; config-driven skills re-install; malformed config degrades with warnings).

## Context

ADR-012 made syncs verifiable but left them initiated by humans or by an agent that happened to be told. The wish: when the BoCode workflow triggers in an adopting project, detect staleness automatically and update without anyone asking. Three forces shape the answer:

- **Safety by construction** — `--apply` already only replaces files that still match the stamp byte-for-byte, so local edits cannot be lost; but `merged` / `diverged-delete` / `missing` states need a human judgment no automation can supply.
- **Humans steer** — a sync that silently rewrites the workflow an agent is *currently* running is scope drift at best; the user's in-progress task outranks template freshness.
- **The chicken-and-egg** — automation lives in the tooling and skill text; an adopter gets it only after one manual bootstrap sync (ADR-012), and a skill re-installed mid-session takes effect next session.

## Decision

- **Detection is automatic, read-only, and cheap**: the `bocode` skill's session-start step runs `bocode:doctor -- --strict` (one `git ls-remote`); offline degrades silently to "unknown".
- **Syncs are consent-gated.** `.bocode.json` (optional, project-owned, never touched by syncs) sets `autoSync`: `"ask"` (default) — the agent offers, the user decides; `"auto"` — the agent applies only the conflict-free subset, via a new hard gate.
- **`--apply --ff-only`** refuses *before touching anything* when any changed template-owned file is `merged`, `diverged-delete`, or `missing` — automation can never land half a sync. Everything else (stale copies, new files, safe deletions, script merges) proceeds and verifies as usual.
- **Skills paths are declared, not guessed**: `skillsDir` (relative or `~/`) or `skillsTool` (`zcode`, `claude`) in `.bocode.json`; an explicit `--skills-dir` flag always wins. Unknown values warn and fall back — a broken config never breaks the workflow.
- **Timing**: syncs happen at session start, never mid-task; the skill contract says so explicitly.

Rejected: fully automatic syncs including merges (impossible by principle — merges are a keep-whose choice); auto-detecting the agent's skills directory by probing the filesystem (wrong-machine guesses are worse than one declared line); caching the upstream check (one ls-remote per session is cheap; add a cache only if it ever measurably annoys).

## Consequences

- A conflict-free upgrade now lands with zero human effort on opted-in projects; every other case degrades to a one-question ask with the disposition list attached
- The consent model lives in three aligned places: the tool flag (hard gate), the skill contract (behavior), `.bocode.json` (policy) — the exit code stays the only completion proof (ADR-012 unchanged)
- Adopters who skip `.bocode.json` keep ADR-012 behavior exactly; the file is per-project and portable (`skillsTool` over absolute paths)
- A skill re-installed by an auto-sync affects the *next* session — the current one keeps its loaded text; tools and documents take effect immediately
