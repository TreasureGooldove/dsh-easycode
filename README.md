# EasyCode · 在 DeepSeek Harness 里点击创建应用

EasyCode 是一个面向 DeepSeek Harness Web GUI 的应用创建插件。输入项目名称和需求，选择简易模式或专业模式，EasyCode 会准备本地工作区，并把规划或开发任务直接交给 DeepSeek。

不需要记忆脚手架命令，也不需要为插件单独配置模型或 API Key；生成过程复用 DeepSeek Harness 当前的模型、会话和工作区能力。

> 当前版本：`0.1.0`。DeepSeek Harness 仍处于开发者预览阶段，插件接口可能发生不兼容变更。

## 主要功能

- **首页直接创建**：在 Harness 首页侧栏点击 EasyCode，打开独立创建面板；设置页入口同时保留。
- **简易模式**：只填写项目名称和应用主题，技术栈与开发环境由 DeepSeek 自动决定。
- **专业模式**：手动约束技术栈、开发环境、Git、Plan / Go 工作流、设计目标和 MCP。
- **自动交给 DeepSeek**：项目目录创建成功后，自动注册工作区、打开会话并发送开发任务。
- **本地安全生成**：项目只写入 EasyCode 输出目录；同名目录不会覆盖，文件成功后才原子发布。
- **双主题适配**：使用 Harness 官方主题变量，支持浅色和深色界面。

## 简易模式

简易模式面向“我只想描述需求，然后开始”的场景：

1. 输入项目名称。
2. 输入一句话主题或更具体的应用要求。
3. 点击「让 DeepSeek 创建应用」。
4. EasyCode 创建工作区并启动 Go 工作流。
5. DeepSeek 选择合适的技术方案，生成并验证应用。

简易模式默认不初始化 Git、不启用 MCP，减少首次使用时需要理解的选项。

## 专业模式

专业模式把选项作为 DeepSeek 的工程约束，而不是把应用锁死在固定模板中。

### 技术栈

- 前端与内容站点：Vanilla、React、Vue、Svelte、SolidJS、Angular、Astro、Qwik。
- 全栈 Web：Next.js、Nuxt、Remix、SvelteKit、TanStack Start。
- 后端与 API：Node.js、Express、Fastify、NestJS、Hono、Bun、Deno、FastAPI、Django、Go、Axum、Spring Boot、Ktor、.NET、Laravel、Rails。
- 桌面、移动端与扩展：Electron、Tauri、React Native、Expo、Flutter、浏览器扩展。
- DeepSeek 自动决策或任意自定义技术栈。

React + Vite、Vue + Vite、Next.js、Node.js API 和 Vanilla + Vite 带有内置起始骨架；其他技术栈由 DeepSeek 根据 `EASYCODE.md` 和 `PLAN.md` 继续生成。

### 开发环境

- DeepSeek 自动决策。
- 本地开发、Docker、Podman、Dev Container、WSL、Nix。
- 远程 SSH、GitHub Codespaces、Kubernetes。
- 任意自定义环境约束。

### 工作流

- **Plan**：只完善需求、架构、任务拆分、风险和验收标准，不进入代码实现。
- **Go**：生成完整可运行的应用，执行适合所选技术栈的检查并修复发现的问题。

### Git 与 MCP

- Git 只执行 `git init --initial-branch=main`，不会自动提交、连接远程或推送。
- 手动 MCP 配置会写入项目的 `.mcp.json`。
- 自动搜寻 MCP 当前为 **WIP**：首版不会联网搜索、安装包或修改 MCP 列表。

## 快速安装

需要 Node.js 22 或更高版本，并已安装 DeepSeek Harness CLI。

```bash
dsh plugin --profile web add github:TreasureGooldove/dsh-easycode
```

GitHub 安装会从源码运行 EasyCode 的 `prepare` 构建脚本。pnpm 10 及更高版本可能在首次安装时拒绝执行构建，并打印需要加入 `allowBuilds` 的精确包键。把该键加入对应 `web` profile 的 `pnpm-workspace.yaml` 后，重新执行上面的 DSH 安装命令。

安装完成后先验证配置层：

```bash
dsh --profile web --dump-config
```

输出中应出现 `easycode` 行。随后启动 Harness：

```bash
dsh --profile web
```

