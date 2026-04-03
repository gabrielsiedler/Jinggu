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

export interface ConflictResult {
  outOfBounds: boolean
  overlappingTiles: Array<{ x: number; y: number }>
}

const getSpriteDef = (key: string, category: SpriteCategory, registry: SpriteRegistryV2): SpriteDef | undefined => {
  if (category === 'entities') return registry.entities[key]
  return registry.tiles[category][key]
}

export class MapModel {
  readonly width: number
  readonly height: number
  readonly tiles: MapGrid

  constructor(width: number, height: number, tiles?: MapGrid) {
    this.width = width
    this.height = height
    this.tiles = tiles ?? MapModel.createEmptyGrid(width, height)
  }

  private static createEmptyGrid(width: number, height: number): MapGrid {
    const grid: MapGrid = []
    for (let row = 0; row < height; row++) {
      const rowArr: MapTile[] = []
      for (let col = 0; col < width; col++) {
        rowArr.push({ layers: [] })
      }
      grid.push(rowArr)
    }
    return grid
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
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return this

    const def = getSpriteDef(spriteKey, category, registry)
    if (!def) return this

    const resolvedId = selectVariant(def.render)

    const newTiles = structuredClone(this.tiles)
    // Terrain is single-slot: replace any existing terrain layer
    if (category === 'terrain') {
      newTiles[y][x].layers = newTiles[y][x].layers.filter((l) => l.category !== 'terrain')
    }
    const layer: TileLayer = {
      spriteKey,
      category,
      resolvedId,
    }
    newTiles[y][x].layers.push(layer)
    return new MapModel(this.width, this.height, newTiles)
  }

  /**
   * Place a grid sprite anchored at (x, y) -- top-left corner.
   * OOB tiles are silently clipped.
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
    const newTiles = structuredClone(this.tiles)

    for (const child of children) {
      const tileX = x + child.dx
      const tileY = y + child.dy
      // Silently clip OOB tiles
      if (tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) continue

      const childResolvedId = resolveChildImage(child.childKey, category, registry)
      const isAnchor = child.dx === 0 && child.dy === 0

      const layer: TileLayer = {
        spriteKey: child.childKey,
        category,
        resolvedId: childResolvedId,
        grid: { cols, rows },
        ...(isAnchor ? { parentKey: spriteKey } : { anchor: { x, y } }),
      }

      newTiles[tileY][tileX].layers.push(layer)
    }

    return new MapModel(this.width, this.height, newTiles)
  }

  /**
   * Delete all layers at a tile. If any layer is part of a grid sprite,
   * remove the entire grid sprite from all tiles it occupies.
   */
  deleteTile(x: number, y: number): MapModel {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return this

    const tile = this.tiles[y][x]
    if (tile.layers.length === 0) return this

    const newTiles = structuredClone(this.tiles)

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
          if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) continue

          // Remove grid layers from this tile that belong to this grid sprite
          newTiles[ty][tx].layers = newTiles[ty][tx].layers.filter((l) => {
            if (!l.grid) return true
            // Check if this layer belongs to the grid anchored at (anchorX, anchorY)
            if (l.parentKey && tx === anchorX && ty === anchorY) return false
            if (l.anchor && l.anchor.x === anchorX && l.anchor.y === anchorY) return false
            return true
          })
        }
      }
    }

    // Remove all non-grid layers at the clicked tile
    newTiles[y][x].layers = newTiles[y][x].layers.filter((l) => l.grid !== undefined)

    return new MapModel(this.width, this.height, newTiles)
  }

  /**
   * Delete a single layer at (x, y) by index.
   * If the layer is part of a grid sprite, the entire grid sprite is removed.
   */
  deleteLayer(x: number, y: number, layerIndex: number): MapModel {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return this

    const tile = this.tiles[y][x]
    if (layerIndex < 0 || layerIndex >= tile.layers.length) return this

    const layer = tile.layers[layerIndex]
    const newTiles = structuredClone(this.tiles)

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
        newTiles[y][x].layers.splice(layerIndex, 1)
        return new MapModel(this.width, this.height, newTiles)
      }

      const { cols, rows } = layer.grid
      for (let dy = 0; dy < rows; dy++) {
        for (let dx = 0; dx < cols; dx++) {
          const tx = anchorX + dx
          const ty = anchorY + dy
          if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) continue

          newTiles[ty][tx].layers = newTiles[ty][tx].layers.filter((l) => {
            if (!l.grid) return true
            if (l.parentKey && tx === anchorX && ty === anchorY) return false
            if (l.anchor && l.anchor.x === anchorX && l.anchor.y === anchorY) return false
            return true
          })
        }
      }
    } else {
      // Simple layer: just remove by index
      newTiles[y][x].layers.splice(layerIndex, 1)
    }

    return new MapModel(this.width, this.height, newTiles)
  }

  /**
   * Export to dual-format MapData for persistence.
   */
  toMapData(): MapData {
    const serverTiles: string[][][] = []

    for (let row = 0; row < this.height; row++) {
      const serverRow: string[][] = []
      for (let col = 0; col < this.width; col++) {
        const tile = this.tiles[row][col]
        serverRow.push(tile.layers.map((l) => l.resolvedId))
      }
      serverTiles.push(serverRow)
    }

    return {
      version: 2,
      width: this.width,
      height: this.height,
      editorTiles: this.tiles,
      serverTiles,
    }
  }

  /**
   * Reconstruct from loaded MapData.
   */
  static fromMapData(data: MapData): MapModel {
    return new MapModel(data.width, data.height, data.editorTiles)
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
        if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) {
          outOfBounds = true
          continue
        }
        if (this.tiles[ty][tx].layers.length > 0) {
          overlappingTiles.push({ x: tx, y: ty })
        }
      }
    }

    return { outOfBounds, overlappingTiles }
  }
}
