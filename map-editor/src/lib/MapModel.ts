import type { SpriteCategory, SpriteDef, SpriteRegistryV2 } from '@jinggu/shared'
import { selectVariant } from './variantSelector'
import { getGridChildren, resolveChildImage } from './gridUtils'

export interface TileLayer {
  /** The logical sprite key (e.g. "grass", "bigrock") */
  spriteKey: string
  /** The category in the registry */
  category: SpriteCategory
  /** The resolved image ID to render (e.g. "terrain_grass_var5", "1441") */
  resolvedId: string
  /** For grid children: reference to anchor tile */
  anchor?: { x: number; y: number }
  /** For anchor tiles of grid sprites: the parent key */
  parentKey?: string
  /** Grid dimensions if this is part of a grid sprite */
  grid?: { cols: number; rows: number }
}

export interface MapTile {
  layers: TileLayer[]
}

/** [row][col], height rows x width cols */
export type MapGrid = MapTile[][]

export interface MapData {
  version: 2
  width: number
  height: number
  /** Editor-format tiles with full metadata */
  editorTiles: MapGrid
  /** Server-format tiles: flat array of resolved sprite IDs per tile */
  serverTiles: string[][][]
}

export type TileKey = `${number},${number}`

export interface ConflictResult {
  outOfBounds: boolean
  overlappingTiles: Array<{ x: number; y: number }>
}

const getSpriteDef = (key: string, category: SpriteCategory, registry: SpriteRegistryV2): SpriteDef | undefined => {
  if (category === 'entities') return registry.entities[key]
  return registry.tiles[category][key]
}

export class MapModel {
  readonly tiles: ReadonlyMap<TileKey, MapTile>

  constructor(tiles?: Map<TileKey, MapTile>) {
    this.tiles = tiles ?? new Map()
  }

  static key(x: number, y: number): TileKey {
    return `${x},${y}`
  }

  getTile(x: number, y: number): MapTile | undefined {
    return this.tiles.get(MapModel.key(x, y))
  }

  hasTile(x: number, y: number): boolean {
    return this.tiles.has(MapModel.key(x, y))
  }

  /**
   * Place a single-tile sprite with optional variant resolution.
   */
  placeSingle(
    x: number,
    y: number,
    spriteKey: string,
    category: SpriteCategory,
    registry: SpriteRegistryV2,
  ): MapModel {
    if (x < 0 || y < 0) return this

    const def = getSpriteDef(spriteKey, category, registry)
    if (!def) return this

    const resolvedId = selectVariant(def.render)

    const newTiles = new Map(this.tiles)
    const key = MapModel.key(x, y)
    const existing = newTiles.get(key)
    const tile: MapTile = { layers: [...(existing?.layers ?? [])] }

    // Terrain is single-slot: replace any existing terrain layer
    if (category === 'terrain') {
      tile.layers = tile.layers.filter((l) => l.category !== 'terrain')
    }
    const layer: TileLayer = {
      spriteKey,
      category,
      resolvedId,
    }
    tile.layers.push(layer)
    newTiles.set(key, tile)
    return new MapModel(newTiles)
  }

  /**
   * Place a grid sprite anchored at (x, y) -- top-left corner.
   * OOB tiles (negative coords) are silently clipped.
   */
  placeGrid(
    x: number,
    y: number,
    spriteKey: string,
    category: SpriteCategory,
    registry: SpriteRegistryV2,
  ): MapModel {
    const def = getSpriteDef(spriteKey, category, registry)
    if (!def) return this

    const grid = def.render.grid
    if (!grid) {
      // Not a grid sprite, fall back to single placement
      return this.placeSingle(x, y, spriteKey, category, registry)
    }

    const { cols, rows } = grid
    const children = getGridChildren(spriteKey, cols, rows)
    const newTiles = new Map(this.tiles)

    for (const child of children) {
      const tileX = x + child.dx
      const tileY = y + child.dy
      // Silently clip tiles with negative coords
      if (tileX < 0 || tileY < 0) continue

      const childResolvedId = resolveChildImage(child.childKey, category, registry)
      const isAnchor = child.dx === 0 && child.dy === 0

      const layer: TileLayer = {
        spriteKey: child.childKey,
        category,
        resolvedId: childResolvedId,
        grid: { cols, rows },
        ...(isAnchor ? { parentKey: spriteKey } : { anchor: { x, y } }),
      }

      const key = MapModel.key(tileX, tileY)
      const existing = newTiles.get(key)
      const tile: MapTile = { layers: [...(existing?.layers ?? [])] }
      tile.layers.push(layer)
      newTiles.set(key, tile)
    }

    return new MapModel(newTiles)
  }

