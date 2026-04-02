import type { SpriteRegistryV2 } from '@jinggu/shared'

export const loadRegistry = async (): Promise<SpriteRegistryV2> => {
  console.log('[spriteApi] GET /__api/registry')
  const res = await fetch('/__api/registry')
  console.log(`[spriteApi] GET /__api/registry -> ${res.status}`)
  if (!res.ok) throw new Error(`Failed to load registry: ${res.status} ${res.statusText}`)
  return res.json()
}

export const saveRegistry = async (registry: SpriteRegistryV2): Promise<void> => {
  console.log('[spriteApi] PUT /__api/registry')
  const res = await fetch('/__api/registry', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registry),
  })
  console.log(`[spriteApi] PUT /__api/registry -> ${res.status}`)
  if (!res.ok) throw new Error(await res.text())
}

export const listImages = async (): Promise<string[]> => {
  console.log('[spriteApi] GET /__api/images')
  const res = await fetch('/__api/images')
  console.log(`[spriteApi] GET /__api/images -> ${res.status}`)
  if (!res.ok) throw new Error(`Failed to list images: ${res.status} ${res.statusText}`)
  return res.json()
}

export const renameImage = async (from: string, to: string): Promise<void> => {
  console.log(`[spriteApi] POST /__api/images/rename (${from} -> ${to})`)
  const res = await fetch('/__api/images/rename', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to }),
  })
  console.log(`[spriteApi] POST /__api/images/rename -> ${res.status}`)
  if (!res.ok) throw new Error(await res.text())
}
