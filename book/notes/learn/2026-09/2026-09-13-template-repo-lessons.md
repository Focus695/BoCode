---
description: 把一个项目的方法论抽成通用模板时，工具可移植性、活记录清理、skill/guidelines 分工三条经验
tags: [template, portability, skill-design, tooling]
---

# 抽象通用模板时，可移植性靠"降级到最大公约数"，可清理性靠"结构约定"

- **场景**：把某个项目里跑通的工具链和流程抽成给别人用的模板（不限本项目）。
- **为什么**：
  - 项目内工具可以吃宿主的技术栈红利（如 bun 的 `import.meta.dir`、TypeScript 直跑）；模板不能假设用户有同样的运行时，`fileURLToPath(import.meta.url)` + `.mjs` + 零依赖才是最大公约数。
  - 自举型模板（模板仓库自己用自己的流程）必然产生"作者的活记录"；用户 clone 后要能一键清掉。清理之所以能是一条命令，是因为记录从一开始就按"类型目录 + YYYY-MM 月度子目录"归档——结构约定就是清理接口。
  - skill 与 guideline 内容重复是漂移之源：guidelines 写"是什么/为什么"（人类参考），skills 写"何时做/怎么做"（agent 执行），互相引用、不复制正文。
- **如何应用**：新模板的工具脚本一律 plain Node `.mjs` 起步；自举模板的活记录只落月度目录；写 skill 前先问这条规则 guidelines 里有没有——有就引用，没有才写进 skill。
