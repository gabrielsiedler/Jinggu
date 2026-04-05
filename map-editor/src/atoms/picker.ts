import { atom } from 'jotai'
import type { SpriteCategory } from '@jinggu/shared'

export const selectedSpriteKeyAtom = atom<string | null>(null)
export const selectedCategoryAtom = atom<SpriteCategory | null>(null)
