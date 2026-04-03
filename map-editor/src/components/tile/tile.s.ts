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
  width: 32px;
  height: 32px;
  pointer-events: none;
  user-select: none;
  image-rendering: pixelated;
`

export const GhostSprite = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  pointer-events: none;
  opacity: 0.5;
  image-rendering: pixelated;
`

export const ConflictOverlay = styled.div<{ $type: 'oob' | 'overlap' }>`
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  pointer-events: none;
  border: 2px solid ${(p) => (p.$type === 'oob' ? '#ff4444' : '#ffaa00')};
  box-sizing: border-box;
`

export const DragSelection = styled.div`
  position: absolute;
  background: rgba(80, 120, 255, 0.2);
  border: 2px solid rgba(80, 120, 255, 0.6);
  pointer-events: none;
`

export const SelectedOverlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  pointer-events: none;
  border: 2px solid #4488ff;
  box-sizing: border-box;
`
