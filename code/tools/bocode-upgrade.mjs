#!/usr/bin/env node
// bocode-upgrade.mjs — the template-sync gate for adopting projects (ADR-012).
//
//   node code/tools/bocode-upgrade.mjs --check    list every template-owned delta and its disposition
//   node code/tools/bocode-upgrade.mjs --apply    copy pristine/new files, merge script entries, verify
//   node code/tools/bocode-upgrade.mjs --verify   the gate: exit 0 only when fully synced
//
//   --repo <path>      use a local BoCode clone (default: full clone of --remote into a temp dir)
//   --remote <url>     upstream URL (default https://github.com/Focus695/BoCode, or $BOCODE_REMOTE)
//   --skills-dir <dir> agent skills directory; --apply re-installs the four skills, --verify checks them
//   --stamp <sha>      set the baseline by hand (stamp-less pre-2026-11-05 adoptions)
//   --keep <path>      declare a template path consciously kept local (passes verify, lands in the report)
//
// MANIFEST below is the single source of truth for template-vs-project ownership.
// UPGRADE.md restates it for humans; scripts/check-release-changelog.mjs imports releaseSignal.

import { execSync, spawnSync } from "node:child_process";
import {
  cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_REMOTE = process.env.BOCODE_REMOTE || "https://github.com/Focus695/BoCode";

export const SKILL_DIRS = ["bocode", "boscope", "book-writeback", "bowrite"];

export const MANIFEST = {
  // What an upgrade may refresh in an adopting project. Everything else is
  // project-owned and never touched. UPGRADE.md's table restates this list.
  upgradeOwned: {
    files: [
      "UPGRADE.md",
      "book/guidelines/README.md",
      "book/guidelines/workflow.md",
      "book/guidelines/task-tiers.md",
      "book/guidelines/writing-style.md",
      "book/guidelines/git-workflow.md",
      "book/guidelines/review-checklist.md",
      "book/docs/README.md",
      "book/docs/architecture/README.md",
      "book/docs/api/README.md",
      "book/docs/decisions/README.md",
      "book/notes/README.md",
      "book/plans/README.md",
      "book/changelogs/README.md",
      "skills/README.md",
      "code/package.json", // special: only the scripts block merges; name and the rest stay
    ],
    trees: [
      "skills/bocode",
      "skills/boscope",
      "skills/book-writeback",
      "skills/bowrite",
      "code/tools",
    ],
    // Template-owned only where the adopter kept them (ADOPT.md optional steps).
    optional: [
      "scripts/check-commit-message.mjs",
      "scripts/check-release-changelog.mjs",
      ".githooks",
      ".github/workflows/git-policy.yml",
    ],
  },
  // Template-repo paths whose change owes a CHANGELOG.md entry (ADR-007).
  // Wider than upgradeOwned on purpose: the template's own front matter is
  // release signal too, even though adopters own their copies of it.
  releaseSignal: [
    "AGENTS.md", "ADOPT.md", "UPGRADE.md",
    "README.md", "README.zh-CN.md", "README.ja.md",
    "book/guidelines/", "book/docs/decisions/",
    "skills/", "code/tools/", "code/package.json",
    "scripts/", ".githooks/", ".github/workflows/",
  ],
};

// ---------- small helpers ----------

const q = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
const bufEq = (a, b) => Buffer.compare(a, b) === 0;

function gitStr(repo, args) {
  return execSync(`git -C ${q(repo)} ${args}`, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();
}

function gitBuf(repo, args) {
  return execSync(`git -C ${q(repo)} ${args}`, { encoding: "buffer", maxBuffer: 64 * 1024 * 1024 });
}

function parseArgs(argv) {
  const flags = { keep: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--check" || a === "--apply" || a === "--verify") flags.mode = a.slice(2);
    else if (a === "--repo") flags.repo = argv[++i];
    else if (a === "--remote") flags.remote = argv[++i];
    else if (a === "--skills-dir") flags.skillsDir = argv[++i];
    else if (a === "--stamp") flags.stamp = argv[++i];
    else if (a === "--keep") flags.keep.push(argv[++i]);
    else { console.error(`Unknown argument: ${a}`); usage(2); }
  }
  if (!flags.mode) usage(2);
  return flags;
}

function usage(code) {
  console.error("Usage: bocode-upgrade.mjs --check|--apply|--verify [--repo <path>] [--remote <url>]");
  console.error("                    [--skills-dir <dir>] [--stamp <sha>] [--keep <path>] [--keep <path> ...]");
  process.exit(code);
}

// The adopting project's root. Git first (adopters are repos); fall back to
// this script's location (code/tools/ -> root two levels up).
export function adopterRoot() {
  try {
    return execSync("git rev-parse --show-toplevel", { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch {
    return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
  }
}

function readStamp(root) {
  const file = path.join(root, ".bocode-version");
  if (!existsSync(file)) return null;
  const sha = readFileSync(file, "utf8").trim();
  return /^[0-9a-f]{40}$/.test(sha) ? sha : null;
}

// ---------- ownership + classification ----------

function ownership(p, root) {
  const up = MANIFEST.upgradeOwned;
  if (up.files.includes(p)) return p === "code/package.json" ? "package" : "template";
  for (const t of up.trees) if (p === t || p.startsWith(t + "/")) return "template";
  for (const o of up.optional) {
    if (p === o || p.startsWith(o + "/")) return existsSync(path.join(root, p)) ? "template" : "none";
  }
  return "none";
}

function changedEntries(repo, stamp, head) {
  const out = gitStr(repo, `diff --name-status --no-renames ${stamp} ${head}`);
  return out
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const tab = line.indexOf("\t");
      return { status: line.slice(0, tab), path: line.slice(tab + 1) };
    });
}

// Dispositions:
//   applied          local file already matches upstream HEAD
//   stale            local matches the old stamp version — safe to auto-copy
//   merged           local, stamp, and HEAD all differ — a conscious merge already happened
//   new-file         added upstream, absent locally — safe to auto-copy
//   stale-delete     deleted upstream, local still the old version — safe to delete
//   diverged-delete  deleted upstream, local modified — human decides (delete or move aside)
//   missing          modified upstream, adopter deleted it — restore, or --keep to record the removal
//   pkg-stale        code/package.json misses upstream script entries — merge keys only
//   kept             covered by an explicit --keep — recorded, never copied
function classify(entry, repo, stamp, head, root, keeps) {
  const p = entry.path;
  const localPath = path.join(root, p);
  const hasLocal = existsSync(localPath);

  if (entry.status === "A") {
    const headBuf = gitBuf(repo, `show ${head}:${p}`);
    if (!hasLocal) return { path: p, state: "new-file", headBuf };
    return bufEq(readFileSync(localPath), headBuf)
      ? { path: p, state: "applied" }
      : { path: p, state: "merged" }; // created independently on both sides
  }
  if (entry.status === "D") {
    if (!hasLocal) return { path: p, state: "applied" };
    if (keeps.includes(p)) return { path: p, state: "kept" };
    const stampBuf = gitBuf(repo, `show ${stamp}:${p}`);
    return bufEq(readFileSync(localPath), stampBuf)
      ? { path: p, state: "stale-delete" }
      : { path: p, state: "diverged-delete" };
  }
  // modified upstream
  if (p === "code/package.json") return classifyPackage(repo, head, root);
  if (!hasLocal) return keeps.includes(p) ? { path: p, state: "kept" } : { path: p, state: "missing" };
  const headBuf = gitBuf(repo, `show ${head}:${p}`);
  if (bufEq(readFileSync(localPath), headBuf)) return { path: p, state: "applied" };
  const stampBuf = gitBuf(repo, `show ${stamp}:${p}`);
  if (bufEq(readFileSync(localPath), stampBuf)) return { path: p, state: "stale", headBuf };
  return { path: p, state: "merged" };
}

function classifyPackage(repo, head, root) {
  const parseOrQuit = (text, what) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(`${what} is not valid JSON: ${e.message}`);
      process.exit(1);
    }
  };
  const upPkg = parseOrQuit(gitBuf(repo, `show ${head}:code/package.json`).toString("utf8"), "upstream code/package.json");
  const localPath = path.join(root, "code/package.json");
  const local = existsSync(localPath)
    ? parseOrQuit(readFileSync(localPath, "utf8"), `${localPath} (fix the JSON, or delete the file and rerun to regenerate the scripts block)`)
    : { scripts: {} };
  const upScripts = upPkg.scripts || {};
  const missing = Object.entries(upScripts).filter(([k, v]) => (local.scripts || {})[k] !== v).map(([k]) => k);
  return {
    path: "code/package.json",
    state: missing.length ? "pkg-stale" : "applied",
    missing,
    upScripts,
  };
}

// ---------- apply / verify ----------

function applyItems(items, root) {
  const actions = [];
  for (const it of items) {
    const localPath = path.join(root, it.path);
    if (it.state === "stale" || it.state === "new-file") {
      mkdirSync(path.dirname(localPath), { recursive: true });
      writeFileSync(localPath, it.headBuf);
      actions.push(`copied    ${it.path}`);
    } else if (it.state === "stale-delete") {
      rmSync(localPath);
      actions.push(`deleted   ${it.path}`);
    } else if (it.state === "pkg-stale") {
      const local = JSON.parse(readFileSync(localPath, "utf8"));
      local.scripts = { ...(local.scripts || {}), ...it.upScripts };
      writeFileSync(localPath, JSON.stringify(local, null, 2) + "\n");
      actions.push(`merged scripts: ${it.missing.join(", ")}`);
    }
  }
  return actions;
}

const FAILING_STATES = ["stale", "new-file", "missing", "diverged-delete", "pkg-stale"];

function verify(items, skillsStates) {
  const failures = items
    .filter((it) => FAILING_STATES.includes(it.state))
    .map((it) => `  ${it.state.padEnd(15)} ${it.path}${it.state === "pkg-stale" ? ` (missing: ${it.missing.join(", ")})` : ""}`);
  if (skillsStates) {
    for (const [name, state] of Object.entries(skillsStates)) {
      if (state === "stale" || state === "missing") {
        failures.push(`  ${("skill-" + state).padEnd(15)} skills/${name} → ${state} in the agent skills directory`);
      }
    }
  }
  return failures;
}

// ---------- skills ----------

function walkFiles(dir, base = dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walkFiles(full, base, out);
    else out.push(path.relative(base, full));
  }
  return out.sort();
}

