import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rename, rm, stat, writeFile } from "node:fs/promises";
import { promisify } from "node:util";

//#region src/templates.ts
function json(value) {
	return `${JSON.stringify(value, null, 2)}\n`;
}
function html(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
function packageName(input) {
	return input.replace(/[\u4e00-\u9fff]/g, "app").replace(/-+/g, "-").replace(/^-|-$/g, "") || "easycode-app";
}
function commonCss() {
	return `:root {
  color: #1f2933;
  background: #f4f1ea;
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
  font-synthesis: none;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: #f4f1ea;
}

button, input { font: inherit; }

button {
  border: 0;
  cursor: pointer;
}

button:focus-visible, input:focus-visible {
  outline: 3px solid #24786e;
  outline-offset: 2px;
}

.shell {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 48px 0 72px;
}

.eyebrow {
  margin: 0 0 14px;
  color: #24786e;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: .16em;
  text-transform: uppercase;
}

h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(40px, 7vw, 76px);
  line-height: .98;
  letter-spacing: -.055em;
}

.lede {
  max-width: 680px;
  margin: 24px 0 0;
  color: #59636e;
  font-size: 18px;
  line-height: 1.7;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 24px;
  margin-top: 48px;
}

.board, .brief {
  border: 1px solid #d8d2c7;
  background: #fffdf8;
}

.board { padding: 24px; }
.brief { align-self: start; padding: 24px; }

.composer { display: grid; grid-template-columns: 1fr auto; gap: 10px; }

.composer input {
  min-width: 0;
  border: 1px solid #c6c0b5;
  border-radius: 8px;
  background: #fff;
  padding: 13px 14px;
}

.primary {
  border-radius: 8px;
  background: #24786e;
  color: #fff;
  padding: 12px 18px;
  font-weight: 700;
  transition: transform 160ms ease, background 160ms ease;
}

.primary:hover { background: #1b655d; }
.primary:active { transform: scale(.98); }

.list { display: grid; gap: 1px; margin-top: 24px; background: #ded9cf; }

.item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  background: #fffdf8;
  padding: 14px 12px;
}

.item.done .item-text { color: #889097; text-decoration: line-through; }
.item-toggle { width: 22px; height: 22px; border: 1px solid #9ca3aa; background: #fff; }
.item.done .item-toggle { background: #24786e; box-shadow: inset 0 0 0 5px #fff; }
.item-delete { background: transparent; color: #8b4d3f; padding: 6px; }

.empty { margin: 28px 0 4px; color: #7a838b; text-align: center; }
.brief h2 { margin: 0 0 16px; font-size: 16px; }
.brief p { margin: 0; color: #626b73; line-height: 1.65; }
.metric { margin-top: 28px; border-top: 1px solid #ded9cf; padding-top: 18px; }
.metric strong { display: block; font-size: 32px; letter-spacing: -.04em; }
.metric span { color: #68727a; font-size: 13px; }

@media (max-width: 760px) {
  .shell { width: min(100% - 24px, 1120px); padding-top: 28px; }
  .workspace { grid-template-columns: 1fr; margin-top: 34px; }
  .composer { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
}
`;
}
const STACK_LABELS = {
	auto: "由 DeepSeek 根据需求自动决策",
	vanilla: "Vanilla JavaScript + Vite",
	"react-vite": "React + Vite",
	"vue-vite": "Vue + Vite",
	"svelte-vite": "Svelte + Vite",
	"solid-vite": "SolidJS + Vite",
	angular: "Angular",
	astro: "Astro",
	qwik: "Qwik",
	nextjs: "Next.js",
	nuxt: "Nuxt",
	remix: "Remix",
	sveltekit: "SvelteKit",
	"tanstack-start": "TanStack Start",
	"node-api": "Node.js API",
	express: "Express",
	fastify: "Fastify",
	nestjs: "NestJS",
	hono: "Hono",
	"bun-api": "Bun API",
	"deno-api": "Deno API",
	"python-fastapi": "Python + FastAPI",
	"python-django": "Python + Django",
	"go-api": "Go API",
	"rust-axum": "Rust + Axum",
	"java-spring": "Java + Spring Boot",
	"kotlin-ktor": "Kotlin + Ktor",
	"dotnet-api": ".NET Web API",
	"php-laravel": "PHP + Laravel",
	"ruby-rails": "Ruby on Rails",
	electron: "Electron",
	tauri: "Tauri",
	"react-native": "React Native",
	expo: "Expo",
	flutter: "Flutter",
	"browser-extension": "浏览器扩展",
	custom: "自定义技术栈"
};
const ENVIRONMENT_LABELS = {
	auto: "由 DeepSeek 根据技术栈自动决策",
	local: "本地开发",
	docker: "Docker",
	podman: "Podman",
	devcontainer: "Dev Container",
	wsl: "WSL",
	nix: "Nix / devenv",
	"remote-ssh": "远程 SSH",
	codespaces: "GitHub Codespaces",
	kubernetes: "Kubernetes 开发环境",
	custom: "自定义开发环境"
};
const BUILTIN_STACKS = new Set([
	"vanilla",
	"react-vite",
	"vue-vite",
	"nextjs",
	"node-api"
]);
const BACKEND_STACKS = new Set([
	"node-api",
	"express",
	"fastify",
	"nestjs",
	"hono",
	"bun-api",
	"deno-api",
	"python-fastapi",
	"python-django",
	"go-api",
	"rust-axum",
	"java-spring",
	"kotlin-ktor",
	"dotnet-api",
	"php-laravel",
	"ruby-rails"
]);
function stackLabel(config) {
	return config.stack === "custom" ? config.stackDetail : STACK_LABELS[config.stack];
}
function environmentLabel(config) {
	return config.environment === "custom" ? config.environmentDetail : ENVIRONMENT_LABELS[config.environment];
}
function projectReadme(config) {
	const hasStarter = config.workflow === "go" && BUILTIN_STACKS.has(config.stack);
	const nextStep = config.workflow === "plan" ? `## 下一步

当前目录包含项目规划和稳定上下文。DeepSeek 将先完善方案，不进入代码实现。` : hasStarter ? `## 启动

\`\`\`bash
npm install
npm run dev
\`\`\`

${config.environment === "docker" ? `也可以运行：

\`\`\`bash
docker compose up --build
\`\`\`` : ""}` : `## 下一步

EasyCode 已准备项目上下文，DeepSeek 将读取 \`EASYCODE.md\` 与 \`PLAN.md\`，决定工程细节并生成应用。`;
	return `# ${config.projectName}

由 EasyCode 为 DeepSeek Harness 生成。

## 项目目标

${config.topic}

${nextStep}

## 开发约定

- 技术栈：${stackLabel(config)}
- 开发环境：${environmentLabel(config)}
- 工作流：${config.workflow === "plan" ? "Plan（只完善规划）" : hasStarter ? "Go（已有基础骨架，交给 DeepSeek 完成）" : "Go（交给 DeepSeek 生成）"}
- 设计目标：${config.designGoal || "清晰、快速、移动端可用"}
- MCP：${config.mcpEnabled ? "已写入 .mcp.json" : "未启用"}
`;
}
function projectPlan(config) {
	const backend = BACKEND_STACKS.has(config.stack);
	const milestones = backend ? `1. 定义资源模型、接口契约和错误格式。
2. 实现健康检查、核心路由与输入校验。
3. 补齐鉴权边界、日志、持久化策略和接口测试。
4. 运行检查并记录部署与回滚说明。` : `1. 建立项目结构和开发脚本。
2. 实现核心页面、主要输入与结果状态。
3. 补齐空状态、错误状态、键盘操作和移动端布局。
4. 运行检查并记录交付说明。`;
	const acceptance = backend ? `- 健康检查与本地开发命令可以运行。
- 接口输入有校验，错误响应具有稳定结构。
- 鉴权和持久化方案不依赖未配置的外部服务。` : `- 本地开发命令可以启动。
- 核心流程在桌面端和移动端均可完成。
- 输入有校验，失败有明确反馈。`;
	return `# ${config.projectName} 实施计划

## 目标

${config.topic}

## 体验原则

${config.designGoal || "减少首次使用阻力，保证主要任务在移动端和桌面端都清晰可达。"}

## 技术方案

- 技术栈：${stackLabel(config)}
- 开发环境：${environmentLabel(config)}
- Git 仓库：${config.initializeGit ? "初始化" : "不初始化"}
- MCP：${config.mcpEnabled ? "手动配置" : "关闭"}

## 架构约束

- 先围绕核心功能选择最小可维护架构；当技术栈为“自动”时，由 DeepSeek 说明关键取舍。
- 同一 TypeScript 团队的全栈项目优先端到端类型安全；跨语言或公开接口优先 OpenAPI；简单页面使用类型化请求封装即可。
- 仅在确有账户能力时加入认证。Web 默认使用安全的服务端会话，不把密钥或敏感令牌写入客户端。
- 单向实时更新优先 SSE，只有需要双向低延迟通信时才使用 WebSocket。
- 服务端应包含输入校验、统一错误结构、健康检查与优雅退出；测试和部署策略随所选技术栈落地。

## 里程碑

${milestones}

## 完成标准

${acceptance}
- 不提交密钥、构建产物或依赖目录。
`;
}
function easyCodeBrief(config) {
	return `# EasyCode 项目说明

此文件是生成项目的稳定上下文，供 DeepSeek Harness 或其他编码智能体继续开发时读取。

## 用户要求

${config.topic}

## 设计目标

${config.designGoal || "界面直接、结构清楚、默认可运行。"}

## 用户约束

- 模式：${config.mode === "simple" ? "简易模式" : "专业模式"}
- 工作流：${config.workflow}
- 技术栈：${stackLabel(config)}
- 环境：${environmentLabel(config)}
- Git：${config.initializeGit ? "是" : "否"}
- MCP：${config.mcpEnabled ? "手动启用" : "关闭"}

## DeepSeek 执行规则

- 技术栈或环境为“自动”时，根据用户目标、交付形态、团队维护成本和部署条件自行选择，并在 README 中记录理由。
- 用户指定技术栈或环境时，把它视为强约束；只有在明显不兼容时才选择最接近的替代方案并说明原因。
- Plan 工作流只完善调研、架构、任务拆分和验收标准，不实现应用代码。
- Go 工作流应实现可运行应用，补齐必要的校验、错误状态、测试和启动说明，并实际运行适合该技术栈的检查。
- 先读取现有文件；若已有基础骨架，在其上继续，不要无故重建。
- 不要自动搜索或安装 MCP；该能力在 EasyCode v1 中仍为 WIP。
`;
}
function baseFiles(config) {
	const files = /* @__PURE__ */ new Map();
	files.set("README.md", projectReadme(config));
	files.set("PLAN.md", projectPlan(config));
	files.set("EASYCODE.md", easyCodeBrief(config));
	files.set(".easycode/config.json", json(config));
	files.set(".gitignore", `node_modules/
dist/
build/
.next/
.nuxt/
.svelte-kit/
.venv/
__pycache__/
target/
bin/
obj/
.dart_tool/
.idea/
.vscode/
.env
.env.*
!.env.example
*.log
`);
	if (config.mcpEnabled) files.set(".mcp.json", json({ mcpServers: config.mcpServers }));
	return files;
}
function vanillaFiles(config) {
	const title = html(config.topic.split(/[。.!！?？\n]/)[0]?.slice(0, 72) || config.projectName);
	const files = /* @__PURE__ */ new Map();
	files.set("package.json", json({
		name: packageName(config.projectName),
		private: true,
		version: "0.1.0",
		type: "module",
		scripts: {
			dev: "vite --host 0.0.0.0",
			build: "vite build",
			preview: "vite preview --host 0.0.0.0"
		},
		devDependencies: { vite: "^7.1.0" }
	}));
	files.set("index.html", `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${title}" />
    <title>${title}</title>
  </head>
  <body>
    <main class="shell">
      <p class="eyebrow">EasyCode starter</p>
      <h1>${title}</h1>
      <p class="lede">把想法拆成可以完成的小步骤。数据保存在当前浏览器中。</p>
      <section class="workspace" aria-label="应用工作区">
        <div class="board">
          <form class="composer" id="item-form">
            <input id="item-input" name="item" maxlength="120" placeholder="输入下一件要完成的事" aria-label="新事项" required />
            <button class="primary" type="submit">添加事项</button>
          </form>
          <div class="list" id="item-list" aria-live="polite"></div>
          <p class="empty" id="empty-state">还没有事项，从上方添加第一条。</p>
        </div>
        <aside class="brief">
          <h2>项目目标</h2>
          <p>${html(config.topic)}</p>
          <div class="metric"><strong id="open-count">0</strong><span>项待完成</span></div>
        </aside>
      </section>
    </main>
    <script type="module" src="/src/main.js"><\/script>
  </body>
</html>
`);
	files.set("src/style.css", commonCss());
	files.set("src/main.js", `import './style.css'

const storageKey = ${JSON.stringify(`easycode:${config.projectName}:items`)}
const form = document.querySelector('#item-form')
const input = document.querySelector('#item-input')
const list = document.querySelector('#item-list')
const empty = document.querySelector('#empty-state')
const count = document.querySelector('#open-count')
let items = load()

function load() {
  try { return JSON.parse(localStorage.getItem(storageKey) ?? '[]') }
  catch { return [] }
}

function save() {
  localStorage.setItem(storageKey, JSON.stringify(items))
}

function render() {
  list.replaceChildren(...items.map(item => {
    const row = document.createElement('div')
    row.className = 'item' + (item.done ? ' done' : '')
    const toggle = document.createElement('button')
    toggle.className = 'item-toggle'
    toggle.type = 'button'
    toggle.ariaLabel = item.done ? '标记为未完成' : '标记为完成'
    toggle.addEventListener('click', () => {
      item.done = !item.done
      save()
      render()
    })
    const label = document.createElement('span')
    label.className = 'item-text'
    label.textContent = item.text
    const remove = document.createElement('button')
    remove.className = 'item-delete'
    remove.type = 'button'
    remove.textContent = '删除'
    remove.addEventListener('click', () => {
      items = items.filter(candidate => candidate.id !== item.id)
      save()
      render()
    })
    row.append(toggle, label, remove)
    return row
  }))
  empty.hidden = items.length > 0
  count.textContent = String(items.filter(item => !item.done).length)
}

form.addEventListener('submit', event => {
  event.preventDefault()
  const text = input.value.trim()
  if (!text) return
  items.unshift({ id: crypto.randomUUID(), text, done: false })
  input.value = ''
  save()
  render()
  input.focus()
})

render()
`);
	return files;
}
function reactFiles(config) {
	const files = /* @__PURE__ */ new Map();
	files.set("package.json", json({
		name: packageName(config.projectName),
		private: true,
		version: "0.1.0",
		type: "module",
		scripts: {
			dev: "vite --host 0.0.0.0",
			build: "tsc -b && vite build",
			preview: "vite preview --host 0.0.0.0"
		},
		dependencies: {
			"@vitejs/plugin-react": "^5.0.0",
			vite: "^7.1.0",
			typescript: "^5.9.0",
			react: "^19.1.0",
			"react-dom": "^19.1.0"
		},
		devDependencies: {
			"@types/react": "^19.1.0",
			"@types/react-dom": "^19.1.0"
		}
	}));
	files.set("index.html", "<!doctype html>\n<html lang=\"zh-CN\"><head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>EasyCode App</title></head><body><div id=\"root\"></div><script type=\"module\" src=\"/src/main.tsx\"><\/script></body></html>\n");
	files.set("tsconfig.json", json({
		compilerOptions: {
			target: "ES2022",
			useDefineForClassFields: true,
			lib: [
				"ES2022",
				"DOM",
				"DOM.Iterable"
			],
			allowJs: false,
			skipLibCheck: true,
			esModuleInterop: true,
			allowSyntheticDefaultImports: true,
			strict: true,
			forceConsistentCasingInFileNames: true,
			module: "ESNext",
			moduleResolution: "Bundler",
			resolveJsonModule: true,
			isolatedModules: true,
			noEmit: true,
			jsx: "react-jsx"
		},
		include: ["src"]
	}));
	files.set("vite.config.ts", "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({ plugins: [react()] })\n");
	files.set("src/main.tsx", "import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport { App } from './App'\nimport './style.css'\n\ncreateRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)\n");
	files.set("src/App.tsx", `import { useEffect, useMemo, useState, type FormEvent } from 'react'

type Item = { id: string; text: string; done: boolean }
const storageKey = ${JSON.stringify(`easycode:${config.projectName}:items`)}

export function App() {
  const [items, setItems] = useState<Item[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) ?? '[]') }
    catch { return [] }
  })
  const [draft, setDraft] = useState('')
  const open = useMemo(() => items.filter(item => !item.done).length, [items])
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(items)), [items])

  function submit(event: FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setItems(current => [{ id: crypto.randomUUID(), text, done: false }, ...current])
    setDraft('')
  }

  return <main className="shell">
    <p className="eyebrow">EasyCode starter</p>
    <h1>{${JSON.stringify(config.topic.split(/[。.!！?？\n]/)[0]?.slice(0, 72) || config.projectName)}}</h1>
    <p className="lede">把想法拆成可以完成的小步骤。数据保存在当前浏览器中。</p>
    <section className="workspace" aria-label="应用工作区">
      <div className="board">
        <form className="composer" onSubmit={submit}>
          <input value={draft} onChange={event => setDraft(event.target.value)} maxLength={120} placeholder="输入下一件要完成的事" aria-label="新事项" required />
          <button className="primary" type="submit">添加事项</button>
        </form>
        <div className="list" aria-live="polite">
          {items.map(item => <div className={'item' + (item.done ? ' done' : '')} key={item.id}>
            <button className="item-toggle" type="button" aria-label={item.done ? '标记为未完成' : '标记为完成'} onClick={() => setItems(current => current.map(candidate => candidate.id === item.id ? { ...candidate, done: !candidate.done } : candidate))} />
            <span className="item-text">{item.text}</span>
            <button className="item-delete" type="button" onClick={() => setItems(current => current.filter(candidate => candidate.id !== item.id))}>删除</button>
          </div>)}
        </div>
        {items.length === 0 && <p className="empty">还没有事项，从上方添加第一条。</p>}
      </div>
      <aside className="brief"><h2>项目目标</h2><p>{${JSON.stringify(config.topic)}}</p><div className="metric"><strong>{open}</strong><span>项待完成</span></div></aside>
    </section>
  </main>
}
`);
	files.set("src/style.css", commonCss());
	return files;
}
function vueFiles(config) {
	const files = /* @__PURE__ */ new Map();
	files.set("package.json", json({
		name: packageName(config.projectName),
		private: true,
		version: "0.1.0",
		type: "module",
		scripts: {
			dev: "vite --host 0.0.0.0",
			build: "vite build",
			preview: "vite preview --host 0.0.0.0"
		},
		dependencies: {
			"@vitejs/plugin-vue": "^6.0.0",
			vite: "^7.1.0",
			vue: "^3.5.0"
		}
	}));
	files.set("index.html", "<!doctype html>\n<html lang=\"zh-CN\"><head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>EasyCode App</title></head><body><div id=\"app\"></div><script type=\"module\" src=\"/src/main.js\"><\/script></body></html>\n");
	files.set("vite.config.js", "import { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\n\nexport default defineConfig({ plugins: [vue()] })\n");
	files.set("src/main.js", "import { createApp } from 'vue'\nimport App from './App.vue'\nimport './style.css'\n\ncreateApp(App).mount('#app')\n");
	files.set("src/App.vue", `<script setup>
import { computed, ref, watch } from 'vue'
const storageKey = ${JSON.stringify(`easycode:${config.projectName}:items`)}
const draft = ref('')
const items = ref(JSON.parse(localStorage.getItem(storageKey) ?? '[]'))
const open = computed(() => items.value.filter(item => !item.done).length)
const title = ${JSON.stringify(config.topic.split(/[。.!！?？\n]/)[0]?.slice(0, 72) || config.projectName)}
const goal = ${JSON.stringify(config.topic)}
watch(items, value => localStorage.setItem(storageKey, JSON.stringify(value)), { deep: true })
function add() {
  const text = draft.value.trim()
  if (!text) return
  items.value.unshift({ id: crypto.randomUUID(), text, done: false })
  draft.value = ''
}
<\/script>

<template>
  <main class="shell">
    <p class="eyebrow">EasyCode starter</p>
    <h1>{{ title }}</h1>
    <p class="lede">把想法拆成可以完成的小步骤。数据保存在当前浏览器中。</p>
    <section class="workspace" aria-label="应用工作区">
      <div class="board">
        <form class="composer" @submit.prevent="add"><input v-model="draft" maxlength="120" placeholder="输入下一件要完成的事" aria-label="新事项" required /><button class="primary">添加事项</button></form>
        <div class="list" aria-live="polite"><div v-for="item in items" :key="item.id" :class="['item', { done: item.done }]">
          <button class="item-toggle" type="button" :aria-label="item.done ? '标记为未完成' : '标记为完成'" @click="item.done = !item.done" />
          <span class="item-text">{{ item.text }}</span><button class="item-delete" type="button" @click="items = items.filter(candidate => candidate.id !== item.id)">删除</button>
        </div></div>
        <p v-if="items.length === 0" class="empty">还没有事项，从上方添加第一条。</p>
      </div>
      <aside class="brief"><h2>项目目标</h2><p>{{ goal }}</p><div class="metric"><strong>{{ open }}</strong><span>项待完成</span></div></aside>
    </section>
  </main>
</template>
`);
	files.set("src/style.css", commonCss());
	return files;
}
function nextFiles(config) {
	const files = /* @__PURE__ */ new Map();
	files.set("package.json", json({
		name: packageName(config.projectName),
		private: true,
		version: "0.1.0",
		scripts: {
			dev: "next dev --hostname 0.0.0.0",
			build: "next build",
			start: "next start"
		},
		dependencies: {
			next: "^15.4.0",
			react: "^19.1.0",
			"react-dom": "^19.1.0"
		},
		devDependencies: {
			"@types/node": "^24.0.0",
			"@types/react": "^19.1.0",
			typescript: "^5.9.0"
		}
	}));
	files.set("tsconfig.json", json({
		compilerOptions: {
			target: "ES2017",
			lib: [
				"dom",
				"dom.iterable",
				"esnext"
			],
			allowJs: false,
			skipLibCheck: true,
			strict: true,
			noEmit: true,
			esModuleInterop: true,
			module: "esnext",
			moduleResolution: "bundler",
			resolveJsonModule: true,
			isolatedModules: true,
			jsx: "preserve",
			incremental: true,
			plugins: [{ name: "next" }]
		},
		include: [
			"next-env.d.ts",
			"**/*.ts",
			"**/*.tsx",
			".next/types/**/*.ts"
		],
		exclude: ["node_modules"]
	}));
	files.set("next-env.d.ts", "/// <reference types=\"next\" />\n/// <reference types=\"next/image-types/global\" />\n");
	files.set("app/layout.tsx", "import type { ReactNode } from 'react'\nimport './globals.css'\n\nexport const metadata = { title: 'EasyCode App', description: 'Generated by EasyCode' }\nexport default function RootLayout({ children }: Readonly<{ children: ReactNode }>) { return <html lang=\"zh-CN\"><body>{children}</body></html> }\n");
	files.set("app/page.tsx", `'use client'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
type Item = { id: string; text: string; done: boolean }
const storageKey = ${JSON.stringify(`easycode:${config.projectName}:items`)}
export default function Home() {
  const [ready, setReady] = useState(false)
  const [draft, setDraft] = useState('')
  const [items, setItems] = useState<Item[]>([])
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem(storageKey) ?? '[]')) } finally { setReady(true) } }, [])
  useEffect(() => { if (ready) localStorage.setItem(storageKey, JSON.stringify(items)) }, [items, ready])
  const open = useMemo(() => items.filter(item => !item.done).length, [items])
  function submit(event: FormEvent) { event.preventDefault(); const text = draft.trim(); if (!text) return; setItems(current => [{ id: crypto.randomUUID(), text, done: false }, ...current]); setDraft('') }
  return <main className="shell"><p className="eyebrow">EasyCode starter</p><h1>{${JSON.stringify(config.topic.split(/[。.!！?？\n]/)[0]?.slice(0, 72) || config.projectName)}}</h1><p className="lede">把想法拆成可以完成的小步骤。数据保存在当前浏览器中。</p><section className="workspace" aria-label="应用工作区"><div className="board"><form className="composer" onSubmit={submit}><input value={draft} onChange={event => setDraft(event.target.value)} maxLength={120} placeholder="输入下一件要完成的事" aria-label="新事项" required/><button className="primary">添加事项</button></form><div className="list" aria-live="polite">{items.map(item => <div className={'item' + (item.done ? ' done' : '')} key={item.id}><button className="item-toggle" type="button" aria-label={item.done ? '标记为未完成' : '标记为完成'} onClick={() => setItems(current => current.map(candidate => candidate.id === item.id ? { ...candidate, done: !candidate.done } : candidate))}/><span className="item-text">{item.text}</span><button className="item-delete" type="button" onClick={() => setItems(current => current.filter(candidate => candidate.id !== item.id))}>删除</button></div>)}</div>{ready && items.length === 0 && <p className="empty">还没有事项，从上方添加第一条。</p>}</div><aside className="brief"><h2>项目目标</h2><p>{${JSON.stringify(config.topic)}}</p><div className="metric"><strong>{open}</strong><span>项待完成</span></div></aside></section></main>
}
`);
	files.set("app/globals.css", commonCss());
	return files;
}
function nodeApiFiles(config) {
	const files = /* @__PURE__ */ new Map();
	files.set("package.json", json({
		name: packageName(config.projectName),
		private: true,
		version: "0.1.0",
		type: "module",
		scripts: {
			dev: "node --watch src/server.js",
			start: "node src/server.js"
		}
	}));
	files.set("src/server.js", `import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'

const port = Number(process.env.PORT ?? 3000)
const items = []

function send(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(value))
}

async function body(req) {
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 32_768) throw new Error('请求体过大')
  }
  return raw ? JSON.parse(raw) : {}
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost')
    if (req.method === 'GET' && url.pathname === '/') return send(res, 200, { name: ${JSON.stringify(config.projectName)}, goal: ${JSON.stringify(config.topic)}, status: 'ok' })
    if (req.method === 'GET' && url.pathname === '/api/items') return send(res, 200, { items })
    if (req.method === 'POST' && url.pathname === '/api/items') {
      const input = await body(req)
      if (typeof input.text !== 'string' || !input.text.trim()) return send(res, 400, { error: 'text 不能为空' })
      const item = { id: randomUUID(), text: input.text.trim(), done: false }
      items.unshift(item)
      return send(res, 201, { item })
    }
    const match = url.pathname.match(/^\\/api\\/items\\/([^/]+)$/)
    if (req.method === 'DELETE' && match) {
      const index = items.findIndex(item => item.id === match[1])
      if (index < 0) return send(res, 404, { error: '事项不存在' })
      items.splice(index, 1)
      return send(res, 200, { ok: true })
    }
    return send(res, 404, { error: '路由不存在' })
  } catch (error) {
    return send(res, 400, { error: error instanceof Error ? error.message : '请求失败' })
  }
})

server.listen(port, '0.0.0.0', () => console.log(\`EasyCode API running at http://localhost:\${port}\`))
`);
	return files;
}
function dockerFiles(config) {
	const files = /* @__PURE__ */ new Map();
	const port = config.stack === "node-api" ? 3e3 : config.stack === "nextjs" ? 3e3 : 5173;
	files.set("Dockerfile", `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${port}
CMD ["npm", "run", "dev"]
`);
	files.set("docker-compose.yml", `services:
  app:
    build: .
    ports:
      - "${port}:${port}"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
`);
	files.set(".dockerignore", "node_modules\ndist\n.next\n.git\n*.log\n");
	return files;
}
function merge(target, source) {
	for (const [path, content] of source) target.set(path, content);
}
function buildProjectFiles(config) {
	const files = baseFiles(config);
	if (config.workflow === "go") {
		const builder = {
			vanilla: vanillaFiles,
			"react-vite": reactFiles,
			"vue-vite": vueFiles,
			nextjs: nextFiles,
			"node-api": nodeApiFiles
		}[config.stack];
		if (builder !== void 0) {
			merge(files, builder(config));
			if (config.environment === "docker") merge(files, dockerFiles(config));
		}
	}
	return files;
}