  /**
   * Delete all layers at a tile. If any layer is part of a grid sprite,
   * remove the entire grid sprite from all tiles it occupies.
   */
  deleteTile(x: number, y: number): MapModel {
    if (x < 0 || y < 0) return this

    const tile = this.tiles.get(MapModel.key(x, y))
    if (!tile || tile.layers.length === 0) return this

    const newTiles = new Map(this.tiles)

    // Collect all grid sprite anchors that need full removal
    const gridAnchorsToRemove: Array<{ anchorX: number; anchorY: number; cols: number; rows: number }> = []

    for (const layer of tile.layers) {
      if (layer.grid) {
        // This layer is part of a grid sprite
        let anchorX: number
        let anchorY: number
        if (layer.parentKey) {
          // This is the anchor tile
          anchorX = x
          anchorY = y
        } else if (layer.anchor) {
          // This is a non-anchor tile, follow back-reference
          anchorX = layer.anchor.x
          anchorY = layer.anchor.y
        } else {
          continue
        }
        gridAnchorsToRemove.push({
          anchorX,
          anchorY,
          cols: layer.grid.cols,
          rows: layer.grid.rows,
        })
      }
    }

    // Remove entire grid sprites
    for (const { anchorX, anchorY, cols, rows } of gridAnchorsToRemove) {
      for (let dy = 0; dy < rows; dy++) {
        for (let dx = 0; dx < cols; dx++) {
          const tx = anchorX + dx
          const ty = anchorY + dy
          if (tx < 0 || ty < 0) continue

          const tKey = MapModel.key(tx, ty)
          const tTile = newTiles.get(tKey)
          if (!tTile) continue

          const filteredLayers = tTile.layers.filter((l) => {
            if (!l.grid) return true
            // Check if this layer belongs to the grid anchored at (anchorX, anchorY)
            if (l.parentKey && tx === anchorX && ty === anchorY) return false
            if (l.anchor && l.anchor.x === anchorX && l.anchor.y === anchorY) return false
            return true
          })

          if (filteredLayers.length === 0) {
            newTiles.delete(tKey)
          } else {
            newTiles.set(tKey, { layers: filteredLayers })
          }
        }
      }
    }

    // Remove all non-grid layers at the clicked tile
    const key = MapModel.key(x, y)
    const currentTile = newTiles.get(key)
    if (currentTile) {
      const remainingLayers = currentTile.layers.filter((l) => l.grid !== undefined)
      if (remainingLayers.length === 0) {
        newTiles.delete(key)
      } else {
        newTiles.set(key, { layers: remainingLayers })
      }
    }

    return new MapModel(newTiles)
  }

  /**
   * Delete a single layer at (x, y) by index.
   * If the layer is part of a grid sprite, the entire grid sprite is removed.
   */
  deleteLayer(x: number, y: number, layerIndex: number): MapModel {
    if (x < 0 || y < 0) return this

    const tile = this.tiles.get(MapModel.key(x, y))
    if (!tile) return this
    if (layerIndex < 0 || layerIndex >= tile.layers.length) return this

    const layer = tile.layers[layerIndex]
    const newTiles = new Map(this.tiles)

    if (layer.grid) {
      // Grid sprite: find anchor and remove all tiles belonging to this grid
      let anchorX: number
      let anchorY: number
      if (layer.parentKey) {
        anchorX = x
        anchorY = y
      } else if (layer.anchor) {
        anchorX = layer.anchor.x
        anchorY = layer.anchor.y
      } else {
        // Fallback: just remove the single layer
        const key = MapModel.key(x, y)
        const newLayers = [...tile.layers]
        newLayers.splice(layerIndex, 1)
        if (newLayers.length === 0) {
          newTiles.delete(key)
        } else {
          newTiles.set(key, { layers: newLayers })
        }
        return new MapModel(newTiles)
      }

      const { cols, rows } = layer.grid
      for (let dy = 0; dy < rows; dy++) {
        for (let dx = 0; dx < cols; dx++) {
          const tx = anchorX + dx
          const ty = anchorY + dy
          if (tx < 0 || ty < 0) continue

          const tKey = MapModel.key(tx, ty)
          const tTile = newTiles.get(tKey)
          if (!tTile) continue

          const filteredLayers = tTile.layers.filter((l) => {
            if (!l.grid) return true
            if (l.parentKey && tx === anchorX && ty === anchorY) return false
            if (l.anchor && l.anchor.x === anchorX && l.anchor.y === anchorY) return false
            return true
          })

          if (filteredLayers.length === 0) {
            newTiles.delete(tKey)
          } else {
            newTiles.set(tKey, { layers: filteredLayers })
          }
        }
      }
    } else {
      // Simple layer: just remove by index
      const key = MapModel.key(x, y)
      const newLayers = [...tile.layers]
      newLayers.splice(layerIndex, 1)
      if (newLayers.length === 0) {
        newTiles.delete(key)
      } else {
        newTiles.set(key, { layers: newLayers })
      }
    }

    return new MapModel(newTiles)
  }

