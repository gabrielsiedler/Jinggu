import { loadSprites } from './sprites'

const WINDOW_WIDTH = 1280
const WINDOW_HEIGHT = 640

const run = async () => {
  let canvas = document.createElement('canvas')
  let context: any
  let sprites: any

  const drawBackground = () => {
    for (let i = 0; i < WINDOW_WIDTH; i += 32) {
      for (let j = 0; j < WINDOW_HEIGHT; j += 32) {
        context.drawImage(sprites[0], i, j)
      }
    }
  }

  let pos = 32
  const drawMephis = (pos: number) => {
    let sprite = sprites[1]

    if (pos === 64) {
      sprite = sprites[2]
    }
    const center = [WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2]
    context.drawImage(sprite, center[0], center[1] + pos)
  }

  const Jinggu = {
    start: async () => {
      canvas.width = WINDOW_WIDTH
      canvas.height = WINDOW_HEIGHT
      context = canvas.getContext('2d')
      document.body.insertBefore(canvas, document.body.childNodes[0])

      sprites = await loadSprites()

      drawBackground()
    },
    loop: () => {
      drawBackground()
      drawMephis(pos)

      pos = pos === 32 ? 64 : 32
    },
  }

  await Jinggu.start()

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  let i = 0
  while (i < 500) {
    Jinggu.loop()

    await sleep(500)
    i += 1
  }
}

run()
