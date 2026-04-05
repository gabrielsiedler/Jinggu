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
  z-index: 1000;
`

export const Dialog = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  padding: 24px;
  min-width: 320px;
  max-width: 440px;
`

export const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`

export const Message = styled.div`
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 20px;
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
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

export const ConfirmButton = styled.button<{ $variant?: 'danger' | 'primary' }>`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: ${(p) => (p.$variant === 'danger' ? '#c00' : '#2563eb')};
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${(p) => (p.$variant === 'danger' ? '#a00' : '#1d4ed8')};
  }

  &:focus {
    outline: 2px solid ${(p) => (p.$variant === 'danger' ? '#c00' : '#2563eb')};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`
