<h1 align="center">EasyCode</h1>

<p align="center">
  <strong>在 DeepSeek Harness 中，通过点击和一句需求创建应用。</strong><br>
  从技术栈、开发环境到 Plan / Go 工作流，把项目初始化交给向导，把真正的开发交给 DeepSeek。
</p>

<p align="center"><sub>社区维护的开源 DeepSeek Harness 插件，并非 DeepSeek 官方产品。</sub></p>

<p align="center">
  <a href="https://github.com/TreasureGooldove/dsh-easycode/actions/workflows/ci.yml"><img src="https://github.com/TreasureGooldove/dsh-easycode/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/version-0.1.0-4D6BFE?style=flat" alt="Version 0.1.0">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D22-339933?style=flat&amp;logo=nodedotjs&amp;logoColor=white" alt="Node.js 22 or newer">
  <img src="https://img.shields.io/badge/DeepSeek%20Harness-Web-4493F8?style=flat" alt="DeepSeek Harness Web plugin">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2EA44F?style=flat" alt="MIT License"></a>
</p>

EasyCode 是一个面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI 的点击式应用创建插件。用户不需要记住脚手架命令，只需输入项目主题并选择少量约束，EasyCode 就会创建安全的本地工作区、准备稳定的开发上下文，并把后续任务交给 DeepSeek 会话继续完成。

<a id="install"></a>

## 安装与启动

EasyCode 通过 DSH 插件机制直接安装。仓库已包含预构建运行文件，安装期间不会执行 `prepare`，无需配置 pnpm `allowBuilds`。

| 要求 | 说明 |
| --- | --- |
| Node.js | 22 或更高版本 |
| DeepSeek Harness | 已安装 `dsh` CLI，并可使用 `web` profile |
| 运行平台 | Harness Web GUI |

安装插件：

```bash
dsh plugin --profile web add github:TreasureGooldove/dsh-easycode
```

启动 Harness：

```bash
dsh --profile web
```

打开 Web GUI 后，可从首页侧栏或「设置 → EasyCode」进入创建向导。如需先确认插件是否进入组合配置，可运行：

```bash
dsh --profile web --dump-config
```

输出中应出现 `easycode` 配置行。

## 从一个想法开始

| 步骤 | 操作 | EasyCode 会做什么 |
| --- | --- | --- |
| 1 | 输入项目名称与应用主题 | 校验名称、需求和目标目录 |
| 2 | 选择简易模式或专业模式 | 自动决策，或收集技术栈、环境与工作流约束 |
| 3 | 点击创建 | 原子生成本地工作区和开发上下文 |
| 4 | 进入 Harness 会话 | 打开新工作区，并把 Plan 或 Go 任务交给 DeepSeek |

## 主要功能

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>简易模式</h3>
      <p>只需填写项目名称和应用主题。技术栈与开发环境由 DeepSeek 根据产品目标决定，默认直接进入 Go 工作流，不初始化 Git，也不启用 MCP。</p>
    </td>
    <td width="50%" valign="top">
      <h3>专业模式</h3>
      <p>明确选择技术栈、开发环境、Git、Plan / Go、设计目标和手动 MCP 配置，也可以把单项决策继续交给 DeepSeek。</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>自动衔接 DeepSeek</h3>
      <p>项目创建成功后，EasyCode 使用 Harness 的工作区、会话与对话能力打开项目，并发送结构化开发任务，不需要额外配置模型 API。</p>
    </td>
    <td width="50%" valign="top">
      <h3>安全的本地生成</h3>
      <p>Host 端重新校验所有输入，限制输出目录，拒绝覆盖同名项目，并通过临时目录和原子发布避免留下半成品。</p>
    </td>
  </tr>
</table>

## 专业模式

### 技术栈

技术栈可以由 DeepSeek 自动决定，也可以从预设或自定义输入中选择。

| 类型 | 可选方案 |
| --- | --- |
| 前端与内容站点 | Vanilla、React、Vue、Svelte、SolidJS、Angular、Astro、Qwik |
| 全栈 Web | Next.js、Nuxt、Remix、SvelteKit、TanStack Start |
| Node.js 与边缘 API | Node.js、Express、Fastify、NestJS、Hono、Bun、Deno |
| Python 后端 | FastAPI、Django |
| 其他后端 | Go、Axum、Spring Boot、Ktor、.NET、Laravel、Rails |
| 桌面、移动与扩展 | Electron、Tauri、React Native、Expo、Flutter、浏览器扩展 |
| 其他 | 自动决策或任意自定义技术栈 |

React + Vite、Vue + Vite、Next.js、Node.js API 和 Vanilla + Vite 带有内置起始结构。其他技术栈会作为明确约束写入 `PLAN.md` 与 `EASYCODE.md`，由 DeepSeek 在后续会话中生成和验证。

### 开发环境

| 类型 | 可选方案 |
| --- | --- |
| 自动 | 由 DeepSeek 根据项目目标决定 |
| 本机 | 本地开发、WSL、Nix |
| 容器 | Docker、Podman、Dev Container、Kubernetes |
| 远程 | SSH、GitHub Codespaces |
| 其他 | 任意自定义开发环境 |

