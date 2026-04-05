import { TILES_HALF_X, TILES_HALF_Y, TILE_SIZE, TILE_SIZE_SCALED } from '../constants'
import { core } from '../socket'
import { getRelativePosition } from '../utils/position'

export const drawCorpses = () => {
  core.corpses.forEach((corpse: any) => {
    const rel = getRelativePosition(core.player, { x: corpse.x, y: corpse.y })

    const spriteImage = core.spriteLibrary[corpse.sprite]?.image
    if (!spriteImage) return

    core.canvas.context.drawImage(
      spriteImage,
      (TILES_HALF_X + rel.x) * TILE_SIZE,
      (TILES_HALF_Y + rel.y) * TILE_SIZE,
      TILE_SIZE_SCALED,
      TILE_SIZE_SCALED,
    )
  })
}
