import styled from 'styled-components'

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`

export const MainLayout = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
`

export const SidebarPanel = styled.div`
  width: 280px;
  min-width: 280px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  background: #fafafa;
  padding: 12px;
`

export const EditorArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 16px;
  color: #666;
`

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 16px;
  color: #c00;
  flex-direction: column;
  gap: 12px;
`
