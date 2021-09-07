export class Sprite {
  id: number
  walkable: boolean
  image: any

  constructor(id: number, walkable: boolean, image: any) {
    this.id = id
    this.walkable = walkable
    this.image = image
  }
}

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
  type SpriteTile = { id: number; walkable?: boolean }
  const spriteTiles = [
    { id: 43 },
    { id: 79, walkable: false },
    { id: 80, walkable: false },
    { id: 85, walkable: false },
    { id: 86, walkable: false },
    { id: 339, walkable: false },
    { id: 3482 },
    { id: 3483 },
    { id: 3484 },
    { id: 3485 },
    { id: 3486 },
    { id: 3487 },
    { id: 3488 },
    { id: 3489 },
    { id: 3490 },
    { id: 3491 },
    { id: 3492 },
    { id: 3493 },
  ]

  let sprites: Sprite[]
  const spritesPromise = spriteTiles.map(
    async (spriteTile: SpriteTile) =>
      new Sprite(spriteTile.id, spriteTile.walkable ?? true, await loadSprite(spriteTile.id)),
  )

  sprites = await Promise.all(spritesPromise)

  const spritesAsObject: any = {}

  sprites.forEach((sprite: Sprite) => {
    spritesAsObject[sprite.id] = sprite
  })

  return spritesAsObject
}