//#endregion
//#region src/scaffolder.ts
const execFileAsync = promisify(execFile);
var ProjectExistsError = class extends Error {
	constructor(projectPath) {
		super(`项目目录已存在：${projectPath}`);
		this.projectPath = projectPath;
		this.name = "ProjectExistsError";
	}
};
function assertChildPath(root, candidate) {
	const rel = relative(root, candidate);
	if (rel === "" || rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error("项目路径超出允许的输出目录");
}
async function writeFiles(root, files) {
	for (const [relativePath, content] of files) {
		const output = resolve(root, relativePath);
		assertChildPath(root, output);
		await mkdir(dirname(output), { recursive: true });
		await writeFile(output, content, {
			encoding: "utf8",
			flag: "wx"
		});
	}
}
async function initializeGitRepository(root) {
	try {
		await execFileAsync("git", ["init", "--initial-branch=main"], {
			cwd: root,
			windowsHide: true,
			timeout: 3e4
		});
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`Git 初始化失败：${detail}`);
	}
}
async function pathExists(path) {
	try {
		await stat(path);
		return true;
	} catch (error) {
		if ((error instanceof Error && "code" in error ? String(error.code) : "") === "ENOENT") return false;
		throw error;
	}
}
async function generateProject(outputRoot, config) {
	const root = resolve(outputRoot);
	const target = resolve(root, config.projectName);
	assertChildPath(root, target);
	await mkdir(root, { recursive: true });
	if (await pathExists(target)) throw new ProjectExistsError(target);
	const temporary = await mkdtemp(join(root, `.${config.projectName}-`));
	let published = false;
	try {
		const files = buildProjectFiles(config);
		await writeFiles(temporary, files);
		if (config.initializeGit) await initializeGitRepository(temporary);
		try {
			await rename(temporary, target);
		} catch (error) {
			const code = error instanceof Error && "code" in error ? String(error.code) : "";
			if (code === "EEXIST" || code === "ENOTEMPTY" || code === "EPERM" && await pathExists(target)) throw new ProjectExistsError(target);
			throw error;
		}
		published = true;
		return {
			ok: true,
			projectName: config.projectName,
			outputPath: target,
			workflow: config.workflow,
			files: [...files.keys()].sort(),
			gitInitialized: config.initializeGit
		};
	} finally {
		if (!published) await rm(temporary, {
			recursive: true,
			force: true
		});
	}
}

