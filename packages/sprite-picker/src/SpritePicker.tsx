import { useCallback, useMemo, useState } from 'react'
import type { SpriteCategory } from '@jinggu/shared'
import type { SpritePickerProps, SpriteEntry } from './types'
import { useSpriteSearch } from './useSpriteSearch'
import { SpriteListItem } from './SpriteListItem'
import * as s from './picker.s'

const CATEGORY_LABELS: Record<SpriteCategory, string> = {
  terrain: 'Terrain',
  terrainOverlays: 'Terrain Overlays',
  objects: 'Objects',
  entities: 'Entities',
}

const CATEGORIES: SpriteCategory[] = ['terrain', 'terrainOverlays', 'objects', 'entities']

export const SpritePicker = ({
  registry,
  selectedKey,
  selectedCategory,
  onSelect,
  searchQuery,
  onSearchChange,
  renderItemActions,
  footer,
}: SpritePickerProps) => {
  const entries = useSpriteSearch(registry, searchQuery)

  const [expanded, setExpanded] = useState<Record<SpriteCategory, boolean>>({
    terrain: true,
    terrainOverlays: true,
    objects: true,
    entities: true,
  })

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value)
    },
    [onSearchChange],
  )

  const toggleCategory = useCallback((category: SpriteCategory) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }))
  }, [])

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
        value={searchQuery}
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
                      registry={registry}
                      isSelected={selectedCategory === entry.category && selectedKey === entry.key}
                      onSelect={onSelect}
                      renderActions={renderItemActions?.(entry.category, entry.key)}
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
        {footer}
      </s.Footer>
    </s.Container>
  )
}
