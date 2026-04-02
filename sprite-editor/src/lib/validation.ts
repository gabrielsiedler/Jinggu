import type { SpriteRegistryV2 } from '@jinggu/shared'
import type { SpriteCategory } from '../atoms/selection'

/**
 * Check if a sprite name already exists in the given category.
 * @param excludeKey - Optional key to exclude (for rename/update scenarios)
 */
export const isDuplicateName = (
  registry: SpriteRegistryV2,
  category: SpriteCategory,
  name: string,
  excludeKey?: string,
): boolean => {
  const keys = category === 'entities' ? Object.keys(registry.entities) : Object.keys(registry.tiles[category])

  return keys.some((k) => k !== excludeKey && k === name)
}

/** Validate that the sprite name is not empty */
export const isNameValid = (name: string): boolean => {
  return name.trim().length > 0
}

/** Validate that a base image is assigned (required for saving) */
export const isBaseImageValid = (base: string): boolean => {
  return base.trim().length > 0
}
