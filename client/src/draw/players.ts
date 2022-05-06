import { TILES_HALF_Y, TILES_HALF_X, TILE_SIZE, TILE_SIZE_SCALED } from '../constants'
import { Player } from '../player/Player'
import { core } from '../socket'

interface Gap {
  gapX: number
  gapY: number
}

const drawPlayer = (player: Player, { gapX, gapY }: Gap) => {
  core.canvas.context.drawImage(
    core.spriteLibrary[player.sprite].image,
    (TILES_HALF_X + gapX) * TILE_SIZE,
    (TILES_HALF_Y + gapY) * TILE_SIZE,
    TILE_SIZE_SCALED,
    TILE_SIZE_SCALED,
  )
}

export const drawPlayers = () => {
  drawPlayer(core.player, { gapX: 0, gapY: 0 })

  core.entities.forEach((entity: Player) => {
    const gap = {
      gapX: entity.tile.x - core.player.tile.x - core.player.offset.x / 32,
      gapY: entity.tile.y - core.player.tile.y - core.player.offset.y / 32,
    }

    drawPlayer(entity, gap)
  })
}
