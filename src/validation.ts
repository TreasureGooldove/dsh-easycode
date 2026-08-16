import {
  APP_MODES,
  APP_STACKS,
  DEV_ENVIRONMENTS,
  WORKFLOWS,
  type AppMode,
  type AppStack,
  type DevEnvironment,
  type EasyCodeRequest,
  type McpServerConfig,
  type WorkflowMode,
} from './types.ts'

export class ValidationError extends Error {
  constructor(message: string, readonly field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredString(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ValidationError('该字段不能为空', field)
  }
  const normalized = value.trim()
  if (normalized.length > maxLength) {
    throw new ValidationError(`最多允许 ${maxLength} 个字符`, field)
  }
  return normalized
}

function enumValue<T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string,
  fallback: T,
): T {
  if (value === undefined) return fallback
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    throw new ValidationError('选项无效', field)
  }
  return value as T
}

export function normalizeProjectName(value: unknown): string {
  const raw = requiredString(value, 'projectName', 64).toLowerCase()
  const slug = raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')

  if (slug.length === 0 || slug === '.' || slug === '..') {
    throw new ValidationError('请输入有效的项目名称', 'projectName')
  }
  return slug
}

function normalizeMcpServer(name: string, value: unknown): McpServerConfig {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/.test(name)) {
    throw new ValidationError(`MCP 服务名“${name}”无效`, 'mcpServers')
  }
  if (!isRecord(value)) {
    throw new ValidationError(`MCP 服务“${name}”必须是对象`, 'mcpServers')
  }

  const command = value.command
  const url = value.url
  if (typeof command !== 'string' && typeof url !== 'string') {
    throw new ValidationError(`MCP 服务“${name}”需要 command 或 url`, 'mcpServers')
  }
  if (command !== undefined && (typeof command !== 'string' || command.trim().length === 0)) {
    throw new ValidationError(`MCP 服务“${name}”的 command 无效`, 'mcpServers')
  }
  if (url !== undefined) {
    if (typeof url !== 'string') throw new ValidationError(`MCP 服务“${name}”的 url 无效`, 'mcpServers')
    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      throw new ValidationError(`MCP 服务“${name}”的 url 无效`, 'mcpServers')
    }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new ValidationError(`MCP 服务“${name}”仅支持 http/https`, 'mcpServers')
    }
  }

  const args = value.args
  if (args !== undefined && (!Array.isArray(args) || args.some(item => typeof item !== 'string'))) {
    throw new ValidationError(`MCP 服务“${name}”的 args 必须是字符串数组`, 'mcpServers')
  }

  const env = value.env
  if (env !== undefined && (!isRecord(env) || Object.values(env).some(item => typeof item !== 'string'))) {
    throw new ValidationError(`MCP 服务“${name}”的 env 必须是字符串字典`, 'mcpServers')
  }

  return {
    ...(typeof command === 'string' ? { command: command.trim() } : {}),
    ...(Array.isArray(args) ? { args: [...args] as string[] } : {}),
    ...(isRecord(env) ? { env: { ...env } as Record<string, string> } : {}),
    ...(typeof url === 'string' ? { url } : {}),
  }
}

function normalizeMcpServers(value: unknown, enabled: boolean): Record<string, McpServerConfig> {
  if (!enabled) return {}
  if (!isRecord(value)) throw new ValidationError('MCP 配置必须是对象', 'mcpServers')
  const entries = Object.entries(value)
  if (entries.length > 20) throw new ValidationError('MCP 服务最多 20 个', 'mcpServers')
  return Object.fromEntries(entries.map(([name, server]) => [name, normalizeMcpServer(name, server)]))
}

export function parseEasyCodeRequest(value: unknown): EasyCodeRequest {
  if (!isRecord(value)) throw new ValidationError('请求体必须是对象')

  const mode = enumValue(value.mode, APP_MODES, 'mode', 'simple') as AppMode
  const topic = requiredString(value.topic, 'topic', 2000)
  const projectName = normalizeProjectName(value.projectName)
  const isSimple = mode === 'simple'
  const stack = enumValue(value.stack, APP_STACKS, 'stack', isSimple ? 'vanilla' : 'react-vite') as AppStack
  const environment = enumValue(value.environment, DEV_ENVIRONMENTS, 'environment', 'local') as DevEnvironment
  const workflow = enumValue(value.workflow, WORKFLOWS, 'workflow', isSimple ? 'go' : 'plan') as WorkflowMode
  const designGoal = typeof value.designGoal === 'string'
    ? value.designGoal.trim().slice(0, 2000)
    : ''
  const initializeGit = isSimple ? false : value.initializeGit === true
  const mcpEnabled = isSimple ? false : value.mcpEnabled === true

  return {
    mode,
    projectName,
    topic,
    stack: isSimple ? 'vanilla' : stack,
    environment: isSimple ? 'local' : environment,
    initializeGit,
    workflow: isSimple ? 'go' : workflow,
    designGoal,
    mcpEnabled,
    mcpServers: normalizeMcpServers(value.mcpServers ?? {}, mcpEnabled),
  }
}
