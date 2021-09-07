import { gameMap, spriteLibrary, WINDOW_HEIGHT, WINDOW_WIDTH } from '.'

import { getGridDistance } from './utils'

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export class Player {
  x: number
  y: number
  walking: boolean = false
  dancing: boolean = false
  // traveling: boolean = false
  // travelDestination = {
  //   x: 0,
  //   y: 0,
  // }
  sprite = spriteLibrary[3482]
  level: number = 150
  speed = Math.max(800 - this.level * 5, 200)

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  move = (direction: Direction) => {
    if (this.walking) return

    let destinationTilePos
    const realX = this.x / 32
    const realY = this.y / 32

    switch (direction) {
      case Direction.Up:
        destinationTilePos = [realX, realY - 1]
        break
      case Direction.Down:
        destinationTilePos = [realX, realY + 1]
        break
      case Direction.Left:
        destinationTilePos = [realX - 1, realY]
        break
      case Direction.Right:
        destinationTilePos = [realX + 1, realY]
        break
    }
    const destinationTile = gameMap.tiles[destinationTilePos[1]][destinationTilePos[0]]

    if (!destinationTile.walkable) return

    this.walking = true

    switch (direction) {
      case Direction.Up:
        if (this.y === 0) return

        this.animateWalk('y', -1, 3485)

        break
      case Direction.Down:
        if (this.y === WINDOW_HEIGHT - 32) return

        this.animateWalk('y', 1, 3482)

        break
      case Direction.Left:
        if (this.x === 0) return

        this.animateWalk('x', -1, 3491)
        break
      case Direction.Right:
        if (this.x === WINDOW_WIDTH - 32) return

        this.animateWalk('x', 1, 3488)
        break
    }
  }

  dance = (direction: Direction) => {
    if (this.walking || this.dancing) return

    switch (direction) {
      case Direction.Up:
        this.sprite = spriteLibrary[3485]
        break
      case Direction.Down:
        this.sprite = spriteLibrary[3482]
        break
      case Direction.Left:
        this.sprite = spriteLibrary[3491]
        break
      case Direction.Right:
        this.sprite = spriteLibrary[3488]
        break
    }
    this.dancing = true

    setTimeout(() => (this.dancing = false), 50)
  }

  animateWalk = (property: 'x' | 'y', signal: -1 | 1, spriteBase: number) => {
    const tick = 32 / 8

    const spr = [spriteLibrary[spriteBase + 1], spriteLibrary[spriteBase + 2]]
    let sprI = 0

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

      this.sprite = spriteLibrary[spriteBase]
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
