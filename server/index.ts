import { Server } from 'socket.io'
import { gameMap } from './src/map'

const io = new Server(3008, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log('sockets?', io.sockets.sockets)
  console.log(`(${io.sockets.sockets.size}) Connected:`, socket.conn.id)

  socket.on('getMap', () => {
    socket.emit('getMap', gameMap)
  })

  socket.on('disconnect', (reason) => {
    console.log(`(${io.sockets.sockets.size}) Disconnected: ${socket.conn.id} ${reason}`)
  })
})

console.log('server on at 3008')
