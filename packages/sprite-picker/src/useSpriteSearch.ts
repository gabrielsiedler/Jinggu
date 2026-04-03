import type { SpriteRegistryV2 } from '@jinggu/shared'
import type { SpriteCategory, SpriteDef } from '@jinggu/shared'
import type { SpriteEntry } from './types'

/** Collect keys of all sprites that are grid children */
export const getGridChildKeys = (defs: Record<string, SpriteDef>): Set<string> => {
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

export const filterEntries = (registry: SpriteRegistryV2, query: string): SpriteEntry[] => {
  const entries: SpriteEntry[] = []
  const lowerQuery = query.toLowerCase()

  const addCategory = (category: SpriteCategory, defs: Record<string, SpriteDef>) => {
    const childKeys = getGridChildKeys(defs)
    for (const [key, definition] of Object.entries(defs)) {
      if (childKeys.has(key)) continue
      if (!query || key.toLowerCase().includes(lowerQuery)) {
        entries.push({ category, key, definition })
      }
    }
  }

  addCategory('terrain', registry.tiles.terrain)
  addCategory('terrainOverlays', registry.tiles.terrainOverlays)
  addCategory('objects', registry.tiles.objects)
  addCategory('entities', registry.entities)

  return entries
}

/**
 * Hook: returns filtered sprite entries. Accepts registry and query as parameters.
 */
export const useSpriteSearch = (registry: SpriteRegistryV2, searchQuery: string): SpriteEntry[] => {
  return filterEntries(registry, searchQuery)
}
