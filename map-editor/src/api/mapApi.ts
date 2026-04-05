import type { SpriteRegistryV2 } from '@jinggu/shared'
import type { MapData } from '../lib/MapModel'

export const loadSprites = async (): Promise<SpriteRegistryV2> => {
  console.log('[mapApi] GET /__api/sprites')
  const res = await fetch('/__api/sprites')
  if (!res.ok) throw new Error(`Failed to load sprites: ${res.status}`)
  const data = await res.json()
  console.log('[mapApi] Sprites loaded')
  return data
}

export const loadMap = async (): Promise<MapData | null> => {
  console.log('[mapApi] GET /__api/map')
  const res = await fetch('/__api/map')
  if (res.status === 404) {
    console.log('[mapApi] No map file found, will create new')
    return null
  }
  if (!res.ok) throw new Error(`Failed to load map: ${res.status}`)
  const data = await res.json()
  console.log('[mapApi] Map loaded')
  return data
}

export const saveMap = async (data: MapData): Promise<void> => {
  console.log('[mapApi] POST /__api/map')
  const res = await fetch('/__api/map', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || `Save failed: ${res.status}`)
  }
  console.log('[mapApi] Map saved')
}
