import spriteList from './data/sprites.json'
import { Map } from './lib/Map'
import { Memory } from './lib/Memory'
import { Sprites } from './lib/sprite.i'

export const VIEW_WIDTH = 42
export const VIEW_HEIGHT = 24
export const sprites: Sprites = spriteList
export const map = new Map()
export const memory = new Memory()
