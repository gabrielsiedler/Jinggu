import { Server } from 'socket.io'

import { setupCommunication } from './socket'

const PORT = 3008

const io = new Server(PORT, {
  cors: {
    origin: '*',
  },
})

setupCommunication(io)

console.log(`Jinggu© server on at ${PORT}`)
