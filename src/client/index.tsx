import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {
  AppMode,
  AppStack,
  DevEnvironment,
  EasyCodeError,
  EasyCodeRequest,
  EasyCodeResult,
  WorkflowMode,
} from '../types.ts'

const PLUGIN_ID = 'dsh-easycode'
const NS = 'easycode'

const copy = {
  zh: { nav: 'EasyCode', launch: 'EasyCode', dialogLabel: '创建应用', dialogHint: '从首页直接开始', close: '关闭' },
  en: { nav: 'EasyCode', launch: 'EasyCode', dialogLabel: 'Create app', dialogHint: 'Start directly from Home', close: 'Close' },
}

const OPEN_EASYCODE_EVENT = 'easycode:open'
const CLOSE_EASYCODE_EVENT = 'easycode:close'

interface Choice<T extends string> { id: T; name: string }
interface ChoiceGroup<T extends string> { label: string; items: Array<Choice<T>> }

const STACK_GROUPS: Array<ChoiceGroup<AppStack>> = [
  { label: '智能决策', items: [{ id: 'auto', name: 'DeepSeek 自动决策（推荐）' }] },
  { label: '前端与内容站点', items: [
    { id: 'vanilla', name: 'Vanilla JavaScript + Vite' }, { id: 'react-vite', name: 'React + Vite' },
    { id: 'vue-vite', name: 'Vue + Vite' }, { id: 'svelte-vite', name: 'Svelte + Vite' },
    { id: 'solid-vite', name: 'SolidJS + Vite' }, { id: 'angular', name: 'Angular' },
    { id: 'astro', name: 'Astro' }, { id: 'qwik', name: 'Qwik' },
  ] },
  { label: '全栈 Web', items: [
    { id: 'nextjs', name: 'Next.js' }, { id: 'nuxt', name: 'Nuxt' }, { id: 'remix', name: 'Remix' },
    { id: 'sveltekit', name: 'SvelteKit' }, { id: 'tanstack-start', name: 'TanStack Start' },
  ] },
  { label: '后端与 API', items: [
    { id: 'node-api', name: 'Node.js API' }, { id: 'express', name: 'Express' },
    { id: 'fastify', name: 'Fastify' }, { id: 'nestjs', name: 'NestJS' }, { id: 'hono', name: 'Hono' },
    { id: 'bun-api', name: 'Bun API' }, { id: 'deno-api', name: 'Deno API' },
    { id: 'python-fastapi', name: 'Python + FastAPI' }, { id: 'python-django', name: 'Python + Django' },
    { id: 'go-api', name: 'Go API' }, { id: 'rust-axum', name: 'Rust + Axum' },
    { id: 'java-spring', name: 'Java + Spring Boot' }, { id: 'kotlin-ktor', name: 'Kotlin + Ktor' },
    { id: 'dotnet-api', name: '.NET Web API' }, { id: 'php-laravel', name: 'PHP + Laravel' },
    { id: 'ruby-rails', name: 'Ruby on Rails' },
  ] },
  { label: '桌面、移动端与扩展', items: [
    { id: 'electron', name: 'Electron' }, { id: 'tauri', name: 'Tauri' },
    { id: 'react-native', name: 'React Native' }, { id: 'expo', name: 'Expo' },
    { id: 'flutter', name: 'Flutter' }, { id: 'browser-extension', name: '浏览器扩展' },
  ] },
  { label: '其他', items: [{ id: 'custom', name: '自定义技术栈…' }] },
]

const ENVIRONMENT_GROUPS: Array<ChoiceGroup<DevEnvironment>> = [
  { label: '智能决策', items: [{ id: 'auto', name: 'DeepSeek 自动决策（推荐）' }] },
  { label: '本机与容器', items: [
    { id: 'local', name: '本地开发' }, { id: 'docker', name: 'Docker' },
    { id: 'podman', name: 'Podman' }, { id: 'devcontainer', name: 'Dev Container' },
    { id: 'wsl', name: 'WSL' }, { id: 'nix', name: 'Nix / devenv' },
  ] },
  { label: '远程与云端', items: [
    { id: 'remote-ssh', name: '远程 SSH' }, { id: 'codespaces', name: 'GitHub Codespaces' },
    { id: 'kubernetes', name: 'Kubernetes 开发环境' },
  ] },
  { label: '其他', items: [{ id: 'custom', name: '自定义开发环境…' }] },
]

