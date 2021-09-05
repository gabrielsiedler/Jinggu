const loadSprite = async (id: number) =>
  new Promise((resolve, reject) => {
    const url = `./sprites/${id}.png`
    const sprite = new Image()
    sprite.src = url

    sprite.onload = () => {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = 32
      tempCanvas.height = 32
      const tempContext: any = tempCanvas.getContext('2d')

      tempContext.drawImage(sprite, 0, 0)
      const image = tempContext.getImageData(0, 0, 32, 32)

      const { data } = image

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] !== 0) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          if (r === 255 && g === 0 && b === 255) {
            data[i + 3] = 0
          }
        }
      }

      tempContext.putImageData(image, 0, 0)

      const source = tempCanvas.toDataURL('image/png')
      const transparentSprite = new Image()
      transparentSprite.src = source

      resolve(transparentSprite)
    }

    sprite.onerror = (error) => {
      console.error('error', error)

      reject(error)
    }
  })

export const loadSprites = async () => {
  const ids = [43, 3482, 3483, 3484, 3485, 3486, 3487, 3488, 3489, 3490, 3491, 3492, 3493]

  let sprites: { [key: number]: any } = {}
  const spritesPromise = ids.map(async (id: number) => (sprites[id] = await loadSprite(id)))

  await Promise.all(spritesPromise)

  return sprites
}
