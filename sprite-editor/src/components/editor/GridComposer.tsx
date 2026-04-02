import { useCallback, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { registryAtom, dirtyAtom } from '../../atoms/registry'
import type { SpriteCategory, SpriteDef } from '../../atoms/selection'
import { imagePickerOpenAtom, imagePickerTargetAtom } from '../../atoms/ui'
import GridCell from './GridCell'
import * as s from './gridcomposer.s'

interface GridComposerProps {
  category: SpriteCategory
  spriteKey: string
  definition: SpriteDef
}

/**
 * Resolves the image assigned to a grid cell by looking up the related sprite entry.
 * Grid entries follow the naming convention: `{spriteKey}-{cellIndex + 1}`.
 */
const getGridCellImage = (
  registry: ReturnType<typeof useAtomValue<typeof registryAtom>>,
  category: SpriteCategory,
  spriteKey: string,
  cellIndex: number,
): string | null => {
  const relatedKey = `${spriteKey}-${cellIndex + 1}`
  let def: SpriteDef | undefined
  if (category === 'entities') {
    def = registry.entities[relatedKey]
  } else {
    def = registry.tiles[category][relatedKey]
  }
  return def?.render.base || null
}

const GridComposer = ({ category, spriteKey, definition }: GridComposerProps) => {
  const registry = useAtomValue(registryAtom)
  const setRegistry = useSetAtom(registryAtom)
  const setDirty = useSetAtom(dirtyAtom)
  const setImagePickerOpen = useSetAtom(imagePickerOpenAtom)
  const setImagePickerTarget = useSetAtom(imagePickerTargetAtom)

  const grid = definition.render.grid
  const cols = grid?.cols ?? 1
  const rows = grid?.rows ?? 1
  const totalCells = cols * rows

  const handleEnableGrid = useCallback(() => {
    setRegistry((prev) => {
      const next = structuredClone(prev)
      const getDef = () => {
        if (category === 'entities') return next.entities[spriteKey]
        return next.tiles[category][spriteKey]
      }
      const def = getDef()
      if (!def) return prev
      def.render.grid = { cols: 2, rows: 2 }
      return next
    })
    setDirty(true)
  }, [category, spriteKey, setRegistry, setDirty])

  const handleRemoveGrid = useCallback(() => {
    setRegistry((prev) => {
      const next = structuredClone(prev)
      const getDef = () => {
        if (category === 'entities') return next.entities[spriteKey]
        return next.tiles[category][spriteKey]
      }
      const def = getDef()
      if (!def) return prev
      delete def.render.grid

      // Also remove related grid entries
      const currentCols = definition.render.grid?.cols ?? 0
      const currentRows = definition.render.grid?.rows ?? 0
      for (let i = 1; i <= currentCols * currentRows; i++) {
        const relatedKey = `${spriteKey}-${i}`
        if (category === 'entities') {
          delete next.entities[relatedKey]
        } else {
          delete next.tiles[category][relatedKey]
        }
      }

      return next
    })
    setDirty(true)
  }, [category, spriteKey, definition, setRegistry, setDirty])

  const handleColsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10)
      if (isNaN(value) || value < 1 || value > 10) return
      setRegistry((prev) => {
        const next = structuredClone(prev)
        const getDef = () => {
          if (category === 'entities') return next.entities[spriteKey]
          return next.tiles[category][spriteKey]
        }
        const def = getDef()
        if (!def) return prev
        def.render.grid = { cols: value, rows: def.render.grid?.rows ?? 1 }
        return next
      })
      setDirty(true)
    },
    [category, spriteKey, setRegistry, setDirty],
  )

  const handleRowsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10)
      if (isNaN(value) || value < 1 || value > 10) return
      setRegistry((prev) => {
        const next = structuredClone(prev)
        const getDef = () => {
          if (category === 'entities') return next.entities[spriteKey]
          return next.tiles[category][spriteKey]
        }
        const def = getDef()
        if (!def) return prev
        def.render.grid = { cols: def.render.grid?.cols ?? 1, rows: value }
        return next
      })
      setDirty(true)
    },
    [category, spriteKey, setRegistry, setDirty],
  )

  const handleCellAssign = useCallback(
    (row: number, col: number) => {
      setImagePickerTarget({ type: 'gridCell', row, col })
      setImagePickerOpen(true)
    },
    [setImagePickerOpen, setImagePickerTarget],
  )

  // Build the list of cell images from the registry
  const cellImages = useMemo(() => {
    const images: (string | null)[] = []
    for (let i = 0; i < totalCells; i++) {
      images.push(getGridCellImage(registry, category, spriteKey, i))
    }
    return images
  }, [registry, category, spriteKey, totalCells])

  // If no grid is set, show enable button
  if (!grid) {
    return (
      <s.Container>
        <s.Title>Grid Composer</s.Title>
        <s.EnableButton onClick={handleEnableGrid}>Enable Grid Layout</s.EnableButton>
      </s.Container>
    )
  }

  return (
    <s.Container>
      <s.Title>Grid Composer</s.Title>

      <s.ControlRow>
        <s.Label>Cols</s.Label>
        <s.NumberInput value={cols} onChange={handleColsChange} min={1} max={10} />
        <s.Label>Rows</s.Label>
        <s.NumberInput value={rows} onChange={handleRowsChange} min={1} max={10} />
        <s.RemoveButton onClick={handleRemoveGrid}>Remove Grid</s.RemoveButton>
      </s.ControlRow>

      <s.GridVisual $cols={cols}>
        {Array.from({ length: totalCells }, (_, i) => {
          const row = Math.floor(i / cols)
          const col = i % cols
          return (
            <GridCell
              key={`${row}-${col}`}
              row={row}
              col={col}
              cellIndex={i}
              image={cellImages[i]}
              onAssign={handleCellAssign}
            />
          )
        })}
      </s.GridVisual>

      {/* Composed preview (only if any cells have images) */}
      {cellImages.some((img) => img !== null) && (
        <>
          <s.Title>Composed Preview</s.Title>
          <s.ComposedPreview $cols={cols}>
            {cellImages.map((img, i) =>
              img ? (
                <s.ComposedCell key={i} src={`/sprites/${img}.png`} alt={`Cell ${i + 1}`} />
              ) : (
                <s.ComposedPlaceholder key={i} />
              ),
            )}
          </s.ComposedPreview>
        </>
      )}
    </s.Container>
  )
}

export default GridComposer
