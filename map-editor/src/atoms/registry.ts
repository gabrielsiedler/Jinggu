import { atom } from 'jotai'
import type { SpriteRegistryV2, SpriteCategory, SpriteDef } from '@jinggu/shared'

const emptyRegistry: SpriteRegistryV2 = {
  version: 2,
  tiles: { terrain: {}, terrainOverlays: {}, objects: {} },
  entities: {},
}

export const registryAtom = atom<SpriteRegistryV2>(emptyRegistry)

export interface SpriteEntry {
  category: SpriteCategory
  key: string
  definition: SpriteDef
}

/** Collect keys of all sprites that are grid children */
const getGridChildKeys = (defs: Record<string, SpriteDef>): Set<string> => {
  const childKeys = new Set<string>()
  for (const [key, def] of Object.entries(defs)) {
    const grid = def.render.grid
    if (grid) {
      for (let i = 1; i <= grid.cols * grid.rows; i++) {
        childKeys.add(`${key}-${i}`)
      }
    }
  }
  return childKeys
}

function buildEntries(registry: SpriteRegistryV2): SpriteEntry[] {
  const entries: SpriteEntry[] = []

  const addCategory = (category: SpriteCategory, defs: Record<string, SpriteDef>) => {
    const childKeys = getGridChildKeys(defs)
    for (const [key, definition] of Object.entries(defs)) {
      if (childKeys.has(key)) continue
      entries.push({ category, key, definition })
    }
  }

  addCategory('terrain', registry.tiles.terrain)
  addCategory('terrainOverlays', registry.tiles.terrainOverlays)
  addCategory('objects', registry.tiles.objects)
  addCategory('entities', registry.entities)

  return entries
}

/** Derived: flat sprite entries for picker (excludes grid children) */
export const spriteEntriesAtom = atom<SpriteEntry[]>((get) => {
  const registry = get(registryAtom)
  return buildEntries(registry)
})
