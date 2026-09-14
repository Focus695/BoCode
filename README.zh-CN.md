<p align="center">
  <img src=".github/assets/banner.svg" alt="BoCode — 文档驱动代码，代码回写文档" width="720">
</p>

<p align="center">
  <a href="README.md">English</a> · <b>简体中文</b> · <a href="README.ja.md">日本語</a>
</p>

<p align="center">
  <a href="https://github.com/Focus695/BoCode/actions/workflows/git-policy.yml"><img src="https://github.com/Focus695/BoCode/actions/workflows/git-policy.yml/badge.svg" alt="Git Policy"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/Focus695/BoCode/generate"><img src="https://img.shields.io/badge/use_this-template-2ea44f.svg" alt="Use this template"></a>
</p>

**让文档驱动代码，让代码反过来写文档。**

BoCode 把仓库分成两半：`code/` 放源代码，`book/` 放文档和知识库，两边互相驱动。它针对的场景很具体：现在大部分代码是人和 AI agent 一起写的。agent 快，但每开一个新会话就从零开始——项目知识有没有存在一个可靠的地方，决定了开发是越滚越顺，还是每轮都重付学费。

## 一句话接入

已经有项目了？把这句发给你的 AI agent：

```text
阅读 https://github.com/Focus695/BoCode（从 ADOPT.md 开始），按照它的步骤把当前项目改造为 BoCode 工作流。
```

新开项目？三条命令的快速开始在下面。

---

## 为什么需要 BoCode

### 问题

用 AI agent 写代码的项目，几乎都会撞上三件事：

1. **Agent 没有记忆。** 每个会话从零开始。没写下来的知识会被重新推导一遍、重新问一遍、重新踩一遍——每次都付全价。
2. **文档会烂。** 立项时写一次，之后没人更新。更新文档的好处在将来，跳过它的好处在眼前，所以文档总输。到最后没人信文档——不信也对。
3. **人抓不住方向盘。** 你让 agent 做一件事，它会顺手多做十二件。速度上去了、关卡没跟上，作用域就开始漂：改了不该改的，决定了没人知道的，半年后没人说得清"当时为什么这么做"。

三件事的根子是同一个：知识不能只活在聊天记录和人脑里。

### 两个半脑

BoCode 的答案是结构。一个项目有两半：

- **`code/`** 回答"它现在是怎么跑的"
- **`book/`** 回答"它为什么长这样、做过什么决定、踩过什么坑"

一个是能跑的真相，一个是能查的真相，缺哪个都不行。没有 book 的 code 能跑，但谁也说不清它为什么长这样；没有 code 的 book 就是一本日记。两半并排放在仓库顶层，永远看得见，谁也不会被悄悄忘掉。

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

**book → code**：动代码之前，agent 先读 plan（施工图）、guidelines（基线）、相关的 learn（前人踩过的坑）、还开着的 issue（已知的雷）。

**code → book**：活干完后回写——summary 写给不看 diff 的人，learn 存给下个会话检索，issue 记下发现但先不修的问题，changelog 记一笔，索引刷一遍。

这就是飞轮：每转一圈，book 都比上一圈更全；每个会话——不管是人还是 agent，今天还是一年后——都站在全部既有经验上开工。**book 越全，对下一个接手的人越值钱。** 开发变成复利，不用每次从零再来。

---

## 方法

### 是关卡，不是刹车

每个功能走六阶段，每阶段是硬关卡（`book/guidelines/workflow.md`，由 `feature-flow` skill 在行为层执行）：

| 阶段 | 产出 | 关卡 |
|------|------|------|
| Step 0 需求 Brief | 背景、作用域、排除项、需求 | 每个槽位填实——**排除清单必填**，空着的排除项是越界改动的头号原因 |
| 1 需求分析 | 影响图 + 风险清单 | 不改任何代码 |
| 2 设计 | 数据流、文件清单、接口 | **用户确认后才推进** |
| 3 实现 | 代码 | 严格按批准的作用域 |
| 4 测试 | 先写测试 | 全绿，不削弱断言 |
| 5 Review | 问题清单 | 只记录，不修复 |
| 6 收尾 | summary、learn、issue、changelog、索引 | 只记录，不修复 |

设计意图：agent 把实现压到分钟级，瓶颈就挪到了决策和作用域上。关卡把人的手正好放在那里——Step 0 补上需求没说的话，Phase 2 由人拍板方向，Phase 5/6 把"看"和"改"分开。**Review 时发现的问题进清单，修复是另一件事。** 不让你顺手修的这道门，正是让 review 保持诚实的同一道门。

### 为读者而写

book 的文档按读者分流，不按产物类型（`book/notes/`）：

| 类型 | 写给谁 | 形态 |
|------|--------|------|
| `summary/` | 人类为主 | 报告：背景 → 做了什么 → 为什么 → 效果 |
| `learn/` | 人类 + agent | 可检索的知识条目，带 tags——包括症状词（"timeout"、"drift"） |
| `issue/` | 人类 + agent | 问题 + 复现 + 建议方向 |
| `task/` | 工作记忆 | 检查清单 |

