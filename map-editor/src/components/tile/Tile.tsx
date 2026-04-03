import { memo } from 'react'
import type { MapTile as MapTileType } from '../../lib/MapModel'
import * as s from './tile.s'

interface Props {
  tile: MapTileType
  x: number
  y: number
  onClick: (x: number, y: number) => void
  onMouseDown?: (x: number, y: number) => void
  onMouseEnter?: (x: number, y: number) => void
  isSelected?: boolean
}

export const MapTile = memo(({ tile, x, y, onClick, onMouseDown, onMouseEnter, isSelected }: Props) => {
  return (
    <s.Tile
      onClick={() => onClick(x, y)}
      onMouseDown={(e) => {
        if (e.button === 0 && onMouseDown) onMouseDown(x, y)
      }}
      onMouseEnter={() => onMouseEnter?.(x, y)}
    >
      {tile.layers.map((layer, i) => (
        <s.Sprite key={i} src={`/sprites/${layer.resolvedId}.png`} draggable={false} />
      ))}
      {isSelected && <s.SelectedOverlay />}
    </s.Tile>
  )
})

MapTile.displayName = 'MapTile'
