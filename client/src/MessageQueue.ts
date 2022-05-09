import { Message } from './Message'
import { Player } from './player/Player'

export class MessageQueue {
  messages: Message[]

  constructor() {
    this.messages = []
  }

  autoClearMessage = (messageId: number) => {
    this.messages = this.messages.filter((item) => item.id !== messageId)
  }

  addMessage = (player: Player, message: string) => {
    const messagesFromPlayer = this.messages.filter((m) => m.player.id === player.id)
    const offsetY = messagesFromPlayer?.length ?? 0 * 20

    const newMessage = new Message(player, message, offsetY)

    this.messages.unshift(newMessage)

    setTimeout(() => this.autoClearMessage(newMessage.id), 3000)
  }
}
