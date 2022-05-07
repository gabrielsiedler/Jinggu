import dotenv from 'dotenv'
import { io } from 'socket.io-client'

import { Core } from './Core'
import { Direction } from './player/player.i'

dotenv.config()

const socket = io(process.env.SERVER_URL!)

export let core: Core

socket.on('error', (error) => {
  console.error(error)
})

socket.on('connect', () => {
  core = new Core()
})

socket.on('disconnect', () => {
  core.canvas.clear()
})

socket.on('initial-data', ({ player, map, sprites, entities }) => {
  core.startEngine(player, map, sprites, entities)
})

socket.on('player-connected', (player) => {
  core.addEntity(player)
})

socket.on('player-disconnected', (player) => {
  core.removeEntity(player)
})

socket.on('player-moved', (playerId: any, direction: any) => {
  core.moveEntity(playerId, direction)
})

export const emitMove = (direction: Direction) => {
  socket.emit('move', direction)
}
