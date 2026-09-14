<p align="center">
  <img src=".github/assets/banner.svg" alt="BoCode — humans steer, agents build, the book remembers" width="720">
</p>

<p align="center">
  <b>English</b> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a>
</p>

<p align="center">
  <a href="https://github.com/Focus695/BoCode/actions/workflows/git-policy.yml"><img src="https://github.com/Focus695/BoCode/actions/workflows/git-policy.yml/badge.svg" alt="Git Policy"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/Focus695/BoCode/generate"><img src="https://img.shields.io/badge/use_this-template-2ea44f.svg" alt="Use this template"></a>
</p>

**Humans steer, agents build, the book remembers.**

BoCode gives a repository two halves — `code/` for the source, `book/` for the documentation stream and knowledge base — wired together in both directions. It is built for the way software is written now: a human and AI coding agents together. Agents are fast and have memory now — but that memory serves the agent alone: unreadable to humans, unmanageable. Where a project's knowledge lives, and who can read it, decides whether speed comes with control or without it.

## Adopt it in one line

Already have a project? Paste this to your AI agent:

```text
Read https://github.com/Focus695/BoCode — start with ADOPT.md — and retrofit this project onto the BoCode workflow exactly as it prescribes.
```

Starting from scratch? Jump straight to the [Quick Start](#quick-start).

Clone it, run one script, install four skills, and your project gains: a gated development workflow, a self-indexing knowledge base, a write-back discipline that turns every feature into accumulated experience, and a git policy that keeps history readable.

---

## Why BoCode exists

### The problem

Three failures show up in almost every project built with AI agents:

1. **Memory serves the agent alone.** Agents have memory now, but it's a black box: humans can't read it, let alone manage it. What shipped, what bit us, what's waiting to be fixed — all invisible. The faster the agent moves, the less control the human holds. What's missing isn't memory; it's one shared, readable place: recent summaries, known pitfalls, the open fix list, the project's guidelines. Agents work from it; humans steer by it.
2. **Documentation rots.** Written once at the start, updated never. Because updating it pays off later and skipping it pays off now, it always gets skipped. Eventually nobody trusts it — a stale document doesn't deserve trust.
3. **Humans lose the wheel.** An agent will implement what you asked plus twelve things you didn't. Speed without gates means scope drifts, decisions go unrecorded, and the project's "why" evaporates.

Each failure points at the same root: knowledge and control need a place to live that isn't chat history or someone's memory.

### Two halves

BoCode's answer is structural. A project has two halves:

- **`code/`** is the executable truth — it answers *"how does it work right now?"*
- **`book/`** is the navigable truth — it answers *"why does it work this way, what did we decide, and what have we learned?"*

Neither is optional. Code without a book is write-only: it runs, but nobody — human or agent — can cheaply find out why it's shaped the way it is. A book without code is a diary. The two live side by side at the top level, forever visible, so neither can be quietly forgotten.

### The flywheel

The halves drive each other:

```
                 book/  (knowledge base + driving force)
               ┌─────────────────────────────────────┐
               │  plans/      → drives implementation │
               │  guidelines/ → provides the baseline │
               │  learn/      → provides experience   │
               │  issue/      → provides direction    │
               │  decisions/  → provides context      │
               └──────────────┬──────────────────────┘
                              │ drives
                              ▼
                          code/
                              │ produces
                              ▼
               ┌─────────────────────────────────────┐
               │  summary/    ← feature reports       │
               │  learn/      ← new experience        │
               │  issue/      ← new problems found    │
               │  changelogs/ ← change records        │
               │  plans/      ← completion status     │
               └─────────────────────────────────────┘
```

**book → code:** before implementation, the agent reads the plan (the construction blueprint), the guidelines (the baseline), the relevant learn entries (accumulated experience), and the open issues (known landmines).

**code → book:** when the work is done, the wrap-up writes back — a summary a human can read without opening the diff, learn entries the next session will search, issues for problems found but deliberately not fixed, a changelog entry, and a regenerated index.

This is the flywheel: every cycle leaves the book more complete than it found it, so every session — human or agent, today or in a year — starts from everything learned so far. **The more complete the book, the more it's worth to everyone who touches the project next.** Development compounds instead of resetting.

---

## The method

BoCode's rules are carried by four skills, each invoked independently:

| Skill | Chinese name | Owns | Triggers |
|-------|--------------|------|----------|
| `bocode` | 薄码 | The structure map and session discipline | Session start; where documents go |
| `boscope` | 薄界 | The six gated phases — scope it thin, gate it hard | "Implement / add / change X" |
| `book-writeback` | 返写 | Write-back templates and quality gates | Feature wrap-up; summary / learn / issue |
| `bowrite` | 薄写 | Write thin and well — fewer words, same core | Writing or revising any document |

The sections below state the rules; the skills are their enforcement layer.

### boscope（薄界）— gates, not brakes

Every feature runs a six-phase workflow with hard gates (the rules live in `book/guidelines/workflow.md`):

| Phase | Output | Gate |
|-------|--------|------|
| Step 0 — requirements brief | background, scope, exclusions, requirement | Every slot filled |
| 1 — Analysis | impact map + risk list | No code changed |
| 2 — Design | data flow, files, interfaces | **User approval required** |
| 3 — Implementation | the code | Nothing outside the approved scope |
| 4 — Testing | tests, written first | All green, no weakened assertions |
| 5 — Review | findings list | Recorded, never fixed |
| 6 — Wrap-up | summary, learn, issues, changelog, index | Recorded, never fixed |

The exclusions list is Step 0's crux: an empty "does not affect" list is the number-one cause of out-of-scope changes in Phase 3.

The design intent: agents compress implementation to minutes, which moves the bottleneck to decisions and scope. The gates hold exactly there — Step 0 fills in what the request didn't say, Phase 2 is where a person approves direction, and Phases 5–6 enforce the separation of observing and fixing. **A problem found at review becomes a recorded issue; fixing it is separate work.** That is what keeps the review honest.

### Write for the reader

Book documents are routed by audience, not by kind of artifact (`book/notes/`):

| Type | Written for | Shape |
|------|-------------|-------|
| `summary/` | Humans first | A report: background → what was done → why → outcome |
| `learn/` | Humans + agents | A searchable knowledge entry with tags — including symptom tags like "timeout" |
| `issue/` | Humans + agents | Problem + reproduction + suggested direction |
| `task/` | Task tracking | A checklist |

A summary that requires reading the diff isn't a summary. A learn entry whose title doesn't answer the question won't be found by the next session. The templates in `book/notes/README.md` encode the quality bar, and the `book-writeback` skill carries them at wrap-up.

### The index contract

Documentation you can't find doesn't exist. BoCode makes discoverability a build check:

- Every book document starts with a frontmatter `description` — one plain-language line about the *content*, not the genre.
- `code/tools/gen-book-index.mjs` (zero dependencies, plain Node) regenerates `book/README.md` — the master index of every document, grouped by directory.
- A document missing its description makes the build **fail** (exit 1). Zero warnings is the only passing state.
- Internal links must resolve — a broken link fails the build. The book doubles as an Obsidian vault; a broken link is a build bug.

`book/README.md` doubles as the entry point: agents read it first to get the map; the folder also opens directly as an [Obsidian](https://obsidian.md) vault — index, tags, backlinks, and graph all work (see FAQ).

### bowrite（薄写）— speak human

Documentation is read for years and written in minutes, so the style rule is strict and short (`book/guidelines/writing-style.md`): write like a specific person in a specific situation — professional is fine, templated is not. Thin: fewer words, same core — cut words, not information. Well: natural, direct, no strained cleverness, facts locked — numbers, commands, names, and responsibility attribution never move. bowrite distills [shuorenhua](https://github.com/MrGeDiao/shuorenhua) by MrGeDiao, plus the pattern ledger accumulated in this project's own reviews.

### Clean git flow

The git history is part of the book (`book/guidelines/git-workflow.md`). Every non-merge commit follows the [Clean Commit](https://github.com/wgtechlabs/clean-commit) format — `📦 new (index): add book index generator` — and branching follows the [Clean Flow](https://github.com/wgtechlabs/clean-flow) model (`work → dev → main`). The specs themselves ship no tooling; BoCode closes that gap with a zero-dependency validator running locally (`.githooks/`) and in CI (`.github/workflows/git-policy.yml`). Branching in practice: `dev` is the solo-developer integration branch where small verified fixes land directly; big features cut work branches; `main` only ever receives merge commits from `dev`.

### Built with itself, shipped clean

BoCode is its own first user: the foundation went through a structured requirements brief, an approved design plan, phased implementation with per-step verification, and a Clean Commit history — the whole story is readable in the git log. The template you receive is clean: no dated records, no leftover plans — an empty book waiting for yours. One example ships on purpose: [ADR-001](book/docs/decisions/ADR-001-adopt-bocode.md), the decision to run on this workflow — the first decision your project will re-affirm.

---

## Quick start

```bash
# 1. Create your repo from this template (GitHub "Use this template")
#    or clone it:
git clone <your-fork-url> myproject && cd myproject

# 2. Turn the template into your project (name, description, clean records):
bash scripts/init-project.sh myproject "What it does, in one line"

# 3. Install the four skills for your AI agent:
cp -r skills/bocode skills/boscope skills/book-writeback skills/bowrite <your-skills-dir>/
#    (ZCode: ~/.zcode/skills/ · Claude Code: ~/.claude/skills/ — see skills/README.md)

# 4. Point your agent at AGENTS.md — most tools read it automatically.
#    Then build something. The skills will drive the workflow.
```

Requirements: `bash` and `node` for the two scripts. No packages, no install step, no lockfile — the tooling is deliberately boring.

## Repository tour

| Path | What it is |
|------|------------|
| `AGENTS.md` | The entry point for AI agents — structure, rules, hard constraints |
| `book/guidelines/` | The rulebook: workflow, writing style, git, review |
| `book/README.md` | The master index (generated — start here) |
| `book/plans/` | Implementation blueprints |
| `book/notes/{summary,learn,task,issue}/` | The four note types |
| `book/docs/{architecture,api,decisions}/` | Snapshots, contracts, ADRs |
| `skills/` | `bocode`, `boscope`, `book-writeback`, `bowrite` |
| `code/tools/gen-book-index.mjs` | The index generator |
| `scripts/init-project.sh` | Template → your project |
| `scripts/check-commit-message.mjs` | Clean Commit validator (+ `.githooks/`) |

## FAQ

**I have an existing project. Can I adopt BoCode?**
Yes — hand [ADOPT.md](ADOPT.md) to your AI agent. It's a step-by-step retrofit playbook written for agents: inventory, book skeleton, layout decision, doc migration, tooling, skills, and the first writeback. The manual path also works: copy `book/`, `skills/`, `scripts/`, `.githooks/`, `AGENTS.md`, and `code/tools/` in, merge your existing docs into the book, and run the index generator.

**Does it lock me into a language or stack?**
No. The book is Markdown; the two scripts are plain Node with zero dependencies. Your `code/` can hold anything — the template's own `code/` contains only the tooling.

**Which AI tools does it work with?**
Anything that reads `AGENTS.md` as its instruction file and supports the `SKILL.md` format (ZCode, Claude Code, and compatible agents). The workflow degrades gracefully without skills: the guidelines carry the same rules in prose.

**Does the book work in Obsidian or other PKM tools?**
Yes, with zero setup. The book is plain Markdown — relative links, YAML frontmatter (`description`, `tags`), no proprietary formats. Open `book/` as an Obsidian vault and the index, tag pane, backlinks, and graph all work. The build also validates links — a broken link fails the build — so what you open is always a navigable web. Not Obsidian-locked either: Logseq, Foam, VS Code, anything that reads Markdown works.

**What if I don't regenerate the index?**
Nothing breaks at runtime — but a stale index erodes the discoverability the whole system rests on, which is why the check makes missing descriptions fail loudly.

**Why `YYYY-MM/` folders instead of per-feature folders?**
Months are stable, low-maintenance physical grouping. Features are found through the index, frontmatter, and links — not through directory nesting that fragments every multi-month effort.

## Credits

BoCode's git discipline builds on two open standards by WGTech Labs — [Clean Commit](https://github.com/wgtechlabs/clean-commit) (commit message format) and [Clean Flow](https://github.com/wgtechlabs/clean-flow) (branching model) — and adds the enforcement tooling both specs describe but don't ship. The plain-language writing standard draws on [shuorenhua](https://github.com/MrGeDiao/shuorenhua) by MrGeDiao, distilled into the `bowrite` skill.

## License

[MIT](LICENSE)
