import styled from 'styled-components'

export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 16px;
`

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 14px;
  color: #888;
`

export const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
`

export const PreviewImage = styled.img`
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  border: 1px solid #ccc;
  background: #f8f8f8;
`

export const PreviewPlaceholder = styled.div`
  width: 64px;
  height: 64px;
  border: 1px dashed #ccc;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
`

export const SpriteKeyLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
  word-break: break-all;
`

export const CategoryLabel = styled.div`
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const SectionTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 4px;
  border-bottom: 1px solid #eee;
`

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const FieldLabel = styled.label`
  font-size: 12px;
  color: #555;
  min-width: 100px;
  flex-shrink: 0;
`

export const TextInput = styled.input`
  flex: 1;
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #888;
  }

  &:disabled {
    background: #f0f0f0;
    color: #888;
  }
`

export const NumberInput = styled.input.attrs({ type: 'number' })`
  width: 80px;
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

export const Select = styled.select`
  flex: 1;
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: #fff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #888;
  }

  &:disabled {
    background: #f0f0f0;
    color: #888;
    cursor: default;
  }
`

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  cursor: pointer;
`

export const BaseImageRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`

export const BaseImageValue = styled.span`
  font-size: 12px;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const SmallButton = styled.button`
  padding: 3px 8px;
  font-size: 11px;
  color: #333;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
    border-color: #bbb;
  }
`

export const VariantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 108px;
`

export const VariantRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const VariantImage = styled.img`
  width: 24px;
  height: 24px;
  image-rendering: pixelated;
  border: 1px solid #ddd;
  background: #f8f8f8;
`

export const VariantName = styled.span`
  font-size: 11px;
  color: #555;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RemoveButton = styled.button`
  padding: 1px 5px;
  font-size: 10px;
  color: #c00;
  background: transparent;
  border: 1px solid #dcc;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: #fef0f0;
  }
`

export const AnimationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 108px;
`

export const AnimationTypeLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #666;
`

export const DirectionRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding-left: 8px;
`

export const DirectionLabel = styled.span`
  font-size: 11px;
  color: #888;
  min-width: 40px;
`

export const FrameList = styled.span`
  font-size: 11px;
  color: #555;
  word-break: break-all;
`

export const GridRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 108px;
`

export const GridLabel = styled.span`
  font-size: 12px;
  color: #555;
`

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #c00;
  background: #fff;
  border: 1px solid #dcc;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    background: #fef0f0;
    border-color: #c99;
  }
`
