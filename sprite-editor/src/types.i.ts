export interface SpriteContent {
  walkable: boolean
  spriteId: number
}

interface SpriteSingle extends SpriteContent {
  id: number
}

interface SpriteGroup {
  id: number
  size: [number, number]
  sprites: SpriteContent[]
}

export type Sprite = SpriteSingle | SpriteGroup

export type SpriteMap = { [key: string]: Sprite }
