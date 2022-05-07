export class StatusMessage {
  message: string
  timeout: any

  constructor() {
    this.message = ''
  }

  clearMessage = () => {
    this.message = ''
    clearTimeout(this.timeout)
  }

  setMessage(newMessage: string) {
    clearTimeout(this.timeout)
    this.message = newMessage
    this.timeout = setTimeout(() => this.clearMessage(), 1200)
  }
}
