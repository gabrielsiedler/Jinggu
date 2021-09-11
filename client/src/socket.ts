import { io } from 'socket.io-client'

import { addEntity, entityMoved, removeEntity, startEngine } from '.'
import { Direction } from './Player'

const socket = io('http://localhost:3008')

socket.on('error', (error) => {
  console.error(error)
})

socket.on('connect', () => {
  console.log('connected', socket.id)
  socket.emit('getInitial')
})

socket.on('initial-data', ({ player, map, sprites, entities }) => {
  startEngine(player, map, sprites, entities)
})

socket.on('player-connected', (player) => {
  addEntity(player)
})

socket.on('player-disconnected', (player) => {
  removeEntity(player)
})

socket.on('player-moved', (playerId: any, direction: any) => {
  console.log('received player-moved', playerId, direction)
  entityMoved(playerId, direction)
})

export const emitMove = (direction: Direction) => {
  console.log('emitting playerMove')
  socket.emit('move', direction)
}
