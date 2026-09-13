# BoCode

**一个文档驱动代码、代码回写文档的项目模板。**

BoCode 给仓库装上两个半脑——`code/` 放源代码，`book/` 放文档流与知识库——并且双向连接。它面向的是现在软件真实的写法：人和 AI coding agent 一起开发。agent 快，但没有状态；一个项目是复利增长还是每个会话都从零开始，取决于它的知识有没有落在一个耐用的地方。

Clone、跑一条命令、装三个 skill，你的项目就有了：带关卡的六阶段开发流程、自动建索引的知识库、把每个功能变成经验沉淀的回写纪律、保持提交历史可读的 git 规范。

---

## 为什么需要 BoCode

### 问题

用 AI agent 开发的项目几乎都会撞上三件事：

1. **Agent 无状态。** 每个会话从零开始。没写下来的知识会被重新推导、重新提问、重新踩坑——每次都付全价。
2. **文档腐烂。** 立项写一次，之后永不更新。更新文档的收益在将来，跳过的收益在眼前，所以它总是输。最后没人信文档，也确实不该信。
3. **人失去方向盘。** agent 会实现你要求的，外加十二件你没要求的。没有关卡的速度意味着作用域漂移、决策失载、项目的"为什么"蒸发。

三个问题指向同一个根：知识和控制需要住在聊天记录和人脑之外的地方。

### 双半脑

BoCode 的答案是结构性的。一个项目有两半：

- **`code/`** 是可执行的真相——回答"它现在是怎么运作的"
- **`book/`** 是可导航的真相——回答"它为什么这样运作、我们做过什么决定、学到了什么"

缺一不可。没有 book 的 code 是只写的：它能跑，但任何人（人或 agent）都难以低成本地搞清它为什么长这样。没有 code 的 book 是日记。两半并排放在顶层，永远看得见，谁也不会被悄悄忘掉。

### 飞轮

两半互相驱动：

```
                 book/  (知识库 + 驱动源)
               ┌─────────────────────────────────────┐
               │  plans/      → 驱动代码实现          │
               │  guidelines/ → 提供编码基线          │
               │  learn/      → 提供经验参考          │
               │  issue/      → 提供改进方向          │
               │  decisions/  → 提供决策上下文        │
               └──────────────┬──────────────────────┘
                              │ 驱动
                              ▼
                          code/
                              │ 产出
                              ▼
               ┌─────────────────────────────────────┐
               │  summary/    ← 功能完成报告          │
               │  learn/      ← 新增经验沉淀          │
               │  issue/      ← 新增潜在问题          │
               │  changelogs/ ← 变更记录              │
               │  plans/      ← 标记完成状态          │
               └─────────────────────────────────────┘
```

**book → code**：实现之前，agent 先读 plan（施工图）、guidelines（基线）、相关的 learn 条目（积累的经验）、开放的 issue（已知的雷）。

**code → book**：工作完成后收尾回写——人类不看 diff 也能读懂的 summary、下个会话能检索到的 learn、只记录不修复的 issue、一条 changelog、刷新过的索引。

这就是飞轮：每转一圈，book 都比上一圈更完整，于是每个会话——人或 agent，今天或一年后——都站在全部既有经验之上。**book 越完整，对下一个接触项目的人越值钱。** 开发变成复利，而不是重置。

---

## 方法

### 是关卡，不是刹车

每个功能走六阶段流程，每阶段是硬关卡（`book/guidelines/workflow.md`，由 `feature-flow` skill 在行为层执行）：

| 阶段 | 产出 | 关卡 |
|------|------|------|
| Step 0 需求 Brief | 背景、作用域、排除项、需求 | 每个槽位填实——**排除清单必填**，空白排除项是越界改动的头号原因 |
| 1 需求分析 | 影响图 + 风险清单 | 不改任何代码 |
| 2 设计 | 数据流、文件清单、接口 | **用户确认后才推进** |
| 3 实现 | 代码 | 严格按批准的作用域 |
| 4 测试 | 先写测试 | 全绿，不削弱断言 |
| 5 Review | 问题清单 | 只记录，不修复 |
| 6 收尾 | summary、learn、issue、changelog、索引 | 只记录，不修复 |

设计意图：agent 把实现压缩到分钟级，瓶颈于是转移到决策和作用域。关卡把人的手正好放在那里——Step 0 补上需求没说的话，Phase 2 由人批准方向，Phase 5/6 强制"观察"与"行动"分离。**Review 时发现的问题变成一条记录的 issue，修复是另一件事。** 不让你顺手修的这道门，和让 review 保持诚实的是同一道门。

### 为读者而写

book 文档按读者分流，不按产物类型（`book/notes/`）：

| 类型 | 写给谁 | 形态 |
|------|--------|------|
| `summary/` | 人类为主 | 报告：背景 → 做了什么 → 为什么 → 效果 |
| `learn/` | 人类 + agent | 可检索的知识条目，带 tags——包括症状词（"timeout"、"drift"） |
| `issue/` | 人类 + agent | 问题 + 复现 + 建议方向 |
| `task/` | 工作记忆 | 检查清单 |

