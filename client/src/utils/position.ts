import { Player } from '../player/Player'
import { Point } from '../types.i'

export const getRelativePlayerPosition = (myself: Player, otherPlayer: Player): Point => ({
  x: otherPlayer.tile.x + otherPlayer.offset.x / 32 - myself.tile.x - myself.offset.x / 32,
  y: otherPlayer.tile.y + otherPlayer.offset.y / 32 - myself.tile.y - myself.offset.y / 32,
})

export const getRelativePosition = (myself: Player, point: Point): Point => ({
  x: point.x / 32 + myself.tile.x - myself.offset.x / 32,
  y: point.y / 32 - myself.tile.y - myself.offset.y / 32,
})
