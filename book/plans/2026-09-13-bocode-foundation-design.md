---
description: BoCode 基础设计:自举式 code+book 双向驱动工作流模板仓库的完整蓝图与已确认决策
---

# BoCode 基础设计（Design Spec）

> 状态：待用户审阅 · 2026-09-13 · 本文档是 BoCode 仓库的第一篇 plan，仓库从这一刻起自举。

## 1. 背景与目标

StarBell 项目验证了一套 code/book 双向驱动的工作方法：`code/` 与 `book/` 双半脑、六阶段关卡、四类 notes、frontmatter 索引契约、说人话书写规范。本设计把这套方法从 StarBell 抽象成**通用开源模板仓库 BoCode**（book + code），任何人 clone 即可给自己的项目装上这套工作流。

**成功标准：**

1. 新用户通过 GitHub "Use this template" 或 clone，运行一条命令完成项目化重置，5 分钟内得到一个可用的 BoCode 项目
2. AI agent（任何支持 SKILL.md / AGENTS.md 约定的工具）读入口文件后能正确遵守双向驱动纪律
3. README（英文主 + 中文版）把设计哲学讲透，仓库本身就是工作流的活示范
4. 零第三方运行时依赖：不需要 bun、不需要 npm install、node 直跑全部脚本

## 2. 已确认决策（用户拍板）

| 决策点 | 结论 |
|--------|------|
| 消费形态 | 模板仓库（clone / Use this template 即用） |
| 仓库架构 | 方案 A 自举模板：仓库自身就是一个 BoCode 项目，自己的记录走自己的流程 |
| skills 来源 | 全部自研（superpowers 套件仅作参考，不收录不改编其文本） |
| shuorenhua | 只引用不内置：writing-style 保留规则文本作兜底，skill 本体给外部安装指引 |
| skill 数量 | 3 个：bocode（入口）、feature-flow（六阶段）、book-writeback（回写） |
| README 语言 | 英文主文档 + 中文版 README.zh-CN.md，内容对等 |
| guidelines 语言 | 模板表面（guidelines、AGENTS.md、skills）全英文；BoCode 自身活记录（summary/learn/changelog/plans）中文 |
| 索引工具 | gen-book-index 从 .ts/bun 改为 .mjs，node 与 bun 通吃，零依赖 |
| agent 入口 | AGENTS.md 承载内容，CLAUDE.md 只写一行指针 |
| 许可证 | MIT，版权人 Focus（2026） |

## 3. 仓库结构

```
BoCode/
├── README.md                       # 英文主文档：设计哲学九章 + Quick Start + 目录导览
├── README.zh-CN.md                 # 中文版，内容对等
├── LICENSE                         # MIT
├── AGENTS.md                       # agent 入口：结构、双向驱动规则、文档约定、关键约束
├── CLAUDE.md                       # 一行指针 → AGENTS.md
├── .gitignore                      # 忽略 .DS_Store、node_modules 等
├── .github/
│   └── workflows/git-policy.yml    # CI：Clean Commit 校验 + 分支流向检查（dev→main 只允许 merge commit）
├── scripts/
│   ├── check-commit-message.mjs    # Clean Commit 标题校验，零依赖，node 直跑
│   └── init-project.sh             # 一键重置：改项目名、清空 BoCode 自身活记录、刷新索引
├── skills/
│   ├── README.md                   # 各平台安装指引（ZCode / Claude Code / 通用 SKILL.md 兼容工具）
│   ├── bocode/SKILL.md             # 入口 skill：结构认知、双向驱动纪律、索引刷新时机
│   ├── feature-flow/SKILL.md       # Step 0 需求 Brief + 六阶段硬关卡（Phase 4 内嵌 TDD）
│   └── book-writeback/SKILL.md     # summary/learn/issue 回写向导：模板 + 质量关卡
├── code/
│   ├── tools/gen-book-index.mjs    # 扫描 book/ 生成总索引；缺 description 警告并退出 1
│   └── package.json                # 仅 book:index 一个脚本，零依赖
└── book/
    ├── README.md                   # 总索引（脚本生成，勿手改）
    ├── guidelines/
    │   ├── README.md               # guidelines 地图
    │   ├── workflow.md             # 六阶段关卡 + 双向驱动七条交互规则 + 文档分流表
    │   ├── writing-style.md        # 说人话：保真合同 + 最小规则 + 档位 + 回读清单（含 shuorenhua 引用）
    │   ├── git-workflow.md         # Clean Commit + Clean Flow（通用版，去 StarBell 细节）
    │   ├── review-checklist.md     # Phase 5 结构化 review 清单
    │   ├── architecture.md         # 模板：指导项目定义自己的长期边界（含示例写法）
    │   └── coding-style.md         # 模板：技术栈相关的编码基线占位
    ├── docs/
    │   ├── README.md
    │   ├── architecture/README.md  # 实现快照占位
    │   ├── api/README.md           # API 文档占位
    │   └── decisions/
    │       ├── README.md           # ADR 写法说明
    │       └── ADR-001-adopt-bocode.md   # 示范 ADR：为什么本项目采用 BoCode
    ├── notes/
    │   ├── README.md               # 四类 notes 分工 + 写入时机 + 检索顺序 + 内嵌模板
    │   ├── learn/2026-09/          # 经验条目（BoCode 自身记录，init-project.sh 清理）
    │   ├── summary/2026-09/        # 功能报告（同上）
    │   ├── task/README.md
    │   └── issue/2026-09/README.md # 只记不修（同上）
    ├── plans/                      # 本设计文档所在；README 说明 plan 格式
    └── changelogs/
        └── 2026-09/README.md       # 变更日志格式说明
```

## 4. 组件设计

### 4.1 README.md（英文）与 README.zh-CN.md

