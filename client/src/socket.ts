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

socket.on('initialize', function (payload) {
  console.log(payload)
  socket.emit('fromClient', { hello: 'world from client' })
})

socket.on('initialData', ({ myself, map, entities }) => {
  startEngine(myself, map, entities)
})

socket.on('playerConnected', (player) => {
  addEntity(player)
})

socket.on('playerDisconnected', (player) => {
  removeEntity(player)
})

socket.on('playerMoved', (playerId: any, direction: any) => {
  console.log('received playerMoved', playerId, direction)
  entityMoved(playerId, direction)
})

export const emitMove = (direction: Direction) => {
  console.log('emitting playerMove')
  socket.emit('playerMove', direction)
}
