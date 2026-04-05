import { useEffect, useState } from 'react'
import { useSetAtom } from 'jotai'
import { registryAtom } from './atoms/registry'
import { allImageFilenamesAtom } from './atoms/images'
import { loadRegistry, listImages } from './api/spriteApi'
import StatusBar from './components/shared/StatusBar'
import Sidebar from './components/sidebar/Sidebar'
import EditorPanel from './components/editor/EditorPanel'
import CreateSpriteDialog from './components/sidebar/CreateSpriteDialog'
import ImagePicker from './components/picker/ImagePicker'
import * as s from './App.s'

const App = () => {
  const setRegistry = useSetAtom(registryAtom)
  const setAllImages = useSetAtom(allImageFilenamesAtom)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const [registry, images] = await Promise.all([loadRegistry(), listImages()])
        setRegistry(registry)
        setAllImages(images)
        setLoading(false)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load data'
        console.error('[App] Initialization error:', message)
        setError(message)
        setLoading(false)
      }
    }
    init()
  }, [setRegistry, setAllImages])

  if (loading) {
    return <s.LoadingContainer>Loading sprite registry...</s.LoadingContainer>
  }

  if (error) {
    return (
      <s.ErrorContainer>
        <div>Failed to load sprite editor</div>
        <div>{error}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </s.ErrorContainer>
    )
  }

  return (
    <s.AppContainer>
      <StatusBar />
      <s.MainLayout>
        <s.SidebarPanel>
          <Sidebar />
        </s.SidebarPanel>
        <s.EditorArea>
          <EditorPanel />
        </s.EditorArea>
      </s.MainLayout>
      <CreateSpriteDialog />
      <ImagePicker />
    </s.AppContainer>
  )
}

export default App
