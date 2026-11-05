---
description: task and issue entries archive by flipping a frontmatter status and regenerating the index — files never move, the index regroups with open entries first
---

# ADR-010: Archive by status flip, not by moving files

## Status

Accepted — 2026-11-06. Ships as status parsing, validation, and grouped listing in `code/tools/gen-book-index.mjs`, plus the status convention and templates in `book/notes/README.md`.

## Context

Task and issue entries accumulate, and a reader opening the folders cannot tell handled from unhandled. The obvious fix is an archive folder files move into when done — but the book doubles as an Obsidian vault: retrieval runs through `book/README.md`, frontmatter, and relative links, and moving files breaks inbound links. Month folders (`YYYY-MM/`) are physical grouping only; the book's own rule is retrieval through the index, never through directory nesting.

## Decision

- Archive is a field, not a location. `notes/task/` entries carry `status: open|done`, `notes/issue/` entries `status: open|resolved`; handling an entry means flipping the field and rerunning `npm run book:index`.
- The index is the archive view: `gen-book-index.mjs` lists open entries first and handled entries after, so unhandled work is visible from `book/README.md` without opening folders.
- The build enforces the vocabulary the same way it enforces `description`: missing or unknown status in task/issue warns and exits 1.

## Consequences

- Zero link breakage: files never move after creation
- Open work is one glance away in the index; Obsidian users can also filter by the `status` property directly
- Adopters with existing task/issue entries must add a `status` line to each on upgrade (the CHANGELOG entry says so)
- The vocabulary is fixed at two states per type; a richer lifecycle (wontfix, blocked) means a new ADR, not a silent script edit
