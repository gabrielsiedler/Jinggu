import { map } from '../core'

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

const possibleSkins = [3398, 3410, 3422, 3434, 3446, 3458, 3470, 3482, 3494]

export class Player {
  id: string
  x: number
  y: number
  walking: boolean = false
  spriteBase: number
  level: number
  speed: number

  constructor(id: string) {
    this.id = id
    this.x = 0
    this.y = 0
    this.spriteBase = possibleSkins[Math.floor(Math.random() * possibleSkins.length)]
    this.level = 150
    this.speed = Math.max(800 - this.level * 5, 200)
  }

  move = (direction: Direction) => {
    if (this.walking) return

    let destinationTilePos

    switch (direction) {
      case Direction.Up:
        destinationTilePos = [this.x, this.y - 1]
        break
      case Direction.Down:
        destinationTilePos = [this.x, this.y + 1]
        break
      case Direction.Left:
        destinationTilePos = [this.x - 1, this.y]
        break
      case Direction.Right:
        destinationTilePos = [this.x + 1, this.y]
        break
    }

    const destinationTile = map.tiles[destinationTilePos[1]][destinationTilePos[0]]

    if (!destinationTile.walkable) return

    this.walking = true

    // emit player move

    setTimeout(() => (this.walking = false), this.speed)
  }

  dance = (direction: Direction) => {
    if (this.walking) return

    // emit player dance
  }
}
