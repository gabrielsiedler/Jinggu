import {
  TILES_HALF_Y,
  TILES_HALF_X,
  TILE_SIZE_SCALED,
  TILE_SIZE,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  TILES_BUFFER,
} from '../constants'
import { core } from '../socket'

const cropVirtualMap = () => {
  core.canvas.context.drawImage(
    core.canvas.virtualCanvas,
    TILE_SIZE_SCALED,
    TILE_SIZE_SCALED,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
  )
}

export const drawMap = () => {
  // const topBoundary = core.player.tile.y - TILES_HALF_Y - TILES_BUFFER
  // const bottomBoundary = core.player.tile.y + TILES_HALF_Y + TILES_BUFFER
  // const leftBoundary = core.player.tile.x - TILES_HALF_X - TILES_BUFFER
  // const rightBoundary = core.player.tile.x + TILES_HALF_X + TILES_BUFFER
  const topBoundary = core.player.tile.y - TILES_HALF_Y
  const bottomBoundary = core.player.tile.y + TILES_HALF_Y
  const leftBoundary = core.player.tile.x - TILES_HALF_X
  const rightBoundary = core.player.tile.x + TILES_HALF_X

  for (let y = topBoundary, j = 0; y <= bottomBoundary; y += 1, j += 1) {
    for (let x = leftBoundary, i = 0; x <= rightBoundary; x += 1, i += 1) {
      let currentTile

      if (y < 0 || x < 0 || y >= core.gameMap.tiles.length || x >= core.gameMap.tiles[y].length) {
        core.canvas.context.beginPath()
        core.canvas.context.fillStyle = 'black'
        core.canvas.context.fillRect(
          i * TILE_SIZE_SCALED - core.player.offset.x,
          j * TILE_SIZE_SCALED - core.player.offset.y,
          TILE_SIZE_SCALED,
          TILE_SIZE_SCALED,
        )
        core.canvas.context.closePath()

        continue
      }
      currentTile = core.gameMap.tiles[y][x]

      currentTile.sprites.forEach((sprite) => {
        core.canvas.context.drawImage(
          core.spriteLibrary[sprite.id].image,
          i * TILE_SIZE_SCALED - core.player.offset.x,
          j * TILE_SIZE_SCALED - core.player.offset.y,
          TILE_SIZE_SCALED,
          TILE_SIZE_SCALED,
        )
      })
    }
  }

  // cropVirtualMap()
}
