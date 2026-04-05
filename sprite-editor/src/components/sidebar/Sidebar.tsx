import { useCallback, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { SpritePicker } from '@jinggu/sprite-picker'
import type { SpriteCategory } from '@jinggu/shared'
import { registryAtom } from '../../atoms/registry'
import { selectedCategoryAtom, selectedSpriteKeyAtom } from '../../atoms/selection'
import { createDialogOpenAtom } from '../../atoms/ui'
import * as s from './sidebar.s'

const Sidebar = () => {
  const registry = useAtomValue(registryAtom)
  const selectedKey = useAtomValue(selectedSpriteKeyAtom)
  const selectedCategory = useAtomValue(selectedCategoryAtom)
  const setSelectedKey = useSetAtom(selectedSpriteKeyAtom)
  const setSelectedCategory = useSetAtom(selectedCategoryAtom)
  const setCreateDialogOpen = useSetAtom(createDialogOpenAtom)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSelect = useCallback(
    (category: SpriteCategory, key: string) => {
      setSelectedCategory(category)
      setSelectedKey(key)
    },
    [setSelectedCategory, setSelectedKey],
  )

  const handleCreate = useCallback(() => {
    setCreateDialogOpen(true)
  }, [setCreateDialogOpen])

  return (
    <SpritePicker
      registry={registry}
      selectedKey={selectedKey}
      selectedCategory={selectedCategory}
      onSelect={handleSelect}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      footer={<s.CreateButton onClick={handleCreate}>+ Create Sprite</s.CreateButton>}
    />
  )
}

export default Sidebar
