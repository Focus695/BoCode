#!/usr/bin/env node
/**
 * Validates commit subjects against the Clean Commit format.
 * See book/guidelines/git-workflow.md for the full standard.
 *
 * Usage:
 *   node scripts/check-commit-message.mjs "<subject>"     # one subject
 *   ... | node scripts/check-commit-message.mjs           # subjects on stdin
 * Exit 0 = all valid; exit 1 = any invalid.
 */
const allowedTypes = new Map([
  ["📦", "new"],
  ["🔧", "update"],
  ["🗑️", "remove"],
  ["🔒", "security"],
  ["⚙️", "setup"],
  ["☕", "chore"],
  ["🧪", "test"],
  ["📖", "docs"],
  ["🚀", "release"],
]);

const breakingTypes = new Set(["new", "update", "remove", "security"]);
const subjectPattern = /^(?<emoji>📦|🔧|🗑️|🔒|⚙️|☕|🧪|📖|🚀) (?<type>[a-z]+)(?<breaking>!)?(?: \((?<scope>[a-z0-9][a-z0-9-]*)\))?: (?<description>.+)$/u;

function validateSubject(subject) {
  const match = subjectPattern.exec(subject);
  if (!match?.groups) {
    return "must match '<emoji> <type>: <description>' (scope and ! are optional)";
  }

  const { emoji, type, breaking, description } = match.groups;
  if (allowedTypes.get(emoji) !== type) {
    return `must use the matching Clean Commit emoji for type '${type}'`;
  }
  if (breaking && !breakingTypes.has(type)) {
    return `type '${type}' cannot use the breaking-change marker !`;
  }
  if (description.endsWith(".")) {
    return "description must not end with a period";
  }
  if (Array.from(description).length >= 72) {
    return "description must be under 72 characters";
  }

  return null;
}

const argumentSubjects = process.argv.slice(2);
const input = argumentSubjects.length > 0
  ? argumentSubjects.join("\n")
  : await new Promise((resolve, reject) => {
      let data = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (chunk) => { data += chunk; });
      process.stdin.on("end", () => resolve(data));
      process.stdin.on("error", reject);
    });

const subjects = input.split(/\r?\n/).filter(Boolean);
if (subjects.length === 0) {
  console.error("No commit subject supplied.");
  process.exit(1);
}

const invalidSubjects = subjects
  .map((subject) => ({ subject, error: validateSubject(subject) }))
  .filter(({ error }) => error);

if (invalidSubjects.length > 0) {
  for (const { subject, error } of invalidSubjects) {
    console.error(`Invalid commit subject: ${subject}\n  ${error}`);
  }
  console.error("See book/guidelines/git-workflow.md for valid examples.");
  process.exit(1);
}

console.log(`Validated ${subjects.length} Clean Commit subject${subjects.length === 1 ? "" : "s"}.`);
