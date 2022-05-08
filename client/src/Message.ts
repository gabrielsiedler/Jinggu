import { TILE_SIZE } from './constants'
import { Player } from './player/Player'
import { Point } from './types.i'

export class Message {
  id: number
  time: string
  position: Point
  player: Player
  message: string

  constructor(player: Player, message: string) {
    this.id = Math.floor(Date.now() * Math.random())

    const now = new Date()
    const asTime = now.toLocaleTimeString('en-US', { hour12: false })

    this.time = asTime
    this.position = {
      x: player.tile.x * TILE_SIZE + player.offset.x,
      y: player.tile.y * TILE_SIZE + player.offset.y,
    }
    this.player = player
    this.message = message
  }
}
