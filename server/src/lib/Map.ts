import { sprites } from '../core.js'
import mapData from '@jinggu/shared/data/map.json' with { type: 'json' }
import type { MapData } from '@jinggu/shared'
import { Tile } from './Tile.js'

const data = mapData as unknown as MapData

if (!data.serverTiles || !Array.isArray(data.serverTiles)) {
  throw new Error(
    'Fatal: shared/data/map.json is missing or has invalid serverTiles. Server cannot start.',
  )
}

export class Map {
  readonly width: number
  readonly height: number
  tiles: Tile[][]

  constructor() {
    this.width = data.width
    this.height = data.height
    this.tiles = this.generateMap()
  }

  generateMap = () => {
    const map: Tile[][] = []

    for (let row = 0; row < this.height; row += 1) {
      const line: Tile[] = []

      for (let col = 0; col < this.width; col += 1) {
        const currentSprite = data.serverTiles[row][col]

        const tile = new Tile(
          row,
          col,
          currentSprite.map((spr: string) => sprites[spr]),
        )

        line.push(tile)
      }

      map.push(line)
    }

    return map
  }
}
