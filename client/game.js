kaboom({
  global: true,
  scale: 1,
  debug: true,
})

loadRoot('http://localhost:5000/sprites/')

layers(['field', 'top'], 'game')
await loadSprite('grass', '43.png')
await loadSprite('player', '3482.png')
await loadSprite('shrub', '1049.png')

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

const addShrub = (posX, posY) => {
  add([
    sprite('shrub'),
    pos(posX, posY),
    layer('top'),
    'shrub',
    {
      dir: vec2(-1, 0),
      dead: false,
      speed: 10,
    },
  ])
}

const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

let x, y
for (let i = 0; i < 20; i++) {
  x = getRandom(0, Math.floor(screen.width / 32)) * 32
  y = getRandom(0, Math.floor(screen.height / 32)) * 32
  addShrub(x, y)
}

const dirs = {
  left: vec2(-1, 0),
  right: vec2(1, 0),
  up: vec2(0, -1),
  down: vec2(0, 1),
}

for (const dir in dirs) {
  keyDown(dir, () => {
    player.move(dirs[dir].scale(32 * 10))
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
