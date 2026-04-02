import { useCallback, useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { registryAtom } from '../../atoms/registry'
import { searchQueryAtom, createDialogOpenAtom } from '../../atoms/ui'
import type { SpriteCategory } from '../../atoms/selection'
import { useSpriteSearch, type SpriteEntry } from '../../hooks/useSpriteSearch'
import SpriteListItem from './SpriteListItem'
import * as s from './sidebar.s'

const CATEGORY_LABELS: Record<SpriteCategory, string> = {
  terrain: 'Terrain',
  terrainOverlays: 'Terrain Overlays',
  objects: 'Objects',
  entities: 'Entities',
}

const CATEGORIES: SpriteCategory[] = ['terrain', 'terrainOverlays', 'objects', 'entities']

const Sidebar = () => {
  const registry = useAtomValue(registryAtom)
  const setSearchQuery = useSetAtom(searchQueryAtom)
  const setCreateDialogOpen = useSetAtom(createDialogOpenAtom)
  const entries = useSpriteSearch()

  const [expanded, setExpanded] = useState<Record<SpriteCategory, boolean>>({
    terrain: true,
    terrainOverlays: true,
    objects: true,
    entities: true,
  })

  const [inputValue, setInputValue] = useState('')

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      setSearchQuery(e.target.value)
    },
    [setSearchQuery],
  )

  const toggleCategory = useCallback((category: SpriteCategory) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }))
  }, [])

  const handleCreate = useCallback(() => {
    setCreateDialogOpen(true)
  }, [setCreateDialogOpen])

  const entriesByCategory = useMemo(() => {
    const grouped: Record<SpriteCategory, SpriteEntry[]> = {
      terrain: [],
      terrainOverlays: [],
      objects: [],
      entities: [],
    }
    for (const entry of entries) {
      grouped[entry.category].push(entry)
    }
    return grouped
  }, [entries])

  const totalCount = useMemo(() => {
    const t = Object.keys(registry.tiles.terrain).length
    const to = Object.keys(registry.tiles.terrainOverlays).length
    const o = Object.keys(registry.tiles.objects).length
    const e = Object.keys(registry.entities).length
    return t + to + o + e
  }, [registry])

  return (
    <s.Container>
      <s.SearchInput
        type="text"
        placeholder="Search sprites..."
        value={inputValue}
        onChange={handleSearchChange}
      />
      <s.CategoryList>
        {CATEGORIES.map((category) => {
          const categoryEntries = entriesByCategory[category]
          const isExpanded = expanded[category]

          return (
            <s.CategorySection key={category}>
              <s.CategoryHeader onClick={() => toggleCategory(category)}>
                <s.CategoryHeaderLeft>
                  <s.Arrow $expanded={isExpanded}>&#9654;</s.Arrow>
                  {CATEGORY_LABELS[category]}
                </s.CategoryHeaderLeft>
                <s.Count>{categoryEntries.length}</s.Count>
              </s.CategoryHeader>
              {isExpanded && (
                <s.SpriteListContainer>
                  {categoryEntries.map((entry) => (
                    <SpriteListItem
                      key={entry.key}
                      category={entry.category}
                      spriteKey={entry.key}
                      definition={entry.definition}
                    />
                  ))}
                </s.SpriteListContainer>
              )}
            </s.CategorySection>
          )
        })}
      </s.CategoryList>
      <s.Footer>
        <s.FooterCount>{totalCount} sprites</s.FooterCount>
        <s.CreateButton onClick={handleCreate}>+ Create Sprite</s.CreateButton>
      </s.Footer>
    </s.Container>
  )
}

export default Sidebar
