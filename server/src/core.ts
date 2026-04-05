import spriteRegistry from '@jinggu/shared/data/sprites.json' with { type: 'json' }
import { Map } from './lib/Map.js'
import { Memory } from './lib/Memory.js'
import { buildSpriteLookup, Sprites, SpriteRegistryV2 } from '@jinggu/shared'
import { Corpse } from './lib/Corpse.js'

export const registry = spriteRegistry as unknown as SpriteRegistryV2
export const sprites: Sprites = buildSpriteLookup(registry)
export const map = new Map()
export const memory = new Memory()
export const corpses: Corpse[] = []

console.log(`Map loaded: ${map.width}x${map.height}`)
