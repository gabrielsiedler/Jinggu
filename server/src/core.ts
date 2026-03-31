import spriteList from './data/sprites.json' with { type: 'json' }
import { Map } from './lib/Map.js'
import { Memory } from './lib/Memory.js'
import { Sprites } from '@jinggu/shared'

export const VIEW_WIDTH = 42
export const VIEW_HEIGHT = 24
export const sprites: Sprites = spriteList
export const map = new Map()
export const memory = new Memory()
