kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
})

loadRoot('http://localhost:5000/sprites/')

layers(['field', 'top'], 'game')
await loadSprite('grass', '43.png')
await loadSprite('player', '3482.png')

const player = add([
  sprite('player'),
  pos(100, 100),
  layer('top'),
  'player',
  {
    dir: vec2(-1, 0),
    dead: false,
    speed: 10,
  },
])

const dirs = {
  left: vec2(-1, 0),
  right: vec2(1, 0),
  up: vec2(0, -1),
  down: vec2(0, 1),
}

for (const dir in dirs) {
  keyDown(dir, () => {
    const destination = dirs[dir].scale(32 * 10)

    console.log('destination', destination)

    player.move(destination)
  })
}

const load = async () => {
  add([
    sprite('grass', {
      width: width(),
      height: height(),
      tiled: true,
    }),
    layer('field'),
  ])
}

load()
