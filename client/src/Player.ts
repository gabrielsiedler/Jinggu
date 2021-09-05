import { sprites, WINDOW_HEIGHT, WINDOW_WIDTH } from '.'

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
  sprite = sprites[3482]
  level: number = 1
  speed = Math.max(800 - this.level * 5, 200)

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  move = (direction: Direction) => {
    if (this.walking) return

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
    this.walking = true

    setTimeout(() => (this.walking = false), this.speed)
  }

  dance = (direction: Direction) => {
    if (this.walking || this.dancing) return

    switch (direction) {
      case Direction.Up:
        this.sprite = sprites[3485]
        break
      case Direction.Down:
        this.sprite = sprites[3482]
        break
      case Direction.Left:
        this.sprite = sprites[3491]
        break
      case Direction.Right:
        this.sprite = sprites[3488]
        break
    }
    this.dancing = true

    setTimeout(() => (this.dancing = false), 50)
  }

  animateWalk = (property: 'x' | 'y', signal: -1 | 1, spriteBase: number) => {
    const tick = 32 / 8

    const spr = [sprites[spriteBase + 1], sprites[spriteBase + 2]]
    let sprI = 0

    const moveInterval = setInterval(() => (this[property] = this[property] + tick * signal), this.speed / 8)
    const walkInterval = setInterval(() => {
      if (sprI === spr.length) {
        sprI = 0
      }

      this.sprite = spr[sprI]

      sprI += 1
    }, this.speed / 8)

    setTimeout(() => {
      clearInterval(moveInterval)
      clearInterval(walkInterval)

      this.sprite = sprites[spriteBase]
    }, this.speed)
  }
}
