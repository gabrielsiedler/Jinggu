import React from 'react'
import './App.css'
import { Sprite, SpriteMap } from './types.i'
import * as s from './index.s'

const arrayRange = (start: number, stop: number, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (value, index) => start + index * step)

const rangeArray = arrayRange(0, 1956)

const App = () => {
  const spriteLib: SpriteMap = {}

  return (
    <s.App>
      <s.Repository>
        {}
        {rangeArray.map((ct: any) => (
          <s.RepositoryItem key={ct}>
            <img src={`sprites/${ct}.png`} />
          </s.RepositoryItem>
        ))}
      </s.Repository>
      {/* {Object.values(spriteLib).map((ct: any) => {
        if (ct.spriteId)
          return (
            <div key={ct.id}>
              <img src={`sprites/${ct.spriteId}.png`} />
              <br />
            </div>
          )

        return (
          <div key={ct.id}>
            {ct.sprites.map((spr: Sprite, idx: number) => (
              <div key={spr.id}>
                <img src={`sprites/${spr.spriteId}.png`} />
                {(idx - 1) % ct.size[0] === 0 && <br />}
              </div>
            ))}
            <br />
          </div>
        )
      })} */}
    </s.App>
  )
}

export default App
