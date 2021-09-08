import { Server } from 'socket.io'
import { gameMap } from './src/map'

const io = new Server(3008, {
  cors: {
    origin: '*',
  },
})

const possibleSkins = [3398, 3410, 3422, 3434, 3446, 3458, 3470, 3482, 3494]

const generatePlayer = (id: string) => ({
  id: id,
  x: 0,
  y: 0,
  spriteBase: possibleSkins[Math.floor(Math.random() * possibleSkins.length)],
  level: 150,
})

let entities: any = []

io.on('connection', (socket) => {
  const myself = generatePlayer(socket.conn.id)
  entities.push(myself)
  console.log(`(${io.sockets.sockets.size}) Connected:`, socket.conn.id)
  socket.broadcast.emit('playerConnected', myself)

  console.log(entities.map((entity) => entity.id))

  socket.on('getInitial', () => {
    socket.emit('initialData', { myself, map: gameMap, entities: entities.filter((e) => e.id !== myself.id) })
  })

  socket.on('playerMove', (direction) => {
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

  socket.on('disconnect', (reason) => {
    socket.broadcast.emit('playerDisconnected', myself)
    entities = entities.filter((e) => e.id !== myself.id)
    console.log(`(${io.sockets.sockets.size}) Disconnected: ${socket.conn.id} ${reason}`)
  })
})

console.log('server on at 3008')
