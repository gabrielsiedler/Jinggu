import { atom } from 'jotai'
import { buildSpriteLookup, SpriteRegistryV2 } from '@jinggu/shared'
import spriteRegistry from '@jinggu/shared/data/sprites.json'

const registry = spriteRegistry as unknown as SpriteRegistryV2
const flatLookup = buildSpriteLookup(registry)

export const availableSpriteIdsAtom = atom(Object.keys(flatLookup))
export const pickerSelectedTileAtom = atom(Object.keys(flatLookup)[0] || '')
