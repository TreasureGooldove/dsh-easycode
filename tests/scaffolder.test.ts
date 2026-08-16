import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import { generateProject, ProjectExistsError } from '../src/scaffolder.ts'
import type { EasyCodeRequest } from '../src/types.ts'

const roots: string[] = []

afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

function config(): EasyCodeRequest {
  return {
    mode: 'simple',
    projectName: 'safe-app',
    topic: '一个简单应用',
    stack: 'vanilla',
    environment: 'local',
    initializeGit: false,
    workflow: 'go',
    designGoal: '',
    mcpEnabled: false,
    mcpServers: {},
  }
}

describe('generateProject', () => {
  it('publishes generated files under the configured root', async () => {
    const root = await mkdtemp(join(tmpdir(), 'easycode-test-'))
    roots.push(root)
    const result = await generateProject(root, config())

    expect(result.outputPath).toBe(join(root, 'safe-app'))
    expect((await stat(join(root, 'safe-app', 'src', 'main.js'))).isFile()).toBe(true)
    expect(await readFile(join(root, 'safe-app', '.easycode', 'config.json'), 'utf8')).toContain('safe-app')
  })

  it('never overwrites an existing project', async () => {
    const root = await mkdtemp(join(tmpdir(), 'easycode-test-'))
    roots.push(root)
    await generateProject(root, config())
    await expect(generateProject(root, config())).rejects.toBeInstanceOf(ProjectExistsError)
  })
})
