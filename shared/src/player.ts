import { Point } from './types.js'

export interface PlayerFromServer {
  id: number
  pos: Point
  x: number
  y: number
  spriteBase: string
  level: number
  health: number
  name: string
  facing: string
  alive: boolean
}
