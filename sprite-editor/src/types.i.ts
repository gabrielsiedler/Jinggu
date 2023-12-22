export interface SpriteSingle {
  id: number
  walkable: boolean
  category: 'terrain' | 'terrain-overlay' | 'overlay' | 'object'
  spriteId: number
}

interface SpriteGroup {
  groupId: number
  category: string
  sprites: SpriteSingle[][]
}

export type Sprite = SpriteSingle | SpriteGroup

export type SpriteMap = { [key: string]: Sprite }
