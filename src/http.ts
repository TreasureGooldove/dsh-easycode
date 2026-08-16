import type { IncomingMessage, ServerResponse } from 'node:http'
import { generateProject, ProjectExistsError } from './scaffolder.ts'
import type { EasyCodeError, EasyCodeResult } from './types.ts'
import { parseEasyCodeRequest, ValidationError } from './validation.ts'

const MAX_BODY_BYTES = 64 * 1024

function respond(
  res: ServerResponse,
  status: number,
  payload: EasyCodeResult | EasyCodeError,
): void {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(body),
    'x-content-type-options': 'nosniff',
  })
  res.end(body)
}

function sameOrigin(req: IncomingMessage): boolean {
  const origin = req.headers.origin
  if (origin === undefined || origin === 'null') return true
  const host = req.headers.host
  if (host === undefined) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > MAX_BODY_BYTES) throw new ValidationError('请求体不能超过 64 KB')
    chunks.push(buffer)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) throw new ValidationError('请求体不能为空')
  try {
    return JSON.parse(raw)
  } catch {
    throw new ValidationError('请求体不是有效的 JSON')
  }
}

export function createProjectHandler(outputRoot: string) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (req.method !== 'POST') {
      res.setHeader('allow', 'POST')
      respond(res, 405, { ok: false, error: '仅支持 POST 请求' })
      return
    }
    if (req.headers['x-easycode-request'] !== '1' || !sameOrigin(req)) {
      respond(res, 403, { ok: false, error: '请求来源未通过校验' })
      return
    }
    const contentType = req.headers['content-type'] ?? ''
    if (!contentType.toLowerCase().startsWith('application/json')) {
      respond(res, 415, { ok: false, error: 'Content-Type 必须是 application/json' })
      return
    }

    try {
      const config = parseEasyCodeRequest(await readJson(req))
      const result = await generateProject(outputRoot, config)
      respond(res, 201, result)
    } catch (error) {
      if (error instanceof ValidationError) {
        respond(res, 400, {
          ok: false,
          error: error.message,
          ...(error.field === undefined ? {} : { field: error.field }),
        })
        return
      }
      if (error instanceof ProjectExistsError) {
        respond(res, 409, { ok: false, error: error.message, field: 'projectName' })
        return
      }
      const message = error instanceof Error ? error.message : '创建项目失败'
      respond(res, 500, { ok: false, error: message })
    }
  }
}
