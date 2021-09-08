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

  if (player.walking) return

  let dir
  switch (code) {
    // case 'Escape':
    //   if(player.traveling) {
    //     player.traveling = false
    //   }
    //   break;

    case 'ArrowLeft':
      dir = Direction.Left
      break
    case 'ArrowUp':
      dir = Direction.Up
      break
    case 'ArrowRight':
      dir = Direction.Right
      break
    case 'ArrowDown':
      dir = Direction.Down
      break
  }
  emitMove(dir as any)
}
