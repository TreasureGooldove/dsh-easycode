# 贡献指南

本项目采用 GitHub Flow。

1. 从最新 `main` 创建短生命周期功能分支，例如 `feat/add-template`。
2. 只提交与当前目标相关的变更。
3. 提交前运行 `npm run check`。
4. 使用 Conventional Commits，例如 `feat: add Svelte template`。
5. 推送分支并创建 Pull Request；不要直接向 `main` 推送功能开发。

修改项目生成逻辑时，请至少覆盖以下边界：Plan/Go、已有同名目录、路径逃逸、Docker、Git 与 MCP 输入校验。
