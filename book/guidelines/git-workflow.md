---
description: Clean Commit message format and Clean Flow branch, PR, and merge rules for solo and team development
---

# Git workflow

This repository follows [Clean Commit](https://github.com/wgtechlabs/clean-commit) and [Clean Flow](https://github.com/wgtechlabs/clean-flow): commit history stays readable, and `main` only ever receives code that already integrated stably on `dev`. Both specs ship as documentation only — this repository enforces them with its own zero-dependency tooling (`scripts/check-commit-message.mjs`, `.githooks/`, and `.github/workflows/git-policy.yml`).

## The whole flow in one picture

```text
Big feature: feature/* work branch ── local acceptance ──> dev ── PR + merge commit ──> main
Small fix:   direct commit ─────────────────────────────────────> dev
```

| Branch | Purpose | Allowed sources |
|--------|---------|-----------------|
| `main` | Stable, releasable code | Merge commits from `dev` only |
| `dev` | The solo-developer integration branch | Verified small fixes, docs, low-risk iterations commit directly; big features merge in when done |
| Work branches | Independent big features or cross-cutting changes | Cut from the latest `dev` |

Never commit or push directly to `main`. Solo development optimizes for speed: small, focused, locally verified fixes and docs may land on `dev` directly. Every independent big feature still starts from a work branch, so unfinished capability never leaks into `dev`.

PRs are for reviews that deserve their own record: multi-person collaboration, and every `dev → main` release. A solo big feature may squash-merge into `dev` after local acceptance without a PR; a high-risk change can still open one deliberately.

## Branch naming

Short, lowercase, hyphenated:

```text
feature/watchlist-alerts
fix/calendar-timezone
docs/deployment-guide
chore/update-dependencies
test/flow-classifier
refactor/provider-client
```

## Clean Commit format

Every non-merge commit subject uses one of these forms. The rule applies to new commits from the moment this standard lands; existing history is never rewritten.

```text
<emoji> <type>: <description>
<emoji> <type> (<scope>): <description>
<emoji> <type>!: <description>
<emoji> <type>! (<scope>): <description>
```

| Emoji | Type | Use for |
|:---:|---|---|
| 📦 | `new` | New features, files, or capabilities |
| 🔧 | `update` | Changes, fixes, refactors, improvements to existing code |
| 🗑️ | `remove` | Deleting code, files, features, or dependencies |
| 🔒 | `security` | Security fixes and vulnerability patches |
| ⚙️ | `setup` | Config, CI/CD, tooling, build system |
| ☕ | `chore` | Maintenance, dependency updates, cleanup |
| 🧪 | `test` | Adding, updating, or fixing tests |
| 📖 | `docs` | Documentation changes |
| 🚀 | `release` | Version releases and release preparation |

Rules: type and scope are lowercase; scope is optional and short; the description is present tense, doesn't end with a period, and stays under 72 characters. The breaking marker `!` goes right after the type and only on `new`, `update`, `remove`, and `security`.

```text
📦 new (alerts): add signal threshold rules
🔧 update (api): improve error handling
🧪 test: add flow classifier coverage
📖 docs: describe deployment process
🚀 release: promote dev to main
```

The repo script validates format, type, scope, breaking markers, trailing periods, and length; present tense stays a judgment call at review.

## Solo agile development

### Small fixes and fast iterations

Keep them single-purpose, quickly verifiable, free of migrations, irreversible data operations, or wide refactors. After local checks pass, commit straight to `dev`:

```bash
git checkout dev
git pull --ff-only origin dev
# change, test
node scripts/check-commit-message.mjs "🔧 update (hot): handle empty option data"
git commit -am "🔧 update (hot): handle empty option data"
git push origin dev
```

### Independent big features

Start from a work branch. Local acceptance is enough for a solo feature — squash-merge into `dev`, then push:

```bash
# 1. from the latest dev
git checkout dev
git pull --ff-only origin dev

# 2. cut a work branch
git checkout -b feature/watchlist-alerts

# 3. validate a subject before committing
node scripts/check-commit-message.mjs "📦 new (alerts): add signal threshold rules"
git add <files>
git commit -m "📦 new (alerts): add signal threshold rules"

# 4. sync with dev before merging back
git fetch origin
git rebase origin/dev
git checkout dev
git merge --squash feature/watchlist-alerts
git commit -m "📦 new (alerts): add signal threshold rules"
git push origin dev
```

When several people build the same feature, open the PR from `feature/watchlist-alerts` into `dev` and **Squash and merge** after checks; the squash subject uses Clean Commit too. Delete the work branch after merging.

When `dev` is stable, open the `dev → main` PR and choose **Create a merge commit** to preserve the integration boundary. The merge-commit subject is Clean Commit as well, e.g.:

```text
🚀 release: promote dev to main
```

## Automation and platform settings

- PRs into `dev`/`main` and pushes to them are checked by `.github/workflows/git-policy.yml` for branch direction and commit subjects; direct pushes to `dev` still pass Clean Commit validation.
- Run `git config core.hooksPath .githooks` once per clone to get the same `commit-msg` check locally.
- Protect `main` on GitHub: require a PR from `dev`, status checks, and merge commits. Keep direct pushes to `dev` allowed for solo speed; team PRs still use squash merges.

On private repos whose plan lacks the branch-protection API, CI and the local hook already enforce the policy in-repo; enable the platform settings as soon as the repo is public or the plan supports them.
