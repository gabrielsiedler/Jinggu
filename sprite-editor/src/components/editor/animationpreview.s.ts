import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #fafafa;
`

export const Title = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  align-self: flex-start;
`

export const FrameDisplay = styled.div`
  width: 96px;
  height: 96px;
  border: 1px solid #ccc;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const FrameImage = styled.img`
  width: 96px;
  height: 96px;
  image-rendering: pixelated;
`

export const FramePlaceholder = styled.div`
  font-size: 11px;
  color: #999;
`

export const FrameLabel = styled.div`
  font-size: 11px;
  color: #666;
`

export const ButtonRow = styled.div`
  display: flex;
  gap: 4px;
`

export const DirectionButton = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  font-size: 11px;
  color: ${(p) => (p.$active ? '#fff' : '#555')};
  background: ${(p) => (p.$active ? '#555' : '#fff')};
  border: 1px solid ${(p) => (p.$active ? '#555' : '#ccc')};
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: ${(p) => (p.$active ? '#444' : '#f0f0f0')};
  }
`

export const AnimTypeButton = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  font-size: 11px;
  color: ${(p) => (p.$active ? '#fff' : '#555')};
  background: ${(p) => (p.$active ? '#668' : '#fff')};
  border: 1px solid ${(p) => (p.$active ? '#668' : '#ccc')};
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: ${(p) => (p.$active ? '#557' : '#f0f0f0')};
  }
`
