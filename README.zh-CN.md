<p align="center">
  <img src=".github/assets/banner.svg" alt="BoCode — 人定方向，agent 写码，book 记住一切" width="720">
</p>

<p align="center">
  <a href="README.md">English</a> · <b>简体中文</b> · <a href="README.ja.md">日本語</a>
</p>

<p align="center">
  <a href="https://github.com/Focus695/BoCode/actions/workflows/git-policy.yml"><img src="https://github.com/Focus695/BoCode/actions/workflows/git-policy.yml/badge.svg" alt="Git Policy"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/Focus695/BoCode/generate"><img src="https://img.shields.io/badge/use_this-template-2ea44f.svg" alt="Use this template"></a>
</p>

**人定方向，agent 写码，book 记住一切。**

BoCode 把仓库分成两半：`code/` 放源代码，`book/` 放文档和知识库，两边互相驱动。它是为现在最常见的开发方式设计的：人和 AI agent 一起写代码。agent 快，也有记忆，可记忆只归它自己：人读不懂、管不了。项目知识放在哪里、给谁读，决定了开发是又快又稳，还是快得让人心里没底。

## 一句话接入

已经有项目了？把这句发给你的 AI agent：

```text
阅读 https://github.com/Focus695/BoCode（从 ADOPT.md 开始），按照它的步骤把当前项目改造为 BoCode 工作流。
```

