import { emitDance } from '../socket'
import { Point } from '../types.i'
import { Direction, PlayerFromServer } from './player.i'

// const possibleSkins = ['creature_man1', 'creature_woman1', 'creature_rat', 'creature_bigrat']
const possibleSkins = ['creature_man1', 'creature_woman1']

export class Player {
  id: number
  offset: Point
  tile: Point
  health: number
  walking: boolean = false
  dancing: boolean = false
  spriteBase = possibleSkins[Math.floor(Math.random() * possibleSkins.length)]
  sprite = `${this.spriteBase}_down_standing`
  level: number = 150
  speed = Math.max(800 - this.level * 5, 200)
  name: string

  constructor(player: PlayerFromServer) {
    const { id, x, y, spriteBase, level, health, name } = player
    this.id = id
    this.offset = {
      x: 0,
      y: 0,
    }
    this.tile = {
      x,
      y,
    }

    this.spriteBase = spriteBase
    this.sprite = `${spriteBase}_down_standing`
    this.level = level
    this.speed = Math.max(800 - level * 5, 200)
    this.health = health
    this.name = name
  }

  move = (direction: Direction) => {
    switch (direction) {
      case Direction.Up:
        this.animateWalk('y', -1, `${this.spriteBase}_up`)

        break
      case Direction.Down:
        this.animateWalk('y', 1, `${this.spriteBase}_down`)

        break
      case Direction.Left:
        this.animateWalk('x', -1, `${this.spriteBase}_left`)

        break
      case Direction.Right:
        this.animateWalk('x', 1, `${this.spriteBase}_right`)

        break
    }
  }

  dance = (direction: Direction) => {
    if (this.walking || this.dancing) return

    switch (direction) {
      case Direction.Up:
        this.sprite = `${this.spriteBase}_up_standing`
        break
      case Direction.Down:
        this.sprite = `${this.spriteBase}_down_standing`
        break
      case Direction.Left:
        this.sprite = `${this.spriteBase}_left_standing`
        break
      case Direction.Right:
        this.sprite = `${this.spriteBase}_right_standing`
        break
    }
    this.dancing = true

    setTimeout(() => (this.dancing = false), 50)
  }

  animateWalk = (property: 'x' | 'y', signal: -1 | 1, movementSpriteBase: string) => {
    const tick = 32 / 16

    const spr = [`${movementSpriteBase}_walking1`, `${movementSpriteBase}_walking2`]
    let sprI = 0

    this.walking = true

    let tickRuns = 0

    const runMove = () => {
      this.offset[property] = (this.offset[property] + tick * signal) % 32

      if (tickRuns % 2 === 0) {
        if (sprI === spr.length) {
          sprI = 0
        }

        this.sprite = spr[sprI]
        sprI += 1
      }

      tickRuns += 1
      if (tickRuns < 16) {
        setTimeout(runMove, this.speed / 16)

        return
      }

      this.sprite = `${movementSpriteBase}_standing`
      this.walking = false
      this.tile[property] += signal * 1
    }

    setTimeout(runMove, this.speed / 16)
  }
}
