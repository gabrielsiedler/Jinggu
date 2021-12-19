import { drawHealthBars } from './draw/health-bars'
import { drawMap } from './draw/map'
import { drawPlayers } from './draw/players'

export const draw = () => {
  drawMap()
  drawPlayers()
  drawHealthBars()
}
