export class Sprite {
  id: number
  walkable: boolean
  image: any

  constructor(id: number, walkable: boolean, image: any) {
    this.id = id
    this.walkable = walkable
    this.image = image
  }

  addTransparency(sprite: HTMLImageElement) {
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

    Promise.resolve(transparentSprite)
  }
}

export const loadSprite = async (id: number) => {
  const url = `./sprites/${id}.png`
  const sprite = new Image()
  sprite.src = url

  return sprite
}

export const loadSprites = async (spriteTiles: any) => {
  let sprites: Sprite[]

  const spritesPromise = Object.values(spriteTiles).map(
    async (spriteTile: any) => new Sprite(spriteTile.id, spriteTile.walkable ?? true, await loadSprite(spriteTile.id)),
  )

  sprites = await Promise.all(spritesPromise)

  const spritesAsObject: any = {}

  const blankTile = await loadSprite(0)

  sprites.forEach((sprite: Sprite) => {
    spritesAsObject[sprite.id] = sprite
  })

  spritesAsObject[0] = blankTile

  return spritesAsObject
}
