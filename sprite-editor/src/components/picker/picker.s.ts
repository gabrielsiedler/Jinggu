import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
`

export const Modal = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  width: 80vw;
  max-width: 960px;
  height: 80vh;
  max-height: 720px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
`

export const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;

  &:hover {
    color: #333;
  }

  &:focus {
    outline: 2px solid #888;
    outline-offset: 2px;
  }
`

export const SearchRow = styled.div`
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`

export const GridContainer = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 8px;
`

export const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 14px;
`

export const Cell = styled.div<{ $selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid ${(p) => (p.$selected ? '#2563eb' : 'transparent')};
  background: ${(p) => (p.$selected ? 'rgba(37, 99, 235, 0.08)' : 'transparent')};

  &:hover {
    background: ${(p) => (p.$selected ? 'rgba(37, 99, 235, 0.12)' : '#f0f0f0')};
  }
`

export const Thumbnail = styled.img`
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  object-fit: contain;
`

export const ThumbnailPlaceholder = styled.div`
  width: 32px;
  height: 32px;
  background: #f0f0f0;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #aaa;
`

export const Filename = styled.div`
  font-size: 9px;
  color: #666;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 44px;
  margin-top: 2px;
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid #ddd;
  flex-shrink: 0;
`

export const CountLabel = styled.div`
  font-size: 12px;
  color: #888;
`

export const FooterActions = styled.div`
  display: flex;
  gap: 8px;
`

export const CancelButton = styled.button`
  padding: 8px 16px;
  font-size: 13px;
  color: #333;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }

  &:focus {
    outline: 2px solid #888;
    outline-offset: 2px;
  }
`

export const ConfirmButton = styled.button`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: #2563eb;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }

  &:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`
