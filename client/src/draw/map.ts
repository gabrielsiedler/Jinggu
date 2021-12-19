import { TILES_HALF_Y, TILES_HALF_X, TILE_SIZE_SCALED, TILE_SIZE, CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants'
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
  // const blankTile = new Tile(0, 0, [new Sprite(0, false, core.spriteLibrary[0])])

  const topBoundary = core.player.tile.y - TILES_HALF_Y - 1
  const bottomBoundary = core.player.tile.y + TILES_HALF_Y + 1
  const leftBoundary = core.player.tile.x - TILES_HALF_X - 1
  const rightBoundary = core.player.tile.x + TILES_HALF_X + 1

  for (let y = topBoundary, j = 0; y <= bottomBoundary; y += 1, j += 1) {
    for (let x = leftBoundary, i = 0; x <= rightBoundary; x += 1, i += 1) {
      let currentTile

      if (y < 0 || x < 0 || y >= core.gameMap.tiles.length || x >= core.gameMap.tiles[y].length) {
        core.canvas.virtualCanvasContext.beginPath()
        core.canvas.virtualCanvasContext.fillStyle = 'black'
        core.canvas.virtualCanvasContext.fillRect(
          i * TILE_SIZE - core.player.offset.x,
          j * TILE_SIZE - core.player.offset.y,
          TILE_SIZE,
          TILE_SIZE,
        )

        continue
      }
      currentTile = core.gameMap.tiles[y][x]

      currentTile.sprites.forEach((sprite) => {
        core.canvas.virtualCanvasContext.drawImage(
          core.spriteLibrary[sprite.id].image,
          i * TILE_SIZE - core.player.offset.x,
          j * TILE_SIZE - core.player.offset.y,
        )
      })
    }
  }

  cropVirtualMap()
}
