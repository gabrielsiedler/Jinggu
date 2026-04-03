export interface Sprite {
  id: string | number
  walkable?: boolean
}

export interface Sprites {
  [key: Sprite['id']]: Sprite
}

export interface SpriteRender {
  layer: 'base' | 'terrainOverlay' | 'object' | 'entity'
  orderMode: 'fixed' | 'mapOrder' | 'dynamic'
  zOffset?: number
  base: string
  variants?: string[]
  animations?: {
    idle: DirectionalFrames
    walk: DirectionalFrames
  }
  grid?: { cols: number; rows: number }
}

export interface DirectionalFrames {
  up: string[]
  down: string[]
  left: string[]
  right: string[]
}

export interface TerrainDefinition {
  render: SpriteRender
  collision: {
    walkable: boolean
  }
}

export interface TerrainOverlayDefinition {
  render: SpriteRender
  collision?: {
    walkable: boolean
  }
}

export interface ObjectDefinition {
  render: SpriteRender
  collision?: {
    walkableOverride: boolean
  }
}

export interface EntityDefinition {
  render: SpriteRender
}

export interface SpriteRegistryV2 {
  version: 2
  tiles: {
    terrain: Record<string, TerrainDefinition>
    terrainOverlays: Record<string, TerrainOverlayDefinition>
    objects: Record<string, ObjectDefinition>
  }
  entities: Record<string, EntityDefinition>
}

/**
 * Build a flat sprite lookup from the v2 registry.
 * Maps each individual sprite ID (e.g. "terrain_grass_var1") to { id, walkable }.
 */
export type SpriteCategory = 'terrain' | 'terrainOverlays' | 'objects' | 'entities'

export type SpriteDef = TerrainDefinition | TerrainOverlayDefinition | ObjectDefinition | EntityDefinition

export const buildSpriteLookup = (registry: SpriteRegistryV2): Sprites => {
  const lookup: Sprites = {}

  // Terrain sprites
  for (const def of Object.values(registry.tiles.terrain)) {
    const walkable = def.collision.walkable
    lookup[def.render.base] = { id: def.render.base, walkable }
    if (def.render.variants) {
      for (const v of def.render.variants) {
        lookup[v] = { id: v, walkable }
      }
    }
  }

  // Terrain overlays (walkable by default unless collision specified)
  for (const def of Object.values(registry.tiles.terrainOverlays)) {
    const walkable = def.collision?.walkable ?? true
    lookup[def.render.base] = { id: def.render.base, walkable }
    if (def.render.variants) {
      for (const v of def.render.variants) {
        lookup[v] = { id: v, walkable }
      }
    }
  }

  // Objects (walkable by default unless walkableOverride is false)
  for (const def of Object.values(registry.tiles.objects)) {
    const walkable = def.collision?.walkableOverride ?? true
    lookup[def.render.base] = { id: def.render.base, walkable }
    if (def.render.variants) {
      for (const v of def.render.variants) {
        lookup[v] = { id: v, walkable }
      }
    }
  }

  // Entity sprites (creatures) - collect all frame sprite IDs
  for (const def of Object.values(registry.entities)) {
    lookup[def.render.base] = { id: def.render.base }
    if (def.render.animations) {
      for (const animType of Object.values(def.render.animations)) {
        for (const frames of Object.values(animType)) {
          for (const frame of frames as string[]) {
            lookup[frame] = { id: frame }
          }
        }
      }
    }
  }

  return lookup
}
