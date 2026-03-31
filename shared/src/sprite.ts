export interface Sprite {
  id: string | number
  walkable?: boolean
}

export interface Sprites {
  [key: Sprite['id']]: Sprite
}
