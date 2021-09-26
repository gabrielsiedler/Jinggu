import { Player } from './Player'
import { core } from './socket'
import { loadSprite, Sprite } from './sprites'
import { Tile } from './Tile'

export const drawMap = () => {
  const blankTile = new Tile(0, 0, [new Sprite(0, false, core.spriteLibrary[0])])
  // for (let y = 0; y < core.gameMap.tiles.length; y += 1) {
  //   for (let x = 0; x < core.gameMap.tiles[0].length; x += 1) {
  for (let y = core.player.realY - 6, j = 0; y < core.player.realY + 7; y += 1, j += 1) {
    for (let x = core.player.realX - 6, i = 0; x < core.player.realX + 7; x += 1, i += 1) {
      let currentTile

      if (y < 0 || x < 0 || y >= core.gameMap.tiles.length || x >= core.gameMap.tiles[y].length) {
        core.canvas.context.beginPath()
        core.canvas.context.fillStyle = 'black'
        core.canvas.context.fillRect(i * 32, j * 32, 32, 32)
        // core.canvas.context.drawImage(core.spriteLibrary[0].image, i * 32, j * 32)

        continue
      }
      currentTile = core.gameMap.tiles[y][x]

      currentTile.sprites.forEach((sprite) => {
        core.canvas.context.drawImage(core.spriteLibrary[sprite.id].image, i * 32, j * 32)
      })
    }
  }

  // for (let y = core.player.realY - 3; y < core.player.realY + 3; y += 1) {
  //   for (let x = core.player.realX - 3; x < core.player.realX + 3; x += 1) {
  //     if (x >= 0 && x < core.gameMap.tiles[0].length && y >= 0 && y < core.gameMap.tiles.length) {
  //       const currentTile = core.gameMap.tiles[y][x]

  //       if (currentTile) {
  //         currentTile.sprites.forEach((sprite) => {
  //           core.canvas.context.drawImage(core.spriteLibrary[sprite.id].image, x * 32, y * 32)
  //         })
  //       }
  //     } else {
  //       core.canvas.context.fillStyle = '#000'
  //       core.canvas.context.fillRect(x, y, x * 32, y * 32)
  //     }
  //   }
  // }
}

const drawPlayer = (player: Player) => {
  // core.canvas.context.drawImage(core.spriteLibrary[player.sprite].image, player.x, player.y)
  core.canvas.context.drawImage(core.spriteLibrary[player.sprite].image, 6 * 32, 6 * 32)
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
  // const healthBarStart = [player.x + 1, player.y - 6]
  const healthBarStart = [6 * 32 + 1, 6 * 32 - 6]

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
  // const textPos = [player.x + 16 - textWidth / 2, player.y - 10]
  const textPos = [6 * 32 + 16 - textWidth / 2, 6 * 32 - 10]
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
