import { Message } from './Message'
import { Player } from './player/Player'
import { Point } from './types.i'

export class MessageQueue {
  messages: Message[]

  constructor() {
    this.messages = []
  }

  autoClearMessage = (messageId: number) => {
    this.messages = this.messages.filter((item) => item.id !== messageId)
  }

  addMessage = (player: Player, message: string) => {
    const newMessage = new Message(player, message)

    this.messages.unshift(newMessage)

    setTimeout(() => this.autoClearMessage(newMessage.id), 3000)
  }
}
