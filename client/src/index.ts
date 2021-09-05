import { drawBackground, drawPlayer } from './draw'
import { checkKeyPress } from './input'
import { Player } from './Player'
import { loadSprites } from './sprites'

export const WINDOW_WIDTH = 1280
export const WINDOW_HEIGHT = 640

export let canvas = document.createElement('canvas')
export let context: any
export let sprites: any
export let player: Player

const setup = async () => {
  canvas.width = WINDOW_WIDTH
  canvas.height = WINDOW_HEIGHT
  context = canvas.getContext('2d')
  document.body.insertBefore(canvas, document.body.childNodes[0])

  sprites = await loadSprites()

  player = new Player(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2)

  window.addEventListener('keydown', checkKeyPress, false)
}

const loop = async () => {
  drawBackground()

  drawPlayer(player.x, player.y)
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let FRAME = 100

const theLoop = async () => {
  loop()

  await sleep(FRAME)
  window.requestAnimationFrame(theLoop)
}

;(async () => {
  await setup()

  theLoop()
  window.requestAnimationFrame(theLoop)
})()