新开项目？直接跳到[快速开始](#快速开始)。

---

## 为什么需要 BoCode

### 问题

用 AI agent 写代码的项目，几乎都会撞上三件事：

1. **记忆只归 agent 自己。** 现在的 agent 都有 memory，可那是个黑盒：人读不懂，也管不了。最近推进了什么、踩过哪些坑、哪些问题等着修，人一概看不见——agent 干得越快，人的掌控感越少。缺的不是记忆，是人和 agent 共读的同一个地方：进展的总结、踩过的坑、待修的问题、项目的指南。agent 靠它干活，人靠它掌舵。
2. **文档会过时。** 立项时写一次，之后没人更新。更新文档的好处要很久之后才看得到，跳过它马上就省事，所以文档总是作用不大。到最后没人信文档——过时的文档确实不值得信。
3. **人抓不住方向盘。** 你让 agent 做一件事，它会顺手多做十二件。速度上去了、关卡没跟上，作用域就开始漂移：改了不该改的，做了没人知道的决定，半年后没人说得清"当时为什么这么做"。

三件事的根源是同一个：知识不能只存在聊天记录和人脑里。

### 各管一半

BoCode 用结构回答这个问题。一个项目有两半：

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

这就是飞轮：每转一圈，book 都比上一圈更全；不管对人还是 agent，今天还是一年后，每个会话都从积累好的经验开始。**book 越全，对下一个接手的人越值钱。** 开发变成复利，不用每次从零再来。

---

## 方法

BoCode 的规矩由四个 skill 分头执行、各自独立调用：

| Skill | 中文 | 管 | 何时出手 |
|-------|------|-----|---------|
| `bocode` | 薄码 | 结构地图与全程纪律 | 会话开始；查文档去向、索引规则 |
| `boscope` | 薄界 | 六阶段关卡——范围先说死，一关一关过 | 要实现 / 改一个功能 |
| `book-writeback` | 返写 | 回写模板与质量线 | 功能收尾；写 summary / learn / issue |
| `bowrite` | 薄写 | 写薄写好——内容变少，核心没变 | 写或改任何文档 |

下面几节讲规则本身，skill 是它们的执行层。

### 薄界（boscope）：是关卡，不是刹车

每个功能走六阶段，每阶段是硬关卡（规范本体：`book/guidelines/workflow.md`）：

| 阶段 | 产出 | 关卡 |
|------|------|------|
| Step 0 需求 Brief | 背景、作用域、排除项、需求 | 每个槽位填实 |
| 1 需求分析 | 影响图 + 风险清单 | 不改任何代码 |
| 2 设计 | 数据流、文件清单、接口 | **用户确认后才推进** |
| 3 实现 | 代码 | 严格按批准的作用域 |
| 4 测试 | 先写测试 | 全绿，不削弱断言 |
| 5 Review | 问题清单 | 只记录，不修复 |
| 6 收尾 | summary、learn、issue、changelog、索引 | 只记录，不修复 |

排除清单是 Step 0 的命门：空着的"不影响"清单，就是 Phase 3 越界改动的头号来源。

设计意图：agent 把实现压到分钟级，瓶颈就挪到了决策和作用域上，关卡恰好守在那里——Step 0 补上需求没说的话，Phase 2 由人拍板方向，Phase 5/6 把"看"和"改"分开。**Review 时发现的问题进清单，修复是另一件事。** 只记录、不修复，review 的结论才可信。

### 为读者而写

book 的文档按读者分流，而不是按文档类型（`book/notes/`）：

| 类型 | 写给谁 | 形态 |
|------|--------|------|
| `summary/` | 人类为主 | 报告：背景 → 做了什么 → 为什么 → 效果 |
| `learn/` | 人类 + agent | 可检索的知识条目，带 tags——包括症状词（"timeout"、"drift"） |
| `issue/` | 人类 + agent | 问题 + 复现 + 建议方向 |
| `task/` | 任务跟踪 | 检查清单 |

要读 diff 才懂的 summary 不是 summary；标题答不了问题的 learn，下个会话也搜不到。`book/notes/README.md` 里的模板就是合格线，收尾回写时由 `book-writeback`（返写）skill 带着执行。

### 索引契约

找不到的知识等于没写。BoCode 把"能找到"做成构建检查：

- 每篇 book 文档开头有 frontmatter `description`——一行说人话的内容摘要，写内容，不写体裁
- `code/tools/gen-book-index.mjs`（零依赖、纯 Node）重新生成 `book/README.md`——全库文档总索引
- 缺 description 的文档让构建直接失败（退出码 1）。零警告是唯一通过状态
- 内部链接必须走得通：断链同样让构建失败——book 是个 vault，断链就是构建 bug

`book/README.md` 也是入口：agent 先读它拿地图；这个目录还能直接用 [Obsidian](https://obsidian.md) 等知识管理工具打开当 vault——索引、标签、反链、关系图全部可用（详见 FAQ）。

### 薄写（bowrite）：说人话

文档是几分钟写完、要被读好几年的东西，所以风格规则短而严（`book/guidelines/writing-style.md`）：像具体的人在具体场景里说话——专业可以，模板化不行。写薄：内容变少、核心没变，删的是字不是信息；写好：自然、直接、不抖机灵，事实锁死——数字、命令、名称、责任主体一个不动。bowrite 蒸馏自 MrGeDiao 的 [shuorenhua](https://github.com/MrGeDiao/shuorenhua)，加上本项目 review 中攒下的表达模式账本。

### 干净的 git 流

git 历史也是 book 的一部分（`book/guidelines/git-workflow.md`）。非合并提交一律走 [Clean Commit](https://github.com/wgtechlabs/clean-commit) 格式——`📦 new (index): add book index generator`；分支走 [Clean Flow](https://github.com/wgtechlabs/clean-flow)（`工作分支 → dev → main`）。这两个规范本身不带工具，BoCode 补上了：零依赖校验器在本地（`.githooks/`）和 CI（`.github/workflows/git-policy.yml`）两头跑。日常用法：`dev` 是单人开发的集成分支，验证过的小修复直接进；大功能切工作分支；`main` 只收来自 `dev` 的 merge commit。

### 用自己建的，干干净净交付

BoCode 是自己的第一个用户：它的奠基就是按这套流程走的——结构化需求、设计确认、分阶段施工、逐步验证，提交历史全程 Clean Commit，整个过程在 git log 里可查。你拿到的模板是干净的：没有带日期的记录、没有别人的 plan，book 是空的，等着写你的。只留一个示范：[ADR-001](book/docs/decisions/ADR-001-adopt-bocode.md)——"采用这套工作流"的决策记录，这也是你的项目开工后要写的第一个决定。

---

## 快速开始

```bash
# 1. 用 GitHub 的 "Use this template" 从本模板建仓库，
#    或者直接 clone：
git clone <your-fork-url> myproject && cd myproject

# 2. 把模板变成你的项目（起名、填描述、清掉模板记录）：
bash scripts/init-project.sh myproject "一句话说明它是干什么的"

# 3. 给你的 AI agent 装上四个 skill：
cp -r skills/bocode skills/boscope skills/book-writeback skills/bowrite <your-skills-dir>/
#    （ZCode: ~/.zcode/skills/ · Claude Code: ~/.claude/skills/ —— 见 skills/README.md）

# 4. 让 agent 指向 AGENTS.md——多数工具会自动读。
#    然后开始开发，skill 会带着流程走。
```

需要的只有 `bash` 和 `node`（跑两个脚本用）。不装包、没有 install 步骤、没有 lockfile——工具链刻意保持朴素。

## 仓库导览

| 路径 | 是什么 |
|------|--------|
| `AGENTS.md` | AI agent 的入口——结构、规则、硬约束 |
| `book/guidelines/` | 规则书：工作流、书写风格、git、review |
| `book/README.md` | 总索引（脚本生成——从这里开始） |
| `book/plans/` | 实现计划（施工图） |
| `book/notes/{summary,learn,task,issue}/` | 四类笔记 |
| `book/docs/{architecture,api,decisions}/` | 快照、契约、ADR |
| `skills/` | `bocode`、`boscope`、`book-writeback`、`bowrite` |
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

**book 能用 Obsidian 这类双链笔记工具读吗？**
能，零设置。book 全是普通 Markdown：相对链接、YAML frontmatter（description、tags），没有任何专有格式。把 `book/` 当 vault 打开，索引、标签面板、反向链接、关系图全部可用。构建还会校验链接——断链直接构建失败，你打开的永远是一张走得通的网。也不锁 Obsidian：Logseq、Foam、VS Code，任何认 Markdown 的工具都行。

**不刷索引会怎么样？**
运行不会出问题——但索引一过期，文档就慢慢找不到了，而这套体系靠的正是"找得到"。所以检查让缺 description 的文档直接报错，而不是悄悄放过去。

**为什么按 `YYYY-MM/` 归档，不按功能建目录？**
月份是稳定的物理分组，维护成本最低。功能靠索引、frontmatter 和链接来找——不靠把跨月的功能切碎在目录树里。

## 致谢

BoCode 的 git 纪律构建在 WGTech Labs 的两个开放标准上——[Clean Commit](https://github.com/wgtechlabs/clean-commit)（提交格式）与 [Clean Flow](https://github.com/wgtechlabs/clean-flow)（分支模型）——并为这两个"只有规范没有工具"的标准补上了执行工具链。说人话书写规范源自 MrGeDiao 的 [shuorenhua](https://github.com/MrGeDiao/shuorenhua)，蒸馏成了 `bowrite` skill。

## 许可

[MIT](LICENSE)
