import type { SpriteCategory, SpriteRegistryV2 } from '@jinggu/shared'

/**
 * Given a parent sprite key and grid dimensions, return child keys and their (dx, dy) offsets.
 * Children are named {parentKey}-{index} where index starts at 1, left-to-right, top-to-bottom.
 */
export const getGridChildren = (
  parentKey: string,
  cols: number,
  rows: number,
): Array<{ childKey: string; dx: number; dy: number; index: number }> => {
  const children: Array<{ childKey: string; dx: number; dy: number; index: number }> = []
  let index = 1
  for (let dy = 0; dy < rows; dy++) {
    for (let dx = 0; dx < cols; dx++) {
      children.push({ childKey: `${parentKey}-${index}`, dx, dy, index })
      index++
    }
  }
  return children
}

/**
 * Resolve the image ID for a grid child sprite from the registry.
 */
export const resolveChildImage = (
  childKey: string,
  category: SpriteCategory,
  registry: SpriteRegistryV2,
): string => {
  const collection = category === 'entities' ? registry.entities : registry.tiles[category]
  const childDef = collection[childKey]
  return childDef?.render.base || ''
}
