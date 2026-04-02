import { useCallback, useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { registryAtom } from '../../atoms/registry'
import { selectedCategoryAtom, selectedSpriteKeyAtom } from '../../atoms/selection'
import type { SpriteCategory, SpriteDef } from '../../atoms/selection'
import * as s from './sidebar.s'

interface SpriteListItemProps {
  category: SpriteCategory
  spriteKey: string
  definition: SpriteDef
}

const SpriteListItem = ({ category, spriteKey, definition }: SpriteListItemProps) => {
  const registry = useAtomValue(registryAtom)
  const selectedKey = useAtomValue(selectedSpriteKeyAtom)
  const selectedCategory = useAtomValue(selectedCategoryAtom)
  const setSelectedKey = useSetAtom(selectedSpriteKeyAtom)
  const setSelectedCategory = useSetAtom(selectedCategoryAtom)
  const [imgError, setImgError] = useState(false)

  const isSelected = selectedCategory === category && selectedKey === spriteKey
  const grid = definition.render.grid
  const base = definition.render.base
  const variantCount = definition.render.variants?.length ?? 0

  const handleClick = useCallback(() => {
    setSelectedCategory(category)
    setSelectedKey(spriteKey)
  }, [category, spriteKey, setSelectedCategory, setSelectedKey])

  const handleImgError = useCallback(() => {
    setImgError(true)
  }, [])

  // Resolve grid cell images from related sprite entries
  const gridCellImages = useMemo(() => {
    if (!grid) return null
    const collection = category === 'entities' ? registry.entities : registry.tiles[category]
    const images: (string | null)[] = []
    for (let i = 1; i <= grid.cols * grid.rows; i++) {
      const childDef = collection[`${spriteKey}-${i}`]
      images.push(childDef?.render.base || null)
    }
    return images
  }, [grid, registry, category, spriteKey])

  const renderThumbnail = () => {
    // Grid sprite: show composed preview
    if (grid && gridCellImages) {
      return (
        <s.GridThumbnail $cols={grid.cols}>
          {gridCellImages.map((img, i) =>
            img ? (
              <s.GridThumbnailCell key={i} src={`/sprites/${img}.png`} alt={`cell ${i + 1}`} />
            ) : (
              <s.GridThumbnailEmpty key={i} />
            ),
          )}
        </s.GridThumbnail>
      )
    }
    // Regular sprite with base image
    if (base && !imgError) {
      return <s.Thumbnail src={`/sprites/${base}.png`} alt={spriteKey} onError={handleImgError} />
    }
    // No image
    return <s.ThumbnailPlaceholder>?</s.ThumbnailPlaceholder>
  }

  return (
    <s.ItemRow $selected={isSelected} onClick={handleClick}>
      {renderThumbnail()}
      <s.ItemName title={spriteKey}>{spriteKey}</s.ItemName>
      {grid && <s.TypeIndicator>grid</s.TypeIndicator>}
      {variantCount > 0 && <s.Badge>{variantCount}v</s.Badge>}
    </s.ItemRow>
  )
}

export default SpriteListItem
