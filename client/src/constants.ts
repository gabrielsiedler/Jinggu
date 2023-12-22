export const SCALE = 1

// 42 x 24 max
export const TILE_SIZE = 32
export const TILE_SIZE_SCALED = TILE_SIZE * SCALE
export const TILES_BUFFER = 2
export const TILES_TOTAL_X = 25 // odd
export const TILES_TOTAL_Y = 17 // odd
export const TILES_HALF_X = Math.floor(TILES_TOTAL_X / 2)
export const TILES_HALF_Y = Math.floor(TILES_TOTAL_Y / 2)

export const CANVAS_WIDTH = Math.floor(TILES_TOTAL_X * TILE_SIZE_SCALED)
export const CANVAS_HEIGHT = Math.floor(TILES_TOTAL_Y * TILE_SIZE_SCALED)

export const FRAME = 25