九章哲学骨架（两部分已确认）：

1. **The problem** — agent 无状态、文档腐烂、人失去控制
2. **Two half-brains** — code 回答"怎么运作"，book 回答"为什么这样运作"；可执行的真相 vs 可导航的真相
3. **The flywheel** — book→code（plans/guidelines/learn/issue/decisions），code→book（summary/learn/issue/changelog/索引刷新）；复利而非重启
4. **Gates, not brakes** — Step 0 需求 Brief（"不影响清单"必填）；Phase 2 人类确认；Phase 5/6 只记录不修复
5. **Write for the reader** — summary 报告体 vs learn 知识条目
6. **The index contract** — 一行 description + 零依赖脚本 + 缺失即失败；Obsidian 兼容
7. **Speak human** — 反模板腔、事实锁死（引用 shuorenhua）
8. **Clean git flow** — emoji 提交格式、dev 集成分支、main 只收 merge commit
9. **This repo runs on BoCode** — 自举示范，活记录在 book/ 里

之后：Quick Start（Use this template → `bash scripts/init-project.sh` → 装 skills → 指向 AGENTS.md）、目录导览、FAQ（含"我已经有一个项目怎么引入"）、License。

### 4.2 AGENTS.md

从 StarBell CLAUDE.md 通用化：项目概述占位、空间结构、双向驱动规则、文档分流表、code↔book 交互五条、关键约束（六阶段不跳步、Phase 2 确认、只记不修、索引必刷新）。去掉 StarBell 特有内容（六条架构边界、codegen 命令）。

### 4.3 skills 套件（全自研，纯 SKILL.md）

| skill | 触发场景 | 核心内容 | 来源与改写 |
|-------|----------|----------|------------|
| `bocode` | 会话开始 / 用户提到 book、索引、文档去向 | 结构地图；编码前查 guidelines+learn、收尾必回写+刷索引；frontmatter description 纪律 | 新写 |
| `feature-flow` | 用户要实现/修改功能且请求稀疏 | Step 0 Brief（背景/作用域/需求，"不影响"必填 + 推荐清单）；六阶段硬关卡；Phase 4 内嵌 TDD；Phase 6 回写指向 book-writeback | structured-feature-implementation 通用化：去 doc-sync-router/Mango 分支，回写目标固定为 book/ |
| `book-writeback` | 功能收尾 / 用户要写 summary/learn/issue | 三类文档模板与质量关卡（summary 报告体、learn 带 tags 可检索、issue 只记不修）；写完刷索引 | 新写，吸收 StarBell notes 模板 |

### 4.4 工具链

- **gen-book-index.mjs**：逻辑照搬 StarBell 版（walk + frontmatter description 解析 + 按目录分组 + 警告退出 1），ESM plain Node，标题里的项目名从 `code/package.json` 的 `name` 字段读，读不到用 "book"
- **check-commit-message.mjs**：StarBell 版即零依赖自研实现，直接通用化收编
- **init-project.sh**：交互式问项目名 → 替换 AGENTS.md 与 `code/package.json` 的占位 → 删除 book/notes/{learn,summary,issue,task} 与 book/changelogs 下的全部 YYYY-MM 月度目录（BoCode 自身记录）→ 重跑 book:index → 打印 skills 安装提示
- **git-policy.yml**：push/PR 校验提交标题格式与分支流向；文档写明 GitHub 分支保护建议（main：require PR + merge commit）

### 4.5 book/ 模板内容

guidelines 五篇核心（workflow/writing-style/git-workflow/review-checklist）为**通用成品**（英文），architecture.md 与 coding-style.md 为**带示例写法的模板**。notes 四类目录的 README.md 内嵌该类文档的写作模板（不单独成篇，避免索引混入假文件），保证 `book:index` 首跑即零警告。

### 4.6 自举策略

- BoCode 自身的开发记录（本设计文档、后续 changelog、learn、summary）用中文写进 book/，作为活教材
- init-project.sh 负责把这部分"作者的记录"从用户项目里清掉，同时保留模板示例
- 仓库 git 历史从 main 上的首个 commit（本设计文档）开始，随后建 dev 分支，日常开发走 dev，遵循 BoCode 自己的 git-workflow

## 5. 明确不做（YAGNI）

- 不做 npm 脚手架 CLI
- 不做多语言 guidelines（英文模板 + 中文 README 即止）
- 不内置任何第三方 skill（shuorenhua、superpowers 均为外部引用）
- 不做文档站 / 不做 Obsidian 插件
- v1 不做 CONTRIBUTING.md / SECURITY.md（开源后按需加）

## 6. 风险与对策

| 风险 | 对策 |
|------|------|
| README 哲学写成抽象口号 | 每个哲学点必须落到一条可执行的规则或一个目录/脚本上；宁短勿空 |
| 模板示例与 BoCode 活记录混淆 | init-project.sh 明确清理范围；示例文件名统一 template 前缀或集中标注 |
| 英文文档表达打折 | 英文定稿前用说人话标准回读；术语表与中文版一一对应 |
| skills 与 guidelines 内容重复漂移 | 原则：guidelines 管"是什么/为什么"（人类读），skills 管"何时做/怎么做"（agent 执行）；引用不复制 |

## 7. 验收清单

- [ ] `bash scripts/init-project.sh` 在干净 clone 上跑通，产出项目无 BoCode 自身记录残留
- [ ] `node code/tools/gen-book-index.mjs` 首跑零警告退出 0
- [ ] `node scripts/check-commit-message.mjs "<subject>"` 对正反例行为正确
- [ ] 3 个 SKILL.md 均带 frontmatter name/description，触发条件互斥清晰
- [ ] README.md 与 README.zh-CN.md 章节一一对应
- [ ] 仓库全部 commit 符合 Clean Commit 格式
