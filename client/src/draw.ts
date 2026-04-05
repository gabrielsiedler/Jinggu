import { drawAttackZone } from './draw/attack'
import { drawCombatEffects } from './draw/combat-effects'
import { drawCorpses } from './draw/corpses'
import { drawDeathScreen } from './draw/death'
import { drawHealthBars } from './draw/health-bars'
import { drawMap } from './draw/map'
import { drawMessages } from './draw/messages'
import { drawPlayers } from './draw/players'
import { drawStatus } from './draw/status'

export const draw = () => {
  drawMap()
  drawCorpses()
  drawPlayers()
  drawAttackZone()
  drawCombatEffects()
  drawHealthBars()
  drawStatus()
  drawMessages()
  drawDeathScreen()
}