function treeEq(a, b) {
  const filesA = walkFiles(a);
  const filesB = walkFiles(b);
  if (filesA.length !== filesB.length || filesA.some((f, i) => f !== filesB[i])) return false;
  return filesA.every((f) => bufEq(readFileSync(path.join(a, f)), readFileSync(path.join(b, f))));
}

export function skillsStates(root, skillsDir) {
  const states = {};
  for (const s of SKILL_DIRS) {
    const src = path.join(root, "skills", s);
    if (!existsSync(src)) { states[s] = "no-source"; continue; }
    const dst = path.join(skillsDir, s);
    if (!existsSync(dst)) { states[s] = "missing"; continue; }
    states[s] = treeEq(src, dst) ? "current" : "stale";
  }
  return states;
}

function installSkills(root, skillsDir) {
  mkdirSync(skillsDir, { recursive: true });
  for (const s of SKILL_DIRS) {
    const src = path.join(root, "skills", s);
    if (!existsSync(src)) continue;
    const dst = path.join(skillsDir, s);
    // A mistyped --skills-dir must not delete unrelated same-named directories:
    // only ever replace a directory that already looks like the skill.
    if (existsSync(dst) && !existsSync(path.join(dst, "SKILL.md"))) {
      console.error(`Refusing to overwrite ${dst}: it exists but holds no SKILL.md — that is not the skill directory.`);
      console.error("Check --skills-dir; if the stray directory is yours, delete or rename it by hand, then rerun.");
      process.exit(1);
    }
    rmSync(dst, { recursive: true, force: true });
    cpSync(src, dst, { recursive: true });
  }
}

