import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const runtimeFiles = ['lib/index.js', 'lib/index.d.ts', 'lib/client.js']
const installLifecycleScripts = ['preinstall', 'install', 'postinstall', 'prepare']
const errors = []

const blockedScripts = installLifecycleScripts.filter((name) => manifest.scripts?.[name])
if (blockedScripts.length > 0) {
  errors.push(
    `Git-hosted DSH plugins must not require install-time scripts: ${blockedScripts.join(', ')}`,
  )
}

const tracked = spawnSync('git', ['ls-files', '--error-unmatch', ...runtimeFiles], {
  cwd: root,
  encoding: 'utf8',
})
if (tracked.status !== 0) {
  errors.push(`Prebuilt runtime files must be tracked by Git: ${runtimeFiles.join(', ')}`)
}

const npmCli = process.env.npm_execpath
if (!npmCli) {
  errors.push('npm_execpath is unavailable; cannot inspect the package archive')
} else {
  const packed = spawnSync(
    process.execPath,
    [npmCli, 'pack', '--dry-run', '--ignore-scripts', '--json'],
    { cwd: root, encoding: 'utf8' },
  )

  if (packed.status !== 0) {
    errors.push(`npm pack inspection failed: ${packed.stderr.trim() || packed.stdout.trim()}`)
  } else {
    const [archive] = JSON.parse(packed.stdout)
    const archivedFiles = new Set(archive.files.map(({ path }) => path))
    const missing = runtimeFiles.filter((path) => !archivedFiles.has(path))
    if (missing.length > 0) {
      errors.push(`Package archive is missing runtime files: ${missing.join(', ')}`)
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`package verification failed: ${error}`)
  process.exit(1)
}

console.log('package verification passed: Git installs use committed runtime files')
