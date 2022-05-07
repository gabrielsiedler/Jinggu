import { core, status } from '../socket'

export const drawStatus = () => {
  if (!status.message) return

  const textWidth = core.canvas.context.measureText(status.message).width
  const textPos = [core.canvas.canvas.width / 2 - textWidth / 2, core.canvas.canvas.height - 10]

  core.canvas.context.strokeText(status.message, textPos[0], textPos[1])
  core.canvas.context.fillStyle = 'white'
  core.canvas.context.fillText(status.message, textPos[0], textPos[1])
}
