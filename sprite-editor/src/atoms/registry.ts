import { atom } from 'jotai'
import type { SpriteRegistryV2 } from '@jinggu/shared'

const emptyRegistry: SpriteRegistryV2 = {
  version: 2,
  tiles: { terrain: {}, terrainOverlays: {}, objects: {} },
  entities: {},
}

export const registryAtom = atom<SpriteRegistryV2>(emptyRegistry)
export const dirtyAtom = atom(false)
