#!/usr/bin/env node
// bocode-upgrade.test.mjs — selftest for the template-sync gate (ADR-012).
//
//   node code/tools/bocode-upgrade.test.mjs     (or: cd code && npm run bocode:selftest)
//
// Builds a fake upstream (two commits) and fake adopters in a temp dir, then
// drives bocode-upgrade / bocode-doctor through every disposition state. No
// network: everything runs against the local fixture via --repo / --remote.
// Adopters can rerun this after an upgrade to prove the tool still gates.

import { execSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TOOL = path.join(HERE, "bocode-upgrade.mjs");
const DOCTOR = path.join(HERE, "bocode-doctor.mjs");

const q = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
const GIT_ID = `-c user.email=dev@test -c user.name=dev`;

let failures = 0;
const ok = (cond, label) => {
  console.log(`${cond ? "ok  " : "FAIL"} ${label}`);
  if (!cond) failures++;
};

const run = (script, args, cwd) =>
  spawnSync("node", [script, ...args], { cwd, encoding: "utf8" });

const sh = (cmd) => execSync(cmd, { stdio: "pipe" }).toString();

function write(root, rel, content) {
  const full = path.join(root, rel);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, content);
}

function gitInit(dir) {
  sh(`git init -q ${q(dir)}`);
}

function commitAll(repo, msg) {
  sh(`git -C ${q(repo)} add -A && git -C ${q(repo)} ${GIT_ID} commit -q -m ${q(msg)}`);
}

function checkoutTree(repo, sha, dest) {
  const tar = execSync(`git -C ${q(repo)} archive ${sha}`, { maxBuffer: 64 * 1024 * 1024 });
  const res = spawnSync("tar", ["-x", "-C", dest], { input: tar });
  if (res.status !== 0) throw new Error("tar extract failed");
}

// ---------- fixture: the fake upstream ----------

const tmp = mkdtempSync(path.join(os.tmpdir(), "bocode-selftest-"));
const upstream = path.join(tmp, "upstream");

gitInit(upstream);
write(upstream, "UPGRADE.md", "upgrade v1\n");
write(upstream, "AGENTS.md", "agents v1\n");
write(upstream, "book/guidelines/workflow.md", "workflow v1\n");
write(upstream, "book/guidelines/writing-style.md", "style v1\n");
write(upstream, "book/guidelines/review-checklist.md", "review v1\n");
write(upstream, "book/notes/README.md", "notes readme v1\n");
write(upstream, "skills/README.md", "skills readme v1\n");
write(upstream, "skills/bocode/SKILL.md", "bocode v1\n");
write(upstream, "skills/bowrite/SKILL.md", "bowrite v1\n");
write(upstream, "skills/book-writeback/SKILL.md", "writeback v1\n");
write(upstream, "skills/boscope/SKILL.md", "boscope v1\n");
write(upstream, "code/tools/gen-book-index.mjs", "console.log('index ok');\n");
write(upstream, "code/tools/bocode-upgrade.mjs", "upgrade tool stub v1\n"); // so doctor's presence check passes
write(upstream, "code/tools/bocode-doctor.mjs", "doctor stub v1\n");
write(upstream, "code/package.json", JSON.stringify({
  name: "bocode",
  scripts: { "book:index": "node tools/gen-book-index.mjs" },
}, null, 2) + "\n");
write(upstream, "scripts/check-commit-message.mjs", "commit check v1\n");
commitAll(upstream, "v1");
const STAMP = sh(`git -C ${q(upstream)} rev-parse HEAD`).trim();

// v2: modify pristine + diverged + skills, add the reference (the ADR-011
// regression shape), delete a guideline, extend package scripts, touch
// project-owned AGENTS.md (must be ignored).
write(upstream, "book/guidelines/workflow.md", "workflow v2\n");
write(upstream, "book/guidelines/writing-style.md", "style v2\n");
write(upstream, "book/notes/README.md", "notes readme v2\n");
write(upstream, "skills/boscope/SKILL.md", "boscope v2\n");
write(upstream, "skills/boscope/references/automation-tools.md", "automation v2\n");
write(upstream, "code/package.json", JSON.stringify({
  name: "bocode",
  scripts: {
    "book:index": "node tools/gen-book-index.mjs",
    "bocode:doctor": "node tools/bocode-doctor.mjs",
  },
}, null, 2) + "\n");
write(upstream, "scripts/check-commit-message.mjs", "commit check v2\n");
write(upstream, "AGENTS.md", "agents v2\n");
rmSync(path.join(upstream, "book/guidelines/review-checklist.md"));
commitAll(upstream, "v2");
const HEAD = sh(`git -C ${q(upstream)} rev-parse HEAD`).trim();

