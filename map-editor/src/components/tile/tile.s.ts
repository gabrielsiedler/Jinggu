import styled from 'styled-components'

interface TileProps {
  selected?: boolean
}

export const Tile = styled.div<TileProps>`
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  flex-shrink: 0;

  &:hover {
    opacity: 0.8;
  }

  ${({ selected }) => selected && 'opacity: 0.4;'}
`

export const Sprite = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  user-drag: none;
  user-select: none;
`

export const Draggable = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`
