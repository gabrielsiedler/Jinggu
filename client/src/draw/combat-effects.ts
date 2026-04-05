import { TILES_HALF_X, TILES_HALF_Y, TILE_SIZE } from '../constants'
import { core } from '../socket'
import { getRelativePosition } from '../utils/position'

const EFFECT_DURATION = 800
const FLOAT_DISTANCE = 30

export const drawCombatEffects = () => {
  const now = Date.now()

  // Remove expired effects
  core.combatEffects = core.combatEffects.filter((e: any) => now - e.createdAt < EFFECT_DURATION)

  core.combatEffects.forEach((effect: any) => {
    const age = now - effect.createdAt
    const progress = age / EFFECT_DURATION
    const alpha = Math.max(0, 1 - progress)
    const yOffset = -progress * FLOAT_DISTANCE

    const rel = getRelativePosition(core.player, { x: effect.x, y: effect.y })

    const screenX = (TILES_HALF_X + rel.x) * TILE_SIZE + 16
    const screenY = (TILES_HALF_Y + rel.y) * TILE_SIZE + yOffset

    core.canvas.context.font = 'bold 14px Tahoma'
    core.canvas.context.globalAlpha = alpha
    core.canvas.context.strokeStyle = 'black'
    core.canvas.context.lineWidth = 2

    const textWidth = core.canvas.context.measureText(effect.text).width
    core.canvas.context.strokeText(effect.text, screenX - textWidth / 2, screenY)
    core.canvas.context.fillStyle = effect.color
    core.canvas.context.fillText(effect.text, screenX - textWidth / 2, screenY)

    core.canvas.context.globalAlpha = 1
  })
}
