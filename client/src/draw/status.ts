import { core, status } from '../socket'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants'

export const drawStatus = () => {
  if (!status.message) return

  const textWidth = core.canvas.context.measureText(status.message).width
  const textPos = [CANVAS_WIDTH / 2 - textWidth / 2, CANVAS_HEIGHT - 10]

  core.canvas.context.strokeText(status.message, textPos[0], textPos[1])
  core.canvas.context.fillStyle = 'white'
  core.canvas.context.fillText(status.message, textPos[0], textPos[1])
}
