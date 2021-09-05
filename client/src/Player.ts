import { sprites } from '.'

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
  sprite = sprites[3482]

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  move = (direction: Direction) => {
    if (this.walking) return

    switch (direction) {
      case Direction.Up:
        this.y = this.y - 32
        this.sprite = sprites[3485]
        break
      case Direction.Down:
        this.y = this.y + 32
        this.sprite = sprites[3482]
        break
      case Direction.Left:
        this.x = this.x - 32
        this.sprite = sprites[3491]
        break
      case Direction.Right:
        this.x = this.x + 32
        this.sprite = sprites[3488]
        break
    }
    this.walking = true

    setTimeout(() => (this.walking = false), 250)
  }
}
