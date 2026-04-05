import { Canvas } from './Canvas'
import { FRAME } from './constants'
import { draw } from './draw'
import { GameMap } from './GameMap'
import { inputsSetup } from './input'
import { MessageQueue } from './MessageQueue'
import { Player } from './player/Player'
import { Direction, PlayerFromServer } from './player/player.i'
import { messageQueue } from './socket'
import { loadSprites } from './sprites'
import { sleep } from './utils'

export class Core {
  canvas!: Canvas
  virtualCanvas!: Canvas
  player!: Player
  gameMap: GameMap = [[]] as any
  spriteLibrary: any
  entities: any = []
  attackOverlays: { tiles: [number, number][]; createdAt: number }[] = []
  combatEffects: { x: number; y: number; text: string; color: string; createdAt: number }[] = []
  corpses: { x: number; y: number; sprite: string }[] = []

  prepare = async (myPlayer: PlayerFromServer, map: any, sprites: any, serverEntities: any[], corpses?: any[]) => {
    this.canvas = new Canvas()

    this.entities = serverEntities.map((entity) => new Player(entity))

    this.spriteLibrary = await loadSprites(sprites)

    this.player = new Player(myPlayer)
    this.gameMap = new GameMap(map.tiles)
    this.corpses = corpses || []

    inputsSetup()
  }

  drawLoop = () => {
    draw()
  }

  gameLoop = async () => {
    this.drawLoop()

    await sleep(FRAME)

    window.requestAnimationFrame(this.gameLoop)
  }

  startEngine = async (myPlayer: PlayerFromServer, map: any, sprites: any, serverEntities: any[], corpses?: any[]) => {
    await this.prepare(myPlayer, map, sprites, serverEntities, corpses)

    this.gameLoop()
  }

  addEntity = (entity: PlayerFromServer) => {
    this.entities.push(new Player(entity))
  }

  removeEntity = (entity: PlayerFromServer) => {
    this.entities = this.entities.filter((e: any) => e.id !== entity.id)
  }

  moveEntity = (playerId: any, direction: any) => {
    let entity: Player

    if (this.player.id === playerId) entity = this.player
    else entity = this.entities.find((e: any) => e.id === playerId)

    let d
    switch (direction) {
      case 'up':
        d = Direction.Up
        break
      case 'down':
        d = Direction.Down
        break
      case 'left':
        d = Direction.Left
        break
      case 'right':
        d = Direction.Right
        break
    }

    entity.move(d as Direction)
  }

  faceEntity = (playerId: any, direction: any) => {
    let entity: Player

    if (this.player.id === playerId) entity = this.player
    else entity = this.entities.find((e: any) => e.id === playerId)

    let d
    switch (direction) {
      case 'up':
        d = Direction.Up
        break
      case 'down':
        d = Direction.Down
        break
      case 'left':
        d = Direction.Left
        break
      case 'right':
        d = Direction.Right
        break
    }

    entity.face(d as Direction)
  }

  handleMessage = (playerId: any, message: string) => {
    let entity: Player

    if (this.player.id === playerId) entity = this.player
    else entity = this.entities.find((e: any) => e.id === playerId)

    messageQueue.addMessage(entity, message)
  }

  handleAttack = (data: any) => {
    // Store attack zone overlay for rendering
    this.attackOverlays.push({
      tiles: data.zone,
      createdAt: Date.now(),
    })

    // Process each result
    for (const result of data.results) {
      // Find target player
      let target: Player | undefined
      if (this.player.id === result.targetId) {
        target = this.player
      } else {
        target = this.entities.find((e: any) => e.id === result.targetId)
      }

      if (target) {
        // Update health
        target.health = result.remainingHealth

        // Create combat effect
        let text: string
        let color: string
        if (result.outcome === 'hit') {
          text = `-${result.damage}`
          color = '#FF0000'
        } else if (result.outcome === 'blocked') {
          text = 'Blocked'
          color = '#4488FF'
        } else {
          text = 'Miss'
          color = '#999999'
        }

        this.combatEffects.push({
          x: target.tile.x,
          y: target.tile.y,
          text,
          color,
          createdAt: Date.now(),
        })
      }
    }
  }

  handleDeath = (data: any) => {
    // Add corpse for rendering
    this.corpses.push({
      x: data.x,
      y: data.y,
      sprite: data.corpseSprite,
    })

    // Mark player as dead
    if (this.player.id === data.playerId) {
      this.player.alive = false
    } else {
      const entity = this.entities.find((e: any) => e.id === data.playerId)
      if (entity) {
        entity.alive = false
      }
    }
  }
}
