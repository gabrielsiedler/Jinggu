import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { SpritePicker } from '@jinggu/sprite-picker'
import type { SpriteCategory } from '@jinggu/shared'

import { registryAtom } from '../atoms/registry'
import { mapModelAtom, mapDirtyAtom, saveStatusAtom } from '../atoms/map'
import { selectedSpriteKeyAtom, selectedCategoryAtom } from '../atoms/picker'
import { loadSprites, loadMap, saveMap } from '../api/mapApi'
import { MapModel } from '../lib/MapModel'
import type { MapTile as MapTileType } from '../lib/MapModel'
import { MapTile } from './tile/Tile'
import { StatusBar } from './statusBar/StatusBar'
import * as s from './app.s'

const TILE_SIZE = 32
const BUFFER = 2

const App = () => {
  const [registry, setRegistry] = useAtom(registryAtom)
  const [mapModel, setMapModel] = useAtom(mapModelAtom)
  const [mapDirty, setMapDirty] = useAtom(mapDirtyAtom)
  const [saveStatus, setSaveStatus] = useAtom(saveStatusAtom)
  const [selectedKey, setSelectedKey] = useAtom(selectedSpriteKeyAtom)
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Ghost overlay state — ref for immediate reads, state throttled for StatusBar
  const hoveredTileRef = useRef<{ x: number; y: number } | null>(null)
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null)
  const hoveredRafRef = useRef<number | null>(null)

  // Selected tile for deletion / inspection
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null)

  // Selected layer index within the selected tile (for per-layer deletion)
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null)

  // Drag state for terrain fill
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null)

  // Camera state
  const [cameraX, setCameraX] = useState(0)
  const [cameraY, setCameraY] = useState(0)
  const [isPanning, setIsPanning] = useState(false)
  const panAnchorRef = useRef<{ mouseX: number; mouseY: number; camX: number; camY: number } | null>(null)

  // Zoom state
  const [zoomPercent, setZoomPercent] = useState(100)

  // Refs for use in native event listeners (avoid stale closures)
  const zoomPercentRef = useRef(zoomPercent)
  const cameraXRef = useRef(cameraX)
  const cameraYRef = useRef(cameraY)

  useEffect(() => {
    zoomPercentRef.current = zoomPercent
  }, [zoomPercent])
  useEffect(() => {
    cameraXRef.current = cameraX
  }, [cameraX])
  useEffect(() => {
    cameraYRef.current = cameraY
  }, [cameraY])

  const canvasRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  // Measure container size with ResizeObserver
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setContainerSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [loading])

  // Native wheel handler for cursor-centered zoom
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      const delta = e.deltaY > 0 ? -25 : 25
      const currentZoom = zoomPercentRef.current
      const newZoom = Math.max(50, Math.min(400, currentZoom + delta))
      if (newZoom === currentZoom) return

      const rect = el.getBoundingClientRect()
      const cursorScreenX = e.clientX - rect.left
      const cursorScreenY = e.clientY - rect.top

      const oldZoomF = currentZoom / 100
      const newZoomF = newZoom / 100

      // World point under cursor before zoom
      const worldX = cursorScreenX / oldZoomF + cameraXRef.current
      const worldY = cursorScreenY / oldZoomF + cameraYRef.current

      // Adjust camera so the same world point stays under cursor
      setCameraX(worldX - cursorScreenX / newZoomF)
      setCameraY(worldY - cursorScreenY / newZoomF)
      setZoomPercent(newZoom)
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [loading]) // re-attach after loading completes and canvasRef is available

  const handleResetZoom = useCallback(() => {
    setZoomPercent(100)
  }, [])

  const initialize = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const sprites = await loadSprites()
      setRegistry(sprites)
      console.log(
        `[registry] terrain: ${Object.keys(sprites.tiles.terrain).length}, overlays: ${Object.keys(sprites.tiles.terrainOverlays).length}, objects: ${Object.keys(sprites.tiles.objects).length}, entities: ${Object.keys(sprites.entities).length}`,
      )

      const mapData = await loadMap()
      if (mapData) {
        setMapModel(MapModel.fromMapData(mapData))
        console.log('[App] Map loaded from API')
      } else {
        setMapModel(new MapModel())
        console.log('[App] Initialized empty map')
      }
    } catch (err) {
      console.error('[App] Init failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize')
    } finally {
      setLoading(false)
    }
  }, [setRegistry, setMapModel])

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleSelect = useCallback(
    (category: SpriteCategory, key: string) => {
      setSelectedCategory(category)
      setSelectedKey(key)
      setSelectedTile(null)
      setSelectedLayerIndex(null)
    },
    [setSelectedCategory, setSelectedKey],
  )

  const handlePointerMode = useCallback(() => {
    setSelectedKey(null)
    setSelectedCategory(null)
    setSelectedTile(null)
    setSelectedLayerIndex(null)
  }, [setSelectedKey, setSelectedCategory])

  // Determine if selected sprite is a grid sprite
  const getSelectedSpriteDef = useCallback(() => {
    if (!selectedKey || !selectedCategory) return null
    if (selectedCategory === 'entities') return registry.entities[selectedKey] ?? null
    return registry.tiles[selectedCategory][selectedKey] ?? null
  }, [selectedKey, selectedCategory, registry])

  const isGridSprite = useCallback(() => {
    const def = getSelectedSpriteDef()
    return !!def?.render.grid
  }, [getSelectedSpriteDef])

  const handleTileClick = useCallback(
    (x: number, y: number) => {
      if (isPanning) return
      if (x < 0 || y < 0) return

      if (!selectedKey || !selectedCategory) {
        // Pointer mode: select tile for inspection / deletion
        setSelectedTile((prev) => {
          if (prev?.x === x && prev?.y === y) return null
          return { x, y }
        })
        setSelectedLayerIndex(null)
        return
      }

      const def = getSelectedSpriteDef()
      if (!def) return

      let newModel: MapModel
      if (def.render.grid) {
        newModel = mapModel.placeGrid(x, y, selectedKey, selectedCategory, registry)
      } else {
        newModel = mapModel.placeSingle(x, y, selectedKey, selectedCategory, registry)
      }
      setMapModel(newModel)
      setMapDirty(true)
    },
    [isPanning, selectedKey, selectedCategory, registry, mapModel, setMapModel, setMapDirty, getSelectedSpriteDef],
  )

  const handleMouseUp = useCallback(() => {
    if (!dragStart || !dragEnd || !selectedKey || !selectedCategory) {
      setDragStart(null)
      setDragEnd(null)
      return
    }

    // If drag covers more than one tile, do fill
    if (dragStart.x !== dragEnd.x || dragStart.y !== dragEnd.y) {
      const minX = Math.min(dragStart.x, dragEnd.x)
      const maxX = Math.max(dragStart.x, dragEnd.x)
      const minY = Math.min(dragStart.y, dragEnd.y)
      const maxY = Math.max(dragStart.y, dragEnd.y)

      let model = mapModel
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          model = model.placeSingle(x, y, selectedKey, selectedCategory, registry)
        }
      }
      setMapModel(model)
      setMapDirty(true)
    }

    setDragStart(null)
    setDragEnd(null)
  }, [dragStart, dragEnd, selectedKey, selectedCategory, registry, mapModel, setMapModel, setMapDirty])

  const handleSave = useCallback(async () => {
    setSaveStatus('saving')
    try {
      const data = mapModel.toMapData()
      await saveMap(data)
      // Rebase editor to normalized coordinates
      setMapModel(MapModel.fromMapData(data))
      setCameraX(0)
      setCameraY(0)
      setSaveStatus('success')
      setMapDirty(false)
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (err) {
      setSaveStatus('error')
      console.error('[App] Save failed:', err instanceof Error ? err.message : err)
    }
  }, [mapModel, setSaveStatus, setMapDirty, setMapModel])

  const handleDeleteSelectedLayer = useCallback(() => {
    if (!selectedTile) return

    if (selectedLayerIndex !== null) {
      // Delete specific layer
      const newModel = mapModel.deleteLayer(selectedTile.x, selectedTile.y, selectedLayerIndex)
      setMapModel(newModel)
      setMapDirty(true)
      // After deletion, check if tile still has layers
      const updatedTile = newModel.getTile(selectedTile.x, selectedTile.y)
      const remainingLayers = updatedTile?.layers.length ?? 0
      if (remainingLayers === 0) {
        setSelectedTile(null)
        setSelectedLayerIndex(null)
      } else {
        // Adjust index if it was the last layer
        setSelectedLayerIndex((prev) => (prev !== null && prev >= remainingLayers ? remainingLayers - 1 : prev))
      }
    } else {
      // No layer selected -- delete all layers (legacy behavior)
      const newModel = mapModel.deleteTile(selectedTile.x, selectedTile.y)
      setMapModel(newModel)
      setMapDirty(true)
      setSelectedTile(null)
    }
  }, [selectedTile, selectedLayerIndex, mapModel, setMapModel, setMapDirty])

  // Coordinate transform helpers
  const screenToWorld = useCallback(
    (screenX: number, screenY: number, rect: DOMRect) => {
      const zoom = zoomPercent / 100
      return {
        worldX: (screenX - rect.left) / zoom + cameraX,
        worldY: (screenY - rect.top) / zoom + cameraY,
      }
    },
    [zoomPercent, cameraX, cameraY],
  )

  const worldToTile = (worldX: number, worldY: number) => ({
    tileX: Math.floor(worldX / TILE_SIZE),
    tileY: Math.floor(worldY / TILE_SIZE),
  })

  // Keyboard handler for deletion and panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedTile) {
        e.preventDefault()
        handleDeleteSelectedLayer()
        return
      }

      const step = e.shiftKey ? TILE_SIZE * 10 : TILE_SIZE
      switch (e.key) {
        case 'ArrowUp':
          setCameraY((v) => v - step)
          e.preventDefault()
          break
        case 'ArrowDown':
          setCameraY((v) => v + step)
          e.preventDefault()
          break
        case 'ArrowLeft':
          setCameraX((v) => v - step)
          e.preventDefault()
          break
        case 'ArrowRight':
          setCameraX((v) => v + step)
          e.preventDefault()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedTile, handleDeleteSelectedLayer])

  // Canvas panning handlers
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1) {
        // Middle click: start panning
        setIsPanning(true)
        panAnchorRef.current = { mouseX: e.clientX, mouseY: e.clientY, camX: cameraX, camY: cameraY }
        e.preventDefault()
        return
      }

      if (e.button === 0 && !isPanning) {
        // Left click: compute tile coordinates for click or drag-fill start
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return
        const { worldX, worldY } = screenToWorld(e.clientX, e.clientY, rect)
        const { tileX, tileY } = worldToTile(worldX, worldY)

        // Handle drag-fill start for non-grid sprites
        if (selectedKey && selectedCategory && !isGridSprite()) {
          if (tileX < 0 || tileY < 0) return
          setDragStart({ x: tileX, y: tileY })
          setDragEnd({ x: tileX, y: tileY })
        }
      }
    },
    [cameraX, cameraY, isPanning, selectedKey, selectedCategory, isGridSprite, screenToWorld],
  )

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning && panAnchorRef.current) {
        const dx = e.clientX - panAnchorRef.current.mouseX
        const dy = e.clientY - panAnchorRef.current.mouseY
        const zoom = zoomPercent / 100
        setCameraX(panAnchorRef.current.camX - dx / zoom)
        setCameraY(panAnchorRef.current.camY - dy / zoom)
      }

      // Update hovered tile from mouse position
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        const { worldX, worldY } = screenToWorld(e.clientX, e.clientY, rect)
        const { tileX, tileY } = worldToTile(worldX, worldY)

        const prev = hoveredTileRef.current
        if (!prev || prev.x !== tileX || prev.y !== tileY) {
          hoveredTileRef.current = { x: tileX, y: tileY }
          // Throttle state update to once per animation frame
          if (hoveredRafRef.current === null) {
            hoveredRafRef.current = requestAnimationFrame(() => {
              setHoveredTile(hoveredTileRef.current)
              hoveredRafRef.current = null
            })
          }
        }

        // Update drag end if dragging (clamp to non-negative)
        if (dragStart && !isPanning) {
          setDragEnd({ x: Math.max(0, tileX), y: Math.max(0, tileY) })
        }
      }
    },
    [isPanning, cameraX, cameraY, dragStart, zoomPercent, screenToWorld],
  )

  const handleCanvasMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1) {
        setIsPanning(false)
        panAnchorRef.current = null
        return
      }

      if (e.button === 0 && !isPanning) {
        // Left click release: if we had a drag, do fill; otherwise do tile click
        if (dragStart && dragEnd && (dragStart.x !== dragEnd.x || dragStart.y !== dragEnd.y)) {
          handleMouseUp()
        } else {
          // Single click -- compute tile and click
          const rect = canvasRef.current?.getBoundingClientRect()
          if (rect) {
            const { worldX, worldY } = screenToWorld(e.clientX, e.clientY, rect)
            const { tileX, tileY } = worldToTile(worldX, worldY)
            handleTileClick(tileX, tileY)
          }
          setDragStart(null)
          setDragEnd(null)
        }
      }
    },
    [isPanning, dragStart, dragEnd, cameraX, cameraY, handleMouseUp, handleTileClick, screenToWorld],
  )

  // Compute visible tile range (accounting for zoom)
  const zoom = zoomPercent / 100
  const viewportWorldWidth = containerSize.width / zoom
  const viewportWorldHeight = containerSize.height / zoom

  const startCol = Math.floor(cameraX / TILE_SIZE) - BUFFER
  const startRow = Math.floor(cameraY / TILE_SIZE) - BUFFER
  const endCol = Math.floor(cameraX / TILE_SIZE) + Math.ceil(viewportWorldWidth / TILE_SIZE) + BUFFER
  const endRow = Math.floor(cameraY / TILE_SIZE) + Math.ceil(viewportWorldHeight / TILE_SIZE) + BUFFER

  // Build visible tiles array (memoized to avoid rebuilding on unrelated state changes)
  const visibleTiles = useMemo(() => {
    const tiles: Array<{ x: number; y: number; tile: MapTileType | undefined }> = []
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        tiles.push({
          x: col,
          y: row,
          tile: mapModel.getTile(col, row),
        })
      }
    }
    return tiles
  }, [startRow, startCol, endRow, endCol, mapModel])

  // Stable noop for MapTile onClick
  const noopClick = useCallback(() => {}, [])

  // Compute ghost overlay info for grid sprites (use Map for O(1) lookups)
  const ghostDef = getSelectedSpriteDef()
  const ghostGrid = ghostDef?.render.grid
  const ghostMap = useMemo(() => {
    if (!ghostGrid || !hoveredTile || !selectedKey) return null
    const map = new Map<string, { childKey: string; resolvedId: string }>()
    let index = 1
    for (let dy = 0; dy < ghostGrid.rows; dy++) {
      for (let dx = 0; dx < ghostGrid.cols; dx++) {
        const childKey = `${selectedKey}-${index}`
        const category = selectedCategory!
        const collection = category === 'entities' ? registry.entities : registry.tiles[category]
        const childDef = collection[childKey]
        const resolvedId = childDef?.render.base || ''
        map.set(`${hoveredTile.x + dx},${hoveredTile.y + dy}`, { childKey, resolvedId })
        index++
      }
    }
    return map
  }, [ghostGrid, hoveredTile, selectedKey, selectedCategory, registry])

  // Compute conflict info for ghost overlay
  const ghostConflicts = useMemo(() => {
    if (!ghostGrid || !hoveredTile) return null
    return mapModel.checkGridConflicts(hoveredTile.x, hoveredTile.y, ghostGrid.cols, ghostGrid.rows)
  }, [ghostGrid, hoveredTile, mapModel])

  const ghostOverlapSet = useMemo(() => {
    if (!ghostConflicts) return null
    const set = new Set<string>()
    for (const t of ghostConflicts.overlappingTiles) {
      set.add(`${t.x},${t.y}`)
    }
    return set
  }, [ghostConflicts])

  if (loading) {
    return <s.LoadingScreen>Loading sprites and map data...</s.LoadingScreen>
  }

  if (error) {
    return (
      <s.ErrorScreen>
        <div>Error: {error}</div>
        <s.RetryButton onClick={initialize}>Retry</s.RetryButton>
      </s.ErrorScreen>
    )
  }

  const statusLabel =
    saveStatus === 'saving'
      ? 'Saving...'
      : saveStatus === 'success'
        ? 'Saved'
        : saveStatus === 'error'
          ? 'Save failed'
          : mapDirty
            ? 'Unsaved changes'
            : ''

  // Compute drag selection rectangle
  const dragRect =
    dragStart && dragEnd
      ? {
          minX: Math.min(dragStart.x, dragEnd.x),
          maxX: Math.max(dragStart.x, dragEnd.x),
          minY: Math.min(dragStart.y, dragEnd.y),
          maxY: Math.max(dragStart.y, dragEnd.y),
        }
      : null

  // Layer inspector for selected tile
  const selectedTileData = selectedTile ? mapModel.getTile(selectedTile.x, selectedTile.y) : undefined

  return (
    <s.Container>
      <s.Sidebar>
        <SpritePicker
          registry={registry}
          selectedKey={selectedKey}
          selectedCategory={selectedCategory}
          onSelect={handleSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </s.Sidebar>
      <s.Main>
        <s.Toolbar>
          <s.SaveButton $status={saveStatus} onClick={handleSave} disabled={saveStatus === 'saving'}>
            Save Map
          </s.SaveButton>
          {statusLabel && <s.StatusText $status={saveStatus}>{statusLabel}</s.StatusText>}
          <s.PointerButton $active={!selectedKey && !selectedCategory} onClick={handlePointerMode}>
            Pointer
          </s.PointerButton>
          <s.TileCount>
            {mapModel.tiles.size.toLocaleString()} tiles
            {mapModel.tiles.size > 8000 && (
              <s.TileCountWarning> (large map -- may affect performance)</s.TileCountWarning>
            )}
          </s.TileCount>
          {selectedTile &&
            !selectedKey &&
            (() => {
              if (!selectedTileData || selectedTileData.layers.length === 0)
                return <s.LayerInspector>Empty tile</s.LayerInspector>
              return (
                <s.LayerInspector>
                  Tile ({selectedTile.x}, {selectedTile.y}):
                  {selectedTileData.layers.map((layer, i) => (
                    <s.LayerChip
                      key={i}
                      $selected={selectedLayerIndex === i}
                      onClick={() => setSelectedLayerIndex((prev) => (prev === i ? null : i))}
                      title={`${layer.spriteKey} (${layer.category})`}
                    >
                      <s.LayerChipImage src={`/sprites/${layer.resolvedId}.png`} draggable={false} />
                      <s.LayerChipLabel>{layer.spriteKey}</s.LayerChipLabel>
                    </s.LayerChip>
                  ))}
                  {selectedLayerIndex !== null && (
                    <s.DeleteLayerButton onClick={handleDeleteSelectedLayer}>Delete</s.DeleteLayerButton>
                  )}
                </s.LayerInspector>
              )
            })()}
        </s.Toolbar>
        <s.CanvasContainer
          ref={canvasRef}
          $isPanning={isPanning}
          $negativeZone={hoveredTile ? hoveredTile.x < 0 || hoveredTile.y < 0 : false}
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={() => {
            hoveredTileRef.current = null
            setHoveredTile(null)
            if (isPanning) {
              setIsPanning(false)
              panAnchorRef.current = null
            }
            if (dragStart) handleMouseUp()
          }}
        >
          <s.InnerCanvas
            style={{
              transform: `scale(${zoomPercent / 100})`,
            }}
          >
            {visibleTiles.map(({ x: col, y: row, tile }) => {
              const key = `${col},${row}`
              const ghostChild = ghostMap?.get(key)
              const isOverlap = ghostOverlapSet?.has(key)

              return (
                <div
                  key={key}
                  style={{
                    position: 'absolute',
                    left: col * TILE_SIZE - cameraX,
                    top: row * TILE_SIZE - cameraY,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                  }}
                >
                  {tile ? (
                    <MapTile
                      tile={tile}
                      x={col}
                      y={row}
                      onClick={noopClick}
                      isSelected={selectedTile?.x === col && selectedTile?.y === row}
                    />
                  ) : (
                    <s.EmptyTile />
                  )}
                  {ghostChild && ghostChild.resolvedId && (
                    <img
                      src={`/sprites/${ghostChild.resolvedId}.png`}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        pointerEvents: 'none',
                        opacity: 0.5,
                        imageRendering: 'pixelated',
                      }}
                      draggable={false}
                    />
                  )}
                  {ghostChild && isOverlap && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        pointerEvents: 'none',
                        border: '2px solid #ffaa00',
                        boxSizing: 'border-box',
                      }}
                    />
                  )}
                </div>
              )
            })}
            {dragRect && (
              <div
                style={{
                  position: 'absolute',
                  left: dragRect.minX * TILE_SIZE - cameraX,
                  top: dragRect.minY * TILE_SIZE - cameraY,
                  width: (dragRect.maxX - dragRect.minX + 1) * TILE_SIZE,
                  height: (dragRect.maxY - dragRect.minY + 1) * TILE_SIZE,
                  background: 'rgba(80, 120, 255, 0.2)',
                  border: '2px solid rgba(80, 120, 255, 0.6)',
                  pointerEvents: 'none',
                }}
              />
            )}
            <s.OriginLineVertical style={{ left: -cameraX }} />
            <s.OriginLineHorizontal style={{ top: -cameraY }} />
          </s.InnerCanvas>
        </s.CanvasContainer>
        <StatusBar hoveredTile={hoveredTile} zoomPercent={zoomPercent} onResetZoom={handleResetZoom} />
      </s.Main>
    </s.Container>
  )
}

export default App
