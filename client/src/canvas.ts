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
        context.drawImage(sprites[43], i, j)
      }
    }
  }

  let pos = 0
  const step = 8

  const drawMephis = (pos: number) => {
    let sprite = sprites[3483]

    let movement = [0, 0]

    if (pos < 8) {
      movement = [0, step * pos]

      if (pos === 0) {
        sprite = sprites[3482]
      } else if (pos % 2 === 1) {
        sprite = sprites[3483]
      } else {
        sprite = sprites[3484]
      }
    } else if (pos < 16) {
      movement = [step * (pos % 8), 8 * step]

      if (pos === 8) {
        sprite = sprites[3488]
      } else if (pos % 2 === 1) {
        sprite = sprites[3489]
      } else {
        sprite = sprites[3490]
      }
    } else if (pos < 24) {
      movement = [8 * step, 8 * step - step * (pos % 8)]

      if (pos === 12) {
        sprite = sprites[3485]
      } else if (pos % 2 === 1) {
        sprite = sprites[3486]
      } else {
        sprite = sprites[3487]
      }
    } else {
      movement = [8 * step - step * (pos % 8), 0]

      if (pos === 18) {
        sprite = sprites[3491]
      } else if (pos % 2 === 1) {
        sprite = sprites[3492]
      } else {
        sprite = sprites[3493]
      }
    }

    const center = [WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2]
    context.drawImage(sprite, center[0] + movement[0], center[1] + movement[1])
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

      pos += 1
      if (pos === 32) {
        pos = 0
      }
    },
  }

  await Jinggu.start()

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  let i = 0
  while (i < 500) {
    Jinggu.loop()

    await sleep(200)
    i += 1
  }
}

run()
