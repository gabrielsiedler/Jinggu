import React from 'react'
import './App.css'
import { SpriteContent, SpriteMap } from './types.i'

const App = () => {
  const spriteLib: SpriteMap = {
    1: {
      id: 1,
      walkable: false,
      spriteId: 40,
    },
    2: {
      id: 2,
      size: [2, 2],
      sprites: [
        {
          walkable: true,
          spriteId: 3139,
        },
        {
          walkable: true,
          spriteId: 3140,
        },
        {
          walkable: true,
          spriteId: 3141,
        },
        {
          walkable: true,
          spriteId: 3142,
        },
      ],
    },
  }

  return (
    <div className="App">
      {Object.values(spriteLib).map((ct: any) => {
        if (ct.spriteId)
          return (
            <div key={ct.id}>
              <img src={`sprites/${ct.spriteId}.png`} />
              <br />
            </div>
          )

        return (
          <div key={ct.id}>
            {ct.sprites.map((spr: SpriteContent, idx: number) => (
              <div key={spr.spriteId}>
                <img src={`sprites/${spr.spriteId}.png`} />
                {(idx - 1) % ct.size[0] === 0 && <br />}
              </div>
            ))}
            <br />
          </div>
        )
      })}
    </div>
  )
}

export default App
