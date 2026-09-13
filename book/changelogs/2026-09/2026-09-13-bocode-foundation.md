---
description: BoCode 模板仓库奠基——工具链、book 模板、skills 三件套、init 脚本、CI 与双语 README 全部落成
---

# 2026-09-13 — BoCode 奠基

从 StarBell 验证过的 code+book 双向驱动方法，抽象为通用开源模板仓库 BoCode，按奠基设计的八步施工一次完成：

- 零依赖工具链：`code/tools/gen-book-index.mjs`（frontmatter description 缺失即退出 1）、`scripts/check-commit-message.mjs`（Clean Commit 校验）、`.githooks/commit-msg` 本地钩子
- book/ 模板：guidelines 五篇通用成品（workflow / writing-style / git-workflow / review-checklist / README）+ 两篇带示例的模板（architecture / coding-style）、docs 三区与 ADR-001 示范、notes 四类内嵌写作模板、plans / changelogs 规范
- skills 三件套全自研：`bocode`（入口纪律）、`feature-flow`（Step 0 + 六阶段，TDD 内嵌 Phase 4）、`book-writeback`（回写模板与质量关卡）；superpowers 仅作参考，未收录未改编
- `scripts/init-project.sh`：一键模板化（改名、清活记录、重生成索引、可选重置 git 历史），已在临时 clone 上验证通过
- `.github/workflows/git-policy.yml`：PR 与受保护分支的 Clean Commit / 分支流向校验
- 双语 README：九章设计哲学（问题 → 双半脑 → 飞轮 → 关卡 → 为读者而写 → 索引契约 → 说人话 → git 流 → 自举），英文主文档 + 中文版
