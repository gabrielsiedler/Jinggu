import { atom } from 'jotai'

export const imagePickerOpenAtom = atom(false)
export const searchQueryAtom = atom('')
export const saveStatusAtom = atom<'idle' | 'saving' | 'success' | 'error'>('idle')
export const saveErrorAtom = atom<string | null>(null)
export const createDialogOpenAtom = atom(false)

/** Tracks what the image picker is assigning to (base image, variant index, grid cell, etc.) */
export type ImagePickerTarget =
  | { type: 'base' }
  | { type: 'variant'; index: number }
  | { type: 'gridCell'; row: number; col: number }
  | null

export const imagePickerTargetAtom = atom<ImagePickerTarget>(null)
