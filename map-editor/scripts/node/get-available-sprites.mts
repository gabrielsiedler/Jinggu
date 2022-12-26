const fs = require('fs')

const spritesFolder = 'public/sprites'

let sprites = []
fs.readdirSync(spritesFolder).forEach((file) => {
  if (file === '.DS_Store') return

  sprites.push(file.split('.png')[0])
})

console.log(JSON.stringify(sprites))
