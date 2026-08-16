export const APP_MODES = ['simple', 'professional'] as const
export const APP_STACKS = [
  'auto',
  'vanilla', 'react-vite', 'vue-vite', 'svelte-vite', 'solid-vite', 'angular', 'astro', 'qwik',
  'nextjs', 'nuxt', 'remix', 'sveltekit', 'tanstack-start',
  'node-api', 'express', 'fastify', 'nestjs', 'hono', 'bun-api', 'deno-api',
  'python-fastapi', 'python-django', 'go-api', 'rust-axum', 'java-spring', 'kotlin-ktor',
  'dotnet-api', 'php-laravel', 'ruby-rails',
  'electron', 'tauri', 'react-native', 'expo', 'flutter', 'browser-extension',
  'custom',
] as const
export const DEV_ENVIRONMENTS = [
  'auto', 'local', 'docker', 'podman', 'devcontainer', 'wsl', 'nix',
  'remote-ssh', 'codespaces', 'kubernetes', 'custom',
] as const
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
  stackDetail: string
  environment: DevEnvironment
  environmentDetail: string
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
