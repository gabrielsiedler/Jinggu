import { Canvas } from './Canvas'
import { FRAME } from './constants'
import { draw } from './draw'
import { GameMap } from './GameMap'
import { inputsSetup } from './input'
import { Direction, Player, PlayerFromServer } from './Player'
import { loadSprites } from './sprites'
import { sleep } from './utils'

export class Core {
  canvas!: Canvas
  player!: Player
  gameMap: GameMap = [[]] as any
  spriteLibrary: any
  entities: any = []

  prepare = async (myPlayer: PlayerFromServer, map: any, sprites: any, serverEntities: any[]) => {
    this.canvas = new Canvas()

    this.entities = serverEntities.map((entity) => new Player(entity))

    this.spriteLibrary = await loadSprites(sprites)

    this.player = new Player(myPlayer)
    this.gameMap = new GameMap(map.tiles)

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

  startEngine = async (myPlayer: PlayerFromServer, map: any, sprites: any, serverEntities: any[]) => {
    await this.prepare(myPlayer, map, sprites, serverEntities)

    this.gameLoop()
  }

  addEntity = (entity: PlayerFromServer) => {
    this.entities.push(new Player(entity))
  }

  removeEntity = (entity: PlayerFromServer) => {
    this.entities = this.entities.filter((e: any) => e.id !== entity.id)
  }
  moveEntity = (playerId: any, direction: any) => {
    let entity

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
}
