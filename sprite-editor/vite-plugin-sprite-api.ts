import type { Plugin } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SPRITES_JSON = path.resolve(__dirname, '../shared/data/sprites.json')
const SPRITES_DIR = path.resolve(__dirname, 'public/sprites')

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk: Buffer) => {
      data += chunk.toString()
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

export function spriteApiPlugin(): Plugin {
  return {
    name: 'sprite-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''

        // GET /__api/registry
        if (url === '/__api/registry' && req.method === 'GET') {
          try {
            const data = await fs.readFile(SPRITES_JSON, 'utf-8')
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(data)
          } catch (err) {
            console.error('[sprite-api] Failed to read sprites.json:', err)
            sendJson(res, 500, { error: 'Failed to read sprites.json' })
          }
          return
        }

        // PUT /__api/registry
        if (url === '/__api/registry' && req.method === 'PUT') {
          try {
            const body = await readBody(req)

            // Validate JSON
            const parsed = JSON.parse(body)
            const pretty = JSON.stringify(parsed, null, 2) + '\n'

            const tmpPath = SPRITES_JSON + '.tmp'
            const bakPath = SPRITES_JSON + '.bak'

            // Write to tmp file
            await fs.writeFile(tmpPath, pretty, 'utf-8')
            console.log(`[sprite-api] Wrote tmp file: ${tmpPath} (${pretty.length} bytes)`)

            // Backup current file
            try {
              await fs.copyFile(SPRITES_JSON, bakPath)
              console.log(`[sprite-api] Backed up to: ${bakPath}`)
            } catch {
              // No existing file to back up -- that is fine on first run
            }

            // Atomic rename
            await fs.rename(tmpPath, SPRITES_JSON)
            console.log(`[sprite-api] Renamed tmp -> ${SPRITES_JSON}`)

            sendJson(res, 200, { ok: true })
          } catch (err) {
            console.error('[sprite-api] Failed to write sprites.json:', err)
            sendJson(res, 500, { error: 'Failed to write sprites.json' })
          }
          return
        }

        // GET /__api/images
        if (url === '/__api/images' && req.method === 'GET') {
          try {
            const entries = await fs.readdir(SPRITES_DIR)
            const filenames = entries
              .filter((f) => f.endsWith('.png'))
              .map((f) => f.replace(/\.png$/, ''))
              .sort()
            sendJson(res, 200, filenames)
          } catch (err) {
            console.error('[sprite-api] Failed to list images:', err)
            sendJson(res, 500, { error: 'Failed to list images' })
          }
          return
        }

        // POST /__api/images/rename
        if (url === '/__api/images/rename' && req.method === 'POST') {
          try {
            const body = await readBody(req)
            const { from, to } = JSON.parse(body) as { from: string; to: string }

            if (!from || !to) {
              sendJson(res, 400, { error: 'Missing "from" or "to" field' })
              return
            }

            // Path traversal prevention: no slashes or backslashes in filenames
            if (/[/\\]/.test(from) || /[/\\]/.test(to)) {
              sendJson(res, 400, { error: 'Filenames must not contain path separators' })
              return
            }

            const fromPath = path.join(SPRITES_DIR, `${from}.png`)
            const toPath = path.join(SPRITES_DIR, `${to}.png`)

            // Verify resolved paths are within SPRITES_DIR
            if (!path.resolve(fromPath).startsWith(SPRITES_DIR) || !path.resolve(toPath).startsWith(SPRITES_DIR)) {
              sendJson(res, 400, { error: 'Invalid file path' })
              return
            }

            // Check source exists
            try {
              await fs.access(fromPath)
            } catch {
              sendJson(res, 404, { error: `Source file not found: ${from}.png` })
              return
            }

            // Check target does not exist
            try {
              await fs.access(toPath)
              sendJson(res, 409, { error: `Target file already exists: ${to}.png` })
              return
            } catch {
              // Target does not exist -- good
            }

            await fs.rename(fromPath, toPath)
            console.log(`[sprite-api] Renamed image: ${from}.png -> ${to}.png`)

            sendJson(res, 200, { ok: true })
          } catch (err) {
            console.error('[sprite-api] Failed to rename image:', err)
            sendJson(res, 500, { error: 'Failed to rename image' })
          }
          return
        }

        next()
      })
    },
  }
}
