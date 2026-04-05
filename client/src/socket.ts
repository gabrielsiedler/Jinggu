import { io } from 'socket.io-client'

import { Core } from './Core'
import { MessageQueue } from './MessageQueue'
import { Direction } from './player/player.i'
import { StatusMessage } from './StatusMessage'

if (!import.meta.env.SERVER_URL) {
  throw new Error('SERVER_URL environment variable is not defined. Create a .env file with SERVER_URL=<url>')
}

const socket = io(import.meta.env.SERVER_URL)

export let core: Core
export const status = new StatusMessage()
export const messageQueue = new MessageQueue()

socket.on('error', (error) => {
  console.error(error)
})

socket.on('connect', () => {
  core = new Core()
})

socket.on('disconnect', () => {
  core.canvas.clear()
})

socket.on('initial-data', ({ player, map, sprites, entities, corpses }) => {
  core.startEngine(player, map, sprites, entities, corpses)
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

socket.on('player-faced', (playerId: any, direction: any) => {
  core.faceEntity(playerId, direction)
})

socket.on('status', (message: any) => {
  status.setMessage(message)
})

socket.on('message', (playerId: any, message: string) => {
  core.handleMessage(playerId, message)
})

socket.on('player-attacked', (data: any) => {
  core.handleAttack(data)
})

socket.on('player-died', (data: any) => {
  core.handleDeath(data)
})

export const emitMove = (direction: Direction) => {
  socket.emit('move', direction)
}

export const emitMessage = (message: string) => {
  socket.emit('message', message)
}

export const emitAttack = () => {
  socket.emit('attack')
}
