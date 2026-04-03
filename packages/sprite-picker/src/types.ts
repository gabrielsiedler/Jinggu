import type { ReactNode } from 'react'
import type { SpriteCategory, SpriteDef, SpriteRegistryV2 } from '@jinggu/shared'

export interface SpriteEntry {
  category: SpriteCategory
  key: string
  definition: SpriteDef
}

export interface SpritePickerProps {
  registry: SpriteRegistryV2
  selectedKey: string | null
  selectedCategory: SpriteCategory | null
  onSelect: (category: SpriteCategory, key: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  renderItemActions?: (category: SpriteCategory, key: string) => ReactNode
  footer?: ReactNode
}

export type { SpriteCategory, SpriteDef, SpriteRegistryV2 }
