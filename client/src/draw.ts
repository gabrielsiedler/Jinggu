import { context, gameMap, player, spriteLibrary } from '.'

export const drawPlayer = () => {
  context.drawImage(spriteLibrary[player.sprite].image, player.x, player.y)
}

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
