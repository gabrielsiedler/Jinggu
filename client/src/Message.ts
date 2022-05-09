import { Player } from './player/Player'
import { Point } from './types.i'

export class Message {
  id: number
  time: string
  position: Point
  player: Player
  messages: string[]

  constructor(player: Player, message: string, offsetY: number) {
    this.id = Math.floor(Date.now() * Math.random())

    const now = new Date()
    const asTime = now.toLocaleTimeString('en-US', { hour12: false })

    this.time = asTime
    this.position = {
      x: player.tile.x + player.offset.x / 32,
      y: player.tile.y + player.offset.y / 32 + offsetY,
    }
    this.player = player

    this.messages = [`${player.name} says:`, ...message.match(/.{1,25}/g)!]
  }
}
