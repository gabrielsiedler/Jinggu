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
    { id: 1049, walkable: false },
    { id: 1203, walkable: false },
    { id: 1204 },
    { id: 1548 },
    { id: 1575 },
    { id: 1595, walkable: false },
    { id: 1596, walkable: false },
    { id: 1597, walkable: false },
    { id: 1598, walkable: false },
    { id: 2933 },
    { id: 2934 },
    { id: 2935 },
    { id: 2936 },
    { id: 3398 },
    { id: 3399 },
    { id: 3400 },
    { id: 3401 },
    { id: 3402 },
    { id: 3403 },
    { id: 3404 },
    { id: 3405 },
    { id: 3406 },
    { id: 3407 },
    { id: 3408 },
    { id: 3409 },
    { id: 3410 },
    { id: 3411 },
    { id: 3412 },
    { id: 3413 },
    { id: 3414 },
    { id: 3415 },
    { id: 3416 },
    { id: 3417 },
    { id: 3418 },
    { id: 3419 },
    { id: 3420 },
    { id: 3421 },
    { id: 3422 },
    { id: 3423 },
    { id: 3424 },
    { id: 3425 },
    { id: 3426 },
    { id: 3427 },
    { id: 3428 },
    { id: 3429 },
    { id: 3430 },
    { id: 3431 },
    { id: 3432 },
    { id: 3433 },
    { id: 3434 },
    { id: 3435 },
    { id: 3436 },
    { id: 3437 },
    { id: 3438 },
    { id: 3439 },
    { id: 3440 },
    { id: 3441 },
    { id: 3442 },
    { id: 3443 },
    { id: 3444 },
    { id: 3445 },
    { id: 3446 },
    { id: 3447 },
    { id: 3448 },
    { id: 3449 },
    { id: 3450 },
    { id: 3451 },
    { id: 3452 },
    { id: 3453 },
    { id: 3454 },
    { id: 3455 },
    { id: 3456 },
    { id: 3457 },
    { id: 3458 },
    { id: 3459 },
    { id: 3460 },
    { id: 3461 },
    { id: 3462 },
    { id: 3463 },
    { id: 3464 },
    { id: 3465 },
    { id: 3466 },
    { id: 3467 },
    { id: 3468 },
    { id: 3469 },
    { id: 3470 },
    { id: 3471 },
    { id: 3472 },
    { id: 3473 },
    { id: 3474 },
    { id: 3475 },
    { id: 3476 },
    { id: 3477 },
    { id: 3478 },
    { id: 3479 },
    { id: 3480 },
    { id: 3481 },
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
    { id: 3494 },
    { id: 3495 },
    { id: 3496 },
    { id: 3497 },
    { id: 3498 },
    { id: 3499 },
    { id: 3500 },
    { id: 3501 },
    { id: 3502 },
    { id: 3503 },
    { id: 3504 },
    { id: 3505 },
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
