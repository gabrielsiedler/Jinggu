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

  const healthBarStart = [player.x - 10, player.y - 10]
  // health bar

  context.beginPath()
  context.fillStyle = 'green'
  context.strokeStyle = 'black'
  context.strokeWidth = 1
  context.rect(...healthBarStart, 40, 6)
  context.fill()
  context.stroke()
}

export const drawPlayers = () => {
  drawPlayer(player)

  entities.forEach((entity: Player) => {
    drawPlayer(entity)
  })
}
