import { readFileSync } from 'node:fs'
import { buildSpriteLookup, SpriteRegistryV2 } from '../src/sprite.js'

const registryRaw = JSON.parse(readFileSync(new URL('../data/sprites.json', import.meta.url), 'utf-8'))
const registry = registryRaw as SpriteRegistryV2
const lookup = buildSpriteLookup(registry)

const mapRaw = JSON.parse(readFileSync(new URL('../../server/src/data/map.json', import.meta.url), 'utf-8'))

let totalIds = 0
const missingIds: string[] = []

for (const row of mapRaw) {
  for (const cell of row) {
    for (const spriteId of cell) {
      totalIds++
      if (!lookup[spriteId]) {
        missingIds.push(String(spriteId))
      }
    }
  }
}

console.log(`Total sprite ID references in map.json: ${totalIds}`)
console.log(`Lookup entries: ${Object.keys(lookup).length}`)

if (missingIds.length === 0) {
  console.log('PASS: 100% coverage -- all sprite IDs in map.json are resolvable.')
} else {
  console.error(`FAIL: ${missingIds.length} sprite IDs not found in lookup:`)
  const unique = [...new Set(missingIds)]
  unique.forEach((id) => console.error(`  - ${id}`))
  process.exit(1)
}
