const fs = require('fs')

const spritesFolder = 'public/sprites'

fs.readdirSync(spritesFolder).forEach((file) => {
  console.log(file)
})