### 工作流与项目选项

| 选项 | 行为 |
| --- | --- |
| Plan | 先完善需求、架构、约束和验收标准，不立即进入完整实现 |
| Go | 要求 DeepSeek 继续生成可运行代码并执行检查 |
| Git | 可初始化一个以 `main` 为首分支的本地仓库，不自动提交或连接远程 |
| 设计目标 | 记录产品体验、视觉方向、工程质量或其他独立目标 |
| MCP | 仅写入用户手动确认的 MCP 配置 |

自动搜寻和安装 MCP 仍为 **WIP**。当前版本不会为此联网搜索、安装软件包或修改 MCP 列表。

## 生成结果

项目默认写入：

```text
$DSH_HOME/easycode-projects/<project-name>
```

每个项目至少包含以下上下文：

| 文件 | 用途 |
| --- | --- |
| `README.md` | 项目目标、技术方案与启动说明 |
| `PLAN.md` | 里程碑、架构约束和验收标准 |
| `EASYCODE.md` | 供 DeepSeek 后续开发读取的稳定上下文 |
| `.easycode/config.json` | 本次向导选项的结构化记录 |
| `.mcp.json` | 仅在用户手动启用 MCP 时生成 |

需要更改输出根目录时，可在 profile 或 `$DSH_HOME/cordis.patch.yml` 中完整覆盖 `easycode` 行：

```yaml
- id: easycode
  name: dsh-easycode
  config:
    outputRoot: '/absolute/path/to/projects'
```

Harness patch 会替换整段 `config`，不会逐字段深度合并。

## 插件架构

EasyCode 由 Host 插件和 Web 客户端插件组成，并通过官方插件配置装入 Harness。

| 组成 | 入口 | 职责 |
| --- | --- | --- |
| Host 插件 | `lib/index.js` | 注册项目创建接口，负责校验、原子写入和可选 Git 初始化 |
| Web 客户端 | `lib/client.js` | 注册首页入口和设置页向导，连接 Harness 工作区与会话 |
| Bundle 配置 | `cordis.patch.yml` | 把 EasyCode 插入 profile，并配置默认输出位置 |

```text
Harness Web GUI
  └─ EasyCode 创建向导
       └─ POST /easycode/api/projects
            └─ Host 校验并创建本地工作区
                 └─ Harness workspace / session / conversation
                      └─ DeepSeek 继续执行 Plan 或 Go
```

## 安全边界

- 生成路径始终限制在配置的 `outputRoot` 内，拒绝路径逃逸。
- 同名目录存在时返回冲突，不覆盖、不合并。
- 文件先写入临时目录，全部成功后才发布到最终路径。
- 创建接口只接受同源、JSON、带 EasyCode 请求头的 POST 请求。
- 请求体最大 64 KB；项目名、枚举、自定义约束和 MCP 结构都会在 Host 端重新校验。
- Git 只执行参数化的 `git init --initial-branch=main`，不会提交、连接远程或推送。
- MCP 只按用户明确输入写入；当前版本不自动发现或安装 MCP。

## 与 DeepSeek Harness 的关系

EasyCode 使用 DeepSeek Harness 提供的插件、Web UI、工作区、会话和对话能力，不修改 Harness 上游源码，也不单独实现模型调用层。

Harness 负责模型与 Agent 运行时；EasyCode 负责把“创建应用前需要做的选择”整理成可点击的产品流程，并将生成后的工作区交回 Harness。其他 DSH 插件仍可按照官方组合机制与 EasyCode 一起使用。

## 开发

克隆仓库后执行：

```bash
npm install
npm run check
```

`npm run check` 会依次执行类型检查、20 项测试、生产构建和包结构校验。构建产物位于 `lib/`，并必须随源码一起提交，以保证 Git 托管安装不依赖安装期脚本。贡献流程和发布约束见 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 项目结构

```text
src/
├── client/          # Harness Web UI 插件
├── http.ts          # 同源 HTTP 边界
├── scaffolder.ts    # 原子项目生成与 Git 初始化
├── templates.ts     # Plan / Go 与技术栈模板
├── types.ts         # 共享请求和结果模型
└── validation.ts    # Host 端输入校验
```

## 路线图

- `v0.1`：双模式向导、DeepSeek 自动决策、35+ 技术栈、丰富开发环境、Plan / Go、Git、手动 MCP 和首页入口。
- `v0.2`：更多生成后验证、可恢复的创建历史和可共享预设。
- `WIP`：在具备明确来源、审查和授权流程后，按项目需求发现合适的 MCP。

## 特别感谢

感谢 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 与 DeepSeek AI 团队提供 Agent 运行时、插件系统和 Web UI，也感谢 [Cordis](https://github.com/cordiverse/cordis) 项目提供插件化基础。

同时感谢每一位测试、反馈和参与 EasyCode 开发的社区成员。

## License

本项目遵循 [MIT License](LICENSE)。

> EasyCode 是基于 DeepSeek Harness 构建的社区插件，并非 DeepSeek 官方产品，也未获得官方背书。

> 本项目完全开源免费。