打开 Web GUI 后，可从首页侧栏或「设置 → EasyCode」进入创建向导。用于长期使用时，建议在 GitHub 安装地址后附加已审查的 commit SHA，避免默认分支后续变化影响实际安装内容。

## 使用流程

```text
用户输入需求
    ↓
选择简易模式或专业模式
    ↓
EasyCode 校验请求并创建本地项目目录
    ↓
生成 README.md / PLAN.md / EASYCODE.md / .easycode/config.json
    ↓
注册为 Harness 工作区并打开新会话
    ↓
向 DeepSeek 发送 Plan 或 Go 开发任务
    ↓
DeepSeek 在新工作区中规划、生成和验证应用
```

## 架构

EasyCode 是一个 npm bundle，同时包含 Host 和浏览器两个装载面：

| 装载面 | 入口 | 作用 |
|---|---|---|
| Host 插件 | `lib/index.js` | 注册 `/easycode/api/projects`，负责校验、原子写入和 Git 初始化 |
| 浏览器插件 | `lib/client.js` | 注册首页入口、创建面板和设置页，并连接 Harness 工作区与会话 |
| Bundle 配置 | `cordis.patch.yml` | 在 profile 中插入 `easycode` Host 行并配置输出目录 |

```text
浏览器（Harness Web GUI）                 Host（dsh --profile web）
┌──────────────────────────────┐        ┌──────────────────────────────┐
│ 首页 EasyCode / 设置页向导    │  POST  │ /easycode/api/projects       │
│ · 模式与项目要求              │ ─────▶ │ · Host 端输入校验             │
│ · 技术栈与环境约束            │        │ · 临时目录写入与原子发布       │
│ · Plan / Go / Git / MCP      │        │ · 可选 Git 初始化              │
└──────────────┬───────────────┘        └──────────────┬───────────────┘
               │                                       │
               └──── workspaces / sessions / conversation ────┘
                                      ↓
                              DeepSeek 开发会话
```

## 输出位置

项目默认写入：

```text
$DSH_HOME/easycode-projects/<project-name>
```

每个项目至少包含：

| 文件 | 用途 |
|---|---|
| `README.md` | 项目目标、技术方案和启动说明 |
| `PLAN.md` | 里程碑、架构约束与验收标准 |
| `EASYCODE.md` | 供 DeepSeek 持续开发时读取的稳定上下文 |
| `.easycode/config.json` | 本次创建选择的结构化记录 |
| `.mcp.json` | 仅在用户手动启用 MCP 时生成 |

需要修改输出根目录时，可在 profile 或 `$DSH_HOME/cordis.patch.yml` 中完整覆盖 `easycode` 行：

```yaml
- id: easycode
  name: dsh-easycode
  config:
    outputRoot: '/absolute/path/to/projects'
```

Harness patch 会替换整段 `config`，不会逐字段深度合并。

## 安全边界

- 项目路径始终限制在配置的 `outputRoot` 内。
- 已存在的同名目录返回冲突，不覆盖、不合并。
- 文件先写入临时目录，全部成功后才发布到最终路径。
- 创建接口只接受同源、JSON、带 EasyCode 请求头的 POST 请求。
- 请求体最大 64 KB；项目名、枚举、自定义约束和 MCP 结构都会在 Host 端重新校验。
- 不上传生成项目，不创建远程仓库，不自动提交或推送代码。
- MCP 只接受用户明确提供的配置；自动发现和安装仍为 WIP。

## 开发

```bash
npm install
npm run check
```

`npm run check` 会依次执行 TypeScript 类型检查、Vitest 测试和生产构建。

项目结构：

```text
src/
├── client/          # Harness Web UI 插件
├── http.ts          # 同源 HTTP 边界
├── scaffolder.ts    # 原子项目生成与 Git 初始化
├── templates.ts     # Plan / Go 上下文与内置起始骨架
├── types.ts         # 共享请求与结果模型
└── validation.ts    # Host 端输入校验
```

## 路线图

- `v0.1`：双模式向导、DeepSeek 自动决策、专业约束、Plan / Go、Git、手动 MCP、首页入口。
- `v0.2`：生成后验证记录、可恢复的创建历史和可共享预设。
- `WIP`：基于项目需求发现 MCP；在具备明确来源、审查和授权流程前不会自动安装。

## 许可

[MIT](./LICENSE)
