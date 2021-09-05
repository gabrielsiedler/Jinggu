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

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  move = (direction: Direction) => {
    if (this.walking) return

    switch (direction) {
      case Direction.Up:
        this.y = this.y - 32
        break
      case Direction.Down:
        this.y = this.y + 32
        break
      case Direction.Left:
        this.x = this.x - 32
        break
      case Direction.Right:
        this.x = this.x + 32
        break
    }
    this.walking = true

    setTimeout(() => (this.walking = false), 300)
  }
}
