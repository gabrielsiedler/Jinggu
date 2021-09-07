import { Tile } from './Tile'

export class GameMap {
  tiles: Tile[][]

  constructor(tiles: Tile[][]) {
    this.tiles = tiles
  }
}
