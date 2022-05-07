import { TILES_HALF_X, TILES_HALF_Y, TILE_SIZE, TILE_SIZE_SCALED } from '../constants'
import { Player } from '../player/Player'
import { core } from '../socket'
import { Point } from '../types.i'

const getHealthColor = (health: number) => {
  if (health >= 92) return '#00BC00'
  if (health >= 60) return '#50A150'
  if (health >= 30) return '#A1A100'
  if (health >= 8) return '#BF0A0A'
  if (health >= 3) return '#910F0F'

  return '#850C0C'
}

const drawHealthBar = (player: Player, gap: Point) => {
  const xOffset = (TILES_HALF_X + gap.x) * TILE_SIZE
  const yOffset = (TILES_HALF_Y + gap.y) * TILE_SIZE

  const healthBarStart = [xOffset + 1, yOffset - 6]

  const healthColor = getHealthColor(player.health)
  const healthPercent = (30 * player.health) / 100

  core.canvas.context.beginPath()
  core.canvas.context.fillStyle = 'black'
  core.canvas.context.rect(healthBarStart[0] - 1, healthBarStart[1] - 1, TILE_SIZE_SCALED, 5)
  core.canvas.context.fill()

  core.canvas.context.beginPath()
  core.canvas.context.fillStyle = healthColor
  core.canvas.context.rect(healthBarStart[0], healthBarStart[1], healthPercent, 3)
  core.canvas.context.fill()

  core.canvas.context.font = 'bold 10px Tahoma'
  core.canvas.context.strokeStyle = 'black'
  core.canvas.context.lineWidth = 2

  const textWidth = core.canvas.context.measureText(player.name).width
  const textPos = [xOffset + 16 - textWidth / 2, yOffset - 10]
  core.canvas.context.strokeText(player.name, textPos[0], textPos[1])
  core.canvas.context.fillStyle = healthColor
  core.canvas.context.fillText(player.name, textPos[0], textPos[1])
}

export const drawHealthBars = () => {
  drawHealthBar(core.player, { x: 0, y: 0 })

  core.entities.forEach((entity: Player) => {
    const gap = {
      x: entity.tile.x - core.player.tile.x - core.player.offset.x / 32 + entity.offset.x / 32,
      y: entity.tile.y - core.player.tile.y - core.player.offset.y / 32 + entity.offset.y / 32,
    }

    drawHealthBar(entity, gap)
  })
}
