import { describe, expect, it } from 'vitest'
import { buildProjectFiles } from '../src/templates.ts'
import type { EasyCodeRequest } from '../src/types.ts'

function config(overrides: Partial<EasyCodeRequest> = {}): EasyCodeRequest {
  return {
    mode: 'professional',
    projectName: 'demo-app',
    topic: '一个可离线使用的任务管理应用',
    stack: 'react-vite',
    stackDetail: '',
    environment: 'local',
    environmentDetail: '',
    initializeGit: false,
    workflow: 'go',
    designGoal: '克制、清楚、移动端优先',
    mcpEnabled: false,
    mcpServers: {},
    ...overrides,
  }
}

describe('buildProjectFiles', () => {
  it('creates documentation only in Plan workflow', () => {
    const files = buildProjectFiles(config({ workflow: 'plan', mcpEnabled: true, mcpServers: {} }))
    expect(files.has('PLAN.md')).toBe(true)
    expect(files.has('EASYCODE.md')).toBe(true)
    expect(files.has('.mcp.json')).toBe(true)
    expect(files.has('package.json')).toBe(false)
    expect(files.get('README.md')).toContain('不进入代码实现')
    expect(files.get('README.md')).not.toContain('npm run dev')
  })

  it('writes API-specific milestones for a Node API plan', () => {
    const files = buildProjectFiles(config({ workflow: 'plan', stack: 'node-api' }))
    expect(files.get('PLAN.md')).toContain('定义资源模型、接口契约和错误格式')
    expect(files.get('PLAN.md')).not.toContain('移动端布局')
  })

  it('creates a runnable React skeleton and Docker files in Go workflow', () => {
    const files = buildProjectFiles(config({ environment: 'docker' }))
    expect(files.has('package.json')).toBe(true)
    expect(files.has('src/App.tsx')).toBe(true)
    expect(files.has('Dockerfile')).toBe(true)
    expect(files.has('docker-compose.yml')).toBe(true)
  })

  it('has a runnable entry for every supported stack', () => {
    const expectations = {
      vanilla: 'src/main.js',
      'react-vite': 'src/App.tsx',
      'vue-vite': 'src/App.vue',
      nextjs: 'app/page.tsx',
      'node-api': 'src/server.js',
    } as const

    for (const [stack, entry] of Object.entries(expectations)) {
      const files = buildProjectFiles(config({ stack: stack as EasyCodeRequest['stack'] }))
      expect(files.has(entry), `${stack} should create ${entry}`).toBe(true)
    }
  })

  it('creates an AI-ready brief for automatic and extended stacks', () => {
    const automatic = buildProjectFiles(config({ stack: 'auto', environment: 'auto' }))
    expect(automatic.has('EASYCODE.md')).toBe(true)
    expect(automatic.has('package.json')).toBe(false)
    expect(automatic.get('EASYCODE.md')).toContain('由 DeepSeek 根据需求自动决策')

    const extended = buildProjectFiles(config({ stack: 'rust-axum', environment: 'devcontainer' }))
    expect(extended.get('PLAN.md')).toContain('Rust + Axum')
    expect(extended.get('PLAN.md')).toContain('Dev Container')
    expect(extended.get('PLAN.md')).toContain('统一错误结构')
  })

  it('preserves custom stack and environment constraints for DeepSeek', () => {
    const files = buildProjectFiles(config({
      stack: 'custom',
      stackDetail: 'Elixir + Phoenix LiveView',
      environment: 'custom',
      environmentDetail: '内网 Linux 构建机',
    }))
    expect(files.get('EASYCODE.md')).toContain('Elixir + Phoenix LiveView')
    expect(files.get('EASYCODE.md')).toContain('内网 Linux 构建机')
  })

  it('does not emit placeholder media URLs', () => {
    const content = [...buildProjectFiles(config()).values()].join('\n')
    expect(content).not.toMatch(/unsplash|picsum|placeholder\.com|placehold\.co|via\.placeholder|lorem\.space|dummyimage/i)
  })
})
