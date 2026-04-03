import type { SpriteRender } from '@jinggu/shared'

/**
 * Select a resolved sprite ID for placement.
 * If the sprite has variants: 70% base, 30% random variant.
 * If no variants: return base.
 */
export const selectVariant = (render: SpriteRender): string => {
  const { base, variants } = render
  if (!variants || variants.length === 0) return base
  if (Math.random() < 0.7) return base
  return variants[Math.floor(Math.random() * variants.length)]
}
