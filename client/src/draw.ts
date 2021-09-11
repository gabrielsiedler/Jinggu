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

  const healthBarStart = [player.x - 3, player.y - 8]
  // health bar

  // table.insert(LifeBarColors, {percentAbove = 92, color = '#00BC00' } )
  // table.insert(LifeBarColors, {percentAbove = 60, color = '#50A150' } )
  // table.insert(LifeBarColors, {percentAbove = 30, color = '#A1A100' } )
  // table.insert(LifeBarColors, {percentAbove = 8, color = '#BF0A0A' } )
  // table.insert(LifeBarColors, {percentAbove = 3, color = '#910F0F' } )
  // table.insert(LifeBarColors, {percentAbove = -1, color = '#850C0C' } )

  context.beginPath()
  context.fillStyle = 'black'
  context.rect(healthBarStart[0] - 1, healthBarStart[1] - 1, 32, 6)
  context.fill()

  context.beginPath()
  context.fillStyle = '#A1A100'
  context.rect(...healthBarStart, 16, 4)
  context.fill()
}

export const drawPlayers = () => {
  drawPlayer(player)

  entities.forEach((entity: Player) => {
    drawPlayer(entity)
  })
}
