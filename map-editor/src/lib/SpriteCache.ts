export class SpriteCache {
  private images: Map<string, HTMLImageElement> = new Map()
  private loading: Set<string> = new Set()
  private onLoadCallback: (() => void) | null = null

  constructor(onLoad?: () => void) {
    this.onLoadCallback = onLoad ?? null
  }

  get(spriteId: string): HTMLImageElement | null {
    const existing = this.images.get(spriteId)
    if (existing && existing.complete) {
      return existing
    }

    if (!existing && !this.loading.has(spriteId)) {
      this.load(spriteId)
    }

    return null
  }

  private load(spriteId: string): void {
    this.loading.add(spriteId)
    const img = new Image()

    img.onload = () => {
      this.loading.delete(spriteId)
      this.images.set(spriteId, img)
      this.onLoadCallback?.()
    }

    img.onerror = () => {
      this.loading.delete(spriteId)
      console.warn('[SpriteCache] Failed to load sprite:', spriteId)
      // Store the broken image as a sentinel to prevent retry
      this.images.set(spriteId, img)
    }

    img.src = `/sprites/${spriteId}.png`
    // Store immediately so concurrent get() calls see it as in-progress
    this.images.set(spriteId, img)
  }

  get size(): number {
    return this.images.size
  }
}
