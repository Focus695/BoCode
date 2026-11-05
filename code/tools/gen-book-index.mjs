#!/usr/bin/env node
/**
 * Scans every Markdown file under book/ and regenerates book/README.md,
 * the master index of the whole book.
 *
 * Usage:   cd code && node tools/gen-book-index.mjs
 *          (or: npm run book:index)
 *
 * Conventions:
 *   1. Every document starts with frontmatter whose `description` is a
 *      one-line, plain-language summary. Missing → warning, exit 1.
 *   2. Internal links must resolve. Broken relative links → warning, exit 1 —
 *      the book doubles as an Obsidian vault, so a broken link is a build bug.
 *   3. Entries under notes/task/ and notes/issue/ carry a frontmatter
 *      `status` — `open|done` (task) or `open|resolved` (issue). Missing or
 *      unknown → warning, exit 1. The index lists open entries first, so
 *      flipping the field and rerunning is the archive step (ADR-010).
 * Zero dependencies; runs on plain Node (and bun).
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TOOLS_DIR = dirname(fileURLToPath(import.meta.url));
const CODE_ROOT = join(TOOLS_DIR, "..");
const BOOK_ROOT = join(CODE_ROOT, "..", "book");
const OUTPUT = join(BOOK_ROOT, "README.md");

function projectName() {
  try {
    const pkg = JSON.parse(readFileSync(join(CODE_ROOT, "package.json"), "utf8"));
    if (pkg.name) return pkg.name;
  } catch {
    // no package.json or no name — fall through to the default
  }
  return "this project";
}

const NAME = projectName();

const DIR_PURPOSE = {
  changelogs: "Change log: what landed and when",
  docs: "Technical docs: architecture, API, decisions",
  "docs/api": "API design and interface docs",
  "docs/architecture": "Architecture snapshots: modules, data flow",
  "docs/decisions": "Architecture decision records (ADR)",
  guidelines: "Development rules every contributor (including AI) must follow",
  notes: "Running records: learn / summary / task / issue",
  "notes/learn": "Experience and lessons; read before coding",
  "notes/summary": "Feature reports, written for humans",
  "notes/task": "Task tracking and breakdowns (status: open|done)",
  "notes/issue": "Potential problems — recorded, never auto-fixed (status: open|resolved)",
  plans: "Implementation plans: the construction blueprint agents build from",
};

// Sections whose entries carry a frontmatter `status` and are grouped by it in
// the index (open first, handled after) instead of listed per subdirectory —
// the index is the archive view; files never move (ADR-010).
const STATUS_SECTIONS = [
  { root: "notes/task", handled: "done", handledLabel: "Done" },
  { root: "notes/issue", handled: "resolved", handledLabel: "Resolved" },
];

function statusSectionFor(dir) {
  return (
    STATUS_SECTIONS.find(
      (s) => dir === s.root || dir.startsWith(`${s.root}/`)
    ) ?? null
  );
}

function purposeForDir(dir) {
  if (DIR_PURPOSE[dir]) return DIR_PURPOSE[dir];
  const parent = Object.keys(DIR_PURPOSE)
    .filter((key) => key && dir.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];
  return parent ? `Archived under ${parent}/, grouped by month` : "";
}

function walkMd(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMd(full));
    else if (entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

function parseDescription(text) {
  if (!text.startsWith("---")) return null;
  const lines = text.split("\n");
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") return null; // frontmatter ended, not found
    const m = lines[i].match(/^description:\s*(.+)$/);
    if (m) return m[1].trim();
  }
  return null;
}

function parseStatus(text) {
  if (!text.startsWith("---")) return null;
  const lines = text.split("\n");
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") return null; // frontmatter ended, not found
    const m = lines[i].match(/^status:\s*(\S+)\s*$/);
    if (m) return m[1];
  }
  return null;
}

function collectInternalLinks(text) {
  const out = [];
  const re = /(?:\]\(<([^>]+)>\)|\]\(([^)\s]+)\))/g;
  let m;
  while ((m = re.exec(text))) {
    const target = (m[1] || m[2]).split("#")[0];
    if (target && !/^[a-z]+:/.test(target)) out.push(target); // skip http:, mailto:, obsidian:…
  }
  return out;
}

function link(rel) {
  return /[\s()]/.test(rel) ? `<${rel}>` : rel;
}

const files = walkMd(BOOK_ROOT)
  .filter((f) => f !== OUTPUT)
  .sort();

const warnings = [];
const statusWarnings = [];
const brokenLinks = [];
const byDir = new Map();

for (const abs of files) {
  const rel = relative(BOOK_ROOT, abs);
  const dir = dirname(rel) === "." ? "" : dirname(rel);
  const text = readFileSync(abs, "utf8");
  const desc = parseDescription(text);
  if (!desc) warnings.push(rel);
  const section = statusSectionFor(dir);
  let status = null;
  if (section) {
    status = parseStatus(text);
    const allowed = ["open", section.handled];
    if (!status) statusWarnings.push(`${rel} (missing status)`);
    else if (!allowed.includes(status))
      statusWarnings.push(`${rel} (status '${status}', expected ${allowed.join(" | ")})`);
  }
  for (const target of collectInternalLinks(text)) {
    const resolved = resolve(dirname(abs), target);
    if (!existsSync(resolved)) brokenLinks.push(`${rel} → ${target}`);
  }
  const key = section ? section.root : dir;
  if (!byDir.has(key)) byDir.set(key, []);
  byDir.get(key).push({ name: rel.split("/").pop(), rel, desc: desc ?? "(missing description)", status });
}

const dirKeys = [...byDir.keys()].sort((a, b) => a.localeCompare(b, "en"));

let out = "";
out += "---\n";
out += "description: Master index of the book — the map of every document. Regenerate with `cd code && npm run book:index` after any book change\n";
out += "---\n\n";
out += `# book — ${NAME} master index\n\n`;
out += "> Generated by a script — do not edit by hand. After any book change run: `cd code && npm run book:index`.\n";
out += "> Every new file must carry a frontmatter `description` (one plain-language line about the content, not the genre); entries under `notes/task/` and `notes/issue/` also need a `status` (`open|done` / `open|resolved`); the build warns and exits 1 otherwise.\n\n";
out += "## How to use this book\n\n";
out += "- **AI agents**: read this file first for the full map, then follow links to what you need. Before writing any book document, read `guidelines/writing-style.md`.\n";
out += "- **Humans**: browse by the directory table below. Rules live in `guidelines/`, blueprints in `plans/`, experience in `notes/learn/`, architecture in `docs/architecture/`, decisions in `docs/decisions/`.\n";
out += "- **By time**: `changelogs/` and `notes/{summary,learn,issue}/` archive under `YYYY-MM/`; the month is a physical grouping only — do not nest deeper by feature.\n";
out += "- **By status**: entries in `notes/task/` and `notes/issue/` carry a frontmatter `status`; this index lists open entries first — flipping the field and rerunning is the archive step.\n";
out += "- **By feature**: search this index for a feature name, keyword, or frontmatter summary; `notes/learn/` entries are also searchable by their `tags`.\n";
out += "- **Obsidian**: open `book/` directly as a vault. Links are plain relative Markdown; if you move files, rerun the index.\n\n";
out += "## Directory map\n\n";
out += "| Directory | Purpose |\n|------|------|\n";
for (const key of dirKeys) {
  const label = key === "" ? "(root)" : key + "/";
  out += `| \`${label}\` | ${purposeForDir(key)} |\n`;
}
out += "\n## All files\n\n";
for (const key of dirKeys) {
  const label = key === "" ? "root" : key + "/";
  out += `### ${label}\n\n`;
  const section = STATUS_SECTIONS.find((s) => s.root === key);
  if (section) {
    const open = byDir.get(key).filter((f) => f.status === "open");
    const handled = byDir.get(key).filter((f) => f.status !== "open");
    const group = (title, list) => {
      if (list.length === 0) return;
      out += `**${title} (${list.length})**\n\n`;
      for (const f of list) out += `- [${f.name}](${link(f.rel)}) — ${f.desc}\n`;
      out += "\n";
    };
    group("Open", open);
    group(section.handledLabel, handled);
  } else {
    for (const f of byDir.get(key)) {
      out += `- [${f.name}](${link(f.rel)}) — ${f.desc}\n`;
    }
    out += "\n";
  }
}
out += `<!-- ${files.length} documents -->\n`;

writeFileSync(OUTPUT, out);

if (warnings.length > 0 || statusWarnings.length > 0 || brokenLinks.length > 0) {
  if (warnings.length > 0) {
    console.error(`Files missing frontmatter description (${warnings.length}):`);
    for (const w of warnings) console.error(`  - ${w}`);
  }
  if (statusWarnings.length > 0) {
    console.error(`task/issue entries with missing or invalid status (${statusWarnings.length}):`);
    for (const w of statusWarnings) console.error(`  - ${w}`);
  }
  if (brokenLinks.length > 0) {
    console.error(`Broken internal links (${brokenLinks.length}):`);
    for (const l of brokenLinks) console.error(`  - ${l}`);
  }
  console.error(`Index written to ${OUTPUT} (${files.length} documents), but the issues above fail the build. Fix them and rerun.`);
  process.exit(1);
}
console.log(`Index written to ${OUTPUT} — ${files.length} documents, zero warnings, all links resolve.`);
