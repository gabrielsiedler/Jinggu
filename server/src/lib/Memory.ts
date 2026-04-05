import { Player } from './Player.js'

export class Memory {
  players: Player[]

  constructor() {
    this.players = []
  }

  connected = (player: Player) => {
    this.players.push(player)
  }

  disconnected = (disconnectedPlayerId: string) => {
    this.players = this.players.filter((e: any) => e.id !== disconnectedPlayerId)
  }

  listOtherPlayers = (myPlayerId: string) => {
    return this.players.filter((e: any) => e.id !== myPlayerId)
  }

  getPlayersAtPositions = (positions: [number, number][], excludeId: string): Player[] => {
    return this.players.filter(
      (p) => p.alive && p.id !== excludeId && positions.some(([px, py]) => p.x === px && p.y === py),
    )
  }
}
