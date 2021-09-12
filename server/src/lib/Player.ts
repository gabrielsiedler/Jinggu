import { map, VIEW_HEIGHT, VIEW_WIDTH } from '../core'

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

const possibleSkins = [3398, 3410, 3422, 3434, 3446, 3458, 3470, 3482, 3494]

const makeid = (length: number) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export class Player {
  id: string
  x: number
  y: number
  walking: boolean = false
  spriteBase: number
  level: number
  speed: number
  health: number
  name: string

  constructor(id: string) {
    this.id = id
    this.x = 0
    this.y = 0
    this.spriteBase = possibleSkins[Math.floor(Math.random() * possibleSkins.length)]
    this.level = 150
    this.speed = Math.max(800 - this.level * 5, 200)
    this.health = Math.floor(Math.random() * 100 + 1)
    const nameLength = Math.floor(Math.random() * 10 + 3)
    this.name = makeid(nameLength)
  }

  move = (direction: Direction) => {
    if (this.walking) return

    let destinationTilePos: [number, number]

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

    if (
      destinationTilePos[0] < 0 ||
      destinationTilePos[1] < 0 ||
      destinationTilePos[0] >= VIEW_WIDTH ||
      destinationTilePos[1] >= VIEW_HEIGHT
    )
      return false

    const destinationTile = map.tiles[destinationTilePos[1]][destinationTilePos[0]]
    if (!destinationTile.walkable) return false

    this.walking = true

    setTimeout(() => {
      this.walking = false
      this.x = destinationTilePos[0]
      this.y = destinationTilePos[1]
    }, this.speed)

    return true
  }

  dance = (direction: Direction) => {
    if (this.walking) return

    // emit player dance
  }
}