// ---------- report + index ----------

function writeReport(root, fromSha, toSha, items, skillsNote) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const dir = path.join(root, "book", "changelogs", `${yyyy}-${mm}`);
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `bocode-sync-${yyyy}-${mm}-${dd}-${toSha.slice(0, 7)}.md`);
  const rows = items.length
    ? items.map((it) => `| ${it.state} | \`${it.path}\` |`).join("\n")
    : "| (none — only the stamp moved) | |";
  const body = `---
description: BoCode template sync ${fromSha.slice(0, 7)} → ${toSha.slice(0, 7)} on ${yyyy}-${mm}-${dd} — per-file dispositions, verify green, ${skillsNote}
---

# BoCode sync ${yyyy}-${mm}-${dd}

- Baseline: \`${fromSha.slice(0, 7)}\` → \`${toSha.slice(0, 7)}\` (commit SHAs, ADR-007)
- Verify: green (every template-owned delta applied, merged, or consciously kept)
- Skills: ${skillsNote}

| Disposition | Path |
|-------------|------|
${rows}

Generated by \`code/tools/bocode-upgrade.mjs --apply\` — regenerate the index after editing.
`;
  writeFileSync(file, body);
  return file;
}

function runIndex(root) {
  const script = path.join(root, "code", "tools", "gen-book-index.mjs");
  if (!existsSync(script)) return { ok: true, note: "gen-book-index.mjs not installed — index step skipped" };
  const res = spawnSync("node", [script], { cwd: path.join(root, "code"), encoding: "utf8" });
  if (res.status !== 0) {
    return { ok: false, note: (res.stdout || "") + (res.stderr || "") };
  }
  return { ok: true, note: res.stdout || "" };
}

// ---------- main ----------

