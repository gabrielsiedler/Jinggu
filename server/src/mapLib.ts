import spriteMap from './map.json'
import { spriteLibrary } from './spriteLib'
import { Tile } from './Tile'

let map: any = []

for (let lineI = 0; lineI < 24; lineI += 1) {
  const line = []

  for (let columnI = 0; columnI < 42; columnI += 1) {
    let currentSprite = spriteMap[lineI][columnI]

    let tile = new Tile(
      lineI,
      columnI,
      currentSprite.map((spr: number) => (spriteLibrary as any)[spr]),
    )

    line.push(tile)
  }

  map.push(line)
}

export const gameMap = { tiles: map }
