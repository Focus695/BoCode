# Skills

Four self-contained skills implement the BoCode workflow for AI agents. Each is a single `SKILL.md` in the standard format (frontmatter with `name` and `description`, then the body) — no code, no dependencies.

| Skill | Does | Triggers |
|-------|------|----------|
| `bocode` | The structure map and the session discipline — read before coding, write back after | Session start in a BoCode repo; questions about where documents go or how the index works |
| `feature-flow` | Step-0 requirements brief + six hard-gated phases for feature development | "Implement / add / support / change X" with a sparse request |
| `book-writeback` | Templates and quality gates for writing back to the book | Feature wrap-up; "write a summary / learn entry / issue" |
| `bowrite` | The writing skill（薄写）: write documents thin and well — fewer words, same core, natural voice | Writing or revising any document; drafts that smell templated, translated, or strained |

Division of labor: **skills say when and how** (executable behavior for the agent); **`book/guidelines/` says what and why** (reference for humans). They reference each other and never duplicate rules.

## Installation

Copy the four skill directories into your agent's skills folder:

- **ZCode**: `~/.zcode/skills/` (user-wide) or `<project>/.zcode/skills/` (per project)
- **Claude Code**: `~/.claude/skills/` or `<project>/.claude/skills/`
- **Other SKILL.md-compatible agents**: the skills directory your tool documents

```bash
cp -r skills/bocode skills/feature-flow skills/book-writeback skills/bowrite <your-skills-dir>/
```

`bowrite` distills [shuorenhua](https://github.com/MrGeDiao/shuorenhua) (MIT, by MrGeDiao) together with patterns accumulated in this project's own reviews; for deep Chinese cleanups the upstream skill goes further and is worth installing alongside.
