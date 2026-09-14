#!/usr/bin/env node
/**
 * Guards the template boundary (ADR-004): this repository ships the BoCode
 * template, not an adopting project's working records. The book's
 * running-record directories must hold nothing but their READMEs.
 *
 * Usage:   cd code && node tools/check-template-clean.mjs
 *          (or: npm run book:release-check)
 *
 * Guarded: book/changelogs, book/notes/{learn,summary,issue,task}, book/plans.
 * This repo's own knowledge work lands in book/docs/decisions/ ADRs instead.
 * Adopters do not copy this script — see ADOPT.md step 4.
 * Zero dependencies; runs on plain Node (and bun).
 */
import { readdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const TOOLS_DIR = dirname(fileURLToPath(import.meta.url));
const BOOK_ROOT = join(TOOLS_DIR, "..", "..", "book");

const GUARDED_DIRS = [
  "changelogs",
  "notes/learn",
  "notes/summary",
  "notes/issue",
  "notes/task",
  "plans",
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const violations = [];

for (const rel of GUARDED_DIRS) {
  const base = join(BOOK_ROOT, rel);
  let files;
  try {
    files = walk(base);
  } catch {
    continue; // directory absent — nothing to guard
  }
  for (const file of files) {
    if (relative(base, file) === "README.md") continue;
    violations.push(`book/${relative(BOOK_ROOT, file)}`);
  }
}

if (violations.length > 0) {
  console.error(`Instance working records in the template tree (${violations.length}) — ADR-004 keeps this repository to template content:`);
  for (const v of violations) console.error(`  - ${v}`);
  console.error("Distill the entry into an ADR (book/docs/decisions/) or move it out of the repository, then rerun. The dev→main release stays blocked until this check is green.");
  process.exit(1);
}

console.log("Template tree clean — guarded directories hold READMEs only (ADR-004).");