//#endregion
//#region src/types.ts
const APP_MODES = ["simple", "professional"];
const APP_STACKS = [
	"auto",
	"vanilla",
	"react-vite",
	"vue-vite",
	"svelte-vite",
	"solid-vite",
	"angular",
	"astro",
	"qwik",
	"nextjs",
	"nuxt",
	"remix",
	"sveltekit",
	"tanstack-start",
	"node-api",
	"express",
	"fastify",
	"nestjs",
	"hono",
	"bun-api",
	"deno-api",
	"python-fastapi",
	"python-django",
	"go-api",
	"rust-axum",
	"java-spring",
	"kotlin-ktor",
	"dotnet-api",
	"php-laravel",
	"ruby-rails",
	"electron",
	"tauri",
	"react-native",
	"expo",
	"flutter",
	"browser-extension",
	"custom"
];
const DEV_ENVIRONMENTS = [
	"auto",
	"local",
	"docker",
	"podman",
	"devcontainer",
	"wsl",
	"nix",
	"remote-ssh",
	"codespaces",
	"kubernetes",
	"custom"
];
const WORKFLOWS = ["plan", "go"];

//#endregion
//#region src/validation.ts
var ValidationError = class extends Error {
	constructor(message, field) {
		super(message);
		this.field = field;
		this.name = "ValidationError";
	}
};
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function requiredString(value, field, maxLength) {
	if (typeof value !== "string" || value.trim().length === 0) throw new ValidationError("该字段不能为空", field);
	const normalized = value.trim();
	if (normalized.length > maxLength) throw new ValidationError(`最多允许 ${maxLength} 个字符`, field);
	return normalized;
}
function optionalString(value, field, maxLength) {
	if (value === void 0) return "";
	if (typeof value !== "string") throw new ValidationError("该字段必须是字符串", field);
	const normalized = value.trim();
	if (normalized.length > maxLength) throw new ValidationError(`最多允许 ${maxLength} 个字符`, field);
	return normalized;
}
function enumValue(value, allowed, field, fallback) {
	if (value === void 0) return fallback;
	if (typeof value !== "string" || !allowed.includes(value)) throw new ValidationError("选项无效", field);
	return value;
}
function normalizeProjectName(value) {
	const slug = requiredString(value, "projectName", 64).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-+|-+$/g, "").replace(/-+/g, "-");
	if (slug.length === 0 || slug === "." || slug === "..") throw new ValidationError("请输入有效的项目名称", "projectName");
	return slug;
}
function normalizeMcpServer(name$1, value) {
	if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/.test(name$1)) throw new ValidationError(`MCP 服务名“${name$1}”无效`, "mcpServers");
	if (!isRecord(value)) throw new ValidationError(`MCP 服务“${name$1}”必须是对象`, "mcpServers");
	const command = value.command;
	const url = value.url;
	if (typeof command !== "string" && typeof url !== "string") throw new ValidationError(`MCP 服务“${name$1}”需要 command 或 url`, "mcpServers");
	if (command !== void 0 && (typeof command !== "string" || command.trim().length === 0)) throw new ValidationError(`MCP 服务“${name$1}”的 command 无效`, "mcpServers");
	if (url !== void 0) {
		if (typeof url !== "string") throw new ValidationError(`MCP 服务“${name$1}”的 url 无效`, "mcpServers");
		let parsed;
		try {
			parsed = new URL(url);
		} catch {
			throw new ValidationError(`MCP 服务“${name$1}”的 url 无效`, "mcpServers");
		}
		if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new ValidationError(`MCP 服务“${name$1}”仅支持 http/https`, "mcpServers");
	}
	const args = value.args;
	if (args !== void 0 && (!Array.isArray(args) || args.some((item) => typeof item !== "string"))) throw new ValidationError(`MCP 服务“${name$1}”的 args 必须是字符串数组`, "mcpServers");
	const env = value.env;
	if (env !== void 0 && (!isRecord(env) || Object.values(env).some((item) => typeof item !== "string"))) throw new ValidationError(`MCP 服务“${name$1}”的 env 必须是字符串字典`, "mcpServers");
	return {
		...typeof command === "string" ? { command: command.trim() } : {},
		...Array.isArray(args) ? { args: [...args] } : {},
		...isRecord(env) ? { env: { ...env } } : {},
		...typeof url === "string" ? { url } : {}
	};
}
function normalizeMcpServers(value, enabled) {
	if (!enabled) return {};
	if (!isRecord(value)) throw new ValidationError("MCP 配置必须是对象", "mcpServers");
	const entries = Object.entries(value);
	if (entries.length > 20) throw new ValidationError("MCP 服务最多 20 个", "mcpServers");
	return Object.fromEntries(entries.map(([name$1, server]) => [name$1, normalizeMcpServer(name$1, server)]));
}
function parseEasyCodeRequest(value) {
	if (!isRecord(value)) throw new ValidationError("请求体必须是对象");
	const mode = enumValue(value.mode, APP_MODES, "mode", "simple");
	const topic = requiredString(value.topic, "topic", 2e3);
	const projectName = normalizeProjectName(value.projectName);
	const isSimple = mode === "simple";
	const stack = enumValue(value.stack, APP_STACKS, "stack", "auto");
	const environment = enumValue(value.environment, DEV_ENVIRONMENTS, "environment", "auto");
	const stackDetail = optionalString(value.stackDetail, "stackDetail", 300);
	const environmentDetail = optionalString(value.environmentDetail, "environmentDetail", 300);
	if (!isSimple && stack === "custom" && stackDetail.length === 0) throw new ValidationError("请选择具体技术栈，或填写自定义技术栈", "stackDetail");
	if (!isSimple && environment === "custom" && environmentDetail.length === 0) throw new ValidationError("请选择具体开发环境，或填写自定义环境", "environmentDetail");
	const workflow = enumValue(value.workflow, WORKFLOWS, "workflow", isSimple ? "go" : "plan");
	const designGoal = typeof value.designGoal === "string" ? value.designGoal.trim().slice(0, 2e3) : "";
	const initializeGit = isSimple ? false : value.initializeGit === true;
	const mcpEnabled = isSimple ? false : value.mcpEnabled === true;
	return {
		mode,
		projectName,
		topic,
		stack: isSimple ? "auto" : stack,
		stackDetail: !isSimple && stack === "custom" ? stackDetail : "",
		environment: isSimple ? "auto" : environment,
		environmentDetail: !isSimple && environment === "custom" ? environmentDetail : "",
		initializeGit,
		workflow: isSimple ? "go" : workflow,
		designGoal,
		mcpEnabled,
		mcpServers: normalizeMcpServers(value.mcpServers ?? {}, mcpEnabled)
	};
}

