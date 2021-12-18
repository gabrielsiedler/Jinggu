export const VIEW_WIDTH_SQUARE = 25 // odd
export const VIEW_HEIGHT_SQUARE = 17 // odd
export const SCALE = 1.2
export const TILE_SQUARE = 32

// 42 x 24 max
export const WINDOW_WIDTH = Math.floor(VIEW_WIDTH_SQUARE * TILE_SQUARE * SCALE)
export const WINDOW_HEIGHT = Math.floor(VIEW_HEIGHT_SQUARE * TILE_SQUARE * SCALE)
export const FRAME = 34 // 1000 / 30 = 30 frames per second
