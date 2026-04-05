import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants'
import { core } from '../socket'

let deathDomElement: HTMLDivElement | null = null

const createDeathDomElement = () => {
  if (deathDomElement) return

  deathDomElement = document.createElement('div')
  deathDomElement.setAttribute('role', 'alert')
  deathDomElement.setAttribute('aria-live', 'assertive')
  deathDomElement.textContent = 'You died'
  deathDomElement.style.position = 'absolute'
  deathDomElement.style.top = '0'
  deathDomElement.style.left = '0'
  deathDomElement.style.width = '1px'
  deathDomElement.style.height = '1px'
  deathDomElement.style.overflow = 'hidden'
  deathDomElement.style.clip = 'rect(0, 0, 0, 0)'
  deathDomElement.style.whiteSpace = 'nowrap'
  deathDomElement.style.border = '0'
  document.body.appendChild(deathDomElement)
}

export const drawDeathScreen = () => {
  if (!core.player || core.player.alive) return

  // Create accessible DOM element (once)
  createDeathDomElement()

  const ctx = core.canvas.context

  // Semi-transparent black overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // "You died" text
  ctx.font = 'bold 48px Tahoma'
  ctx.fillStyle = '#CC0000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 3
  ctx.strokeText('You died', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
  ctx.fillText('You died', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)

  // Subtitle
  ctx.font = '16px Tahoma'
  ctx.fillStyle = '#AAAAAA'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 1
  ctx.strokeText('Your soul has departed this world', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40)
  ctx.fillText('Your soul has departed this world', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40)

  // Reset text alignment
  ctx.textAlign = 'start'
  ctx.textBaseline = 'alphabetic'
}
