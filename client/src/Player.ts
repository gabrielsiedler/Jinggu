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

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  move = (direction: Direction) => {
    if (this.walking) return

    switch (direction) {
      case Direction.Up:
        if (this.y === 0) return

        this.y = this.y - 32
        this.sprite = sprites[3485]

        break
      case Direction.Down:
        if (this.y === WINDOW_HEIGHT - 32) return

        this.y = this.y + 32
        this.sprite = sprites[3482]

        break
      case Direction.Left:
        if (this.x === 0) return

        this.x = this.x - 32
        this.sprite = sprites[3491]
        break
      case Direction.Right:
        if (this.x === WINDOW_WIDTH - 32) return

        this.x = this.x + 32
        this.sprite = sprites[3488]
        break
    }
    this.walking = true

    setTimeout(() => (this.walking = false), 250)
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
}
