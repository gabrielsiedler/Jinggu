import styled from 'styled-components'

export const App = styled.div`
  display: flex;
`

export const Repository = styled.div`
  background-color: brown;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 5px;
  max-height: 500px;
  overflow-y: auto;
`

export const RepositoryItem = styled.div`
  width: 32px;
  height: 32px;
`
