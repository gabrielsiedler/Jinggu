import { useCallback, useEffect, useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { SpritePicker } from '@jinggu/sprite-picker'
import type { SpriteCategory, SpriteRegistryV2 } from '@jinggu/shared'

import { registryAtom } from '../atoms/registry'
import { mapModelAtom, mapDirtyAtom, saveStatusAtom } from '../atoms/map'
import { selectedSpriteKeyAtom, selectedCategoryAtom } from '../atoms/picker'
import { loadSprites, loadMap, saveMap } from '../api/mapApi'
import { MapModel } from '../lib/MapModel'
import { MapTile } from './tile/Tile'
import * as s from './app.s'

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

  // Ghost overlay state
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null)

  // Selected tile for deletion / inspection
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null)

  // Selected layer index within the selected tile (for per-layer deletion)
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null)

  // Drag state for terrain fill
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null)

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
        setMapModel(new MapModel(42, 24))
        console.log('[App] Initialized empty 42x24 map')
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
    [selectedKey, selectedCategory, registry, mapModel, setMapModel, setMapDirty, getSelectedSpriteDef],
  )

  const handleMouseDown = useCallback(
    (x: number, y: number) => {
      if (!selectedKey || !selectedCategory || isGridSprite()) return
      setDragStart({ x, y })
      setDragEnd({ x, y })
    },
    [selectedKey, selectedCategory, isGridSprite],
  )

  const handleMouseEnter = useCallback(
    (x: number, y: number) => {
      setHoveredTile({ x, y })
      if (dragStart) {
        setDragEnd({ x, y })
      }
    },
    [dragStart],
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
      setSaveStatus('success')
      setMapDirty(false)
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (err) {
      setSaveStatus('error')
      console.error('[App] Save failed:', err)
    }
  }, [mapModel, setSaveStatus, setMapDirty])

  const handleDeleteSelectedLayer = useCallback(() => {
    if (!selectedTile) return

    if (selectedLayerIndex !== null) {
      // Delete specific layer
      const newModel = mapModel.deleteLayer(selectedTile.x, selectedTile.y, selectedLayerIndex)
      setMapModel(newModel)
      setMapDirty(true)
      // After deletion, check if tile still has layers
      const remainingLayers = newModel.tiles[selectedTile.y]?.[selectedTile.x]?.layers.length ?? 0
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

  // Keyboard handler for deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedTile) {
        e.preventDefault()
        handleDeleteSelectedLayer()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedTile, handleDeleteSelectedLayer])

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

  // Compute ghost overlay info for grid sprites
  const ghostDef = getSelectedSpriteDef()
  const ghostGrid = ghostDef?.render.grid
  const ghostChildren =
    ghostGrid && hoveredTile && selectedKey
      ? (() => {
          const children: Array<{ x: number; y: number; childKey: string; resolvedId: string }> = []
          let index = 1
          for (let dy = 0; dy < ghostGrid.rows; dy++) {
            for (let dx = 0; dx < ghostGrid.cols; dx++) {
              const childKey = `${selectedKey}-${index}`
              const category = selectedCategory!
              const collection = category === 'entities' ? registry.entities : registry.tiles[category]
              const childDef = collection[childKey]
              const resolvedId = childDef?.render.base || ''
              children.push({
                x: hoveredTile.x + dx,
                y: hoveredTile.y + dy,
                childKey,
                resolvedId,
              })
              index++
            }
          }
          return children
        })()
      : null

  // Compute conflict info for ghost overlay
  const ghostConflicts =
    ghostGrid && hoveredTile
      ? mapModel.checkGridConflicts(hoveredTile.x, hoveredTile.y, ghostGrid.cols, ghostGrid.rows)
      : null

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
          {selectedTile && !selectedKey && (() => {
            const tile = mapModel.tiles[selectedTile.y]?.[selectedTile.x]
            if (!tile || tile.layers.length === 0) return <s.LayerInspector>Empty tile</s.LayerInspector>
            return (
              <s.LayerInspector>
                Tile ({selectedTile.x}, {selectedTile.y}):
                {tile.layers.map((layer, i) => (
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
          onMouseLeave={() => {
            setHoveredTile(null)
            if (dragStart) handleMouseUp()
          }}
          onMouseUp={handleMouseUp}
        >
          <s.MapGrid>
            {mapModel.tiles.map((row, y) => (
              <s.MapRow key={y}>
                {row.map((tile, x) => {
                  // Check if this tile is part of a ghost overlay
                  const ghostChild = ghostChildren?.find((c) => c.x === x && c.y === y)
                  const isOverlap = ghostConflicts?.overlappingTiles.some((t) => t.x === x && t.y === y)

                  return (
                    <div key={x} style={{ position: 'relative', width: 32, height: 32, flexShrink: 0 }}>
                      <MapTile
                        tile={tile}
                        x={x}
                        y={y}
                        onClick={handleTileClick}
                        onMouseDown={handleMouseDown}
                        onMouseEnter={handleMouseEnter}
                        isSelected={selectedTile?.x === x && selectedTile?.y === y}
                      />
                      {ghostChild && ghostChild.resolvedId && (
                        <img
                          src={`/sprites/${ghostChild.resolvedId}.png`}
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: 32,
                            height: 32,
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
                            width: 32,
                            height: 32,
                            pointerEvents: 'none',
                            border: '2px solid #ffaa00',
                            boxSizing: 'border-box',
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </s.MapRow>
            ))}
          </s.MapGrid>
          {dragRect && (
            <div
              style={{
                position: 'absolute',
                left: dragRect.minX * 32,
                top: dragRect.minY * 32,
                width: (dragRect.maxX - dragRect.minX + 1) * 32,
                height: (dragRect.maxY - dragRect.minY + 1) * 32,
                background: 'rgba(80, 120, 255, 0.2)',
                border: '2px solid rgba(80, 120, 255, 0.6)',
                pointerEvents: 'none',
              }}
            />
          )}
        </s.CanvasContainer>
      </s.Main>
    </s.Container>
  )
}

export default App
