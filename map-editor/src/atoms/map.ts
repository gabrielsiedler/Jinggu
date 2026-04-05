import { atom } from 'jotai'
import { MapModel } from '../lib/MapModel'

export const mapModelAtom = atom<MapModel>(new MapModel())
export const mapDirtyAtom = atom(false)
export const saveStatusAtom = atom<'idle' | 'saving' | 'success' | 'error'>('idle')
