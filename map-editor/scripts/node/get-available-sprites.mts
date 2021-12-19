const fs = require('fs')

const spritesFolder = 'sprites'

fs.readdirSync(spritesFolder).forEach((file) => {
  console.log(file)
})
