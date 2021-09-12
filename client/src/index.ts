import { drawHealthBars, drawMap, drawPlayers } from './draw'
import { GameMap } from './GameMap'
import { inputsSetup } from './input'
import { Direction, Player, PlayerFromServer } from './Player'
import { loadSprites } from './sprites'

export const WINDOW_WIDTH = 42 * 32
export const WINDOW_HEIGHT = 24 * 32

export let canvas: any
export let context: any
export let player: Player
export let gameMap: GameMap = [[]] as any
export let spriteLibrary: any
export let entities: any = []

export const addEntity = (entity: PlayerFromServer) => {
  console.log(entity.id, 'connected')
  entities.push(new Player(entity))
}

export const removeEntity = (entity: PlayerFromServer) => {
  console.log(entity.id, 'disconnected')
  entities = entities.filter((e: any) => e.id !== entity.id)
}

export const entityMoved = (playerId: any, direction: any) => {
  let entity

  if (player.id === playerId) entity = player
  else entity = entities.find((e: any) => e.id === playerId)

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

var PIXEL_RATIO = (function () {
  var ctx: any = document.createElement('canvas').getContext('2d')!,
    dpr = window.devicePixelRatio || 1,
    bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1

  return dpr / bsr
})()

const createHiDPICanvas = (w: number, h: number, ratio: number = PIXEL_RATIO) => {
  var can = document.createElement('canvas')
  can.width = w * ratio
  can.height = h * ratio
  can.style.width = w + 'px'
  can.style.height = h + 'px'
  can.getContext('2d')!.setTransform(ratio, 0, 0, ratio, 0, 0)
  return can
}

const setup = async (myPlayer: PlayerFromServer, map: any, serverEntities: any[], sprites: any) => {
  canvas = createHiDPICanvas(WINDOW_WIDTH, WINDOW_HEIGHT)
  context = canvas.getContext('2d')
  document.body.insertBefore(canvas, document.body.childNodes[0])

  entities = serverEntities.map((entity) => new Player(entity))

  spriteLibrary = await loadSprites(sprites)

  player = new Player(myPlayer)
  gameMap = new GameMap(map.tiles)

  inputsSetup()
}

const loop = async () => {
  drawMap()
  drawPlayers()
  drawHealthBars()

  // if (player.traveling) {
  //   player.travel()
  // }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let FRAME = 100

const theLoop = async () => {
  loop()

  await sleep(FRAME)
  window.requestAnimationFrame(theLoop)
}

export const startEngine = async (myPlayer: PlayerFromServer, map: any, sprites: any, entities: any[]) => {
  await setup(myPlayer, map, entities, sprites)

  theLoop()
  window.requestAnimationFrame(theLoop)
}
