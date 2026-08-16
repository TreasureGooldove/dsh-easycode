import { describe, expect, it } from 'vitest'
import { parseEasyCodeRequest, ValidationError } from '../src/validation.ts'

describe('parseEasyCodeRequest', () => {
  it('locks simple mode to the zero-configuration defaults', () => {
    const result = parseEasyCodeRequest({
      mode: 'simple',
      projectName: ' My First App ',
      topic: '一个专注清单',
      stack: 'nextjs',
      environment: 'docker',
      initializeGit: true,
      workflow: 'plan',
      mcpEnabled: true,
      mcpServers: { unsafe: { command: 'anything' } },
    })

    expect(result).toMatchObject({
      mode: 'simple',
      projectName: 'my-first-app',
      stack: 'auto',
      stackDetail: '',
      environment: 'auto',
      environmentDetail: '',
      initializeGit: false,
      workflow: 'go',
      mcpEnabled: false,
      mcpServers: {},
    })
  })

  it('normalizes path-like names into one safe directory name', () => {
    const result = parseEasyCodeRequest({ projectName: '../../Demo App', topic: 'demo' })
    expect(result.projectName).toBe('demo-app')
  })

  it('accepts command and URL MCP servers in professional mode', () => {
    const result = parseEasyCodeRequest({
      mode: 'professional',
      projectName: 'pro-app',
      topic: '专业应用',
      stack: 'react-vite',
      environment: 'docker',
      workflow: 'plan',
      initializeGit: true,
      mcpEnabled: true,
      mcpServers: {
        local: { command: 'node', args: ['server.js'], env: { TOKEN: '${TOKEN}' } },
        remote: { url: 'https://example.com/mcp' },
      },
    })

    expect(Object.keys(result.mcpServers)).toEqual(['local', 'remote'])
    expect(result.initializeGit).toBe(true)
  })

  it('accepts extended and custom DeepSeek constraints', () => {
    expect(parseEasyCodeRequest({
      mode: 'professional', projectName: 'api', topic: '服务',
      stack: 'rust-axum', environment: 'devcontainer',
    })).toMatchObject({ stack: 'rust-axum', environment: 'devcontainer' })

    expect(parseEasyCodeRequest({
      mode: 'professional', projectName: 'custom', topic: '服务',
      stack: 'custom', stackDetail: 'Elixir + Phoenix',
      environment: 'custom', environmentDetail: '公司内网容器平台',
    })).toMatchObject({
      stack: 'custom', stackDetail: 'Elixir + Phoenix',
      environment: 'custom', environmentDetail: '公司内网容器平台',
    })
  })

  it('requires details for custom choices', () => {
    expect(() => parseEasyCodeRequest({
      mode: 'professional', projectName: 'custom', topic: '服务', stack: 'custom',
    })).toThrowError(ValidationError)
  })

  it('rejects invalid MCP server shapes with a field name', () => {
    expect(() => parseEasyCodeRequest({
      mode: 'professional',
      projectName: 'pro-app',
      topic: '专业应用',
      mcpEnabled: true,
      mcpServers: { broken: { args: [] } },
    })).toThrowError(ValidationError)

    try {
      parseEasyCodeRequest({
        mode: 'professional',
        projectName: 'pro-app',
        topic: '专业应用',
        mcpEnabled: true,
        mcpServers: { broken: { args: [] } },
      })
    } catch (error) {
      expect(error).toMatchObject({ field: 'mcpServers' })
    }
  })
})
