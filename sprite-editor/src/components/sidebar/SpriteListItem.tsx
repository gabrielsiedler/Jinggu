import { useCallback, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { selectedCategoryAtom, selectedSpriteKeyAtom } from '../../atoms/selection'
import type { SpriteCategory, SpriteDef } from '../../atoms/selection'
import * as s from './sidebar.s'

interface SpriteListItemProps {
  category: SpriteCategory
  spriteKey: string
  definition: SpriteDef
}

const SpriteListItem = ({ category, spriteKey, definition }: SpriteListItemProps) => {
  const selectedKey = useAtomValue(selectedSpriteKeyAtom)
  const selectedCategory = useAtomValue(selectedCategoryAtom)
  const setSelectedKey = useSetAtom(selectedSpriteKeyAtom)
  const setSelectedCategory = useSetAtom(selectedCategoryAtom)
  const [imgError, setImgError] = useState(false)

  const isSelected = selectedCategory === category && selectedKey === spriteKey

  const handleClick = useCallback(() => {
    setSelectedCategory(category)
    setSelectedKey(spriteKey)
  }, [category, spriteKey, setSelectedCategory, setSelectedKey])

  const handleImgError = useCallback(() => {
    setImgError(true)
  }, [])

  const base = definition.render.base
  const variantCount = definition.render.variants?.length ?? 0
  const hasGrid = !!definition.render.grid

  return (
    <s.ItemRow $selected={isSelected} onClick={handleClick}>
      {base && !imgError ? (
        <s.Thumbnail src={`/sprites/${base}.png`} alt={spriteKey} onError={handleImgError} />
      ) : (
        <s.ThumbnailPlaceholder>?</s.ThumbnailPlaceholder>
      )}
      <s.ItemName title={spriteKey}>{spriteKey}</s.ItemName>
      {hasGrid && <s.TypeIndicator>grid</s.TypeIndicator>}
      {variantCount > 0 && <s.Badge>{variantCount}v</s.Badge>}
    </s.ItemRow>
  )
}

export default SpriteListItem
