export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export interface Point {
  x: number
  y: number
}

export interface PlayerFromServer {
  id: number
  pos: Point
  x: number
  y: number
  spriteBase: number
  level: number
  health: number
  name: string
}
