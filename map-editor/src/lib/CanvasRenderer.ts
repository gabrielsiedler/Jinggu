import type { MapModel } from './MapModel'
import type { SpriteCache } from './SpriteCache'

const TILE_SIZE = 32
const BUFFER = 2

export interface DrawParams {
  ctx: CanvasRenderingContext2D
  canvasWidth: number
  canvasHeight: number
  dpr: number
  cameraX: number
  cameraY: number
  zoom: number
  mapModel: MapModel
  spriteCache: SpriteCache
  hoveredTile: { x: number; y: number } | null
  selectedTile: { x: number; y: number } | null
  dragRect: { minX: number; maxX: number; minY: number; maxY: number } | null
  ghostMap: Map<string, { childKey: string; resolvedId: string }> | null
  ghostOverlapSet: Set<string> | null
}

export interface DirtyRegion {
  type: 'full' | 'tiles'
  tiles?: Array<{ x: number; y: number }>
}

interface VisibleRange {
  startCol: number
  startRow: number
  endCol: number
  endRow: number
}

const computeVisibleRange = (
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number,
  zoom: number,
): VisibleRange => {
  const viewportWorldWidth = canvasWidth / zoom
  const viewportWorldHeight = canvasHeight / zoom
  return {
    startCol: Math.floor(cameraX / TILE_SIZE) - BUFFER,
    startRow: Math.floor(cameraY / TILE_SIZE) - BUFFER,
    endCol: Math.floor(cameraX / TILE_SIZE) + Math.ceil(viewportWorldWidth / TILE_SIZE) + BUFFER,
    endRow: Math.floor(cameraY / TILE_SIZE) + Math.ceil(viewportWorldHeight / TILE_SIZE) + BUFFER,
  }
}

const applyCameraTransform = (ctx: CanvasRenderingContext2D, dpr: number, zoom: number, cameraX: number, cameraY: number) => {
  const scale = dpr * zoom
  ctx.setTransform(scale, 0, 0, scale, -cameraX * scale, -cameraY * scale)
  ctx.imageSmoothingEnabled = false
}

const drawTiles = (
  ctx: CanvasRenderingContext2D,
  range: VisibleRange,
  mapModel: MapModel,
  spriteCache: SpriteCache,
) => {
  const { startCol, startRow, endCol, endRow } = range
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const tile = mapModel.getTile(col, row)
      if (!tile) continue
      for (const layer of tile.layers) {
        const img = spriteCache.get(layer.resolvedId)
        if (img) {
          ctx.drawImage(img, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        }
      }
    }
  }
}

const drawGridLines = (ctx: CanvasRenderingContext2D, range: VisibleRange, zoom: number) => {
  const { startCol, startRow, endCol, endRow } = range
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 1 / zoom

  ctx.beginPath()
  // Vertical lines
  for (let col = startCol; col <= endCol + 1; col++) {
    const x = col * TILE_SIZE
    ctx.moveTo(x, startRow * TILE_SIZE)
    ctx.lineTo(x, (endRow + 1) * TILE_SIZE)
  }
  // Horizontal lines
  for (let row = startRow; row <= endRow + 1; row++) {
    const y = row * TILE_SIZE
    ctx.moveTo(startCol * TILE_SIZE, y)
    ctx.lineTo((endCol + 1) * TILE_SIZE, y)
  }
  ctx.stroke()
}

