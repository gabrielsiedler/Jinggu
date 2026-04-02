import styled from 'styled-components'

export const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  min-height: 40px;
  flex-shrink: 0;
`

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const Title = styled.h1`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
`

export const Center = styled.div`
  display: flex;
  align-items: center;
`

export const ImageCount = styled.span`
  font-size: 12px;
  color: #888;
`

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const SaveButton = styled.button<{ $saving?: boolean }>`
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: ${(p) => (p.$saving ? '#e0e0e0' : '#fff')};
  color: #333;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: #e8e8e8;
    border-color: #bbb;
  }
`

export const StatusText = styled.span<{ $variant?: 'idle' | 'saving' | 'success' | 'error' }>`
  font-size: 13px;
  color: ${(p) => {
    switch (p.$variant) {
      case 'saving':
        return '#888'
      case 'success':
        return '#2a8'
      case 'error':
        return '#c00'
      default:
        return '#888'
    }
  }};
`

export const DirtyIndicator = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e8a020;
`
