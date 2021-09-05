import { player } from '.'
import { Direction } from './Player'

export const checkKeyPress = (e: KeyboardEvent) => {
  var code = e.key

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
