let canvas = document.createElement('canvas')
let context
let sprites

const drawBackground = () => {
  for (let i = 0; i < 640; i += 32) {
    for (let j = 0; j < 640; j += 32) {
      context.drawImage(sprites[0], i, j)
    }
  }

  drawMephis()
}

const drawMephis = () => {
  context.drawImage(sprites[1], 0, 64)
  context.drawImage(sprites[2], 32, 64)
  context.drawImage(sprites[3], 64, 64)
  context.drawImage(sprites[4], 96, 64)
  context.drawImage(sprites[5], 128, 64)
  context.drawImage(sprites[6], 160, 64)
  context.drawImage(sprites[7], 192, 64)
  context.drawImage(sprites[8], 224, 64)
  context.drawImage(sprites[9], 256, 64)
  context.drawImage(sprites[10], 288, 64)
  context.drawImage(sprites[11], 320, 64)
  context.drawImage(sprites[12], 352, 64)
}

const Jinggu = {
  start: async function () {
    canvas.width = 640
    canvas.height = 640
    context = canvas.getContext('2d')
    document.body.insertBefore(canvas, document.body.childNodes[0])

    sprites = await loadSprites()

    drawBackground()
  },
}

Jinggu.start()
