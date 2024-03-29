import { Direction } from './player/player.i'
import { core, emitDance, emitMessage, emitMove } from './socket'

const keysPressed: any = {}

export const inputsSetup = () => {
  window.addEventListener('keydown', checkKeyPress, false)
  window.addEventListener('keyup', removeKey, false)
}

const removeKey = (e: any) => {
  delete keysPressed[e.key]
}

const arrayToDirect: any = {
  ArrowUp: Direction.Up,
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  ArrowRight: Direction.Right,
}

export const checkKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    const message = window.prompt('Message')

    if (message) emitMessage(message)

    return
  }

  keysPressed[e.key] = true

  const code = e.key
  const direction = arrayToDirect[code]
  if (keysPressed.Control || keysPressed.Alt) {
    emitDance(direction)

    return
  }

  // if (keysPressed.j) {
  //   core.player.autoDance()

  //   return
  // }

  if (core.player.walking) return

  if (direction) emitMove(direction)
}
