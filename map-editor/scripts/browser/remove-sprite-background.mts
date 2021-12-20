import * as zip from '@zip.js/zip.js'
import FileSaver from 'file-saver'

import available from '../../src/available-sprite-ids.json'

export let sprites: any = {}

export const loadSprite = async (id: number) =>
  new Promise((resolve, reject) => {
    const url = `sprites/${id}.png`
    const sprite = new Image()
    sprite.src = url

    sprite.onload = () => {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = 32
      tempCanvas.height = 32
      const tempContext: any = tempCanvas.getContext('2d')

      tempContext.drawImage(sprite, 0, 0)
      const image = tempContext.getImageData(0, 0, 32, 32)

      const { data } = image

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] !== 0) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          if (r === 255 && g === 0 && b === 255) {
            data[i + 3] = 0
          }
        }
      }

      tempContext.putImageData(image, 0, 0)

      const source = tempCanvas.toDataURL('image/png')

      resolve(source)
    }

    sprite.onerror = (error) => {
      console.error('error', error)

      reject(error)
    }
  })

const spritesPromise = available.map(async (id: number) => (sprites[id] = await loadSprite(id)))

export const removePinkBackgroundFromSprites = async () => {
  await Promise.all(spritesPromise)

  const blobWriter = new zip.BlobWriter('application/zip')
  const writer = new zip.ZipWriter(blobWriter)

  const writterPromise = Object.keys(sprites).map(async (k) => {
    await writer.add(`${k}.png`, new zip.Data64URIReader(sprites[k]))
  })

  await Promise.all(writterPromise)

  await writer.close()

  FileSaver.saveAs(await blobWriter.getData(), 'download.zip')
}
