import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, rename, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { promisify } from 'node:util'
import { buildProjectFiles } from './templates.ts'
import type { EasyCodeRequest, EasyCodeResult } from './types.ts'

const execFileAsync = promisify(execFile)

export class ProjectExistsError extends Error {
  constructor(readonly projectPath: string) {
    super(`项目目录已存在：${projectPath}`)
    this.name = 'ProjectExistsError'
  }
}

function assertChildPath(root: string, candidate: string): void {
  const rel = relative(root, candidate)
  if (rel === '' || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new Error('项目路径超出允许的输出目录')
  }
}

async function writeFiles(root: string, files: ReadonlyMap<string, string>): Promise<void> {
  for (const [relativePath, content] of files) {
    const output = resolve(root, relativePath)
    assertChildPath(root, output)
    await mkdir(dirname(output), { recursive: true })
    await writeFile(output, content, { encoding: 'utf8', flag: 'wx' })
  }
}

async function initializeGitRepository(root: string): Promise<void> {
  try {
    await execFileAsync('git', ['init', '--initial-branch=main'], {
      cwd: root,
      windowsHide: true,
      timeout: 30_000,
    })
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(`Git 初始化失败：${detail}`)
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch (error) {
    const code = error instanceof Error && 'code' in error ? String(error.code) : ''
    if (code === 'ENOENT') return false
    throw error
  }
}

export async function generateProject(
  outputRoot: string,
  config: EasyCodeRequest,
): Promise<EasyCodeResult> {
  const root = resolve(outputRoot)
  const target = resolve(root, config.projectName)
  assertChildPath(root, target)
  await mkdir(root, { recursive: true })
  if (await pathExists(target)) throw new ProjectExistsError(target)

  const temporary = await mkdtemp(join(root, `.${config.projectName}-`))
  let published = false
  try {
    const files = buildProjectFiles(config)
    await writeFiles(temporary, files)
    if (config.initializeGit) await initializeGitRepository(temporary)
    try {
      await rename(temporary, target)
    } catch (error) {
      const code = error instanceof Error && 'code' in error ? String(error.code) : ''
      if (code === 'EEXIST' || code === 'ENOTEMPTY' || (code === 'EPERM' && await pathExists(target))) {
        throw new ProjectExistsError(target)
      }
      throw error
    }
    published = true
    return {
      ok: true,
      projectName: config.projectName,
      outputPath: target,
      workflow: config.workflow,
      files: [...files.keys()].sort(),
      gitInitialized: config.initializeGit,
    }
  } finally {
    if (!published) await rm(temporary, { recursive: true, force: true })
  }
}
