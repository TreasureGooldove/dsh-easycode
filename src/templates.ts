import type { AppStack, EasyCodeRequest } from './types.ts'

export type ProjectFiles = Map<string, string>

function json(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`
}

function html(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function packageName(input: string): string {
  return input.replace(/[\u4e00-\u9fff]/g, 'app').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'easycode-app'
}

function commonCss(): string {
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
`
}

function projectReadme(config: EasyCodeRequest): string {
  const nextStep = config.workflow === 'plan'
    ? `## 下一步

当前目录只包含项目规划和稳定上下文，尚未生成应用代码。请先审阅 \`PLAN.md\`，确认范围后再进入 Go 工作流。`
    : `## 启动

\`\`\`bash
npm install
npm run dev
\`\`\`

${config.environment === 'docker' ? `也可以运行：

\`\`\`bash
docker compose up --build
\`\`\`` : ''}`
  return `# ${config.projectName}

由 EasyCode 为 DeepSeek Harness 生成。

## 项目目标

${config.topic}

${nextStep}

## 开发约定

- 技术栈：${stackLabel(config.stack)}
- 工作流：${config.workflow === 'plan' ? 'Plan（只生成规划）' : 'Go（已生成可运行骨架）'}
- 设计目标：${config.designGoal || '清晰、快速、移动端可用'}
- MCP：${config.mcpEnabled ? '已写入 .mcp.json' : '未启用'}
`
}

function projectPlan(config: EasyCodeRequest): string {
  const milestones = config.stack === 'node-api'
    ? `1. 定义资源模型、接口契约和错误格式。
2. 实现健康检查、核心路由与输入校验。
3. 补齐鉴权边界、日志、持久化策略和接口测试。
4. 运行检查并记录部署与回滚说明。`
    : `1. 建立项目结构和开发脚本。
2. 实现核心页面、主要输入与结果状态。
3. 补齐空状态、错误状态、键盘操作和移动端布局。
4. 运行检查并记录交付说明。`
  const acceptance = config.stack === 'node-api'
    ? `- 健康检查与本地开发命令可以运行。
- 接口输入有校验，错误响应具有稳定结构。
- 鉴权和持久化方案不依赖未配置的外部服务。`
    : `- 本地开发命令可以启动。
- 核心流程在桌面端和移动端均可完成。
- 输入有校验，失败有明确反馈。`
  return `# ${config.projectName} 实施计划

## 目标

${config.topic}

## 体验原则

${config.designGoal || '减少首次使用阻力，保证主要任务在移动端和桌面端都清晰可达。'}

## 技术方案

- 技术栈：${stackLabel(config.stack)}
- 开发环境：${config.environment === 'docker' ? 'Docker' : '本地 Node.js'}
- Git 仓库：${config.initializeGit ? '初始化' : '不初始化'}
- MCP：${config.mcpEnabled ? '手动配置' : '关闭'}

## 里程碑

${milestones}

## 完成标准

${acceptance}
- 不提交密钥、构建产物或依赖目录。
`
}

function easyCodeBrief(config: EasyCodeRequest): string {
  return `# EasyCode 项目说明

此文件是生成项目的稳定上下文，供 DeepSeek Harness 或其他编码智能体继续开发时读取。

## 用户要求

${config.topic}

## 设计目标

${config.designGoal || '界面直接、结构清楚、默认可运行。'}

## 决策

- 模式：${config.mode === 'simple' ? '简易模式' : '专业模式'}
- 工作流：${config.workflow}
- 技术栈：${config.stack}
- 环境：${config.environment}
- Git：${config.initializeGit ? '是' : '否'}
- MCP：${config.mcpEnabled ? '手动启用' : '关闭'}

## 继续开发提示