要读 diff 才懂的 summary 不是 summary；标题答不了问题的 learn，下个会话也搜不到。`book/notes/README.md` 里的模板就是质量线。

### 索引契约

找不到的知识等于没写。BoCode 把"能找到"做成构建检查：

- 每篇 book 文档开头有 frontmatter `description`——一行说人话的内容摘要，写内容，不写体裁
- `code/tools/gen-book-index.mjs`（零依赖、纯 Node）重新生成 `book/README.md`——全库文档总索引
- 缺 description 的文档让构建直接失败（退出码 1）。零警告是唯一通过状态

`book/README.md` 也是入口：agent 先读它拿地图；这个目录还能直接用 [Obsidian](https://obsidian.md) 打开当 vault。

### 说人话

文档是几分钟写完、要被读好几年的东西，所以风格规则短而严（`book/guidelines/writing-style.md`）：像具体的人在具体场景里说话——专业没关系，模板腔不行。套话和空总结删掉，事实锁死：数字、命令、名称、责任主体一个不动。中文的完整规则在 [shuorenhua](https://github.com/MrGeDiao/shuorenhua) skill；guideline 文件是跨语言的默认兜底。

### 干净的 git 流

git 历史也是 book 的一部分（`book/guidelines/git-workflow.md`）。非合并提交一律走 [Clean Commit](https://github.com/wgtechlabs/clean-commit) 格式——`📦 new (index): add book index generator`；分支走 [Clean Flow](https://github.com/wgtechlabs/clean-flow)（`工作分支 → dev → main`）。这两个规范本身不带工具，BoCode 补上了：零依赖校验器在本地（`.githooks/`）和 CI（`.github/workflows/git-policy.yml`）两头跑。日常用法：`dev` 是单人开发的集成分支，验证过的小修复直接进；大功能切工作分支；`main` 只收来自 `dev` 的 merge commit。

### 用自己建的，干干净净交付

BoCode 是自己的第一个用户：奠基走完了结构化需求、经确认的设计、分阶段施工和逐步验证，提交历史全程 Clean Commit——整个过程在 git log 里可查。你拿到的模板是干净的：没有带日期的记录、没有别人的 plan，book 是空的，等着写你的。只留一个示范：[ADR-001](book/docs/decisions/ADR-001-adopt-bocode.md)——"采用这套工作流"的决策记录，你的项目会第一个重申它。

---

## 快速开始

```bash
# 1. 用 GitHub 的 "Use this template" 从本模板建仓库，
#    或者直接 clone：
git clone <your-fork-url> myproject && cd myproject

# 2. 把模板变成你的项目（起名、填描述、清掉模板记录）：
bash scripts/init-project.sh myproject "一句话说明它是干什么的"

# 3. 给你的 AI agent 装上三个 skill：
cp -r skills/bocode skills/feature-flow skills/book-writeback <your-skills-dir>/
#    （ZCode: ~/.zcode/skills/ · Claude Code: ~/.claude/skills/ —— 见 skills/README.md）

# 4. 让 agent 指向 AGENTS.md——多数工具会自动读。
#    然后开发点什么，skill 会带着流程走。
```

需要的只有 `bash` 和 `node`（跑两个脚本用）。不装包、没有 install 步骤、没有 lockfile——工具链故意做得无聊。

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

**已经有项目了，能套用 BoCode 吗？**
能。把 [ADOPT.md](ADOPT.md) 交给你的 AI agent——这是写给 agent 的分步改造手册：盘点项目、搭 book 骨架、定布局、迁文档、装工具链和 skills、写第一笔回写。想手工来也行：把 `book/`、`skills/`、`scripts/`、`.githooks/`、`AGENTS.md`、`code/tools/` 拷过去，已有文档并进 book，跑一次索引生成。

**会绑死语言或技术栈吗？**
不会。book 全是 Markdown，两个脚本是零依赖纯 Node。`code/` 里放什么随意——模板自己的 `code/` 也只放了工具。

**支持哪些 AI 工具？**
只要读 `AGENTS.md`、认 `SKILL.md` 格式就行（ZCode、Claude Code 和兼容工具）。没装 skill 也能跑：guidelines 用文字载着同样的规则。

**不刷索引会怎么样？**
运行不会坏——但索引一过期，整套体系靠的可发现性就开始漏。所以检查让缺 description 的文档直接报错，而不是悄悄放过去。

**为什么按 `YYYY-MM/` 归档，不按功能建目录？**
月份是稳定的物理分组，维护成本最低。功能靠索引、frontmatter 和链接来找——不靠把跨月的功能切碎在目录树里。

## 致谢

BoCode 的 git 纪律构建在 WGTech Labs 的两个开放标准上——[Clean Commit](https://github.com/wgtechlabs/clean-commit)（提交格式）与 [Clean Flow](https://github.com/wgtechlabs/clean-flow)（分支模型）——并为这两个"只有规范没有工具"的标准补上了执行工具链。说人话书写规范源自 MrGeDiao 的 [shuorenhua](https://github.com/MrGeDiao/shuorenhua)。

## 许可

[MIT](LICENSE)
