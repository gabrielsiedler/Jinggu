import { Server, Socket } from 'socket.io'

import { map, memory, registry } from './core.js'
import { Player } from './lib/Player.js'

const onPlayerMove = (socket: Socket, io: Server, direction: any) => {
  const { player } = socket.data

  if (player.move(direction)) {
    io.emit('player-moved', player.id, direction)
  } else {
    io.emit('player-faced', player.id, direction)
    socket.emit('status', "You can't walk there.")
  }
}
const onMessage = (socket: Socket, io: Server, message: string) => {
  const { player } = socket.data

  io.emit('message', player.id, message)
}

const onConnection = (socket: Socket) => {
  console.log(`* Connected:`, socket.id)
  const myself = new Player(socket.id)

  socket.data.player = myself
  memory.connected(myself)

  socket.broadcast.emit('player-connected', myself)
}

const sendInitialData = (socket: Socket) => {
  const player = socket.data.player

  socket.emit('initial-data', {
    player,
    map,
    sprites: registry,
    entities: memory.listOtherPlayers(player.id),
  })
}

const onDisconection = (reason: string, socket: Socket) => {
  console.log(`* Disconnected: ${socket.id} ${reason}`)

  memory.disconnected(socket.data.player.id)

  socket.broadcast.emit('player-disconnected', socket.data.player)
}

export const setupCommunication = (io: Server) => {
  io.on('connection', (socket) => {
    onConnection(socket)
    sendInitialData(socket)

    socket.on('move', (direction: any) => onPlayerMove(socket, io, direction))
    socket.on('message', (message: string) => onMessage(socket, io, message))
    socket.on('disconnect', (reason) => onDisconection(reason, socket))
  })
}
