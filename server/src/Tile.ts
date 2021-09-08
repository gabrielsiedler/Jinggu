import { Sprite } from './sprites'

export class Tile {
  x: number
  y: number
  sprites: Sprite[]
  walkable: boolean

  constructor(x: number, y: number, sprites: any) {
    this.x = x
    this.y = y
    this.sprites = sprites
    this.walkable = sprites.every((sprite) => sprite.walkable !== false)
  }
}
