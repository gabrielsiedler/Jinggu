import available from './available.json'

export const sprites: any = {}

available.forEach((id) => {
  sprites[id] = require(`../../sprites/${id}.png`)
})
