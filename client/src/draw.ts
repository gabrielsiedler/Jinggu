import { drawHealthBars } from './draw/health-bars'
import { drawMap } from './draw/map'
import { drawMessages } from './draw/messages'
import { drawPlayers } from './draw/players'
import { drawStatus } from './draw/status'

export const draw = () => {
  drawMap()
  drawPlayers()
  drawHealthBars()
  drawStatus()
  drawMessages()
}
