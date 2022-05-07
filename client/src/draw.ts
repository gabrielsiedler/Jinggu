import { drawHealthBars } from './draw/health-bars'
import { drawMap } from './draw/map'
import { drawPlayers } from './draw/players'
import { drawStatus } from './draw/status'

export const draw = () => {
  drawMap()
  drawPlayers()
  drawHealthBars()
  drawStatus()
}
