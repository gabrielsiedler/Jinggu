import { Direction } from '@jinggu/shared'
import { map } from '../core.js'

export { Direction }

const possibleSkins = ['creature_man1', 'creature_woman1']
const possibleNames = ['Allan Dryst', 'Aurea Lee', 'Mephistophelian', 'Lady Florzinha', 'Pademo', 'Dark Chacal']

export class Player {
  id: string
  x: number
  y: number
  walking: boolean = false
  spriteBase: string
  level: number
  speed: number
  health: number
  name: string
  facing: Direction = Direction.Down
  alive: boolean = true
  lastAttackTime: number = 0

  constructor(id: string) {
    this.id = id
    this.x = 13
    this.y = 13
    this.spriteBase = possibleSkins[Math.floor(Math.random() * possibleSkins.length)]
    this.level = 150
    this.speed = Math.max(800 - this.level * 5, 200)
    this.health = Math.floor(Math.random() * 100 + 1)
    this.name = `Player ${Math.floor(Math.random() * (10000 - 1000) + 1000)}`
    // this.name = possibleNames[Math.floor(Math.random() * possibleNames.length)]
  }

  move = (direction: Direction) => {
    this.facing = direction

    if (this.walking) return

    let destinationTilePos!: [number, number]

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
      !destinationTilePos || //TODO: check why this is necessary
      destinationTilePos[0] < 0 ||
      destinationTilePos[1] < 0 ||
      destinationTilePos[0] >= map.width ||
      destinationTilePos[1] >= map.height
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

  getAttackZone = (): [number, number][] => {
    const { x, y } = this
    switch (this.facing) {
      case Direction.Right:
        return [[x + 1, y - 1], [x + 1, y], [x + 1, y + 1]]
      case Direction.Left:
        return [[x - 1, y - 1], [x - 1, y], [x - 1, y + 1]]
      case Direction.Down:
        return [[x - 1, y + 1], [x, y + 1], [x + 1, y + 1]]
      case Direction.Up:
        return [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1]]
    }
  }

  toJSON = () => {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      walking: this.walking,
      spriteBase: this.spriteBase,
      level: this.level,
      speed: this.speed,
      health: this.health,
      name: this.name,
      facing: this.facing,
      alive: this.alive,
    }
  }

}
