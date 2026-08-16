# EasyCode

EasyCode 是一个面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的点击式应用创建插件。它把常见的项目初始化决策收进一个 Web 向导：用户输入应用主题，选择少量选项，就能在本机得到规划文档或可运行的项目骨架。

> 当前版本：`0.1.0`。DeepSeek Harness 仍处于开发者预览阶段，插件接口可能发生不兼容变更。

## 首版能力

### 简易模式

- 只需填写项目名称和应用主题。
- 固定生成 Vanilla JavaScript + Vite 应用。
- 默认使用本地开发环境，不初始化 Git，不启用 MCP。
- 直接执行 Go 工作流，生成可运行的离线事项应用骨架。

### 专业模式

- 技术栈：React + Vite、Vue + Vite、Next.js、Node.js API、Vanilla + Vite。
- 开发环境：本地或 Docker。
- 可选择是否初始化以 `main` 为首分支的 Git 仓库。
- Plan 工作流只创建规划与上下文；Go 工作流同时创建可运行代码。
- 可填写独立的设计目标。
- 可选择是否写入手动确认过的 `.mcp.json`。

“自动搜寻合适的 MCP”在界面中明确标记为 WIP。v0.1 不会为此联网、安装包或修改 MCP 列表。

## 安装

需要 Node.js 22 或更高版本，以及可运行的 `dsh` CLI。

### 从本地检出安装

```bash
npm install
npm run check
npm pack
dsh plugin --profile web add ./dsh-easycode-0.1.0.tgz
dsh web
```

打开 Harness Web UI 后，在设置中选择 `EasyCode`。

### 从 GitHub 安装

Git 安装会运行本仓库的 `prepare` 构建脚本。pnpm 10+ 默认要求用户明确允许安装期构建；请只对你审查并信任的提交授权，并锁定 commit：

```bash
dsh plugin --profile web add github:TreasureGooldove/dsh-easycode#COMMIT_SHA
```

如果 dsh 提示构建未获授权，请把它打印的精确包键加入该 profile 的 `pnpm-workspace.yaml`：

```yaml
allowBuilds:
  dsh-easycode: true
```

随后重新执行安装命令。

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
- `lib/client.js`：Harness Web 客户端插件，在设置页注册 EasyCode 向导。

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

- v0.1：双模式向导、Plan/Go、Docker/本地、Git、手动 MCP。
- v0.2：模板扩展、生成后验证、可恢复的创建历史。
- WIP：基于项目需求发现 MCP；在实现明确的来源、审查和授权流程之前不会自动安装。

## 许可证

[MIT](./LICENSE)