const STACKS = STACK_GROUPS.flatMap(group => group.items)
const ENVIRONMENTS = ENVIRONMENT_GROUPS.flatMap(group => group.items)

const STYLES = `
.ec-root {
  --ec-panel: var(--dsw-alias-bg-layer-1, #ffffff);
  --ec-text: var(--dsw-alias-label-primary, #202725);
  --ec-muted: var(--dsw-alias-label-tertiary, #69716e);
  --ec-border: var(--dsw-alias-border-l2, #d9dcd8);
  --ec-accent: #26786b;
  --ec-accent-strong: #1d665b;
  --ec-accent-label: #26786b;
  --ec-soft: #e5f0ed;
  --ec-switch-off: #b9bfbc;
  --ec-warn: var(--dsw-alias-state-warn-label, #8a5a20);
  --ec-error: var(--dsw-alias-state-error-primary, #9c3f36);
  --ec-result-border: #9ec6bc;
  color: var(--ec-text);
  min-height: 100%;
  padding: 6px 2px 36px;
  container-type: inline-size;
}
.ec-root, .ec-root * { box-sizing: border-box; }

body[data-ds-dark-theme] .ec-root {
  --ec-accent-label: #62c9b6;
  --ec-soft: #193a35;
  --ec-switch-off: #5b6260;
  --ec-result-border: #357f73;
}

.ec-hero { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 24px; align-items: end; border-bottom: 1px solid var(--ec-border); padding: 4px 0 26px; }
.ec-kicker { margin: 0 0 9px; color: var(--ec-accent-label); font-size: 11px; font-weight: 750; letter-spacing: .15em; text-transform: uppercase; }
.ec-title { margin: 0; font-size: clamp(30px, 5vw, 48px); line-height: 1; letter-spacing: -.045em; }
.ec-intro { max-width: 600px; margin: 14px 0 0; color: var(--ec-muted); line-height: 1.65; }
.ec-version { border: 1px solid var(--ec-border); border-radius: 999px; padding: 6px 10px; color: var(--ec-muted); font-size: 12px; }

.ec-mode-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 26px 0; }
.ec-mode { min-height: 108px; border: 1px solid var(--ec-border); border-radius: 14px; background: var(--ec-panel); color: inherit; padding: 18px; text-align: left; cursor: pointer; transition: border-color 160ms ease, transform 160ms ease, background 160ms ease; }
.ec-mode:hover { border-color: var(--ec-accent); }
.ec-mode:active { transform: scale(.99); }
.ec-mode[data-active='true'] { border-color: var(--ec-accent); background: var(--ec-soft); }
.ec-mode strong { display: block; font-size: 16px; }
.ec-mode span { display: block; margin-top: 7px; color: var(--ec-muted); font-size: 13px; line-height: 1.5; }

.ec-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(230px, 290px); gap: 24px; align-items: start; }
.ec-form { display: grid; gap: 22px; }
.ec-section { border-top: 1px solid var(--ec-border); padding-top: 20px; }
.ec-section:first-child { border-top: 0; padding-top: 0; }
.ec-section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
.ec-section-head h3 { margin: 0; font-size: 15px; letter-spacing: -.01em; }
.ec-section-head span { color: var(--ec-muted); font-size: 12px; }
.ec-field { display: grid; gap: 7px; }
.ec-field + .ec-field { margin-top: 14px; }
.ec-label { font-size: 13px; font-weight: 650; }
.ec-help { margin: 0; color: var(--ec-muted); font-size: 12px; line-height: 1.55; }
.ec-input, .ec-textarea, .ec-select {
  width: 100%;
  border: 1px solid var(--ec-border);
  border-radius: 9px;
  background: var(--ec-panel);
  color: var(--ec-text);
  font: inherit;
  padding: 11px 12px;
}
.ec-textarea { min-height: 112px; resize: vertical; line-height: 1.55; }
.ec-code { min-height: 150px; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12px; }
.ec-input:focus, .ec-textarea:focus, .ec-select:focus, .ec-button:focus-visible, .ec-mode:focus-visible, .ec-choice:focus-visible { outline: 3px solid color-mix(in srgb, var(--ec-accent) 35%, transparent); outline-offset: 2px; }

.ec-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ec-decision-note { margin: 10px 0 0; border-left: 3px solid var(--ec-accent); background: var(--ec-soft); padding: 9px 11px; color: var(--ec-muted); font-size: 12px; line-height: 1.55; }
.ec-stack-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.ec-choice { border: 1px solid var(--ec-border); border-radius: 10px; background: var(--ec-panel); color: inherit; padding: 12px; text-align: left; cursor: pointer; }
.ec-choice[data-active='true'] { border-color: var(--ec-accent); box-shadow: inset 3px 0 0 var(--ec-accent); }
.ec-choice strong { display: block; font-size: 13px; }
.ec-choice span { display: block; margin-top: 4px; color: var(--ec-muted); font-size: 11px; }

.ec-switch-row { display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center; padding: 13px 0; border-bottom: 1px solid var(--ec-border); }
.ec-switch-row:last-child { border-bottom: 0; }
.ec-switch-copy strong { display: block; font-size: 13px; }
.ec-switch-copy span { display: block; margin-top: 4px; color: var(--ec-muted); font-size: 12px; line-height: 1.45; }
.ec-switch { position: relative; width: 42px; height: 24px; border: 0; border-radius: 999px; background: var(--ec-switch-off); cursor: pointer; transition: background 160ms ease; }
.ec-switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform 160ms ease; }
.ec-switch[aria-checked='true'] { background: var(--ec-accent); }
.ec-switch[aria-checked='true']::after { transform: translateX(18px); }
.ec-switch:disabled { cursor: not-allowed; opacity: .55; }
.ec-wip { display: inline-flex; margin-left: 7px; border: 1px solid #c79c5e; border-radius: 999px; padding: 1px 6px; color: var(--ec-warn); font-size: 9px; letter-spacing: .08em; }

.ec-summary { position: sticky; top: 12px; border: 1px solid var(--ec-border); border-radius: 14px; background: var(--ec-panel); padding: 18px; }
.ec-summary h3 { margin: 0 0 15px; font-size: 14px; }
.ec-summary dl { display: grid; gap: 10px; margin: 0; }
.ec-summary dl > div { display: grid; grid-template-columns: 72px 1fr; gap: 10px; }
.ec-summary dt { color: var(--ec-muted); font-size: 12px; }
.ec-summary dd { min-width: 0; margin: 0; font-size: 12px; font-weight: 620; overflow-wrap: anywhere; }
.ec-action { margin-top: 18px; }
.ec-button { width: 100%; border: 0; border-radius: 9px; background: var(--ec-accent); color: #fff; padding: 12px 15px; font: inherit; font-weight: 720; cursor: pointer; transition: background 160ms ease, transform 160ms ease; }
.ec-button:hover { background: var(--ec-accent-strong); }
.ec-button:active { transform: scale(.98); }
.ec-button:disabled { cursor: wait; opacity: .65; }
.ec-error { margin: 12px 0 0; color: var(--ec-error); font-size: 12px; line-height: 1.5; }
.ec-result { margin-top: 14px; border: 1px solid var(--ec-result-border); border-radius: 10px; background: var(--ec-soft); padding: 13px; }
.ec-result strong { display: block; font-size: 13px; }
.ec-path { margin: 7px 0 0; color: var(--ec-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11px; line-height: 1.5; overflow-wrap: anywhere; }
.ec-copy { margin-top: 10px; border: 1px solid var(--ec-border); border-radius: 7px; background: var(--ec-panel); color: inherit; padding: 7px 9px; font: inherit; font-size: 11px; cursor: pointer; }
.ec-footnote { margin: 14px 0 0; color: var(--ec-muted); font-size: 11px; line-height: 1.5; }

.ec-launcher {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 36px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-primary, #202725);
  padding: 7px 8px;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;
}
.ec-launcher:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, .06)); }
.ec-launcher:active { transform: scale(.98); }
.ec-launcher:focus-visible { outline: 2px solid var(--dsw-alias-border-l3, #8d9692); outline-offset: 2px; }
.ec-launcher[data-wide='false'] { justify-content: center; width: 36px; padding-inline: 0; }
.ec-launcher-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  border: 1px solid color-mix(in srgb, #26786b 55%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, #26786b 14%, transparent);
  color: #26786b;
  font-size: 9px;
  font-weight: 760;
  letter-spacing: -.03em;
}
body[data-ds-dark-theme] .ec-launcher-mark { color: #62c9b6; border-color: rgba(98, 201, 182, .5); background: rgba(98, 201, 182, .12); }
.ec-launcher-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.ec-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 18px;
  background: var(--dsw-alias-bg-mask-1, rgba(0, 0, 0, .5));
}
.ec-overlay-panel {
  display: flex;
  flex-direction: column;
  width: min(1080px, 100%);
  max-height: 100%;
  border: 1px solid var(--dsw-alias-border-l2, #d9dcd8);
  border-radius: 18px;
  background: var(--dsw-alias-bg-layer-1, #ffffff);
  color: var(--dsw-alias-label-primary, #202725);
  box-shadow: 0 24px 80px rgba(0, 0, 0, .28);
  overflow: hidden;
}
.ec-overlay-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 58px;
  padding: 10px 18px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, #d9dcd8);
}
.ec-overlay-brand { display: flex; align-items: baseline; gap: 10px; min-width: 0; }
.ec-overlay-brand strong { font-size: 15px; }
.ec-overlay-brand span { color: var(--dsw-alias-label-tertiary, #69716e); font-size: 12px; }
.ec-overlay-close {
  flex: none;
  border: 1px solid var(--dsw-alias-border-l2, #d9dcd8);
  border-radius: 999px;
  background: transparent;
  color: var(--dsw-alias-label-primary, #202725);
  padding: 7px 12px;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.ec-overlay-close:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, .06)); }
.ec-overlay-close:focus-visible { outline: 2px solid var(--dsw-alias-border-l3, #8d9692); outline-offset: 2px; }
.ec-overlay-body { min-height: 0; overflow: auto; padding: 22px 26px 0; }
.ec-overlay-body > .ec-root { width: min(920px, 100%); margin-inline: auto; }

@media (max-width: 820px) {
  .ec-layout { grid-template-columns: 1fr; }
  .ec-summary { position: static; }
}
@container (max-width: 820px) {
  .ec-layout { grid-template-columns: 1fr; }
  .ec-summary { position: static; }
}
@container (max-width: 520px) {
  .ec-grid-2 { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .ec-overlay { padding: 0; }
  .ec-overlay-panel { height: 100%; border: 0; border-radius: 0; }
  .ec-overlay-head { padding-inline: 14px; }
  .ec-overlay-body { padding: 18px 14px 0; }
  .ec-overlay-brand span { display: none; }
  .ec-hero { grid-template-columns: 1fr; }
  .ec-version { justify-self: start; }
  .ec-mode-grid, .ec-grid-2, .ec-stack-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .ec-root *, .ec-root *::before, .ec-root *::after { transition: none !important; }
}
`

