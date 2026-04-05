import type { Plugin } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SPRITES_JSON = path.resolve(__dirname, '../shared/data/sprites.json')
const MAP_JSON = path.resolve(__dirname, '../shared/data/map.json')

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

export function mapEditorApiPlugin(): Plugin {
  return {
    name: 'map-editor-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''

        // GET /__api/sprites
        if (url === '/__api/sprites' && req.method === 'GET') {
          try {
            console.log('[map-api-plugin] GET /__api/sprites')
            const data = await fs.readFile(SPRITES_JSON, 'utf-8')
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(data)
          } catch (err) {
            console.error('[map-api-plugin] Failed to read sprites.json:', err)
            sendJson(res, 500, { error: 'Failed to read sprites.json' })
          }
          return
        }

        // GET /__api/map
        if (url === '/__api/map' && req.method === 'GET') {
          try {
            console.log('[map-api-plugin] GET /__api/map')
            const data = await fs.readFile(MAP_JSON, 'utf-8')
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(data)
          } catch (err: unknown) {
            if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
              console.log('[map-api-plugin] map.json not found, returning 404')
              sendJson(res, 404, { error: 'map.json not found' })
            } else {
              console.error('[map-api-plugin] Failed to read map.json:', err)
              sendJson(res, 500, { error: 'Failed to read map.json' })
            }
          }
          return
        }

        // POST /__api/map
        if (url === '/__api/map' && req.method === 'POST') {
          try {
            console.log('[map-api-plugin] POST /__api/map')
            const body = await readBody(req)

            // Validate JSON
            let parsed: unknown
            try {
              parsed = JSON.parse(body)
            } catch {
              sendJson(res, 400, { error: 'Invalid JSON body' })
              return
            }

            const pretty = JSON.stringify(parsed, null, 2) + '\n'

            const tmpPath = MAP_JSON + '.tmp'
            const bakPath = MAP_JSON + '.bak'

            // Write to tmp file
            await fs.writeFile(tmpPath, pretty, 'utf-8')
            console.log(`[map-api-plugin] Wrote tmp file: ${tmpPath} (${pretty.length} bytes)`)

            // Backup current file
            try {
              await fs.copyFile(MAP_JSON, bakPath)
              console.log(`[map-api-plugin] Backed up to: ${bakPath}`)
            } catch {
              // No existing file to back up -- that is fine on first save
            }

            // Atomic rename
            await fs.rename(tmpPath, MAP_JSON)
            console.log(`[map-api-plugin] Renamed tmp -> ${MAP_JSON}`)

            sendJson(res, 200, { ok: true })
          } catch (err) {
            console.error('[map-api-plugin] Failed to write map.json:', err)
            sendJson(res, 500, { error: 'Failed to write map.json' })
          }
          return
        }

        next()
      })
    },
  }
}