  /**
   * Compute the bounding rectangle of all occupied tiles.
   * Returns null if no tiles exist.
   */
  getBounds(): { minX: number; minY: number; maxX: number; maxY: number } | null {
    if (this.tiles.size === 0) return null

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity

    for (const key of this.tiles.keys()) {
      const [x, y] = key.split(',').map(Number)
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }

    return { minX, minY, maxX, maxY }
  }

  /**
   * Export to dual-format MapData for persistence.
   * Computes bounding rectangle and normalizes all coordinates so top-left becomes (0,0).
   */
  toMapData(): MapData {
    const bounds = this.getBounds()
    if (!bounds) {
      throw new Error('Cannot save an empty map. Place at least one tile before saving.')
    }

    const { minX, minY, maxX, maxY } = bounds
    const width = maxX - minX + 1
    const height = maxY - minY + 1

    const shouldTime = this.tiles.size > 1000
    if (shouldTime) console.time('[MapModel] toMapData normalization')

    console.log(`[MapModel] Normalization offset: dx=${minX}, dy=${minY}`)

    const editorTiles: MapGrid = []
    const serverTiles: string[][][] = []

    for (let row = 0; row < height; row++) {
      const editorRow: MapTile[] = []
      const serverRow: string[][] = []

      for (let col = 0; col < width; col++) {
        const worldX = col + minX
        const worldY = row + minY
        const tile = this.tiles.get(MapModel.key(worldX, worldY))

        if (tile) {
          // Clone tile and normalize anchor references
          const normalizedLayers = tile.layers.map((layer) => {
            if (layer.anchor) {
              return {
                ...layer,
                anchor: {
                  x: layer.anchor.x - minX,
                  y: layer.anchor.y - minY,
                },
              }
            }
            return { ...layer }
          })
          editorRow.push({ layers: normalizedLayers })
          serverRow.push(normalizedLayers.map((l) => l.resolvedId))
        } else {
          editorRow.push({ layers: [] })
          serverRow.push([])
        }
      }

      editorTiles.push(editorRow)
      serverTiles.push(serverRow)
    }

    if (shouldTime) console.timeEnd('[MapModel] toMapData normalization')
    console.log(`[MapModel] Saved: bounds (${minX},${minY})->(${maxX},${maxY}), normalized to ${width}x${height}`)

    return {
      version: 2,
      width,
      height,
      editorTiles,
      serverTiles,
    }
  }

  /**
   * Reconstruct from loaded MapData into sparse model.
   * Only stores tiles with layers.length > 0.
   */
  static fromMapData(data: MapData): MapModel {
    const tiles = new Map<TileKey, MapTile>()

    for (let row = 0; row < data.height; row++) {
      for (let col = 0; col < data.width; col++) {
        const tile = data.editorTiles[row][col]
        if (tile && tile.layers.length > 0) {
          tiles.set(MapModel.key(col, row), tile)
        }
      }
    }

    console.log(`[MapModel] Loaded map: ${data.width}x${data.height}, ${tiles.size} occupied tiles`)
    return new MapModel(tiles)
  }

  /**
   * Check if placing a grid sprite at (x, y) would overlap existing sprites or go OOB.
   */
  checkGridConflicts(x: number, y: number, cols: number, rows: number): ConflictResult {
    let outOfBounds = false
    const overlappingTiles: Array<{ x: number; y: number }> = []

    for (let dy = 0; dy < rows; dy++) {
      for (let dx = 0; dx < cols; dx++) {
        const tx = x + dx
        const ty = y + dy
        if (tx < 0 || ty < 0) {
          outOfBounds = true
          continue
        }
        const tile = this.tiles.get(MapModel.key(tx, ty))
        if (tile && tile.layers.length > 0) {
          overlappingTiles.push({ x: tx, y: ty })
        }
      }
    }

    return { outOfBounds, overlappingTiles }
  }
}
