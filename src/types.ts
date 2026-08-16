export const APP_MODES = ['simple', 'professional'] as const
export const APP_STACKS = ['vanilla', 'react-vite', 'vue-vite', 'nextjs', 'node-api'] as const
export const DEV_ENVIRONMENTS = ['local', 'docker'] as const
export const WORKFLOWS = ['plan', 'go'] as const

export type AppMode = (typeof APP_MODES)[number]
export type AppStack = (typeof APP_STACKS)[number]
export type DevEnvironment = (typeof DEV_ENVIRONMENTS)[number]
export type WorkflowMode = (typeof WORKFLOWS)[number]

export interface McpServerConfig {
  command?: string
  args?: string[]
  env?: Record<string, string>
  url?: string
}

export interface EasyCodeRequest {
  mode: AppMode
  projectName: string
  topic: string
  stack: AppStack
  environment: DevEnvironment
  initializeGit: boolean
  workflow: WorkflowMode
  designGoal: string
  mcpEnabled: boolean
  mcpServers: Record<string, McpServerConfig>
}

export interface EasyCodeResult {
  ok: true
  projectName: string
  outputPath: string
  workflow: WorkflowMode
  files: string[]
  gitInitialized: boolean
}

export interface EasyCodeError {
  ok: false
  error: string
  field?: string
}
