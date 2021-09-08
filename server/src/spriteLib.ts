import sprites from './sprites.json'

export interface Sprite {
  id: number
  walkable: boolean
}

export let spriteLibrary = sprites
