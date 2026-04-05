import { TILES_HALF_X, TILES_HALF_Y, TILE_SIZE, TILE_SIZE_SCALED } from '../constants'
import { core } from '../socket'
import { getRelativePosition } from '../utils/position'

const OVERLAY_DURATION = 300

export const drawAttackZone = () => {
  const now = Date.now()

  // Remove expired overlays
  core.attackOverlays = core.attackOverlays.filter((o: any) => now - o.createdAt < OVERLAY_DURATION)

  core.attackOverlays.forEach((overlay: any) => {
    const alpha = Math.max(0, 1 - (now - overlay.createdAt) / OVERLAY_DURATION) * 0.3

    core.canvas.context.fillStyle = `rgba(255, 100, 0, ${alpha})`

    overlay.tiles.forEach(([tx, ty]: [number, number]) => {
      const rel = getRelativePosition(core.player, { x: tx, y: ty })

      core.canvas.context.fillRect(
        (TILES_HALF_X + rel.x) * TILE_SIZE,
        (TILES_HALF_Y + rel.y) * TILE_SIZE,
        TILE_SIZE_SCALED,
        TILE_SIZE_SCALED,
      )
    })
  })
}
