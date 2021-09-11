import { Player } from './Player'

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
}
