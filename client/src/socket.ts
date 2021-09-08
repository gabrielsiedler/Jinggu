import { io } from 'socket.io-client'

import { startEngine } from '.'

const socket = io('http://localhost:3008')

socket.on('error', (error) => {
  console.error(error)
})

socket.on('connect', () => {
  console.log('connected', socket.id)
  socket.emit('getMap')
})

socket.on('initialize', function (payload) {
  console.log(payload)
  socket.emit('fromClient', { hello: 'world from client' })
})

socket.on('getMap', (map) => {
  startEngine(map)
})

socket.on('fromApi', function (payload) {
  console.log(payload)
})
