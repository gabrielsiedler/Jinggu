const fs = require('fs')

const testFolder = 'sprites'

fs.readdirSync(testFolder).forEach((file) => {
  console.log(file)
})
