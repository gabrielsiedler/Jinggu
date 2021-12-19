import './App.css'

import map from './map.json'
import { Tile } from './components/tile/Tile'

function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', border: '1px solid black' }}>
      {map.map((line: any, j: number) => (
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
