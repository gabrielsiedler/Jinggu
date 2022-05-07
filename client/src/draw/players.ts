import { TILES_HALF_X, TILES_HALF_Y, TILE_SIZE, TILE_SIZE_SCALED } from '../constants'
import { Player } from '../player/Player'
import { core } from '../socket'
import { Point } from '../types.i'
import { getRelativePosition } from '../utils/position'

const drawPlayer = (player: Player, { x, y }: Point) => {
  core.canvas.context.drawImage(
    core.spriteLibrary[player.sprite].image,
    (TILES_HALF_X + x) * TILE_SIZE,
    (TILES_HALF_Y + y) * TILE_SIZE,
    TILE_SIZE_SCALED,
    TILE_SIZE_SCALED,
  )
}

export const drawPlayers = () => {
  drawPlayer(core.player, { x: 0, y: 0 })

  core.entities.forEach((entity: Player) => {
    const relativePosition = getRelativePosition(core.player, entity)

    drawPlayer(entity, relativePosition)
  })
}
