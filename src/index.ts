import { resolve } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createProjectHandler } from './http.ts'

export interface Config {
  /** Absolute or process-relative directory that contains generated projects. */
  outputRoot?: string
}

interface WebServerLike {
  register(route: {
    kind: 'exact' | 'prefix'
    path: string
    handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
  }): () => void
}

interface ContextLike {
  webServer: WebServerLike
  effect<T>(factory: () => T, label?: string): T
}

export const name = 'easycode'
export const inject = ['webServer']

/** Register EasyCode's same-origin project creation endpoint. */
export function apply(ctx: ContextLike, config: Config = {}): void {
  const outputRoot = resolve(config.outputRoot ?? 'easycode-projects')
  const handler = createProjectHandler(outputRoot)
  ctx.effect(
    () => ctx.webServer.register({ kind: 'exact', path: '/easycode/api/projects', handler }),
    'easycode: project creation route',
  )
}

export { generateProject } from './scaffolder.ts'
export { buildProjectFiles } from './templates.ts'
export { parseEasyCodeRequest } from './validation.ts'
export type { EasyCodeRequest, EasyCodeResult } from './types.ts'