function main() {
const flags = parseArgs(process.argv.slice(2));
const root = adopterRoot();
const remote = flags.remote || DEFAULT_REMOTE;

let tmpDir = null;
let repo = flags.repo;
if (!repo) {
  tmpDir = mkdtempSync(path.join(os.tmpdir(), "bocode-upgrade-"));
  console.error(`Cloning ${remote} (full clone — the stamp must be reachable, ADR-007)...`);
  try {
    execSync(`git clone --quiet ${q(remote)} ${q(tmpDir)}`, { stdio: "pipe" });
  } catch {
    console.error(`Clone failed. Point --repo at a local BoCode clone, or check network access to ${remote}.`);
    rmSync(tmpDir, { recursive: true, force: true });
    process.exit(1);
  }
  repo = tmpDir;
}

try {
  const head = gitStr(repo, "rev-parse HEAD");
  const stamp = flags.stamp || readStamp(root);
  if (!stamp) {
    console.error("No valid .bocode-version stamp and no --stamp given.");
    console.error("Adopted before 2026-11-05? See UPGRADE.md → \"Fallback: no stamp\".");
    process.exit(1);
  }

  const doSkills = () => (flags.skillsDir ? skillsStates(root, flags.skillsDir) : null);
  const printSkills = (states) => {
    if (!states) return;
    for (const [name, state] of Object.entries(states)) console.log(`  skills/${name}: ${state}`);
  };

  if (stamp === head) {
    console.log(`Up to date: .bocode-version == upstream HEAD (${head.slice(0, 7)}). Nothing to do.`);
    if (flags.skillsDir) {
      const states = doSkills();
      printSkills(states);
      if (Object.values(states).some((s) => s === "stale" || s === "missing")) {
        if (flags.mode === "apply") {
          installSkills(root, flags.skillsDir);
          console.log("Skills re-installed into the agent skills directory.");
        } else {
          console.error("Skills are stale — rerun with --apply (or copy the four skills by hand).");
          process.exit(1);
        }
      }
    }
    process.exit(0);
  }

  const entries = changedEntries(repo, stamp, head).filter((e) => ownership(e.path, root) !== "none");
  const items = entries.map((e) => classify(e, repo, stamp, head, root, flags.keep));

  if (flags.mode === "check") {
    console.log(`Baseline ${stamp.slice(0, 7)} → upstream HEAD ${head.slice(0, 7)}; ${items.length} template-owned change(s):`);
    for (const it of items) {
      console.log(`  ${it.state.padEnd(15)} ${it.path}`);
    }
    printSkills(doSkills());
    const failures = verify(items, doSkills());
    if (failures.length) {
      console.error(`\nNot fully synced (${failures.length} outstanding):`);
      failures.forEach((f) => console.error(f));
      process.exit(1);
    }
    console.log("\nFully synced — every delta applied, merged, or consciously kept.");
    process.exit(0);
  }

  if (flags.mode === "apply") {
    const actions = applyItems(items, root);
    if (flags.skillsDir) installSkills(root, flags.skillsDir);
    actions.forEach((a) => console.log(a));

    // Recompute from disk: the gate trusts the tree, not the plan.
    const items2 = entries.map((e) => classify(e, repo, stamp, head, root, flags.keep));
    const failures = verify(items2, doSkills());
    if (failures.length) {
      console.error(`\nVerify NOT green (${failures.length} outstanding) — stamp left unchanged:`);
      failures.forEach((f) => console.error(f));
      console.error("Merge the flagged files (keep your edits, take the template's changes), rerun --apply.");
      process.exit(1);
    }

    writeFileSync(path.join(root, ".bocode-version"), head + "\n");
    const report = writeReport(root, stamp, head, items2, flags.skillsDir ? "re-installed via --skills-dir" : "not checked (no --skills-dir given)");
    console.log(`Verify green. Stamp → ${head.slice(0, 7)}. Report: ${path.relative(root, report)}`);

    const index = runIndex(root);
    if (!index.ok) {
      console.error(`Index regeneration failed:\n${index.note}`);
      process.exit(1);
    }
    if (index.note) console.log(index.note.trim());
    process.exit(0);
  }

  // --verify
  {
    const failures = verify(items, doSkills());
    printSkills(doSkills());
    if (failures.length) {
      console.error(`Verify failed (${failures.length} outstanding):`);
      failures.forEach((f) => console.error(f));
      console.error("A sync is done when this exits 0 — never when an agent says so.");
      process.exit(1);
    }
    console.log(`Verify green against upstream HEAD ${head.slice(0, 7)}.`);
    process.exit(0);
  }
} finally {
  if (tmpDir) rmSync(tmpDir, { recursive: true, force: true });
}
}

// Run only when invoked directly — bocode-doctor.mjs imports this module for
// MANIFEST / SKILL_DIRS / skillsStates and must not trigger an upgrade.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