const drawGhostOverlay = (
  ctx: CanvasRenderingContext2D,
  range: VisibleRange,
  ghostMap: Map<string, { childKey: string; resolvedId: string }>,
  ghostOverlapSet: Set<string> | null,
  spriteCache: SpriteCache,
  zoom: number,
) => {
  const prevAlpha = ctx.globalAlpha
  ctx.globalAlpha = 0.5

  for (const [key, { resolvedId }] of ghostMap) {
    if (!resolvedId) continue
    const parts = key.split(',')
    const col = Number(parts[0])
    const row = Number(parts[1])
    if (col < range.startCol || col > range.endCol || row < range.startRow || row > range.endRow) continue
    const img = spriteCache.get(resolvedId)
    if (img) {
      ctx.drawImage(img, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    }
  }

  ctx.globalAlpha = prevAlpha

  if (ghostOverlapSet) {
    ctx.strokeStyle = '#ffaa00'
    ctx.lineWidth = 2 / zoom
    for (const key of ghostOverlapSet) {
      const parts = key.split(',')
      const col = Number(parts[0])
      const row = Number(parts[1])
      if (col < range.startCol || col > range.endCol || row < range.startRow || row > range.endRow) continue
      ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    }
  }
}

const drawHoverHighlight = (ctx: CanvasRenderingContext2D, hoveredTile: { x: number; y: number }) => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.fillRect(hoveredTile.x * TILE_SIZE, hoveredTile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
}

const drawSelectionBorder = (ctx: CanvasRenderingContext2D, selectedTile: { x: number; y: number }, zoom: number) => {
  ctx.strokeStyle = '#4488ff'
  ctx.lineWidth = 2 / zoom
  ctx.strokeRect(selectedTile.x * TILE_SIZE, selectedTile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
}

const drawDragRect = (
  ctx: CanvasRenderingContext2D,
  dragRect: { minX: number; maxX: number; minY: number; maxY: number },
  zoom: number,
) => {
  const x = dragRect.minX * TILE_SIZE
  const y = dragRect.minY * TILE_SIZE
  const w = (dragRect.maxX - dragRect.minX + 1) * TILE_SIZE
  const h = (dragRect.maxY - dragRect.minY + 1) * TILE_SIZE

  ctx.fillStyle = 'rgba(80, 120, 255, 0.2)'
  ctx.fillRect(x, y, w, h)

  ctx.strokeStyle = 'rgba(80, 120, 255, 0.6)'
  ctx.lineWidth = 1 / zoom
  ctx.strokeRect(x, y, w, h)
}

const drawOriginLines = (ctx: CanvasRenderingContext2D, range: VisibleRange, zoom: number) => {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 1 / zoom

  ctx.beginPath()
  // Vertical line at x=0
  ctx.moveTo(0, range.startRow * TILE_SIZE)
  ctx.lineTo(0, (range.endRow + 1) * TILE_SIZE)
  // Horizontal line at y=0
  ctx.moveTo(range.startCol * TILE_SIZE, 0)
  ctx.lineTo((range.endCol + 1) * TILE_SIZE, 0)
  ctx.stroke()
}

const drawTilesPartial = (
  ctx: CanvasRenderingContext2D,
  tiles: Array<{ x: number; y: number }>,
  params: DrawParams,
  range: VisibleRange,
) => {
  for (const { x: col, y: row } of tiles) {
    // Clear the tile area (black background)
    ctx.fillStyle = '#000000'
    ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)

    // Redraw tile sprites
    const tile = params.mapModel.getTile(col, row)
    if (tile) {
      for (const layer of tile.layers) {
        const img = params.spriteCache.get(layer.resolvedId)
        if (img) {
          ctx.drawImage(img, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        }
      }
    }

    // Redraw grid lines around this tile
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1 / params.zoom
    ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)

    // Redraw ghost overlay if applicable
    if (params.ghostMap) {
      const key = `${col},${row}`
      const ghost = params.ghostMap.get(key)
      if (ghost && ghost.resolvedId) {
        const prevAlpha = ctx.globalAlpha
        ctx.globalAlpha = 0.5
        const img = params.spriteCache.get(ghost.resolvedId)
        if (img) {
          ctx.drawImage(img, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        }
        ctx.globalAlpha = prevAlpha
      }
      if (params.ghostOverlapSet?.has(key)) {
        ctx.strokeStyle = '#ffaa00'
        ctx.lineWidth = 2 / params.zoom
        ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      }
    }

    // Redraw hover highlight if this tile is hovered
    if (params.hoveredTile && params.hoveredTile.x === col && params.hoveredTile.y === row) {
      drawHoverHighlight(ctx, params.hoveredTile)
    }

    // Redraw selection border if this tile is selected
    if (params.selectedTile && params.selectedTile.x === col && params.selectedTile.y === row) {
      drawSelectionBorder(ctx, params.selectedTile, params.zoom)
    }

    // Redraw origin lines if they pass through this tile
    if (col === 0 || row === 0) {
      drawOriginLines(ctx, range, params.zoom)
    }
  }
}

export function drawFrame(params: DrawParams, dirty?: DirtyRegion): void {
  const { ctx, canvasWidth, canvasHeight, dpr, cameraX, cameraY, zoom, mapModel, spriteCache } = params

  const range = computeVisibleRange(cameraX, cameraY, canvasWidth, canvasHeight, zoom)

  if (dirty && dirty.type === 'tiles' && dirty.tiles && dirty.tiles.length > 0) {
    // Partial redraw: clip to affected tile regions
    ctx.save()
    applyCameraTransform(ctx, dpr, zoom, cameraX, cameraY)

    // Build clip path around dirty tiles
    ctx.beginPath()
    for (const { x: col, y: row } of dirty.tiles) {
      ctx.rect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    }
    ctx.clip()

    drawTilesPartial(ctx, dirty.tiles, params, range)

    ctx.restore()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalAlpha = 1
    return
  }

  // Full redraw
  // 1. Clear canvas to black
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvasWidth * dpr, canvasHeight * dpr)
  ctx.restore()

  // 3. Apply camera transform
  applyCameraTransform(ctx, dpr, zoom, cameraX, cameraY)

  // 4. Draw tiles
  drawTiles(ctx, range, mapModel, spriteCache)

  // 5. Draw grid lines
  drawGridLines(ctx, range, zoom)

  // 6. Draw ghost overlay
  if (params.ghostMap) {
    drawGhostOverlay(ctx, range, params.ghostMap, params.ghostOverlapSet, spriteCache, zoom)
  }

  // 7. Draw hover highlight
  if (params.hoveredTile) {
    drawHoverHighlight(ctx, params.hoveredTile)
  }

  // 8. Draw selection border
  if (params.selectedTile) {
    drawSelectionBorder(ctx, params.selectedTile, zoom)
  }

  // 9. Draw drag-fill rectangle
  if (params.dragRect) {
    drawDragRect(ctx, params.dragRect, zoom)
  }

  // 10. Draw origin lines
  drawOriginLines(ctx, range, zoom)

  // 11. Reset transform
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  // 12. Reset globalAlpha
  ctx.globalAlpha = 1
}
