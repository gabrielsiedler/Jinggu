import './App.css'

import map from './map.json'
import { Tile } from './components/tile/Tile'
import { useEffect, useState } from 'react'

function App() {
  const [loading, setLoading] = useState(true)

  const loadAssets = async () => {
    setLoading(false)
  }

  useEffect(() => {
    loadAssets()
  }, [])

  return (
    <div className="App">
      {loading && <div>Loading</div>}
      {!loading &&
        map.map((line: any, j: number) => (
          <div key={`j${j}`} style={{ display: 'flex' }}>
            {line.map((tile: any, i: number) => (
              <Tile key={`i${i}j${j}`} ids={tile} />
            ))}
          </div>
        ))}
    </div>
  )
}

export default App