要读 diff 才能懂的 summary 不是 summary；标题不能回答问题的 learn 不会被下个会话检索到。`book/notes/README.md` 里的模板就是质量线。

### 索引契约

导航不了的知识库只是写进磁盘的单行道。BoCode 把可发现性做成构建检查：

- 每篇 book 文档头部有 frontmatter `description`——一行说人话的内容摘要，写内容不写体裁
- `code/tools/gen-book-index.mjs`（零依赖、纯 Node）重新生成 `book/README.md`——全库文档的总索引，按目录分组
- 缺 description 的文档让构建**失败**（退出码 1）。零警告是唯一通过状态

`book/README.md` 同时是入口：agent 先读它拿全库地图；这个目录还可以直接用 [Obsidian](https://obsidian.md) 打开当 vault。

### 说人话

文档要被读很多年、却在几分钟内写完，所以风格规则短而严（`book/guidelines/writing-style.md`）：像具体的人在当前场景下表达——专业可以，模板化不行。删开场套话和空总结；事实锁死——数字、命令、名称、责任主体一律不动。中文写作的完整规则在 [shuorenhua](https://github.com/MrGeDiao/shuorenhua) skill；guideline 文件是跨语言的默认兜底。

### 干净的 git 流

git 历史是 book 的一部分（`book/guidelines/git-workflow.md`）。每个非合并提交走 Clean Commit 格式——`📦 new (index): add book index generator`——由零依赖脚本在本地（`.githooks/`）和 CI（`.github/workflows/git-policy.yml`）双重校验。分支走 Clean Flow：`dev` 是单人开发的集成分支，验证过的小修复直接落；大功能切工作分支；`main` 只接收来自 `dev` 的 merge commit。

### 这个仓库自己就在用它

BoCode 是自己的第一个用户。产出本仓库的设计文档在 `book/plans/`；构建的 changelog 和 summary 在 `book/changelogs/` 与 `book/notes/summary/`；决策是 `book/docs/decisions/` 里的 ADR。提交历史遵守它自带的 git 规范。采用模板时，`scripts/init-project.sh` 会清掉这些活记录、保留模板。

---

## 快速开始

```bash
# 1. 用 GitHub "Use this template" 从本模板建仓库，
#    或者直接 clone：
git clone <your-fork-url> myproject && cd myproject

# 2. 把模板变成你的项目（改名、填描述、清理记录）：
bash scripts/init-project.sh myproject "一句话说明它是干什么的"

# 3. 给你的 AI agent 装上三个 skill：
cp -r skills/bocode skills/feature-flow skills/book-writeback <your-skills-dir>/
#    （ZCode: ~/.zcode/skills/ · Claude Code: ~/.claude/skills/ —— 见 skills/README.md）

# 4. 让你的 agent 指向 AGENTS.md——多数工具会自动读它。
#    然后开发点什么。skill 会驱动整个流程。
```

依赖：`bash` 和 `node`（两个脚本用）。没有包管理、没有 install 步骤、没有 lockfile——工具链刻意做得乏味。

## 仓库导览

| 路径 | 是什么 |
|------|--------|
| `AGENTS.md` | AI agent 的入口——结构、规则、硬约束 |
| `book/guidelines/` | 规则书：工作流、书写风格、git、review |
| `book/README.md` | 总索引（脚本生成——从这里开始） |
| `book/plans/` | 实现计划（施工图） |
| `book/notes/{summary,learn,task,issue}/` | 四类笔记 |
| `book/docs/{architecture,api,decisions}/` | 快照、契约、ADR |
| `skills/` | `bocode`、`feature-flow`、`book-writeback` |
| `code/tools/gen-book-index.mjs` | 索引生成器 |
| `scripts/init-project.sh` | 模板 → 你的项目 |
| `scripts/check-commit-message.mjs` | Clean Commit 校验器（含 `.githooks/`） |

## 常见问题

**已有项目能用 BoCode 吗？**
能。把 `book/`、`skills/`、`scripts/`、`.githooks/`、`AGENTS.md`、`code/tools/` 拷进去，已有文档并进 book，跑一次索引生成。不需要迁移工具；`init-project.sh` 只服务新 clone。

**会绑定语言或技术栈吗？**
不会。book 是 Markdown；两个脚本是零依赖纯 Node。你的 `code/` 放什么都行——模板自己的 `code/` 只装工具。

**支持哪些 AI 工具？**
任何把 `AGENTS.md` 当指令入口、支持 `SKILL.md` 格式的工具（ZCode、Claude Code 及兼容 agent）。没有 skill 时流程优雅降级：guidelines 用文字承载同样的规则。

**不刷索引会怎样？**
运行时什么都不会坏——但索引一旦过期，整个系统赖以成立的可发现性就开始流失。所以检查让缺 description 的文档大声失败。

**为什么用 `YYYY-MM/` 归档而不是按功能建目录？**
月份是稳定、低维护的物理分组。功能靠索引、frontmatter 和链接找到——不靠把每个跨月功能切碎的目录嵌套。

## 许可

[MIT](LICENSE)
