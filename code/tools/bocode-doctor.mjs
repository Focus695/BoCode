#!/usr/bin/env node
// bocode-doctor.mjs — staleness checkup for adopting projects (ADR-012).
//
//   node code/tools/bocode-doctor.mjs [--skills-dir <dir>] [--remote <url>] [--strict]
//
// Read-only. Checks: the upgrade tool itself, the .bocode-version stamp,
// upstream HEAD (git ls-remote; offline degrades to "unknown"), and — when
// --skills-dir is given — the four skills installed in the agent's directory.
// Default exit 0 with warnings; --strict exits 1 on any actionable finding.

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_REMOTE, adopterRoot, readConfig, skillsStates } from "./bocode-upgrade.mjs";

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--strict") flags.strict = true;
    else if (a === "--skills-dir") flags.skillsDir = argv[++i];
    else if (a === "--remote") flags.remote = argv[++i];
    else { console.error(`Unknown argument: ${a}`); process.exit(2); }
  }
  return flags;
}

const flags = parseArgs(process.argv.slice(2));
const root = adopterRoot();
const remote = flags.remote || DEFAULT_REMOTE;
const cfg = readConfig(root);
const skillsDir = flags.skillsDir || cfg.skillsDir; // explicit flag beats .bocode.json
let hardFail = false;

// 1. the upgrade tool itself (pre-ADR-012 adopters lack it)
const hasTool = existsSync(path.join(root, "code", "tools", "bocode-upgrade.mjs"));
console.log(`${hasTool ? "ok  " : "FAIL"} upgrade tool present`);
if (!hasTool) {
  hardFail = true;
  console.log("     fetch code/tools/bocode-upgrade.mjs (and bocode-doctor.mjs) from the BoCode repository");
}

// 2. the stamp
const stampFile = path.join(root, ".bocode-version");
let stamp = null;
if (!existsSync(stampFile)) {
  console.log("WARN no .bocode-version stamp — adopted before 2026-11-05? see UPGRADE.md → \"Fallback: no stamp\"");
  if (flags.strict) hardFail = true;
} else {
  const raw = readFileSync(stampFile, "utf8").trim();
  if (/^[0-9a-f]{40}$/.test(raw)) {
    stamp = raw;
    console.log(`ok   stamp ${raw.slice(0, 7)}`);
  } else {
    console.log(`FAIL stamp is not a 40-hex commit SHA: "${raw.slice(0, 20)}"`);
    hardFail = true;
  }
}

// 3. upstream HEAD (offline degrades to unknown — never a failure)
if (stamp) {
  try {
    const upstream = execSync(`git ls-remote ${remote} HEAD`, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] })
      .trim().split(/\s+/)[0];
    if (upstream === stamp) {
      console.log("ok   up to date with upstream HEAD");
    } else {
      console.log(`FAIL behind upstream: local ${stamp.slice(0, 7)}, upstream ${upstream.slice(0, 7)}`);
      console.log(`     run: cd code && npm run bocode:upgrade -- --check (autoSync=${cfg.autoSync}${cfg.autoSync === "auto" ? " — the agent may apply the conflict-free sync via --apply --ff-only" : " — ask the user before syncing"})`);
      hardFail = true;
    }
  } catch {
    console.log("WARN upstream unknown (offline) — rerun with network, or diff against a local clone via bocode-upgrade --repo");
  }
}

// 4. skills freshness in the agent's directory
if (skillsDir) {
  const states = skillsStates(root, skillsDir);
  for (const [name, state] of Object.entries(states)) {
    if (state === "current") {
      console.log(`ok   skills/${name} current`);
    } else if (state === "no-source") {
      console.log(`WARN skills/${name} missing in this repo — nothing to install from`);
    } else {
      console.log(`FAIL skills/${name} ${state} in ${skillsDir}`);
      console.log("     run: cd code && npm run bocode:upgrade -- --apply --skills-dir <dir>");
      hardFail = true;
    }
  }
} else {
  console.log("WARN skills not checked — pass --skills-dir <dir>, or set skillsDir / skillsTool in .bocode.json");
}

if (hardFail) {
  console.error(flags.strict ? "\ndoctor: actionable findings (strict)" : "\ndoctor: actionable findings");
  process.exit(flags.strict ? 1 : 0);
}
console.log("\ndoctor: clean");
