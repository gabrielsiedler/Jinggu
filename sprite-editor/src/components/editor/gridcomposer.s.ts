import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
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
`

export const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Label = styled.span`
  font-size: 12px;
  color: #555;
`

export const NumberInput = styled.input.attrs({ type: 'number' })`
  width: 60px;
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #888;
  }
`

export const GridVisual = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols}, 36px);
  gap: 2px;
`

export const Cell = styled.div<{ $assigned: boolean }>`
  width: 36px;
  height: 36px;
  border: 1px solid ${(p) => (p.$assigned ? '#aac' : '#ccc')};
  border-radius: 2px;
  background: ${(p) => (p.$assigned ? '#f0f4ff' : '#fff')};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;

  &:hover {
    border-color: #888;
    background: #f8f8ff;
  }
`

export const CellImage = styled.img`
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
`

export const CellPlaceholder = styled.span`
  font-size: 14px;
  color: #bbb;
`

export const CellIndex = styled.span`
  position: absolute;
  bottom: 1px;
  right: 2px;
  font-size: 8px;
  color: #999;
`

export const EnableButton = styled.button`
  padding: 4px 10px;
  font-size: 11px;
  color: #555;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
    border-color: #bbb;
  }
`

export const RemoveButton = styled.button`
  padding: 4px 10px;
  font-size: 11px;
  color: #c00;
  background: #fff;
  border: 1px solid #dcc;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: #fef0f0;
  }
`

export const ComposedPreview = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols}, 32px);
  gap: 0;
  border: 1px solid #ccc;
  width: fit-content;
`

export const ComposedCell = styled.img`
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  display: block;
`

export const ComposedPlaceholder = styled.div`
  width: 32px;
  height: 32px;
  background: #eee;
`
