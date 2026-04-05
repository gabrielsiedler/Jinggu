import { Direction } from './player/player.i'
import { core, emitAttack, emitMessage, emitMove } from './socket'

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
  w: Direction.Up,
  s: Direction.Down,
  a: Direction.Left,
  d: Direction.Right,
}

export const checkKeyPress = (e: KeyboardEvent) => {
  if (!core.player.alive) return

  if (e.key === ' ') {
    e.preventDefault()
    if (!core.player.walking) emitAttack()
    return
  }

  if (e.key === 'Enter') {
    const message = window.prompt('Message')

    if (message) emitMessage(message)

    return
  }

  keysPressed[e.key] = true

  const direction = arrayToDirect[e.key]
  if (direction) e.preventDefault()

  if (core.player.walking) return

  if (direction) emitMove(direction)
}
