import { sprites, VIEW_HEIGHT, VIEW_WIDTH } from '../core.js'
import spriteMap from '../data/map.json' with { type: 'json' }
import { Tile } from './Tile.js'

export class Map {
  tiles: Tile[][]

  constructor() {
    this.tiles = this.generateMap()
  }

  generateMap = () => {
    let map: any = []

    for (let lineI = 0; lineI < VIEW_HEIGHT; lineI += 1) {
      const line = []

      for (let columnI = 0; columnI < VIEW_WIDTH; columnI += 1) {
        let currentSprite = spriteMap[lineI][columnI]

        let tile = new Tile(
          lineI,
          columnI,
          currentSprite.map((spr: number | string) => sprites[spr]),
        )

        line.push(tile)
      }

      map.push(line)
    }

    return map
  }
}
