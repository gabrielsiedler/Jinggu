import { gameMap, WINDOW_HEIGHT, WINDOW_WIDTH } from '.'
import { emitMove } from './socket'

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

const possibleSkins = [3398, 3410, 3422, 3434, 3446, 3458, 3470, 3482, 3494]

export interface PlayerFromServer {
  id: number
  x: number
  y: number
  spriteBase: number
  level: number
}
export class Player {
  id: number
  x: number
  y: number
  walking: boolean = false
  dancing: boolean = false
  // traveling: boolean = false
  // travelDestination = {
  //   x: 0,
  //   y: 0,
  // }
  spriteBase = possibleSkins[Math.floor(Math.random() * possibleSkins.length)]
  sprite = this.spriteBase
  level: number = 150
  speed = Math.max(800 - this.level * 5, 200)

  constructor(player: PlayerFromServer) {
    console.log('received', player)
    const { id, x, y, spriteBase, level } = player
    this.id = id
    this.x = x
    this.y = y
    this.spriteBase = spriteBase
    this.sprite = spriteBase
    this.level = level
    this.speed = Math.max(800 - level * 5, 200)
  }

  move = (direction: Direction) => {
    switch (direction) {
      case Direction.Up:
        if (this.y === 0) return

        this.animateWalk('y', -1, this.spriteBase + 3)

        break
      case Direction.Down:
        if (this.y === WINDOW_HEIGHT - 32) return

        this.animateWalk('y', 1, this.spriteBase)

        break
      case Direction.Left:
        if (this.x === 0) return

        this.animateWalk('x', -1, this.spriteBase + 9)
        break
      case Direction.Right:
        if (this.x === WINDOW_WIDTH - 32) return

        this.animateWalk('x', 1, this.spriteBase + 6)
        break
    }
  }

  dance = (direction: Direction) => {
    if (this.walking || this.dancing) return

    switch (direction) {
      case Direction.Up:
        this.sprite = this.spriteBase + 3
        break
      case Direction.Down:
        this.sprite = this.spriteBase
        break
      case Direction.Left:
        this.sprite = this.spriteBase + 9
        break
      case Direction.Right:
        this.sprite = this.spriteBase + 6
        break
    }
    this.dancing = true

    setTimeout(() => (this.dancing = false), 50)
  }

  animateWalk = (property: 'x' | 'y', signal: -1 | 1, movementSpriteBase: number) => {
    const tick = 32 / 8

    const spr = [movementSpriteBase + 1, movementSpriteBase + 2]
    let sprI = 0

    this.walking = true
    console.log('changing property', property, 'to', this[property] + 32 * signal)

    // this[property] = this[property] + 32 * signal
    // this.walking = false

    let tickRuns = 0
    const runMove = () => {
      this[property] = this[property] + tick * signal

      if (sprI === spr.length) {
        sprI = 0
      }

      this.sprite = spr[sprI]
      sprI += 1

      tickRuns += 1
      if (tickRuns < 8) {
        setTimeout(runMove, this.speed / 8)

        return
      }

      this.sprite = movementSpriteBase
      this.walking = false
    }

    setTimeout(runMove, this.speed / 8)
  }

  // setTravelDestination = (x: number, y: number) => {
  //   this.travelDestination = { x, y }
  // }

  // travel = () => {
  //   const distanceToTarget = getGridDistance(this.travelDestination.x, this.travelDestination.y, this.x, this.y)
  //   if (distanceToTarget.x === 0 && distanceToTarget.y === 0) {
  //     this.traveling = false
  //     return
  //   } else if (distanceToTarget.x > 0) {
  //     this.move(Direction.Right)
  //   } else if (distanceToTarget.x < 0) {
  //     this.move(Direction.Left)
  //   } else if (distanceToTarget.y > 0) {
  //     this.move(Direction.Down)
  //   } else if (distanceToTarget.y < 0) {
  //     this.move(Direction.Up)
  //   }
  //   return
  // }
}
