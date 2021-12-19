import { SCALE, TILE_SIZE_SCALED, CANVAS_HEIGHT, CANVAS_WIDTH } from './constants'

export class Canvas {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  virtualCanvas: HTMLCanvasElement
  virtualCanvasContext: CanvasRenderingContext2D

  private getPixelRatio = () => {
    const ctx: any = document.createElement('canvas').getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1

    return dpr / bsr
  }

  private createHiDPICanvas = (w: number, h: number, ratio: number = this.getPixelRatio()) => {
    const canvas = document.createElement('canvas')

    canvas.width = w * ratio
    canvas.height = h * ratio
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    canvas.getContext('2d')!.setTransform(ratio, 0, 0, ratio, 0, 0)

    return canvas
  }

  constructor() {
    this.canvas = this.createHiDPICanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    this.context = this.canvas.getContext('2d')!
    this.context.scale(SCALE, SCALE)

    this.virtualCanvas = this.createHiDPICanvas(
      CANVAS_WIDTH + TILE_SIZE_SCALED * 2,
      CANVAS_HEIGHT + TILE_SIZE_SCALED * 2,
    )
    this.virtualCanvasContext = this.virtualCanvas.getContext('2d')!
    this.virtualCanvasContext.scale(SCALE, SCALE)

    document.body.appendChild(this.canvas)
  }

  clear = () => {
    const canvas = document.getElementsByTagName('canvas')[0]

    canvas.remove()
  }
}
