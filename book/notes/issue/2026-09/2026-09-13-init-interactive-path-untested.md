---
description: init-project.sh 的交互式 git 重置路径未被测试覆盖，非交互主路径已验证
---

# init-project.sh 交互式 git 重置路径未测试

- **Observed**：2026-09-13 奠基施工中，init-project.sh 在临时 clone 上验证走的是非交互路径（项目名与描述以参数传入，无 tty，跳过 git 重置询问）。脚本第 6 步的交互分支（`Reset git history and start fresh? [y/N]` → `rm -rf .git && git init -b main` + 首次提交 + `core.hooksPath` 配置）从未实际执行过。
- **Reproduction**：交互式终端中 `bash scripts/init-project.sh myproj "desc"`，在询问处选 `y`。
- **Suggested direction**：用 `expect` 或手动走一遍该路径；若 `git init -b main` 与首提交行为符合预期则关闭本条。—— recorded only，修复是单独任务。
