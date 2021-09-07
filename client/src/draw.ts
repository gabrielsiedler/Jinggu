import { context, gameMap, player } from '.'

export const drawPlayer = () => {
  context.drawImage(player.sprite.image, player.x, player.y)
}

export const drawMap = () => {
  for (let y = 0; y < gameMap.tiles.length; y += 1) {
    for (let x = 0; x < gameMap.tiles[0].length; x += 1) {
      const currentTile = gameMap.tiles[y][x]

      currentTile.sprites.forEach((sprite) => {
        context.drawImage(sprite.image, x * 32, y * 32)
      })
    }
  }
}
