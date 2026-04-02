import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 4px;
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  font-size: 13px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  background: #fff;
  flex-shrink: 0;

  &:focus {
    border-color: #888;
  }

  &::placeholder {
    color: #aaa;
  }
`

export const CategoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const CategorySection = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`

export const CategoryHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  background: #f0f0f0;
  border: none;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #e8e8e8;
  }
`

export const CategoryHeaderLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const Arrow = styled.span<{ $expanded: boolean }>`
  display: inline-block;
  font-size: 10px;
  transition: transform 0.15s ease;
  transform: ${(p) => (p.$expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
`

export const Count = styled.span`
  font-size: 11px;
  font-weight: 400;
  color: #888;
`

export const SpriteListContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const ItemRow = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 4px 10px;
  font-size: 12px;
  color: #333;
  background: ${(p) => (p.$selected ? '#d0e4ff' : 'transparent')};
  border: none;
  border-top: 1px solid #eee;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${(p) => (p.$selected ? '#c0d8f8' : '#f5f5f5')};
  }
`

export const Thumbnail = styled.img`
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  flex-shrink: 0;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
`

export const ThumbnailPlaceholder = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  background: #e8e8e8;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #999;
`

export const ItemName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Badge = styled.span`
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 8px;
  background: #e0e0e0;
  color: #555;
  flex-shrink: 0;
`

export const TypeIndicator = styled.span`
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 8px;
  background: #f0e8d0;
  color: #886;
  flex-shrink: 0;
`

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
`

export const FooterCount = styled.div`
  font-size: 11px;
  color: #888;
  text-align: center;
`

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  padding: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
    border-color: #bbb;
  }
`
