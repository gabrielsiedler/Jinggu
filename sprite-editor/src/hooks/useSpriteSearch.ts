import { useState, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import type { SpriteRegistryV2 } from '@jinggu/shared'
import type { SpriteCategory, SpriteDef } from '../atoms/selection'
import { registryAtom } from '../atoms/registry'
import { searchQueryAtom } from '../atoms/ui'

export interface SpriteEntry {
  category: SpriteCategory
  key: string
  definition: SpriteDef
}

/**
 * Returns all sprite entries from the registry, filtered by a 150ms-debounced search query.
 * Case-insensitive substring match on key name.
 */
export const useSpriteSearch = (): SpriteEntry[] => {
  const registry = useAtomValue(registryAtom)
  const searchQuery = useAtomValue(searchQueryAtom)
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 150)
    return () => clearTimeout(timer)
  }, [searchQuery])

  return filterEntries(registry, debouncedQuery)
}

/** Collect keys of all sprites that have a grid defined */
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

const filterEntries = (registry: SpriteRegistryV2, query: string): SpriteEntry[] => {
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
