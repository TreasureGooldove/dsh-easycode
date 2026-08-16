# EasyCode

EasyCode 是一个面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的点击式应用创建插件。它把常见的项目初始化决策收进一个 Web 向导：用户输入应用主题，选择少量约束，EasyCode 会创建本地工作区并自动把开发任务交给 DeepSeek。

> 当前版本：`0.1.0`。DeepSeek Harness 仍处于开发者预览阶段，插件接口可能发生不兼容变更。

## 首版能力

### 简易模式

- 只需填写项目名称和应用主题。
- 技术栈和开发环境默认由 DeepSeek 根据产品目标自动决策。
- 不初始化 Git，不启用 MCP。
- 直接执行 Go 工作流，由 DeepSeek 生成并验证应用。

### 专业模式

- 技术栈可以交给 DeepSeek 自动决策，也可以从 35+ 个预设中选择：
  - 前端与内容站点：Vanilla、React、Vue、Svelte、SolidJS、Angular、Astro、Qwik。
  - 全栈 Web：Next.js、Nuxt、Remix、SvelteKit、TanStack Start。
  - 后端与 API：Node.js、Express、Fastify、NestJS、Hono、Bun、Deno、FastAPI、Django、Go、Axum、Spring Boot、Ktor、.NET、Laravel、Rails。
  - 桌面、移动端与扩展：Electron、Tauri、React Native、Expo、Flutter、浏览器扩展。
  - 任意自定义技术栈。
- 开发环境可以自动决策，也可指定本地、Docker、Podman、Dev Container、WSL、Nix、远程 SSH、GitHub Codespaces、Kubernetes 或任意自定义环境。
- 可选择是否初始化以 `main` 为首分支的 Git 仓库。
- Plan 工作流只完善规划与上下文；Go 工作流要求 DeepSeek 生成可运行代码并执行检查。
- 可填写独立的设计目标。
- 可选择是否写入手动确认过的 `.mcp.json`。

“自动搜寻合适的 MCP”在界面中明确标记为 WIP。v0.1 不会为此联网、安装包或修改 MCP 列表。

EasyCode 同时注册在 Harness 首页侧栏和设置页。首页入口会打开独立创建面板；生成后，插件使用 Harness 的工作区与会话服务打开项目，并自动发送开发任务。

## 安装

需要 Node.js 22 或更高版本，并已安装 DeepSeek Harness CLI。

```bash
dsh plugin --profile web add github:TreasureGooldove/dsh-easycode
```

仓库已包含预构建运行文件，安装期间无需执行 `prepare`，也无需修改 pnpm 的 `allowBuilds`。

```bash
dsh --profile web
```

打开 Harness Web UI 后，可从首页侧栏或设置页进入 `EasyCode`。

## 输出位置

插件默认把项目写到：

```text
$DSH_HOME/easycode-projects/<project-name>
```

输出根目录由 bundle 的 `cordis.patch.yml` 提供。需要更改时，在 profile 或 `$DSH_HOME/cordis.patch.yml` 中完整覆盖 `easycode` 行：

```yaml
- id: easycode
  name: dsh-easycode
  config:
    outputRoot: '/absolute/path/to/projects'
```

注意：Harness patch 会替换整段 `config`，不是逐字段深度合并。

## 安全边界

- 生成目录被限制在配置的 `outputRoot` 下。
- 同名目录存在时返回冲突，不覆盖、不合并。
- 文件先写入临时目录，成功后才原子发布。
- 创建 API 只接受同源、JSON、带 EasyCode 请求头的 POST 请求。
- 请求体最大 64 KB；项目名、枚举和 MCP 结构均在 Host 端再次校验。
- Git 只执行参数化的 `git init --initial-branch=main`，不提交、不连接远程、不推送。
- MCP 配置仅按用户明确输入写入；v0.1 不自动发现或安装 MCP。

## 开发

```bash
npm install
npm run typecheck
npm test
npm run build
```

打包产物位于 `lib/`：

- `lib/index.js`：Host 插件，注册安全的项目创建路由。
- `lib/client.js`：Harness Web 客户端插件，注册首页入口、创建面板和设置页向导，并把任务交给 DeepSeek 会话。

## 项目结构

```text
src/
├── client/          # Web UI 插件
├── http.ts          # 同源 HTTP 边界
├── scaffolder.ts    # 原子项目生成与 Git 初始化
├── templates.ts     # Plan/Go 与各技术栈模板
├── types.ts         # 共享请求/结果模型
└── validation.ts    # Host 端输入校验
```

## 路线图

- v0.1：双模式向导、DeepSeek 自动决策、35+ 技术栈、丰富开发环境、Plan/Go、Git、手动 MCP、首页入口。
- v0.2：更多生成后验证、可恢复的创建历史与可共享预设。
- WIP：基于项目需求发现 MCP；在实现明确的来源、审查和授权流程之前不会自动安装。

## 许可证

[MIT](./LICENSE)
