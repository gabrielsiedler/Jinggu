import { useCallback, useEffect, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import type { EntityDefinition } from '@jinggu/shared'
import { registryAtom, dirtyAtom } from '../../atoms/registry'
import { selectedCategoryAtom, selectedSpriteKeyAtom, selectedSpriteDefAtom } from '../../atoms/selection'
import PropertyForm from './PropertyForm'
import GridComposer from './GridComposer'
import AnimationPreview from './AnimationPreview'
import ConfirmDialog from '../shared/ConfirmDialog'
import * as s from './editor.s'

const EditorPanel = () => {
  const category = useAtomValue(selectedCategoryAtom)
  const spriteKey = useAtomValue(selectedSpriteKeyAtom)
  const definition = useAtomValue(selectedSpriteDefAtom)
  const setRegistry = useSetAtom(registryAtom)
  const setDirty = useSetAtom(dirtyAtom)
  const setSelectedCategory = useSetAtom(selectedCategoryAtom)
  const setSelectedSpriteKey = useSetAtom(selectedSpriteKeyAtom)
  const [imgError, setImgError] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [spriteKey, category])

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true)
  }, [])

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (!category || !spriteKey) return

    setRegistry((prev) => {
      const next = structuredClone(prev)
      if (category === 'entities') {
        delete next.entities[spriteKey]
      } else {
        delete next.tiles[category][spriteKey]
      }
      return next
    })

    setSelectedCategory(null)
    setSelectedSpriteKey(null)
    setDirty(true)
    setDeleteDialogOpen(false)
  }, [category, spriteKey, setRegistry, setSelectedCategory, setSelectedSpriteKey, setDirty])

  if (!category || !spriteKey || !definition) {
    return <s.EmptyState>Select a sprite to edit</s.EmptyState>
  }

  const base = definition.render.base
  const isEntity = category === 'entities'
  const hasAnimations = isEntity && !!(definition as EntityDefinition).render.animations

  return (
    <s.EditorContainer>
      <s.PreviewSection>
        {hasAnimations ? (
          <AnimationPreview definition={definition as EntityDefinition} />
        ) : base && !imgError ? (
          <s.PreviewImage
            key={base}
            src={`/sprites/${base}.png`}
            alt={spriteKey}
            onError={() => setImgError(true)}
          />
        ) : (
          <s.PreviewPlaceholder>No image</s.PreviewPlaceholder>
        )}
        <s.SpriteKeyLabel>{spriteKey}</s.SpriteKeyLabel>
        <s.CategoryLabel>{category}</s.CategoryLabel>
      </s.PreviewSection>

      <PropertyForm category={category} spriteKey={spriteKey} definition={definition} />

      {!isEntity && <GridComposer category={category} spriteKey={spriteKey} definition={definition} />}

      <s.DeleteButton onClick={handleDeleteClick}>Delete Sprite</s.DeleteButton>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Sprite"
        message={`Are you sure you want to delete "${spriteKey}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </s.EditorContainer>
  )
}

export default EditorPanel
