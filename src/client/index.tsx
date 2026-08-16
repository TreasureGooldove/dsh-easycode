import { useMemo, useState, type FormEvent } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
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
  zh: { nav: 'EasyCode' },
  en: { nav: 'EasyCode' },
}

const STACKS: Array<{ id: AppStack; name: string; note: string }> = [
  { id: 'react-vite', name: 'React + Vite', note: '交互型 Web 应用' },
  { id: 'vue-vite', name: 'Vue + Vite', note: '渐进式 Web 应用' },
  { id: 'nextjs', name: 'Next.js', note: '全栈与内容型站点' },
  { id: 'node-api', name: 'Node API', note: '轻量后端服务' },
  { id: 'vanilla', name: 'Vanilla + Vite', note: '零框架前端' },
]

const STYLES = `
.ec-root {
  --ec-bg: var(--dsw-surface, #f7f6f2);
  --ec-panel: var(--dsw-surface-raised, #ffffff);
  --ec-text: var(--dsw-text, #202725);
  --ec-muted: var(--dsw-text-muted, #69716e);
  --ec-border: var(--dsw-border, #d9dcd8);
  --ec-accent: #26786b;
  --ec-accent-strong: #1d665b;
  --ec-soft: #e5f0ed;
  --ec-warn: #8a5a20;
  color: var(--ec-text);
  min-height: 100%;
  padding: 6px 2px 36px;
  container-type: inline-size;
}
.ec-root, .ec-root * { box-sizing: border-box; }

.ec-hero { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 24px; align-items: end; border-bottom: 1px solid var(--ec-border); padding: 4px 0 26px; }
.ec-kicker { margin: 0 0 9px; color: var(--ec-accent); font-size: 11px; font-weight: 750; letter-spacing: .15em; text-transform: uppercase; }
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
.ec-stack-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.ec-choice { border: 1px solid var(--ec-border); border-radius: 10px; background: var(--ec-panel); color: inherit; padding: 12px; text-align: left; cursor: pointer; }
.ec-choice[data-active='true'] { border-color: var(--ec-accent); box-shadow: inset 3px 0 0 var(--ec-accent); }
.ec-choice strong { display: block; font-size: 13px; }
.ec-choice span { display: block; margin-top: 4px; color: var(--ec-muted); font-size: 11px; }

.ec-switch-row { display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center; padding: 13px 0; border-bottom: 1px solid var(--ec-border); }
.ec-switch-row:last-child { border-bottom: 0; }
.ec-switch-copy strong { display: block; font-size: 13px; }
.ec-switch-copy span { display: block; margin-top: 4px; color: var(--ec-muted); font-size: 12px; line-height: 1.45; }
.ec-switch { position: relative; width: 42px; height: 24px; border: 0; border-radius: 999px; background: #b9bfbc; cursor: pointer; transition: background 160ms ease; }
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
.ec-error { margin: 12px 0 0; color: #9c3f36; font-size: 12px; line-height: 1.5; }
.ec-result { margin-top: 14px; border: 1px solid #9ec6bc; border-radius: 10px; background: var(--ec-soft); padding: 13px; }
.ec-result strong { display: block; font-size: 13px; }
.ec-path { margin: 7px 0 0; color: var(--ec-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11px; line-height: 1.5; overflow-wrap: anywhere; }
.ec-copy { margin-top: 10px; border: 1px solid var(--ec-border); border-radius: 7px; background: var(--ec-panel); color: inherit; padding: 7px 9px; font: inherit; font-size: 11px; cursor: pointer; }
.ec-footnote { margin: 14px 0 0; color: var(--ec-muted); font-size: 11px; line-height: 1.5; }

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

function EasyCodeWizard() {
  const [mode, setMode] = useState<AppMode>('simple')
  const [projectName, setProjectName] = useState('my-app')
  const [topic, setTopic] = useState('')
  const [stack, setStack] = useState<AppStack>('react-vite')
  const [environment, setEnvironment] = useState<DevEnvironment>('local')
  const [initializeGit, setInitializeGit] = useState(true)
  const [workflow, setWorkflow] = useState<WorkflowMode>('go')
  const [designGoal, setDesignGoal] = useState('清晰、快速、移动端可用')
  const [mcpEnabled, setMcpEnabled] = useState(false)
  const [mcpJson, setMcpJson] = useState('{}')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<EasyCodeResult | null>(null)
  const [copied, setCopied] = useState(false)

  const effective = useMemo(() => mode === 'simple'
    ? { stack: 'vanilla' as AppStack, environment: 'local' as DevEnvironment, workflow: 'go' as WorkflowMode, git: false, mcp: false }
    : { stack, environment, workflow, git: initializeGit, mcp: mcpEnabled },
  [mode, stack, environment, workflow, initializeGit, mcpEnabled])

  function chooseMode(next: AppMode) {
    setMode(next)
    setError('')
    setResult(null)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setResult(null)
    setCopied(false)
    if (!projectName.trim()) return setError('请填写项目名称。')
    if (!topic.trim()) return setError('请描述你要创建的应用。')

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
      environment: effective.environment,
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
        <p className="ec-intro">选择适合你的控制粒度，EasyCode 会在本机生成规划或可运行项目。无需记命令，也不会替你上传代码。</p>
      </div>
      <span className="ec-version">v0.1</span>
    </header>

    <div className="ec-mode-grid" role="group" aria-label="创建模式">
      <button className="ec-mode" type="button" aria-label="简易模式" aria-pressed={mode === 'simple'} data-active={mode === 'simple'} onClick={() => chooseMode('simple')}>
        <strong>简易模式</strong>
        <span>输入项目名与主题，直接获得一个零配置 Web 应用。</span>
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
            <div className="ec-section-head"><h3>开发栈</h3><span>选择一个</span></div>
            <div className="ec-stack-grid">
              {STACKS.map(item => <button key={item.id} className="ec-choice" type="button" data-active={stack === item.id} onClick={() => setStack(item.id)}>
                <strong>{item.name}</strong><span>{item.note}</span>
              </button>)}
            </div>
          </section>

          <section className="ec-section">
            <div className="ec-section-head"><h3>执行策略</h3><span>环境与工作流</span></div>
            <div className="ec-grid-2">
              <label className="ec-field"><span className="ec-label">开发环境</span><select className="ec-select" value={environment} onChange={event => setEnvironment(event.target.value as DevEnvironment)}><option value="local">本地开发</option><option value="docker">Docker</option></select></label>
              <label className="ec-field"><span className="ec-label">工作流</span><select className="ec-select" value={workflow} onChange={event => setWorkflow(event.target.value as WorkflowMode)}><option value="go">Go：生成可运行骨架</option><option value="plan">Plan：只生成规划</option></select></label>
            </div>
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
          <div><dt>技术栈</dt><dd>{stackName(effective.stack)}</dd></div>
          <div><dt>环境</dt><dd>{effective.environment === 'docker' ? 'Docker' : '本地'}</dd></div>
          <div><dt>工作流</dt><dd>{effective.workflow === 'plan' ? 'Plan' : 'Go'}</dd></div>
          <div><dt>Git</dt><dd>{effective.git ? '初始化' : '不初始化'}</dd></div>
          <div><dt>MCP</dt><dd>{effective.mcp ? '手动配置' : '关闭'}</dd></div>
        </dl>
        <div className="ec-action">
          <button className="ec-button" type="submit" disabled={submitting}>{submitting ? '正在创建…' : effective.workflow === 'plan' ? '生成项目规划' : '创建应用'}</button>
          <p className="ec-footnote">项目只会写入 EasyCode 的输出目录。已存在的同名目录不会被覆盖。</p>
          {error && <p className="ec-error" role="alert">{error}</p>}
          {result && <div className="ec-result" aria-live="polite"><strong>{result.workflow === 'plan' ? '规划已生成' : '应用已创建'}</strong><p className="ec-path">{result.outputPath}</p><button className="ec-copy" type="button" onClick={copyPath}>{copied ? '已复制' : '复制路径'}</button></div>}
        </div>
      </aside>
    </form>
  </div>
}

export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
  ctx.effect(ensureStyles, 'easycode: styles')
  ctx.effect(() => ctx.locale.register(NS, copy), 'easycode: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'easycode',
    order: 15,
    label: () => t('nav'),
  }, EasyCodeWizard))
}
