import { Memory } from './core.i'
import spriteList from './data/sprites.json'
import { Map } from './lib/Map'
import { Sprites } from './lib/sprite.i'

export const map = new Map()
export const sprites: Sprites = spriteList

export const memory: Memory = {
  players: [],
}
