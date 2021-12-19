import styled from 'styled-components'

export const Tile = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  flex-shrink: 0;

  &:hover {
    opacity: 0.8;
  }
`

export const Sprite = styled.img`
  position: absolute;
  left: 0;
  top: 0;
`