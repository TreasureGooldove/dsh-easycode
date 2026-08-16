// @vitest-environment jsdom
import { createElement, type ComponentType } from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { apply } from '../src/client/index.tsx'

afterEach(() => {
  cleanup()
  document.head.querySelectorAll('style[data-plugin="dsh-easycode"]').forEach(node => node.remove())
  vi.restoreAllMocks()
})

function captureWizard(): ComponentType {
  let component: unknown
  const ctx = {
    effect<T>(factory: () => T) { return factory() },
    locale: {
      register() { return () => undefined },
      bind() { return (key: string) => key === 'nav' ? 'EasyCode' : key },
    },
    slots: {
      inject(_name: string, factory: () => unknown) { factory() },
      register(_options: unknown, next: unknown) { component = next; return () => undefined },
    },
  }
  apply(ctx)
  return component as ComponentType
}

describe('EasyCodeWizard', () => {
  it('shows MCP auto discovery as disabled WIP', () => {
    const Wizard = captureWizard()
    render(createElement(Wizard))
    fireEvent.click(screen.getByRole('button', { name: '专业模式' }))
    expect((screen.getByRole('switch', { name: '自动搜寻 MCP，开发中' }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText('WIP')).not.toBeNull()
  })

  it('submits simple mode with locked safe defaults', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      ok: true,
      projectName: 'todo-app',
      outputPath: 'C:\\easycode-projects\\todo-app',
      workflow: 'go',
      files: ['README.md'],
      gitInitialized: false,
    }), { status: 201, headers: { 'content-type': 'application/json' } }))
    const Wizard = captureWizard()
    render(createElement(Wizard))
    fireEvent.change(screen.getByLabelText('一句话主题'), { target: { value: 'todo app' } })
    fireEvent.click(screen.getByRole('button', { name: '创建应用' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    const init = fetchMock.mock.calls[0]?.[1]
    const payload = JSON.parse(String(init?.body)) as Record<string, unknown>
    expect(payload).toMatchObject({
      mode: 'simple',
      stack: 'vanilla',
      environment: 'local',
      initializeGit: false,
      workflow: 'go',
      mcpEnabled: false,
    })
    expect(await screen.findByText('应用已创建')).not.toBeNull()
  })
})
