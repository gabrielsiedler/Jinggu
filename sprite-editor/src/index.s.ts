import styled from 'styled-components'

export const App = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 24px;
`

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
`

export const Repository = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const EntryGroup = styled.div`
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background-color: #f0f0f0;
  }
`

export const EntryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Sprite = styled.img`
  width: 32px;
  height: 32px;
`

export const EntryLabel = styled.span`
  font-size: 14px;
  color: #444;
`

export const VariantCount = styled.span`
  font-size: 12px;
  color: #888;
`

export const VariantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 32px);
  grid-gap: 4px;
  padding: 8px 0 8px 40px;
`

export const RepositoryItem = styled.div`
  width: 32px;
  height: 32px;
`
