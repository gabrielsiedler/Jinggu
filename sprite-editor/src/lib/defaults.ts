import type { TerrainDefinition, TerrainOverlayDefinition, ObjectDefinition, EntityDefinition } from '@jinggu/shared'
import type { SpriteCategory } from '../atoms/selection'

export const defaultTerrain: TerrainDefinition = {
  render: { layer: 'base', orderMode: 'fixed', zOffset: 0, base: '' },
  collision: { walkable: true },
}

export const defaultTerrainOverlay: TerrainOverlayDefinition = {
  render: { layer: 'terrainOverlay', orderMode: 'fixed', zOffset: 1, base: '' },
}

export const defaultObject: ObjectDefinition = {
  render: { layer: 'object', orderMode: 'mapOrder', base: '' },
}

export const defaultEntity: EntityDefinition = {
  render: { layer: 'entity', orderMode: 'dynamic', base: '' },
}

export const defaultForCategory = (
  category: SpriteCategory,
): TerrainDefinition | TerrainOverlayDefinition | ObjectDefinition | EntityDefinition => {
  switch (category) {
    case 'terrain':
      return structuredClone(defaultTerrain)
    case 'terrainOverlays':
      return structuredClone(defaultTerrainOverlay)
    case 'objects':
      return structuredClone(defaultObject)
    case 'entities':
      return structuredClone(defaultEntity)
  }
}
