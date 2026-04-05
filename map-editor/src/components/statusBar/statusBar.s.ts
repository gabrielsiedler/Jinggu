import styled from 'styled-components'

export const StatusBarContainer = styled.footer`
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  background: #1e1e1e;
  color: #ccc;
  font-family: monospace;
  font-size: 12px;
  border-top: 1px solid #333;
  flex-shrink: 0;
  gap: 16px;
  user-select: none;
`

export const CoordinateDisplay = styled.span`
  min-width: 80px;
`

export const Spacer = styled.span`
  flex: 1;
`

export const ZoomDisplay = styled.span`
  min-width: 40px;
  text-align: right;
`

export const ResetZoomButton = styled.button`
  padding: 2px 8px;
  font-size: 11px;
  font-family: monospace;
  border: 1px solid #555;
  border-radius: 3px;
  background: transparent;
  color: #ccc;
  cursor: pointer;

  &:hover {
    background: #333;
    color: #fff;
  }

  &:focus-visible {
    outline: 2px solid #4488ff;
    outline-offset: 1px;
  }
`
