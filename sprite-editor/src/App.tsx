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

  const toPath = (id: number) => require(`./sprites/${id}.png`)

  return (
    <div className="App">
      {Object.values(spriteLib).map((ct: any) => {
        if (ct.spriteId)
          return (
            <>
              <img key={ct.id} src={toPath(ct.spriteId)} />
              <br />
            </>
          )

        return (
          <>
            {ct.sprites.map((spr: SpriteContent, idx: number) => (
              <>
                <img key={`${ct.id}-${idx}`} src={toPath(spr.spriteId)} />
                {(idx - 1) % ct.size[0] === 0 && <br />}
              </>
            ))}
            <br />
          </>
        )
      })}
    </div>
  )
}

export default App