保持现有技术栈和目录结构，先验证当前脚本，再按 PLAN.md 的里程碑继续。不要自动安装或搜索 MCP；该能力在 EasyCode v1 中仍为 WIP。
`
}

function stackLabel(stack: AppStack): string {
  return ({
    vanilla: 'Vanilla JavaScript + Vite',
    'react-vite': 'React + Vite',
    'vue-vite': 'Vue + Vite',
    nextjs: 'Next.js',
    'node-api': 'Node.js API',
  })[stack]
}

function baseFiles(config: EasyCodeRequest): ProjectFiles {
  const files = new Map<string, string>()
  files.set('README.md', projectReadme(config))
  files.set('PLAN.md', projectPlan(config))
  files.set('EASYCODE.md', easyCodeBrief(config))
  files.set('.easycode/config.json', json(config))
  files.set('.gitignore', 'node_modules/\ndist/\n.next/\n.env\n.env.*\n!.env.example\n*.log\n')
  if (config.mcpEnabled) files.set('.mcp.json', json({ mcpServers: config.mcpServers }))
  return files
}

function vanillaFiles(config: EasyCodeRequest): ProjectFiles {
  const title = html(config.topic.split(/[。.!！?？\n]/)[0]?.slice(0, 72) || config.projectName)
  const files = new Map<string, string>()
  files.set('package.json', json({
    name: packageName(config.projectName),
    private: true,
    version: '0.1.0',
    type: 'module',
    scripts: { dev: 'vite --host 0.0.0.0', build: 'vite build', preview: 'vite preview --host 0.0.0.0' },
    devDependencies: { vite: '^7.1.0' },
  }))
  files.set('index.html', `<!doctype html>
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
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`)
  files.set('src/style.css', commonCss())
  files.set('src/main.js', `import './style.css'

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
`)
  return files
}

function reactFiles(config: EasyCodeRequest): ProjectFiles {
  const files = new Map<string, string>()
  files.set('package.json', json({
    name: packageName(config.projectName),
    private: true,
    version: '0.1.0',
    type: 'module',
    scripts: { dev: 'vite --host 0.0.0.0', build: 'tsc -b && vite build', preview: 'vite preview --host 0.0.0.0' },
    dependencies: { '@vitejs/plugin-react': '^5.0.0', vite: '^7.1.0', typescript: '^5.9.0', react: '^19.1.0', 'react-dom': '^19.1.0' },
    devDependencies: { '@types/react': '^19.1.0', '@types/react-dom': '^19.1.0' },
  }))
  files.set('index.html', '<!doctype html>\n<html lang="zh-CN"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>EasyCode App</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n')
  files.set('tsconfig.json', json({ compilerOptions: { target: 'ES2022', useDefineForClassFields: true, lib: ['ES2022', 'DOM', 'DOM.Iterable'], allowJs: false, skipLibCheck: true, esModuleInterop: true, allowSyntheticDefaultImports: true, strict: true, forceConsistentCasingInFileNames: true, module: 'ESNext', moduleResolution: 'Bundler', resolveJsonModule: true, isolatedModules: true, noEmit: true, jsx: 'react-jsx' }, include: ['src'] }))
  files.set('vite.config.ts', "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({ plugins: [react()] })\n")
  files.set('src/main.tsx', "import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport { App } from './App'\nimport './style.css'\n\ncreateRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)\n")
  files.set('src/App.tsx', `import { useEffect, useMemo, useState, type FormEvent } from 'react'

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
`)
  files.set('src/style.css', commonCss())
  return files
}

function vueFiles(config: EasyCodeRequest): ProjectFiles {
  const files = new Map<string, string>()
  files.set('package.json', json({
    name: packageName(config.projectName), private: true, version: '0.1.0', type: 'module',
    scripts: { dev: 'vite --host 0.0.0.0', build: 'vite build', preview: 'vite preview --host 0.0.0.0' },
    dependencies: { '@vitejs/plugin-vue': '^6.0.0', vite: '^7.1.0', vue: '^3.5.0' },
  }))
  files.set('index.html', '<!doctype html>\n<html lang="zh-CN"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>EasyCode App</title></head><body><div id="app"></div><script type="module" src="/src/main.js"></script></body></html>\n')
  files.set('vite.config.js', "import { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\n\nexport default defineConfig({ plugins: [vue()] })\n")
  files.set('src/main.js', "import { createApp } from 'vue'\nimport App from './App.vue'\nimport './style.css'\n\ncreateApp(App).mount('#app')\n")
  files.set('src/App.vue', `<script setup>
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
</script>

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
`)
  files.set('src/style.css', commonCss())
  return files
}

function nextFiles(config: EasyCodeRequest): ProjectFiles {
  const files = new Map<string, string>()
  files.set('package.json', json({
    name: packageName(config.projectName), private: true, version: '0.1.0',
    scripts: { dev: 'next dev --hostname 0.0.0.0', build: 'next build', start: 'next start' },
    dependencies: { next: '^15.4.0', react: '^19.1.0', 'react-dom': '^19.1.0' },
    devDependencies: { '@types/node': '^24.0.0', '@types/react': '^19.1.0', typescript: '^5.9.0' },
  }))
  files.set('tsconfig.json', json({ compilerOptions: { target: 'ES2017', lib: ['dom', 'dom.iterable', 'esnext'], allowJs: false, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler', resolveJsonModule: true, isolatedModules: true, jsx: 'preserve', incremental: true, plugins: [{ name: 'next' }] }, include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'], exclude: ['node_modules'] }))
  files.set('next-env.d.ts', '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n')
  files.set('app/layout.tsx', "import type { ReactNode } from 'react'\nimport './globals.css'\n\nexport const metadata = { title: 'EasyCode App', description: 'Generated by EasyCode' }\nexport default function RootLayout({ children }: Readonly<{ children: ReactNode }>) { return <html lang=\"zh-CN\"><body>{children}</body></html> }\n")
  files.set('app/page.tsx', `'use client'
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
`)
  files.set('app/globals.css', commonCss())
  return files
}

function nodeApiFiles(config: EasyCodeRequest): ProjectFiles {
  const files = new Map<string, string>()
  files.set('package.json', json({
    name: packageName(config.projectName), private: true, version: '0.1.0', type: 'module',
    scripts: { dev: 'node --watch src/server.js', start: 'node src/server.js' },
  }))
  files.set('src/server.js', `import { createServer } from 'node:http'
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
`)
  return files
}

function dockerFiles(config: EasyCodeRequest): ProjectFiles {
  const files = new Map<string, string>()
  const port = config.stack === 'node-api' ? 3000 : config.stack === 'nextjs' ? 3000 : 5173
  files.set('Dockerfile', `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${port}
CMD ["npm", "run", "dev"]
`)
  files.set('docker-compose.yml', `services:
  app:
    build: .
    ports:
      - "${port}:${port}"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
`)
  files.set('.dockerignore', 'node_modules\ndist\n.next\n.git\n*.log\n')
  return files
}

function merge(target: ProjectFiles, source: ProjectFiles): void {
  for (const [path, content] of source) target.set(path, content)
}

export function buildProjectFiles(config: EasyCodeRequest): ProjectFiles {
  const files = baseFiles(config)
  if (config.workflow === 'go') {
    const applicationFiles = ({
      vanilla: vanillaFiles,
      'react-vite': reactFiles,
      'vue-vite': vueFiles,
      nextjs: nextFiles,
      'node-api': nodeApiFiles,
    })[config.stack](config)
    merge(files, applicationFiles)
    if (config.environment === 'docker') merge(files, dockerFiles(config))
  }
  return files
}
