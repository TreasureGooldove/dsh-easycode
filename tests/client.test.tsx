// @vitest-environment jsdom
import { Fragment, createElement, type ComponentType } from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { apply } from '../src/client/index.tsx'

afterEach(() => {
  cleanup()
  document.head.querySelectorAll('style[data-plugin="dsh-easycode"]').forEach(node => node.remove())
  vi.restoreAllMocks()
})

interface CapturedEntry {
  component: ComponentType<Record<string, unknown>>
  props: Record<string, unknown>
}

function capturePlugin() {
  const entries = new Map<string, CapturedEntry>()
  const send = vi.fn(async (_prompt: string) => undefined)
  const open = vi.fn()
  const t = (key: string) => ({
    nav: 'EasyCode', launch: 'EasyCode', dialogLabel: '创建应用', dialogHint: '从首页直接开始', close: '关闭',
  })[key] ?? key
  const ctx = {
    effect<T>(factory: () => T) { return factory() },
    locale: {
      register() { return () => undefined },
      bind() { return t },
    },
    slots: {
      inject(_name: string, factory: () => unknown) { factory() },
      register(options: Record<string, unknown>, next: unknown) {
        const injected = typeof options.inject === 'function'
          ? (options.inject as () => Record<string, unknown>)()
          : {}
        const props = { ...injected, ...(options.locale ? { t } : {}) }
        entries.set(`${String(options.name)}:${String(options.id ?? '')}`, {
          component: next as ComponentType<Record<string, unknown>>,
          props,
        })
        return () => undefined
      },
    },
    workspaces: {
      create: vi.fn(async ({ path }: { path: string }) => ({ workspaceId: `workspace:${path}` })),
      connectWorkspace: vi.fn(async () => 'session-1'),
    },
    sessions: {
      open,
      scope: vi.fn(() => ({ get: () => ({ send }) })),
    },
  }
  apply(ctx)
  return { entries, send, open }
}

function renderWizard(plugin = capturePlugin()) {
  const entry = plugin.entries.get('settings.section:easycode')
  if (entry === undefined) throw new Error('EasyCode settings entry was not registered')
  render(createElement(entry.component, entry.props))
  return plugin
}

describe('EasyCodeWizard', () => {
  it('uses official DSH theme aliases including dark-theme overrides', () => {
    capturePlugin()
    const css = document.head.querySelector<HTMLStyleElement>('style[data-plugin="dsh-easycode"]')?.textContent ?? ''
    expect(css).toContain('--dsw-alias-bg-layer-1')
    expect(css).toContain('--dsw-alias-label-primary')
    expect(css).toContain('body[data-ds-dark-theme] .ec-root')
    expect(css).not.toMatch(/--dsw-(surface|surface-raised|text|text-muted|border)\b/)
  })

  it('registers a homepage launcher that opens and closes the overlay', () => {
    const { entries } = capturePlugin()
    const launcher = entries.get('sidebar.footer.action:easycode')
    const overlay = entries.get('shell.overlay:easycode')
    if (launcher === undefined || overlay === undefined) throw new Error('EasyCode homepage entries were not registered')
    render(createElement(Fragment, null,
      createElement(launcher.component, { ...launcher.props, wide: true }),
      createElement(overlay.component, overlay.props),
    ))
    fireEvent.click(screen.getByRole('button', { name: 'EasyCode' }))
    expect(screen.getByRole('dialog', { name: '创建应用' })).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '关闭' }))
    expect(screen.queryByRole('dialog', { name: '创建应用' })).toBeNull()
  })

  it('shows broad stack and environment constraints with custom escape hatches', () => {
    renderWizard()
    fireEvent.click(screen.getByRole('button', { name: '专业模式' }))
    expect(screen.getByRole('option', { name: 'Rust + Axum' })).not.toBeNull()
    expect(screen.getByRole('option', { name: 'GitHub Codespaces' })).not.toBeNull()
    fireEvent.change(screen.getByLabelText('技术栈'), { target: { value: 'custom' } })
    fireEvent.change(screen.getByLabelText('开发环境'), { target: { value: 'custom' } })
    expect(screen.getByLabelText('自定义技术栈')).not.toBeNull()
    expect(screen.getByLabelText('自定义开发环境')).not.toBeNull()
  })

  it('shows MCP auto discovery as disabled WIP', () => {
    renderWizard()
    fireEvent.click(screen.getByRole('button', { name: '专业模式' }))
    expect((screen.getByRole('switch', { name: '自动搜寻 MCP，开发中' }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText('WIP')).not.toBeNull()
  })

  it('submits simple mode with automatic decisions and hands the task to DeepSeek', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      ok: true,
      projectName: 'todo-app',
      outputPath: 'C:\\easycode-projects\\todo-app',
      workflow: 'go',
      files: ['README.md'],
      gitInitialized: false,
    }), { status: 201, headers: { 'content-type': 'application/json' } }))
    const plugin = renderWizard()
    fireEvent.change(screen.getByLabelText('一句话主题'), { target: { value: 'todo app' } })
    fireEvent.click(screen.getByRole('button', { name: '让 DeepSeek 创建应用' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    const init = fetchMock.mock.calls[0]?.[1]
    const payload = JSON.parse(String(init?.body)) as Record<string, unknown>
    expect(payload).toMatchObject({
      mode: 'simple',
      stack: 'auto',
      stackDetail: '',
      environment: 'auto',
      environmentDetail: '',
      initializeGit: false,
      workflow: 'go',
      mcpEnabled: false,
    })
    await waitFor(() => expect(plugin.send).toHaveBeenCalledOnce())
    expect(plugin.open).toHaveBeenCalledWith('session-1')
    expect(plugin.send.mock.calls[0]?.[0]).toContain('完整、可运行的应用')
    expect(await screen.findByText('已交给 DeepSeek')).not.toBeNull()
  })
})
