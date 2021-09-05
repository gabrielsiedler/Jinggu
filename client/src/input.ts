import { player } from '.'
import { Direction } from './Player'

const keysPressed: any = {}

export const keysSetup = () => {
  window.addEventListener('keydown', checkKeyPress, false)
  window.addEventListener('keyup', removeKey, false)
}

const removeKey = (e: any) => {
  delete keysPressed[e.key]
}

export const checkKeyPress = (e: KeyboardEvent) => {
  keysPressed[e.key] = true
  var code = e.key

  if (keysPressed.Control) {
    switch (code) {
      case 'ArrowLeft':
        player.dance(Direction.Left)
        break
      case 'ArrowUp':
        player.dance(Direction.Up)
        break
      case 'ArrowRight':
        player.dance(Direction.Right)
        break
      case 'ArrowDown':
        player.dance(Direction.Down)
        break
    }
    return
  }

  switch (code) {
    case 'ArrowLeft':
      player.move(Direction.Left)
      break
    case 'ArrowUp':
      player.move(Direction.Up)
      break
    case 'ArrowRight':
      player.move(Direction.Right)
      break
    case 'ArrowDown':
      player.move(Direction.Down)
      break
  }
}
