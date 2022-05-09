import { TILES_HALF_X, TILES_HALF_Y, TILE_SIZE, TILE_SIZE_SCALED } from '../constants'
import { Message } from '../Message'
import { core, messageQueue } from '../socket'
import { getRelativePosition } from '../utils/position'

const TEXT_LINE_DISTANCE = 16

export const drawMessages = () => {
  messageQueue.messages.forEach((message: Message) => {
    const textWidth = core.canvas.context.measureText(message.messages[0]).width

    const relativePos = getRelativePosition(core.player, message.position)

    const addedPos = {
      x: (relativePos.x + TILES_HALF_X) * TILE_SIZE - textWidth / 2,
      y: (relativePos.y + TILES_HALF_Y) * TILE_SIZE,
    }

    const textPos = [addedPos.x, addedPos.y]

    message.messages.forEach((line: string, i: number) => {
      core.canvas.context.strokeText(line, textPos[0], textPos[1] + i * TEXT_LINE_DISTANCE)
      core.canvas.context.fillStyle = 'yellow'
      core.canvas.context.fillText(line, textPos[0], textPos[1] + i * TEXT_LINE_DISTANCE)
    })
  })
}
