---
description: BoCode 奠基总结——从 StarBell 抽象通用模板的完整过程、关键取舍与验证结果
---

# BoCode 奠基 — summary

- **背景**：StarBell 用一个月验证了 code/book 双向驱动工作流（六阶段关卡、四类 notes、索引契约、说人话规范）。目标是把它抽象成任何人 clone 即用的开源模板，放在 `Workflow/BoCode`。
- **做了什么**：按六阶段流程走完一轮——Step 0 到 Phase 2 通过逐项问答补齐九个决策（模板仓库形态、自举架构、全自研 3-skill、shuorenhua 只引用、英文主 README、guidelines 英文化、.mjs 工具链、AGENTS.md 主入口、MIT）；设计文档作为仓库第一篇 plan 落盘提交；随后八步施工：工具链 → book 模板 → 入口文件 → skills → init 脚本 → CI → 双语 README → 收尾回写。
- **为什么这些选择**：
  - 自举模板（方案 A）而非干净模板：讲工作流的项目，自己的历史就是最强的 README；代价是活记录需要 init 脚本清理，用"月度目录 + 类型级 README"的结构把清理范围收敛成一条 find 命令。
  - skill 只设三个：入口、流程、回写。TDD 内嵌在 feature-flow 的 Phase 4 不单列；skill 越少 agent 触发越准——这是对全家桶路线的刻意反着来。
  - 工具从 .ts/bun 改 .mjs/plain Node：模板用户技术栈未知，零依赖 plain Node 是最大公约数；顺带去掉了 bun 专属的 `import.meta.dir`，换 `fileURLToPath`。
  - 模板表面英文、活记录中文：模板面向国际用户，作者自己的运行记录用母语——这本身就是双轨示范。
- **效果**：八步全部完成并各自验证——索引 16 篇零警告、缺 description 退出 1、提交校验器正反例正确、init 脚本在临时 clone 跑通（改名替换生效、记录清空、索引重生成零警告）、全部 8 个 commit 符合 Clean Commit。
- **后续**：推 GitHub 开源（建 remote、push main 与 dev、开分支保护）由用户执行；开源后按需补 CONTRIBUTING；StarBell 侧可考虑用 BoCode 的 skill 替换本机版做一次实战验证。
