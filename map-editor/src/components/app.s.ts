import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  max-height: 100vh;
  height: 100vh;
  overflow: hidden;
`

export const Sidebar = styled.aside`
  width: 240px;
  flex-shrink: 0;
  padding: 8px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
`

export const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
  background: #fafafa;
`

export const SaveButton = styled.button<{ $status?: string }>`
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background: ${(p) =>
    p.$status === 'saving'
      ? '#eee'
      : p.$status === 'success'
        ? '#d4edda'
        : p.$status === 'error'
          ? '#f8d7da'
          : '#fff'};

  &:hover {
    background: #f0f0f0;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export const StatusText = styled.span<{ $status?: string }>`
  font-size: 12px;
  color: ${(p) =>
    p.$status === 'success' ? '#28a745' : p.$status === 'error' ? '#dc3545' : '#888'};
`

export const CanvasContainer = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
`

export const MapGrid = styled.div`
  display: inline-flex;
  flex-direction: column;
`

export const MapRow = styled.div`
  display: flex;
`

export const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 12px;
  font-size: 16px;
  color: #666;
`

export const ErrorScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 12px;
  font-size: 16px;
  color: #dc3545;
`

export const RetryButton = styled.button`
  padding: 8px 20px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;

  &:hover {
    background: #f0f0f0;
  }
`

export const PointerButton = styled.button<{ $active?: boolean }>`
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid ${(p) => (p.$active ? '#4488ff' : '#ccc')};
  border-radius: 4px;
  cursor: pointer;
  background: ${(p) => (p.$active ? '#e3eeff' : '#fff')};
  color: ${(p) => (p.$active ? '#2266cc' : '#333')};

  &:hover {
    background: ${(p) => (p.$active ? '#d0e0ff' : '#f0f0f0')};
  }
`

export const LayerInspector = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  margin-left: 8px;
  border-left: 1px solid #e0e0e0;
  font-size: 12px;
  color: #666;
  flex-shrink: 0;
  overflow-x: auto;
  max-width: 60%;
`

export const LayerChip = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border: 1px solid ${(p) => (p.$selected ? '#4488ff' : '#ddd')};
  border-radius: 4px;
  background: ${(p) => (p.$selected ? '#e3eeff' : '#fff')};
  cursor: pointer;
  flex-shrink: 0;
  user-select: none;

  &:hover {
    border-color: #4488ff;
  }
`

export const LayerChipImage = styled.img`
  width: 20px;
  height: 20px;
  image-rendering: pixelated;
`

export const LayerChipLabel = styled.span`
  font-size: 11px;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const DeleteLayerButton = styled.button`
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid #e0a0a0;
  border-radius: 4px;
  cursor: pointer;
  background: #fff0f0;
  color: #cc4444;
  flex-shrink: 0;

  &:hover {
    background: #ffe0e0;
  }
`
