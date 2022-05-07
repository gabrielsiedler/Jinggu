import { Server, Socket } from 'socket.io'

import { map, memory } from './core'
import sprites from './data/sprites.json'
import { Player } from './lib/Player'

const onPlayerMove = (socket: Socket, io: Server, direction: any) => {
  const { player } = socket.data

  if (player.move(direction)) {
    io.emit('player-moved', player.id, direction)
  } else {
    socket.emit('status', "You can't walk there.")
  }
}

const onConnection = (socket: Socket) => {
  console.log(`* Connected:`, socket.conn.id)
  const myself = new Player(socket.conn.id)

  socket.data.player = myself
  memory.connected(myself)

  socket.broadcast.emit('player-connected', myself)
}

const sendInitialData = (socket: Socket) => {
  const player = socket.data.player

  socket.emit('initial-data', {
    player,
    map,
    sprites,
    entities: memory.listOtherPlayers(player.id),
  })
}

const onDisconection = (reason: string, socket: Socket) => {
  console.log(`* Disconnected: ${socket.conn.id} ${reason}`)

  memory.disconnected(socket.data.player.id)

  socket.broadcast.emit('player-disconnected', socket.data.player)
}

export const setupCommunication = (io: Server) => {
  io.on('connection', (socket) => {
    onConnection(socket)
    sendInitialData(socket)

    socket.on('move', (direction: any) => onPlayerMove(socket, io, direction))
    socket.on('disconnect', (reason) => onDisconection(reason, socket))
  })
}