// ---------- fixture: the adopter (installed at v1, one file diverged) ----------

const adopter = path.join(tmp, "adopter");
gitInit(adopter);
checkoutTree(upstream, STAMP, adopter);
// project-owned state: diverge one template file, keep the project's name
write(adopter, "book/guidelines/writing-style.md", "style v1 + local edit\n");
{
  const pkgPath = path.join(adopter, "code/package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.name = "myproject";
  pkg.scripts["custom:thing"] = "echo hi";
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}
writeFileSync(path.join(adopter, ".bocode-version"), STAMP + "\n");
// the agent's skills directory, installed at v1 (boscope will be stale after sync)
const skillsDir = path.join(tmp, "agent-skills");
mkdirSync(skillsDir, { recursive: true });
for (const s of ["bocode", "bowrite", "book-writeback", "boscope"]) {
  execSync(`cp -r ${q(path.join(adopter, "skills", s))} ${q(skillsDir)}`);
}
// the index stub reports itself; the report lands in the adopter's changelogs
write(adopter, "book/changelogs/README.md", "changelogs readme v1\n");

try {
  // 1. --check before any sync: every disposition, exit 1
  {
    const r = run(TOOL, ["--check", "--repo", upstream], adopter);
    const out = r.stdout + r.stderr;
    ok(r.status === 1, "check before sync exits 1");
    ok(out.includes("stale") && out.includes("book/guidelines/workflow.md"), "check lists stale workflow.md");
    ok(out.includes("new-file") && out.includes("automation-tools.md"), "check lists the new reference file (ADR-011 shape)");
    ok(out.includes("stale-delete") && out.includes("review-checklist.md"), "check lists stale-delete review-checklist.md");
    ok(out.includes("pkg-stale") && out.includes("code/package.json"), "check lists pkg-stale package.json");
    ok(out.includes("merged") && out.includes("writing-style.md"), "check lists merged writing-style.md");
    ok(!out.includes("AGENTS.md"), "project-owned AGENTS.md never appears");
  }

  // 2. --verify before sync: exit 1
  ok(run(TOOL, ["--verify", "--repo", upstream], adopter).status === 1, "verify before sync exits 1");

  // 3. --apply with --skills-dir: green, stamp moved, report written
  {
    const r = run(TOOL, ["--apply", "--repo", upstream, "--skills-dir", skillsDir], adopter);
    const out = r.stdout + r.stderr;
    ok(r.status === 0, `apply exits 0 (${out.split("\n").filter(Boolean).slice(0, 3).join(" | ")})`);
    ok(readFileSync(path.join(adopter, "book/guidelines/workflow.md"), "utf8") === "workflow v2\n", "stale workflow.md auto-copied");
    ok(existsSync(path.join(adopter, "skills/boscope/references/automation-tools.md")), "new reference file installed");
    ok(!existsSync(path.join(adopter, "book/guidelines/review-checklist.md")), "stale-delete removed the guideline");
    ok(readFileSync(path.join(adopter, "book/guidelines/writing-style.md"), "utf8") === "style v1 + local edit\n", "merged file left untouched");
    ok(readFileSync(path.join(adopter, "AGENTS.md"), "utf8") === "agents v1\n", "project-owned AGENTS.md untouched");
    ok(readFileSync(path.join(adopter, "scripts/check-commit-message.mjs"), "utf8") === "commit check v2\n", "optional adopted file refreshed");
    const pkg = JSON.parse(readFileSync(path.join(adopter, "code/package.json"), "utf8"));
    ok(pkg.name === "myproject", "package.json name preserved");
    ok(pkg.scripts["custom:thing"] === "echo hi", "local-only script entry preserved");
    ok(pkg.scripts["bocode:doctor"] === "node tools/bocode-doctor.mjs", "upstream script entry merged in");
    ok(readFileSync(path.join(adopter, ".bocode-version"), "utf8").trim() === HEAD, "stamp advanced to upstream HEAD");
    const now = new Date();
    const monthDir = path.join(adopter, "book/changelogs", `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    const reports = existsSync(monthDir) ? readdirSync(monthDir).filter((f) => f.startsWith("bocode-sync-")) : [];
    ok(reports.length === 1, "exactly one sync report written under book/changelogs/YYYY-MM");
    ok(reports.length === 1 && readFileSync(path.join(monthDir, reports[0]), "utf8").startsWith("---\ndescription: BoCode template sync"), "report carries frontmatter description");
    ok(readFileSync(path.join(adopter, "skills/boscope/SKILL.md"), "utf8") === "boscope v2\n", "repo skill refreshed");
    ok(readFileSync(path.join(skillsDir, "boscope/SKILL.md"), "utf8") === "boscope v2\n", "agent skills directory re-installed");
  }

  // 4. idempotency: a second apply is a green no-op
  {
    const r = run(TOOL, ["--apply", "--repo", upstream, "--skills-dir", skillsDir], adopter);
    ok(r.status === 0 && (r.stdout + r.stderr).includes("Up to date"), "second apply is a green no-op");
  }

  // 5. --verify after sync: green
  ok(run(TOOL, ["--verify", "--repo", upstream, "--skills-dir", skillsDir], adopter).status === 0, "verify after sync exits 0");

  // 6. missing template file: fails verify, passes with an explicit --keep
  {
    const adopter2 = path.join(tmp, "adopter2");
    gitInit(adopter2);
    checkoutTree(upstream, HEAD, adopter2);
    writeFileSync(path.join(adopter2, ".bocode-version"), STAMP + "\n");
    rmSync(path.join(adopter2, "book/notes/README.md"));
    ok(run(TOOL, ["--verify", "--repo", upstream], adopter2).status === 1, "missing template file fails verify");
    const r = run(TOOL, ["--verify", "--repo", upstream, "--keep", "book/notes/README.md"], adopter2);
    ok(r.status === 0, "explicit --keep records the removal and passes");
  }

  // 7. skills gate: stale skills directory fails verify even with a synced repo
  {
    writeFileSync(path.join(skillsDir, "boscope/SKILL.md"), "boscope v1\n");
    const r = run(TOOL, ["--verify", "--repo", upstream, "--skills-dir", skillsDir], adopter);
    ok(r.status === 1 && (r.stdout + r.stderr).includes("skills/boscope"), "stale agent skills fail verify");
    run(TOOL, ["--apply", "--repo", upstream, "--skills-dir", skillsDir], adopter); // restore
  }

  // 8. diverged-delete: a locally modified file on a path upstream deleted
  {
    const adopter3 = path.join(tmp, "adopter3");
    gitInit(adopter3);
    checkoutTree(upstream, HEAD, adopter3);
    writeFileSync(path.join(adopter3, ".bocode-version"), STAMP + "\n");
    write(adopter3, "book/guidelines/review-checklist.md", "review v1 + local edit\n");
    ok(run(TOOL, ["--verify", "--repo", upstream], adopter3).status === 1, "diverged-delete fails verify");
    ok(run(TOOL, ["--verify", "--repo", upstream, "--keep", "book/guidelines/review-checklist.md"], adopter3).status === 0, "--keep records the kept file and passes");
  }

  // 9. doctor: behind / current / stale skills, --remote against the local fixture
  {
    writeFileSync(path.join(adopter, ".bocode-version"), STAMP + "\n"); // temporarily behind
    const behind = run(DOCTOR, ["--remote", upstream, "--strict"], adopter);
    ok(behind.status === 1 && (behind.stdout + behind.stderr).includes("behind upstream"), "doctor strict exits 1 when behind");
    writeFileSync(path.join(adopter, ".bocode-version"), HEAD + "\n");
    writeFileSync(path.join(skillsDir, "bocode/SKILL.md"), "bocode v0\n"); // stale skill
    const stale = run(DOCTOR, ["--remote", upstream, "--skills-dir", skillsDir, "--strict"], adopter);
    ok(stale.status === 1 && (stale.stdout + stale.stderr).includes("skills/bocode"), "doctor flags stale skills");
    run(TOOL, ["--apply", "--repo", upstream, "--skills-dir", skillsDir], adopter); // restore skills
    const clean = run(DOCTOR, ["--remote", upstream, "--skills-dir", skillsDir], adopter);
    ok(clean.status === 0 && (clean.stdout + clean.stderr).includes("doctor: clean"), "doctor clean when current");
  }

  // 10. no stamp: refuses with the fallback pointer
  {
    const adopter4 = path.join(tmp, "adopter4");
    gitInit(adopter4);
    write(adopter4, "README.md", "a project\n");
    const r = run(TOOL, ["--check", "--repo", upstream], adopter4);
    ok(r.status === 1 && (r.stdout + r.stderr).includes("Fallback"), "stamp-less project is pointed at the fallback");
  }

  console.log(failures === 0 ? "\nselftest: all green" : `\nselftest: ${failures} failure(s)`);
  process.exit(failures === 0 ? 0 : 1);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
