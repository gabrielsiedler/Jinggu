import { player } from '.'
import { Direction } from './Player'
import { emitMove } from './socket'

const keysPressed: any = {}

export const inputsSetup = () => {
  window.addEventListener('keydown', checkKeyPress, false)
  window.addEventListener('keyup', removeKey, false)
  // window.addEventListener('click', checkClick, false);
}

const removeKey = (e: any) => {
  delete keysPressed[e.key]
}

// export const checkClick = (e: MouseEvent) => {
//   if(Math.floor(player.x/32) === Math.floor(e.clientX / 32) && Math.floor(player.y/32) === Math.floor(e.clientY / 32) ){
//     return
//   } else {
//     if(player.traveling) {
//       return
//     }
//     player.setTravelDestination(e.clientX, e.clientY);
//     player.traveling = true
//     player.travel()
//   }
// }

const arrayToDirect: any = {
  ArrowUp: Direction.Up,
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  ArrowRight: Direction.Right,
}

export const checkKeyPress = (e: KeyboardEvent) => {
  keysPressed[e.key] = true

  const code = e.key
  const direction = arrayToDirect[code]
  if (keysPressed.Control) {
    player.dance(direction)

    return
  }

  if (player.walking) return

  emitMove(direction)
}