function ensureStyles(): () => void {
  const existing = document.querySelector<HTMLStyleElement>(`style[data-plugin="${PLUGIN_ID}"]`)
  if (existing !== null) return () => undefined
  const style = document.createElement('style')
  style.dataset.plugin = PLUGIN_ID
  style.textContent = STYLES
  document.head.append(style)
  return () => style.remove()
}

interface LocaleSeat {
  t: (key: string) => string
}

type EasyCodeHandoff = (outputPath: string, prompt: string) => Promise<void>

function EasyCodeLauncher({ wide, t }: LocaleSeat & { wide: boolean }) {
  function open(event: ReactMouseEvent<HTMLButtonElement>) {
    window.dispatchEvent(new CustomEvent(OPEN_EASYCODE_EVENT, {
      detail: { returnFocus: event.currentTarget },
    }))
  }

  return <button
    className="ec-launcher"
    type="button"
    data-wide={String(wide)}
    aria-label={t('launch')}
    title={wide ? undefined : t('launch')}
    onClick={open}
  >
    <span className="ec-launcher-mark" aria-hidden="true">EC</span>
    {wide && <span className="ec-launcher-label">{t('launch')}</span>}
  </button>
}

function EasyCodeOverlay({ t, handoff }: LocaleSeat & { handoff: EasyCodeHandoff }) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  function close() {
    setOpen(false)
    queueMicrotask(() => returnFocusRef.current?.focus())
  }

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ returnFocus?: HTMLElement }>).detail
      returnFocusRef.current = detail?.returnFocus ?? document.activeElement as HTMLElement | null
      setOpen(true)
    }
    window.addEventListener(OPEN_EASYCODE_EVENT, handleOpen)
    window.addEventListener(CLOSE_EASYCODE_EVENT, close)
    return () => {
      window.removeEventListener(OPEN_EASYCODE_EVENT, handleOpen)
      window.removeEventListener(CLOSE_EASYCODE_EVENT, close)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [open])

  if (!open) return null
  return <div className="ec-overlay" onMouseDown={event => { if (event.target === event.currentTarget) close() }}>
    <section className="ec-overlay-panel" role="dialog" aria-modal="true" aria-labelledby="ec-overlay-title">
      <header className="ec-overlay-head">
        <div className="ec-overlay-brand"><strong id="ec-overlay-title">{t('dialogLabel')}</strong><span>{t('dialogHint')}</span></div>
        <button ref={closeRef} className="ec-overlay-close" type="button" onClick={close}>{t('close')}</button>
      </header>
      <div className="ec-overlay-body"><EasyCodeWizard handoff={handoff} /></div>
    </section>
  </div>
}

