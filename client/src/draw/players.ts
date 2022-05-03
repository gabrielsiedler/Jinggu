import { TILES_HALF_Y, TILES_HALF_X, TILE_SIZE, TILE_SIZE_SCALED } from '../constants'
import { Player } from '../player/Player'
import { core } from '../socket'

const drawPlayer = (player: Player) => {
  core.canvas.context.drawImage(
    core.spriteLibrary[player.sprite].image,
    TILES_HALF_X * TILE_SIZE,
    TILES_HALF_Y * TILE_SIZE,
    TILE_SIZE_SCALED,
    TILE_SIZE_SCALED,
  )
}

export const drawPlayers = () => {
  drawPlayer(core.player)

  core.entities.forEach((entity: Player) => {
    drawPlayer(entity)
  })
}
