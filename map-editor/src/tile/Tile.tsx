import { useState } from 'react'
import * as s from './tile.s'

interface Props {
  ids: number[]
}

export const Tile = ({ ids }: Props) => {
  const [tile, setTile]: any = useState(ids)

  const onOpen = () => {
    const result = window.prompt('Change to', ids.join(','))

    if (!result) return

    const trimmedResult = result?.split(',').map((v) => Number(v.trim()))

    setTile(trimmedResult)
  }

  return (
    <s.Tile onClick={onOpen}>
      {tile.map((id: number, i: number) => (
        <s.Sprite key={`${i}-${id}`} src={`sprites/${id}.png`} />
      ))}
    </s.Tile>
  )
}
