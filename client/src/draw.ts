import { VIEW_HEIGHT_SQUARE, VIEW_WIDTH_SQUARE } from './constants'
import { Player } from './Player'
import { core } from './socket'
import { Sprite } from './sprites'
import { Tile } from './Tile'

const viewSquareMinW = VIEW_WIDTH_SQUARE / 2 - 1
const viewSquareMaxW = VIEW_WIDTH_SQUARE / 2

const viewSquareMinH = VIEW_HEIGHT_SQUARE / 2 - 1
const viewSquareMaxH = VIEW_HEIGHT_SQUARE / 2

// console.log('viewSquareMinY', viewSquareMinY)
// console.log('viewSquareMaxX', viewSquareMaxX)
// console.log('viewSquareMaxY', viewSquareMaxY)
export const drawMap = () => {
  // const virtualCanvas =
  const blankTile = new Tile(0, 0, [new Sprite(0, false, core.spriteLibrary[0])])

  for (let y = core.player.tile.y - viewSquareMinH, j = 0; y < core.player.tile.y + viewSquareMaxH; y += 1, j += 1) {
    for (let x = core.player.tile.x - viewSquareMinW, i = 0; x < core.player.tile.x + viewSquareMaxW; x += 1, i += 1) {
      let currentTile

      if (y < 0 || x < 0 || y >= core.gameMap.tiles.length || x >= core.gameMap.tiles[y].length) {
        core.canvas.context.beginPath()
        core.canvas.context.fillStyle = 'black'
        core.canvas.context.fillRect(i * 32 - core.player.offset.x, j * 32 - core.player.offset.y, 32, 32)

        continue
      }
      currentTile = core.gameMap.tiles[y][x]

      currentTile.sprites.forEach((sprite) => {
        core.canvas.context.drawImage(
          core.spriteLibrary[sprite.id].image,
          i * 32 - core.player.offset.x,
          j * 32 - core.player.offset.y,
        )
      })
    }
  }
}

const drawPlayer = (player: Player) => {
  core.canvas.context.drawImage(core.spriteLibrary[player.sprite].image, viewSquareMinW * 32, viewSquareMinH * 32)
}

export const drawPlayers = () => {
  drawPlayer(core.player)

  core.entities.forEach((entity: Player) => {
    drawPlayer(entity)
  })
}

const getHealthColor = (health: number) => {
  if (health >= 92) return '#00BC00'
  if (health >= 60) return '#50A150'
  if (health >= 30) return '#A1A100'
  if (health >= 8) return '#BF0A0A'
  if (health >= 3) return '#910F0F'

  return '#850C0C'
}

const drawHealthBar = (player: Player) => {
  const healthBarStart = [viewSquareMinW * 32 + 1, viewSquareMinH * 32 - 6]

  const healthColor = getHealthColor(player.health)
  const healthPercent = (30 * player.health) / 100

  core.canvas.context.beginPath()
  core.canvas.context.fillStyle = 'black'
  core.canvas.context.rect(healthBarStart[0] - 1, healthBarStart[1] - 1, 32, 5)
  core.canvas.context.fill()

  core.canvas.context.beginPath()
  core.canvas.context.fillStyle = healthColor
  core.canvas.context.rect(healthBarStart[0], healthBarStart[1], healthPercent, 3)
  core.canvas.context.fill()

  core.canvas.context.font = 'bold 10px Tahoma'
  core.canvas.context.strokeStyle = 'black'
  core.canvas.context.lineWidth = 2

  const textWidth = core.canvas.context.measureText(player.name).width
  const textPos = [viewSquareMinW * 32 + 16 - textWidth / 2, viewSquareMinH * 32 - 10]
  core.canvas.context.strokeText(player.name, textPos[0], textPos[1])
  core.canvas.context.fillStyle = healthColor
  core.canvas.context.fillText(player.name, textPos[0], textPos[1])
}

export const drawHealthBars = () => {
  drawHealthBar(core.player)

  core.entities.forEach((entity: Player) => {
    drawHealthBar(entity)
  })
}

export const draw = () => {
  drawMap()
  drawPlayers()
  drawHealthBars()

  // const pXStart = core.player.realX - 3
  // const pXEnd = (core.player.realX + 3) * 32

  // const pYStart = core.player.realY - 3
  // const pYEnd = (core.player.realY + 3) * 32

  // console.log(pXStart, pYStart, pXEnd, pYEnd)
  // core.canvas.context.rect(pXStart, pYStart, pXEnd, pYEnd)
  // core.canvas.context.stroke()
  // core.canvas.context.clip()
}