function Toggle({ checked, onChange, label, disabled = false }: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  disabled?: boolean
}) {
  return <button
    className="ec-switch"
    type="button"
    role="switch"
    aria-label={label}
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
  />
}

function slugFromTopic(value: string): string {
  const ascii = value.toLowerCase().trim()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32)
  return ascii || 'my-app'
}

function stackName(stack: AppStack): string {
  return STACKS.find(item => item.id === stack)?.name ?? stack
}

function environmentName(environment: DevEnvironment): string {
  return ENVIRONMENTS.find(item => item.id === environment)?.name ?? environment
}

function agentPrompt(config: EasyCodeRequest): string {
  const action = config.workflow === 'plan'
    ? '保持 Plan 模式：只完善需求、架构、任务拆分、风险与验收标准，不实现应用代码。'
    : '进入 Go 模式：实现完整、可运行的应用，执行适合所选技术栈的检查并修复发现的问题。'
  return `这是 EasyCode 创建的项目。请先完整读取 EASYCODE.md、PLAN.md 和 README.md，再继续开发。${action}不要自动搜索或安装 MCP；该能力在 EasyCode v1 中仍为 WIP。`
}

function EasyCodeWizard({ handoff }: { handoff: EasyCodeHandoff }) {
  const [mode, setMode] = useState<AppMode>('simple')
  const [projectName, setProjectName] = useState('my-app')
  const [topic, setTopic] = useState('')
  const [stack, setStack] = useState<AppStack>('auto')
  const [stackDetail, setStackDetail] = useState('')
  const [environment, setEnvironment] = useState<DevEnvironment>('auto')
  const [environmentDetail, setEnvironmentDetail] = useState('')
  const [initializeGit, setInitializeGit] = useState(true)
  const [workflow, setWorkflow] = useState<WorkflowMode>('go')
  const [designGoal, setDesignGoal] = useState('清晰、快速、移动端可用')
  const [mcpEnabled, setMcpEnabled] = useState(false)
  const [mcpJson, setMcpJson] = useState('{}')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<EasyCodeResult | null>(null)
  const [handoffState, setHandoffState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const [copied, setCopied] = useState(false)

  const effective = useMemo(() => mode === 'simple'
    ? { stack: 'auto' as AppStack, environment: 'auto' as DevEnvironment, workflow: 'go' as WorkflowMode, git: false, mcp: false }
    : { stack, environment, workflow, git: initializeGit, mcp: mcpEnabled },
  [mode, stack, environment, workflow, initializeGit, mcpEnabled])

  function chooseMode(next: AppMode) {
    setMode(next)
    setError('')
    setResult(null)
    setHandoffState('idle')
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setResult(null)
    setHandoffState('idle')
    setCopied(false)
    if (!projectName.trim()) return setError('请填写项目名称。')
    if (!topic.trim()) return setError('请描述你要创建的应用。')
    if (mode === 'professional' && effective.stack === 'custom' && !stackDetail.trim()) return setError('请填写自定义技术栈。')
    if (mode === 'professional' && effective.environment === 'custom' && !environmentDetail.trim()) return setError('请填写自定义开发环境。')

    let mcpServers: EasyCodeRequest['mcpServers'] = {}
    if (effective.mcp) {
      try {
        const parsed = JSON.parse(mcpJson) as unknown
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error()
        mcpServers = parsed as EasyCodeRequest['mcpServers']
      } catch {
        return setError('手动 MCP 配置必须是有效的 JSON 对象。')
      }
    }

    const payload: EasyCodeRequest = {
      mode,
      projectName: projectName.trim(),
      topic: topic.trim(),
      stack: effective.stack,
      stackDetail: mode === 'professional' && effective.stack === 'custom' ? stackDetail.trim() : '',
      environment: effective.environment,
      environmentDetail: mode === 'professional' && effective.environment === 'custom' ? environmentDetail.trim() : '',
      initializeGit: effective.git,
      workflow: effective.workflow,
      designGoal: mode === 'simple' ? '' : designGoal.trim(),
      mcpEnabled: effective.mcp,
      mcpServers,
    }

    setSubmitting(true)
    try {
      const response = await fetch('/easycode/api/projects', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-easycode-request': '1' },
        body: JSON.stringify(payload),
      })
      const data = await response.json() as EasyCodeResult | EasyCodeError
      if (!response.ok || !data.ok) throw new Error(data.ok ? '创建项目失败' : data.error)
      setResult(data)
      setHandoffState('sending')
      try {
        await handoff(data.outputPath, agentPrompt(payload))
        setHandoffState('sent')
        window.dispatchEvent(new Event(CLOSE_EASYCODE_EVENT))
      } catch (cause) {
        setHandoffState('failed')
        const detail = cause instanceof Error ? cause.message : '未知错误'
        setError(`项目目录已创建，但无法启动 DeepSeek 开发会话：${detail}`)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '创建项目失败，请稍后重试。')
    } finally {
      setSubmitting(false)
    }
  }

  async function copyPath() {
    if (result === null) return
    try {
      await navigator.clipboard.writeText(result.outputPath)
      setCopied(true)
    } catch {
      setError('无法访问剪贴板，请手动复制项目路径。')
    }
  }

  return <div className="ec-root">
    <header className="ec-hero">
      <div>
        <p className="ec-kicker">Click to build</p>
        <h2 className="ec-title">从一个想法开始。</h2>
        <p className="ec-intro">输入目标并选择控制粒度，EasyCode 会准备本地工作区，再让 DeepSeek 决策技术方案并生成应用。无需记命令，也不会替你上传代码。</p>
      </div>
      <span className="ec-version">v0.1</span>
    </header>

    <div className="ec-mode-grid" role="group" aria-label="创建模式">
      <button className="ec-mode" type="button" aria-label="简易模式" aria-pressed={mode === 'simple'} data-active={mode === 'simple'} onClick={() => chooseMode('simple')}>
        <strong>简易模式</strong>
        <span>只输入项目名与主题，其余技术选择交给 DeepSeek。</span>
      </button>
      <button className="ec-mode" type="button" aria-label="专业模式" aria-pressed={mode === 'professional'} data-active={mode === 'professional'} onClick={() => chooseMode('professional')}>
        <strong>专业模式</strong>
        <span>控制技术栈、环境、Git、工作流、设计目标与 MCP。</span>
      </button>
    </div>

    <form className="ec-layout" onSubmit={submit}>
      <div className="ec-form">
        <section className="ec-section">
          <div className="ec-section-head"><h3>项目基础</h3><span>必填</span></div>
          <div className="ec-grid-2">
            <label className="ec-field">
              <span className="ec-label">项目名称</span>
              <input className="ec-input" aria-label="项目名称" value={projectName} maxLength={64} onChange={event => setProjectName(event.target.value)} placeholder="my-app" autoComplete="off" />
              <span className="ec-help">将作为本地目录名。</span>
            </label>
            <label className="ec-field">
              <span className="ec-label">一句话主题</span>
              <input className="ec-input" aria-label="一句话主题" value={topic} maxLength={2000} onChange={event => {
                const next = event.target.value
                setTopic(next)
                if (projectName === 'my-app' && next.trim()) setProjectName(slugFromTopic(next))
              }} placeholder="例如：给独立开发者使用的待办应用" autoComplete="off" />
              <span className="ec-help">越具体，生成的上下文越清楚。</span>
            </label>
          </div>
        </section>

        {mode === 'professional' && <>
          <section className="ec-section">
            <div className="ec-section-head"><h3>开发栈</h3><span>自动或指定约束</span></div>
            <label className="ec-field"><span className="ec-label">技术栈</span><select className="ec-select" aria-label="技术栈" value={stack} onChange={event => setStack(event.target.value as AppStack)}>
              {STACK_GROUPS.map(group => <optgroup key={group.label} label={group.label}>{group.items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>)}
            </select><span className="ec-help">自动模式会根据产品形态、维护成本、部署条件和用户目标选择，而不是随机套模板。</span></label>
            {stack === 'custom' && <label className="ec-field"><span className="ec-label">自定义技术栈</span><input className="ec-input" aria-label="自定义技术栈" value={stackDetail} maxLength={300} onChange={event => setStackDetail(event.target.value)} placeholder="例如：Elixir + Phoenix LiveView" /></label>}
            <p className="ec-decision-note">这些选项是给 DeepSeek 的工程约束。Go 模式会继续生成和验证应用；Plan 模式只完善方案。</p>
          </section>

          <section className="ec-section">
            <div className="ec-section-head"><h3>执行策略</h3><span>环境与工作流</span></div>
            <div className="ec-grid-2">
              <label className="ec-field"><span className="ec-label">开发环境</span><select className="ec-select" aria-label="开发环境" value={environment} onChange={event => setEnvironment(event.target.value as DevEnvironment)}>{ENVIRONMENT_GROUPS.map(group => <optgroup key={group.label} label={group.label}>{group.items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>)}</select></label>
              <label className="ec-field"><span className="ec-label">工作流</span><select className="ec-select" value={workflow} onChange={event => setWorkflow(event.target.value as WorkflowMode)}><option value="go">Go：生成并验证应用</option><option value="plan">Plan：只完善规划</option></select></label>
            </div>
            {environment === 'custom' && <label className="ec-field"><span className="ec-label">自定义开发环境</span><input className="ec-input" aria-label="自定义开发环境" value={environmentDetail} maxLength={300} onChange={event => setEnvironmentDetail(event.target.value)} placeholder="例如：内网 Linux 构建机 + 自托管 Runner" /></label>}
            <div className="ec-switch-row"><div className="ec-switch-copy"><strong>初始化 Git 仓库</strong><span>创建 main 分支，不自动提交或推送。</span></div><Toggle checked={initializeGit} onChange={setInitializeGit} label="初始化 Git 仓库" /></div>
          </section>

          <section className="ec-section">
            <div className="ec-section-head"><h3>设计目标</h3><span>最多 2000 字</span></div>
            <label className="ec-field"><span className="ec-label">你希望产品给人什么感受？</span><textarea className="ec-textarea" value={designGoal} maxLength={2000} onChange={event => setDesignGoal(event.target.value)} placeholder="例如：工具感强、信息密度适中、移动端优先" /></label>
          </section>

          <section className="ec-section">
            <div className="ec-section-head"><h3>MCP</h3><span>可选能力</span></div>
            <div className="ec-switch-row"><div className="ec-switch-copy"><strong>启用手动 MCP 配置</strong><span>把你确认过的服务器配置写入项目 .mcp.json。</span></div><Toggle checked={mcpEnabled} onChange={setMcpEnabled} label="启用 MCP" /></div>
            <div className="ec-switch-row"><div className="ec-switch-copy"><strong>自动搜寻合适的 MCP <span className="ec-wip">WIP</span></strong><span>首版不联网、不安装、不修改你的 MCP 列表。</span></div><Toggle checked={false} onChange={() => undefined} label="自动搜寻 MCP，开发中" disabled /></div>
            {mcpEnabled && <label className="ec-field"><span className="ec-label">MCP servers JSON</span><textarea className="ec-textarea ec-code" aria-label="MCP servers JSON" value={mcpJson} onChange={event => setMcpJson(event.target.value)} spellCheck={false} aria-describedby="ec-mcp-help" /><span className="ec-help" id="ec-mcp-help">填写 mcpServers 对象的内容，例如 {`{ "my-server": { "command": "...", "args": [] } }`}。</span></label>}
          </section>
        </>}
      </div>

      <aside className="ec-summary">
        <h3>本次创建</h3>
        <dl>
          <div><dt>模式</dt><dd>{mode === 'simple' ? '简易' : '专业'}</dd></div>
          <div><dt>项目</dt><dd>{projectName || '未命名'}</dd></div>
          <div><dt>技术栈</dt><dd>{effective.stack === 'custom' ? stackDetail || '待填写' : stackName(effective.stack)}</dd></div>
          <div><dt>环境</dt><dd>{effective.environment === 'custom' ? environmentDetail || '待填写' : environmentName(effective.environment)}</dd></div>
          <div><dt>工作流</dt><dd>{effective.workflow === 'plan' ? 'Plan' : 'Go'}</dd></div>
          <div><dt>Git</dt><dd>{effective.git ? '初始化' : '不初始化'}</dd></div>
          <div><dt>MCP</dt><dd>{effective.mcp ? '手动配置' : '关闭'}</dd></div>
        </dl>
        <div className="ec-action">
          <button className="ec-button" type="submit" disabled={submitting}>{submitting ? handoffState === 'sending' ? '正在交给 DeepSeek…' : '正在准备项目…' : effective.workflow === 'plan' ? '让 DeepSeek 制定计划' : '让 DeepSeek 创建应用'}</button>
          <p className="ec-footnote">项目只会写入 EasyCode 输出目录，随后在 Harness 中打开并发送开发任务。同名目录不会被覆盖。</p>
          {error && <p className="ec-error" role="alert">{error}</p>}
          {result && <div className="ec-result" aria-live="polite"><strong>{handoffState === 'sent' ? '已交给 DeepSeek' : handoffState === 'failed' ? '项目已准备，等待手动继续' : '项目工作区已准备'}</strong><p className="ec-path">{result.outputPath}</p><button className="ec-copy" type="button" onClick={copyPath}>{copied ? '已复制' : '复制路径'}</button></div>}
        </div>
      </aside>
    </form>
  </div>
}

export const inject = ['slots', 'locale', 'workspaces', 'sessions', 'conversation']

export function apply(ctx: ClientContext): void {
  ctx.effect(ensureStyles, 'easycode: styles')
  ctx.effect(() => ctx.locale.register(NS, copy), 'easycode: dictionaries')
  const t = ctx.locale.bind(NS)
  const handoff: EasyCodeHandoff = async (outputPath, prompt) => {
    const workspace = await ctx.workspaces.create({ path: outputPath })
    const sessionId = await ctx.workspaces.connectWorkspace(workspace.workspaceId)
    ctx.sessions.open(sessionId)
    const conversation = ctx.sessions.scope(sessionId)?.get('conversation')
    if (conversation === undefined) throw new Error('当前工作区没有可用的会话服务')
    await conversation.send(prompt)
  }
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'easycode',
    order: 15,
    label: () => t('nav'),
    inject: () => ({ handoff }),
  }, EasyCodeWizard))
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'easycode',
    order: -10,
    locale: NS,
  }, EasyCodeLauncher))
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'easycode',
    order: 10,
    locale: NS,
    inject: () => ({ handoff }),
  }, EasyCodeOverlay))
}
