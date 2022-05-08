import { Message } from '../Message'
import { core, messageQueue } from '../socket'
import { getRelativePosition } from '../utils/position'

export const drawMessages = () => {
  messageQueue.messages.forEach((message: Message) => {
    console.log(core.player.tile, message.position)
    const completeMessage = `${message.player.name} says:\n ${message.message}`
    const textWidth = core.canvas.context.measureText(completeMessage).width

    const relativePos = getRelativePosition(core.player, message.position)
    const textPos = [relativePos.x - textWidth / 2, relativePos.y - 10]

    core.canvas.context.strokeText(completeMessage, textPos[0], textPos[1])
    core.canvas.context.fillStyle = 'yellow'
    core.canvas.context.fillText(completeMessage, textPos[0], textPos[1])
  })
}
