export class Sprite {
  id: number
  walkable: boolean

  constructor(id: number, walkable: boolean) {
    this.id = id
    this.walkable = walkable
  }
}

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

const spritesAsObject: any = {}

spriteTiles.forEach((sprite: any) => {
  spritesAsObject[sprite.id] = sprite
})

export let spriteLibrary = spritesAsObject
