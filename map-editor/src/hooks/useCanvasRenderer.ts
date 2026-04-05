import { useEffect, useRef, type RefObject } from 'react'
import { SpriteCache } from '../lib/SpriteCache'
import { drawFrame, type DrawParams, type DirtyRegion } from '../lib/CanvasRenderer'
import type { MapModel } from '../lib/MapModel'

export interface UseCanvasRendererParams {
  canvasRef: RefObject<HTMLCanvasElement | null>
  cameraX: number
  cameraY: number
  zoomPercent: number
  mapModel: MapModel
  hoveredTile: { x: number; y: number } | null
  selectedTile: { x: number; y: number } | null
  dragRect: { minX: number; maxX: number; minY: number; maxY: number } | null
  ghostMap: Map<string, { childKey: string; resolvedId: string }> | null
  ghostOverlapSet: Set<string> | null
  containerSize: { width: number; height: number }
}

export function useCanvasRenderer(params: UseCanvasRendererParams): SpriteCache {
  const {
    canvasRef,
    cameraX,
    cameraY,
    zoomPercent,
    mapModel,
    hoveredTile,
    selectedTile,
    dragRect,
    ghostMap,
    ghostOverlapSet,
    containerSize,
  } = params

  // 1. SpriteCache -- created once, stable across renders
  const dirtyRef = useRef<DirtyRegion | null>({ type: 'full' })
  const spriteCacheRef = useRef<SpriteCache | null>(null)
  if (!spriteCacheRef.current) {
    spriteCacheRef.current = new SpriteCache(() => {
      dirtyRef.current = { type: 'full' }
    })
  }
  const spriteCache = spriteCacheRef.current

  // 2. Params ref -- updated every render (cheap pointer swap)
  const paramsRef = useRef<DrawParams | null>(null)
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

  paramsRef.current = {
    ctx: canvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
    canvasWidth: containerSize.width,
    canvasHeight: containerSize.height,
    dpr,
    cameraX,
    cameraY,
    zoom: zoomPercent / 100,
    mapModel,
    spriteCache,
    hoveredTile,
    selectedTile,
    dragRect,
    ghostMap,
    ghostOverlapSet,
  }

  // 3. Dirty flag management
  // Track previous hover/selection for partial redraws
  const prevHoveredRef = useRef<{ x: number; y: number } | null>(null)
  const prevSelectedRef = useRef<{ x: number; y: number } | null>(null)

  // Full redraw triggers
  useEffect(() => {
    dirtyRef.current = { type: 'full' }
  }, [cameraX, cameraY, zoomPercent, mapModel, containerSize.width, containerSize.height, dragRect, ghostMap, ghostOverlapSet])

  // Partial redraw triggers (hover)
  useEffect(() => {
    const tiles: Array<{ x: number; y: number }> = []
    if (prevHoveredRef.current) tiles.push(prevHoveredRef.current)
    if (hoveredTile) tiles.push(hoveredTile)
    if (tiles.length > 0) {
      // Only set partial if not already full
      if (!dirtyRef.current || dirtyRef.current.type !== 'full') {
        dirtyRef.current = { type: 'tiles', tiles }
      }
    }
    prevHoveredRef.current = hoveredTile
  }, [hoveredTile])

  // Partial redraw triggers (selection)
  useEffect(() => {
    const tiles: Array<{ x: number; y: number }> = []
    if (prevSelectedRef.current) tiles.push(prevSelectedRef.current)
    if (selectedTile) tiles.push(selectedTile)
    if (tiles.length > 0) {
      if (!dirtyRef.current || dirtyRef.current.type !== 'full') {
        dirtyRef.current = { type: 'tiles', tiles }
      }
    }
    prevSelectedRef.current = selectedTile
  }, [selectedTile])

  // 4. Canvas sizing with DPR awareness
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const currentDpr = window.devicePixelRatio || 1
    canvas.width = containerSize.width * currentDpr
    canvas.height = containerSize.height * currentDpr
    canvas.style.width = `${containerSize.width}px`
    canvas.style.height = `${containerSize.height}px`
    dirtyRef.current = { type: 'full' }
  }, [containerSize.width, containerSize.height, canvasRef])

  // 5. RAF loop -- runs for the lifetime of the component
  useEffect(() => {
    let rafId: number

    const loop = () => {
      const dirty = dirtyRef.current
      if (dirty && paramsRef.current?.ctx) {
        dirtyRef.current = null
        drawFrame(paramsRef.current, dirty)
      }
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // 6. Return SpriteCache instance
  return spriteCache
}
