import { atom } from 'jotai'
import type { SpriteCategory, SpriteDef } from '@jinggu/shared'
import { registryAtom } from './registry'

export type { SpriteCategory, SpriteDef }

export const selectedCategoryAtom = atom<SpriteCategory | null>(null)
export const selectedSpriteKeyAtom = atom<string | null>(null)

export const selectedSpriteDefAtom = atom<SpriteDef | null>((get) => {
  const registry = get(registryAtom)
  const category = get(selectedCategoryAtom)
  const key = get(selectedSpriteKeyAtom)
  if (!category || !key) return null

  if (category === 'entities') {
    return registry.entities[key] ?? null
  }
  return registry.tiles[category][key] ?? null
})
