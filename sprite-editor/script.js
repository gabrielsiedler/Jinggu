import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const publicPath = path.join(__dirname, 'public', 'sprites')

fs.readdir(publicPath, (err, files) => {
  let id = 0

  files.forEach((file) => {
    const originalFilePath = path.join(__dirname, 'public', 'sprites', file)
    const newFilePath = path.join(__dirname, 'public', 'sprites', `${id++}.png`)

    fs.rename(originalFilePath, newFilePath, function (err) {
      if (err) throw err

      console.log(`Renamed ${originalFilePath} to ${newFilePath}`)
    })
  })
})
