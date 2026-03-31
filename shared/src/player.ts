import { Point } from './types'

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
