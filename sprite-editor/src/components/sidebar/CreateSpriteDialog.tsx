import { useState, useCallback, useEffect, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { registryAtom, dirtyAtom } from '../../atoms/registry'
import { selectedCategoryAtom, selectedSpriteKeyAtom } from '../../atoms/selection'
import type { SpriteCategory } from '../../atoms/selection'
import { createDialogOpenAtom } from '../../atoms/ui'
import { defaultForCategory } from '../../lib/defaults'
import { isDuplicateName, isNameValid } from '../../lib/validation'
import * as s from './createspritedialog.s'

const CATEGORIES: SpriteCategory[] = ['terrain', 'terrainOverlays', 'objects', 'entities']

const CATEGORY_LABELS: Record<SpriteCategory, string> = {
  terrain: 'Terrain',
  terrainOverlays: 'Terrain Overlays',
  objects: 'Objects',
  entities: 'Entities',
}

const CreateSpriteDialog = () => {
  const open = useAtomValue(createDialogOpenAtom)
  const setOpen = useSetAtom(createDialogOpenAtom)
  const registry = useAtomValue(registryAtom)
  const setRegistry = useSetAtom(registryAtom)
  const setDirty = useSetAtom(dirtyAtom)
  const setSelectedCategory = useSetAtom(selectedCategoryAtom)
  const setSelectedSpriteKey = useSetAtom(selectedSpriteKeyAtom)

  const [category, setCategory] = useState<SpriteCategory>('terrain')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const nameRef = useRef<HTMLInputElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement
      setCategory('terrain')
      setName('')
      setError('')
      const timer = setTimeout(() => nameRef.current?.focus(), 0)
      return () => clearTimeout(timer)
    } else if (previousFocusRef.current instanceof HTMLElement) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [open])

  const validate = useCallback(
    (n: string, cat: SpriteCategory): string => {
      if (!isNameValid(n)) {
        return 'Name is required'
      }
      if (isDuplicateName(registry, cat, n.trim())) {
        return `A sprite named "${n.trim()}" already exists in ${CATEGORY_LABELS[cat]}`
      }
      return ''
    },
    [registry],
  )

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setName(val)
      if (error) {
        setError(validate(val, category))
      }
    },
    [category, error, validate],
  )

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const cat = e.target.value as SpriteCategory
      setCategory(cat)
      if (error) {
        setError(validate(name, cat))
      }
    },
    [name, error, validate],
  )

  const handleCancel = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleCreate = useCallback(() => {
    const validationError = validate(name, category)
    if (validationError) {
      setError(validationError)
      return
    }

    const trimmedName = name.trim()
    const def = defaultForCategory(category)

    setRegistry((prev) => {
      const next = structuredClone(prev)
      if (category === 'entities') {
        next.entities[trimmedName] = def as typeof next.entities[string]
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(next.tiles[category] as Record<string, any>)[trimmedName] = def
      }
      return next
    })

    setSelectedCategory(category)
    setSelectedSpriteKey(trimmedName)
    setDirty(true)
    setOpen(false)
  }, [name, category, validate, setRegistry, setSelectedCategory, setSelectedSpriteKey, setDirty, setOpen])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel()
      } else if (e.key === 'Enter') {
        handleCreate()
      }
    },
    [handleCancel, handleCreate],
  )

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleCancel()
      }
    },
    [handleCancel],
  )

  if (!open) return null

  const currentError = error || ''

  return (
    <s.Overlay onClick={handleOverlayClick} onKeyDown={handleKeyDown} role="dialog" aria-modal="true" aria-label="Create Sprite">
      <s.Dialog>
        <s.Title>Create Sprite</s.Title>

        <s.FieldGroup>
          <s.Label htmlFor="create-category">Category</s.Label>
          <s.Select id="create-category" value={category} onChange={handleCategoryChange}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </s.Select>
        </s.FieldGroup>

        <s.FieldGroup>
          <s.Label htmlFor="create-name">Name</s.Label>
          <s.TextInput
            ref={nameRef}
            id="create-name"
            type="text"
            placeholder="e.g. grass-dark"
            value={name}
            onChange={handleNameChange}
            aria-invalid={!!currentError}
            aria-describedby={currentError ? 'create-error' : undefined}
          />
          <s.ErrorText id="create-error" role="alert">
            {currentError}
          </s.ErrorText>
        </s.FieldGroup>

        <s.Actions>
          <s.CancelButton onClick={handleCancel}>Cancel</s.CancelButton>
          <s.CreateButton onClick={handleCreate} disabled={!!currentError && currentError !== ''}>
            Create
          </s.CreateButton>
        </s.Actions>
      </s.Dialog>
    </s.Overlay>
  )
}

export default CreateSpriteDialog
