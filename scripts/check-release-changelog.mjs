#!/usr/bin/env node
// check-release-changelog.mjs — release gate for CHANGELOG.md (ADR-007).
//
//   node scripts/check-release-changelog.mjs <base-ref> <head-ref>
//
// Fails when the base...head diff touches template-owned content but
// CHANGELOG.md is not part of the diff. Template-owned = what adopting
// projects install (guidelines, skills, tooling, agent entry points).
// The list mirrors the ownership table in UPGRADE.md — keep them in sync.

import { execSync } from "node:child_process";

const TEMPLATE_PREFIXES = [
  "AGENTS.md",
  "ADOPT.md",
  "UPGRADE.md",
  "book/guidelines/",
  "book/docs/decisions/",
  "skills/",
  "code/tools/",
  "code/package.json",
  "scripts/",
  ".githooks/",
  ".github/workflows/",
];

const CHANGELOG = "CHANGELOG.md";

const [base, head] = process.argv.slice(2);
if (!base || !head) {
  console.error("Usage: node scripts/check-release-changelog.mjs <base-ref> <head-ref>");
  process.exit(1);
}

const diff = execSync(`git diff --name-only ${base}...${head}`, { encoding: "utf8" });
const changed = diff.split("\n").filter(Boolean);
const templateChanges = changed.filter((f) =>
  TEMPLATE_PREFIXES.some((p) => f === p || f.startsWith(p)),
);

if (templateChanges.length === 0) {
  console.log("No template-owned changes in range; CHANGELOG.md not required.");
  process.exit(0);
}

if (changed.includes(CHANGELOG)) {
  console.log(`CHANGELOG.md updated alongside ${templateChanges.length} template-owned change(s). Gate passed.`);
  process.exit(0);
}

console.error("Release gate failed (ADR-007): template-owned content changed without a CHANGELOG.md update:");
for (const f of templateChanges) console.error(`  ${f}`);
console.error("Adopters learn about template changes only through CHANGELOG.md — add an entry and rerun.");
process.exit(1);