//#endregion
//#region src/http.ts
const MAX_BODY_BYTES = 64 * 1024;
function respond(res, status, payload) {
	const body = JSON.stringify(payload);
	res.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-store",
		"content-length": Buffer.byteLength(body),
		"x-content-type-options": "nosniff"
	});
	res.end(body);
}
function sameOrigin(req) {
	const origin = req.headers.origin;
	if (origin === void 0 || origin === "null") return true;
	const host = req.headers.host;
	if (host === void 0) return false;
	try {
		return new URL(origin).host === host;
	} catch {
		return false;
	}
}
async function readJson(req) {
	let size = 0;
	const chunks = [];
	for await (const chunk of req) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		size += buffer.length;
		if (size > MAX_BODY_BYTES) throw new ValidationError("请求体不能超过 64 KB");
		chunks.push(buffer);
	}
	const raw = Buffer.concat(chunks).toString("utf8");
	if (!raw) throw new ValidationError("请求体不能为空");
	try {
		return JSON.parse(raw);
	} catch {
		throw new ValidationError("请求体不是有效的 JSON");
	}
}
function createProjectHandler(outputRoot) {
	return async (req, res) => {
		if (req.method !== "POST") {
			res.setHeader("allow", "POST");
			respond(res, 405, {
				ok: false,
				error: "仅支持 POST 请求"
			});
			return;
		}
		if (req.headers["x-easycode-request"] !== "1" || !sameOrigin(req)) {
			respond(res, 403, {
				ok: false,
				error: "请求来源未通过校验"
			});
			return;
		}
		if (!(req.headers["content-type"] ?? "").toLowerCase().startsWith("application/json")) {
			respond(res, 415, {
				ok: false,
				error: "Content-Type 必须是 application/json"
			});
			return;
		}
		try {
			respond(res, 201, await generateProject(outputRoot, parseEasyCodeRequest(await readJson(req))));
		} catch (error) {
			if (error instanceof ValidationError) {
				respond(res, 400, {
					ok: false,
					error: error.message,
					...error.field === void 0 ? {} : { field: error.field }
				});
				return;
			}
			if (error instanceof ProjectExistsError) {
				respond(res, 409, {
					ok: false,
					error: error.message,
					field: "projectName"
				});
				return;
			}
			respond(res, 500, {
				ok: false,
				error: error instanceof Error ? error.message : "创建项目失败"
			});
		}
	};
}

//#endregion
//#region src/index.ts
const name = "easycode";
const inject = ["webServer"];
/** Register EasyCode's same-origin project creation endpoint. */
function apply(ctx, config = {}) {
	const handler = createProjectHandler(resolve(config.outputRoot ?? "easycode-projects"));
	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: "/easycode/api/projects",
		handler
	}), "easycode: project creation route");
}

//#endregion
export { apply, buildProjectFiles, generateProject, inject, name, parseEasyCodeRequest };
//# sourceMappingURL=index.js.map