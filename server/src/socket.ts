import { Server, Socket } from 'socket.io'

import { map, memory } from './core'
import sprites from './data/sprites.json'
import { Player } from './lib/Player'

const handShake = (io: Server, socket: Socket) => {
  const myself = new Player(socket.conn.id)
  socket.data.player = myself
  memory.players.push(myself)

  console.log(`* Connected:`, socket.conn.id)
  socket.broadcast.emit('playerConnected', myself)

  socket.emit('initialData', {
    myself,
    map,
    sprites,
    entities: memory.players.filter((e: any) => e.id !== myself.id),
  })

  socket.on('playerMove', (direction: any) => {
    console.log('player moved', myself.id, direction)
    switch (direction) {
      case 'up':
        myself.y -= 1
        break
      case 'down':
        myself.y += 1
        break
      case 'left':
        myself.x -= 1
        break
      case 'right':
        myself.x += 1
        break
    }

    io.emit('playerMoved', myself.id, direction)
  })
}
const onDisconection = (reason: string, socket: Socket) => {
  socket.broadcast.emit('playerDisconnected', socket.data.player)
  memory.players = memory.players.filter((e: any) => e.id !== socket.data.player.id)
  console.log(`* Disconnected: ${socket.conn.id} ${reason}`)
}

export const setupCommunication = (io: Server) => {
  io.on('connection', (socket) => {
    handShake(io, socket)

    socket.on('disconnect', (reason) => onDisconection(reason, socket))
  })
}
