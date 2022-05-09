import { createSelectable } from 'react-selectable-fast'

import * as s from './tile.s'

interface Props {
  ids: number[]
  i: number
  j: number
}

const TileComponent = ({ ids, i, j, selectableRef, isSelecting, selectedVar }: Props & any) => {
  if (selectedVar) console.log('selected', i, j)

  let style: any = {}

  if (isSelecting) {
    style.opacity = 0.5
  }

  return (
    <s.Tile ref={selectableRef} selected={selectedVar} draggable={false} style={style}>
      {ids.map((id: number, i: number) => (
        <s.Sprite draggable={false} key={`${i}-${j}-${id}`} src={`sprites/${id}.png`} />
      ))}
      <s.Draggable draggable />
    </s.Tile>
  )
}

export const Tile = createSelectable(TileComponent)
