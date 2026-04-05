import { atom } from 'jotai'
import { registryAtom } from './registry'

/** All image filenames on disk (without .png extension), loaded from API */
export const allImageFilenamesAtom = atom<string[]>([])

/** Derived: set of all image filenames referenced by any sprite definition in the registry */
export const assignedImagesAtom = atom<Set<string>>((get) => {
  const registry = get(registryAtom)
  const assigned = new Set<string>()

  const collectRender = (base: string, variants?: string[]) => {
    if (base) assigned.add(base)
    if (variants) {
      for (const v of variants) {
        assigned.add(v)
      }
    }
  }

  // Terrain
  for (const def of Object.values(registry.tiles.terrain)) {
    collectRender(def.render.base, def.render.variants)
  }

  // Terrain overlays
  for (const def of Object.values(registry.tiles.terrainOverlays)) {
    collectRender(def.render.base, def.render.variants)
  }

  // Objects
  for (const def of Object.values(registry.tiles.objects)) {
    collectRender(def.render.base, def.render.variants)
  }

  // Entities (base + animation frames)
  for (const def of Object.values(registry.entities)) {
    if (def.render.base) assigned.add(def.render.base)
    if (def.render.variants) {
      for (const v of def.render.variants) {
        assigned.add(v)
      }
    }
    if (def.render.animations) {
      for (const animType of Object.values(def.render.animations)) {
        for (const frames of Object.values(animType)) {
          for (const frame of frames as string[]) {
            assigned.add(frame)
          }
        }
      }
    }
  }

  return assigned
})

/** Derived: image filenames that are not referenced by any sprite definition */
export const unassignedImagesAtom = atom<string[]>((get) => {
  const all = get(allImageFilenamesAtom)
  const assigned = get(assignedImagesAtom)
  return all.filter((f) => !assigned.has(f))
})
