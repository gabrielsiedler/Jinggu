import { Server, Socket } from 'socket.io'

import { map, memory, registry, corpses } from './core.js'
import { Player } from './lib/Player.js'

const onPlayerMove = (socket: Socket, io: Server, direction: any) => {
  const { player } = socket.data

  if (!player.alive) return

  if (player.move(direction)) {
    io.emit('player-moved', player.id, direction)
  } else {
    io.emit('player-faced', player.id, direction)
    socket.emit('status', "You can't walk there.")
  }
}
const onMessage = (socket: Socket, io: Server, message: string) => {
  const { player } = socket.data

  if (!player.alive) return

  io.emit('message', player.id, message)
}

const onPlayerAttack = (socket: Socket, io: Server) => {
  const { player } = socket.data

  // Validation
  if (!player.alive) return
  if (player.walking) return
  if (Date.now() - player.lastAttackTime < 1000) return

  // Set cooldown
  player.lastAttackTime = Date.now()

  // Compute attack zone
  const zone = player.getAttackZone()

  // Filter to valid map bounds
  const validZone = zone.filter(([x, y]: [number, number]) => x >= 0 && y >= 0 && x < map.width && y < map.height)

  // Find targets
  const targets = memory.getPlayersAtPositions(validZone, player.id)

  // Resolve combat for each target
  const results = targets.map((target: any) => {
    const r = Math.random()
    let outcome: 'hit' | 'blocked' | 'miss'
    let damage = 0

    if (r < 0.60) {
      outcome = 'hit'
      damage = Math.floor(Math.random() * 16) + 3
      target.health = Math.max(target.health - damage, 0)
    } else if (r < 0.85) {
      outcome = 'blocked'
    } else {
      outcome = 'miss'
    }

    return {
      targetId: target.id,
      outcome,
      damage,
      remainingHealth: target.health,
    }
  })

  // Broadcast attack results
  io.emit('player-attacked', {
    attackerId: player.id,
    zone: validZone,
    results,
  })

  console.log('* Attack:', player.id, '-> zone', validZone, '->', results.length, 'targets')

  // Process deaths
  for (const result of results) {
    if (result.outcome === 'hit' && result.remainingHealth <= 0) {
      const target = memory.players.find((p: any) => p.id === result.targetId)
      if (target) {
        target.alive = false

        const corpse = { x: target.x, y: target.y, sprite: 'overlay-deadhuman-1' }
        corpses.push(corpse)

        io.emit('player-died', {
          playerId: target.id,
          x: target.x,
          y: target.y,
          corpseSprite: 'overlay-deadhuman-1',
        })

        console.log('* Death:', target.id, 'killed by', player.id)
      }
    }
  }
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
    corpses,
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
    socket.on('attack', () => onPlayerAttack(socket, io))
    socket.on('disconnect', (reason) => onDisconection(reason, socket))
  })
}
