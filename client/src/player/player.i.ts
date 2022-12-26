import { Point } from '../types.i'

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export interface PlayerFromServer {
  id: number
  pos: Point
  x: number
  y: number
  spriteBase: string
  level: number
  health: number
  name: string
}
