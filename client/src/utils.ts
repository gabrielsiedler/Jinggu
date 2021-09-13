export const getGridDistance = (x1: number, y1: number, x2: number, y2: number) => ({
  x: Math.floor(x1 / 32) - Math.floor(x2 / 32),
  y: Math.floor(y1 / 32) - Math.floor(y2 / 32),
})

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
