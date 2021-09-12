import { context, entities, gameMap, player, spriteLibrary } from '.'
import { Player } from './Player'

export const drawMap = () => {
  for (let y = 0; y < gameMap.tiles.length; y += 1) {
    for (let x = 0; x < gameMap.tiles[0].length; x += 1) {
      const currentTile = gameMap.tiles[y][x]

      currentTile.sprites.forEach((sprite) => {
        context.drawImage(spriteLibrary[sprite.id].image, x * 32, y * 32)
      })
    }
  }
}

const drawPlayer = (player: Player) => {
  context.drawImage(spriteLibrary[player.sprite].image, player.x, player.y)
}

export const drawPlayers = () => {
  drawPlayer(player)

  entities.forEach((entity: Player) => {
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
  const healthBarStart = [player.x + 1, player.y - 6]

  const healthColor = getHealthColor(player.health)
  const healthPercent = (30 * player.health) / 100

  context.beginPath()
  context.fillStyle = 'black'
  context.rect(healthBarStart[0] - 1, healthBarStart[1] - 1, 32, 5)
  context.fill()

  context.beginPath()
  context.fillStyle = healthColor
  context.rect(...healthBarStart, healthPercent, 3)
  context.fill()

  context.font = 'bold 10px Tahoma'
  context.strokeStyle = 'black'
  context.lineWidth = 2

  const textWidth = context.measureText(player.name).width
  const textPos = [player.x + 16 - textWidth / 2, player.y - 10]
  context.strokeText(player.name, ...textPos)
  context.fillStyle = healthColor
  context.fillText(player.name, ...textPos)
}

export const drawHealthBars = () => {
  drawHealthBar(player)

  entities.forEach((entity: Player) => {
    drawHealthBar(entity)
  })
}
