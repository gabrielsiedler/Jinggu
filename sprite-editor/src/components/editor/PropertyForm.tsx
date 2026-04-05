import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import type {
  SpriteRender,
  TerrainDefinition,
  TerrainOverlayDefinition,
  ObjectDefinition,
  EntityDefinition,
  DirectionalFrames,
} from '@jinggu/shared'
import { registryAtom, dirtyAtom } from '../../atoms/registry'
import { selectedCategoryAtom, selectedSpriteKeyAtom } from '../../atoms/selection'
import type { SpriteCategory, SpriteDef } from '../../atoms/selection'
import { imagePickerOpenAtom, imagePickerTargetAtom } from '../../atoms/ui'
import * as s from './editor.s'

interface PropertyFormProps {
  category: SpriteCategory
  spriteKey: string
  definition: SpriteDef
}

const LAYER_OPTIONS: SpriteRender['layer'][] = ['base', 'terrainOverlay', 'object', 'entity']
const ORDER_MODE_OPTIONS: SpriteRender['orderMode'][] = ['fixed', 'mapOrder', 'dynamic']

const DIRECTIONS: (keyof DirectionalFrames)[] = ['up', 'down', 'left', 'right']

const PropertyForm = ({ category, spriteKey, definition }: PropertyFormProps) => {
  const setRegistry = useSetAtom(registryAtom)
  const setDirty = useSetAtom(dirtyAtom)
  const setImagePickerOpen = useSetAtom(imagePickerOpenAtom)
  const setImagePickerTarget = useSetAtom(imagePickerTargetAtom)

  const updateDefinition = useCallback(
    (updater: (def: SpriteDef) => SpriteDef) => {
      setRegistry((prev) => {
        const next = structuredClone(prev)
        if (category === 'entities') {
          const current = next.entities[spriteKey]
          if (current) {
            next.entities[spriteKey] = updater(current) as EntityDefinition
          }
        } else {
          const current = next.tiles[category][spriteKey]
          if (current) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(next.tiles[category] as Record<string, any>)[spriteKey] = updater(current)
          }
        }
        return next
      })
      setDirty(true)
    },
    [category, spriteKey, setRegistry, setDirty],
  )

  const handleOrderModeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as SpriteRender['orderMode']
      updateDefinition((def) => ({
        ...def,
        render: { ...def.render, orderMode: value },
      }))
    },
    [updateDefinition],
  )

  const handleZOffsetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10)
      updateDefinition((def) => ({
        ...def,
        render: { ...def.render, zOffset: isNaN(value) ? undefined : value },
      }))
    },
    [updateDefinition],
  )

  const handleBaseChange = useCallback(() => {
    setImagePickerTarget({ type: 'base' })
    setImagePickerOpen(true)
  }, [setImagePickerOpen, setImagePickerTarget])

  const handleWalkableChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked
      updateDefinition((def) => ({
        ...def,
        collision: { ...('collision' in def ? def.collision : {}), walkable: checked },
      }))
    },
    [updateDefinition],
  )

  const handleWalkableOverrideChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked
      updateDefinition((def) => ({
        ...def,
        collision: { walkableOverride: checked },
      }))
    },
    [updateDefinition],
  )

  const handleRemoveVariant = useCallback(
    (index: number) => {
      updateDefinition((def) => {
        const variants = [...(def.render.variants ?? [])]
        variants.splice(index, 1)
        return {
          ...def,
          render: { ...def.render, variants: variants.length > 0 ? variants : undefined },
        }
      })
    },
    [updateDefinition],
  )

  const handleAddVariant = useCallback(() => {
    setImagePickerTarget({ type: 'variant', index: definition.render.variants?.length ?? 0 })
    setImagePickerOpen(true)
  }, [definition.render.variants, setImagePickerOpen, setImagePickerTarget])

  const handleGridColsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cols = parseInt(e.target.value, 10)
      if (isNaN(cols) || cols < 1) return
      updateDefinition((def) => ({
        ...def,
        render: {
          ...def.render,
          grid: { cols, rows: def.render.grid?.rows ?? 1 },
        },
      }))
    },
    [updateDefinition],
  )

  const handleGridRowsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rows = parseInt(e.target.value, 10)
      if (isNaN(rows) || rows < 1) return
      updateDefinition((def) => ({
        ...def,
        render: {
          ...def.render,
          grid: { cols: def.render.grid?.cols ?? 1, rows },
        },
      }))
    },
    [updateDefinition],
  )

  const { render } = definition

  return (
    <s.FormSection>
      <s.SectionTitle>Render</s.SectionTitle>

      {/* Layer (read-only, set by category) */}
      <s.FieldRow>
        <s.FieldLabel>Layer</s.FieldLabel>
        <s.Select value={render.layer} disabled>
          {LAYER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </s.Select>
      </s.FieldRow>

      {/* Order Mode */}
      <s.FieldRow>
        <s.FieldLabel>Order Mode</s.FieldLabel>
        <s.Select value={render.orderMode} onChange={handleOrderModeChange}>
          {ORDER_MODE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </s.Select>
      </s.FieldRow>

      {/* zOffset (terrain + terrainOverlays only) */}
      {(category === 'terrain' || category === 'terrainOverlays') && (
        <s.FieldRow>
          <s.FieldLabel>Z Offset</s.FieldLabel>
          <s.NumberInput value={render.zOffset ?? 0} onChange={handleZOffsetChange} />
        </s.FieldRow>
      )}

      {/* Base image */}
      <s.FieldRow>
        <s.FieldLabel>Base</s.FieldLabel>
        <s.BaseImageRow>
          <s.BaseImageValue>{render.base || '(none)'}</s.BaseImageValue>
          <s.SmallButton onClick={handleBaseChange}>Change</s.SmallButton>
        </s.BaseImageRow>
      </s.FieldRow>

      {/* Variants (terrain, terrainOverlays, objects) */}
      {category !== 'entities' && (
        <>
          <s.FieldRow>
            <s.FieldLabel>Variants</s.FieldLabel>
            <s.SmallButton onClick={handleAddVariant}>+ Add</s.SmallButton>
          </s.FieldRow>
          {render.variants && render.variants.length > 0 && (
            <s.VariantList>
              {render.variants.map((v, i) => (
                <s.VariantRow key={`${v}-${i}`}>
                  <s.VariantImage
                    src={`/sprites/${v}.png`}
                    alt={v}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <s.VariantName>{v}</s.VariantName>
                  <s.RemoveButton onClick={() => handleRemoveVariant(i)}>x</s.RemoveButton>
                </s.VariantRow>
              ))}
            </s.VariantList>
          )}
        </>
      )}

      {/* Grid (cols/rows) */}
      {render.grid && (
        <>
          <s.SectionTitle>Grid</s.SectionTitle>
          <s.GridRow>
            <s.GridLabel>Cols</s.GridLabel>
            <s.NumberInput value={render.grid.cols} onChange={handleGridColsChange} min={1} />
            <s.GridLabel>Rows</s.GridLabel>
            <s.NumberInput value={render.grid.rows} onChange={handleGridRowsChange} min={1} />
          </s.GridRow>
        </>
      )}

      {/* Collision section */}
      {category === 'terrain' && (
        <>
          <s.SectionTitle>Collision</s.SectionTitle>
          <s.FieldRow>
            <s.FieldLabel>Walkable</s.FieldLabel>
            <s.Checkbox
              checked={(definition as TerrainDefinition).collision.walkable}
              onChange={handleWalkableChange}
            />
          </s.FieldRow>
        </>
      )}

      {category === 'terrainOverlays' && (
        <>
          <s.SectionTitle>Collision</s.SectionTitle>
          <s.FieldRow>
            <s.FieldLabel>Walkable</s.FieldLabel>
            <s.Checkbox
              checked={(definition as TerrainOverlayDefinition).collision?.walkable ?? true}
              onChange={handleWalkableChange}
            />
          </s.FieldRow>
        </>
      )}

      {category === 'objects' && (
        <>
          <s.SectionTitle>Collision</s.SectionTitle>
          <s.FieldRow>
            <s.FieldLabel>Walkable Override</s.FieldLabel>
            <s.Checkbox
              checked={(definition as ObjectDefinition).collision?.walkableOverride ?? true}
              onChange={handleWalkableOverrideChange}
            />
          </s.FieldRow>
        </>
      )}

      {/* Animations (entities only, read-only for now) */}
      {category === 'entities' && render.animations && (
        <>
          <s.SectionTitle>Animations (read-only)</s.SectionTitle>
          {(Object.entries(render.animations) as [string, DirectionalFrames][]).map(([animType, frames]) => (
            <s.AnimationSection key={animType}>
              <s.AnimationTypeLabel>{animType}</s.AnimationTypeLabel>
              {DIRECTIONS.map((dir) => (
                <s.DirectionRow key={dir}>
                  <s.DirectionLabel>{dir}:</s.DirectionLabel>
                  <s.FrameList>{frames[dir]?.join(', ') || '(none)'}</s.FrameList>
                </s.DirectionRow>
              ))}
            </s.AnimationSection>
          ))}
        </>
      )}
    </s.FormSection>
  )
}

export default PropertyForm
