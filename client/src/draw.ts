import { context, sprites, WINDOW_HEIGHT, WINDOW_WIDTH } from '.'

export const drawBackground = () => {
  for (let i = 0; i < WINDOW_WIDTH; i += 32) {
    for (let j = 0; j < WINDOW_HEIGHT; j += 32) {
      context.drawImage(sprites[43], i, j)
    }
  }
}

// const step = 8

export const drawPlayer = (x: number, y: number) => {
  let sprite = sprites[3482]

  // let movement = [0, 0]

  // if (pos < 8) {
  //   movement = [0, step * pos]

  //   if (pos === 0) {
  //     sprite = sprites[3482]
  //   } else if (pos % 2 === 1) {
  //     sprite = sprites[3483]
  //   } else {
  //     sprite = sprites[3484]
  //   }
  // } else if (pos < 16) {
  //   movement = [step * (pos % 8), 8 * step]

  //   if (pos === 8) {
  //     sprite = sprites[3488]
  //   } else if (pos % 2 === 1) {
  //     sprite = sprites[3489]
  //   } else {
  //     sprite = sprites[3490]
  //   }
  // } else if (pos < 24) {
  //   movement = [8 * step, 8 * step - step * (pos % 8)]

  //   if (pos === 12) {
  //     sprite = sprites[3485]
  //   } else if (pos % 2 === 1) {
  //     sprite = sprites[3486]
  //   } else {
  //     sprite = sprites[3487]
  //   }
  // } else {
  //   movement = [8 * step - step * (pos % 8), 0]

  //   if (pos === 18) {
  //     sprite = sprites[3491]
  //   } else if (pos % 2 === 1) {
  //     sprite = sprites[3492]
  //   } else {
  //     sprite = sprites[3493]
  //   }
  // }

  context.drawImage(sprite, x, y)
}
