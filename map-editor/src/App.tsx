import './App.css'

import map from './map.json'

const SQ = ({ color }: any) => (
  <div style={{ backgroundColor: `#${color}${color}${color}`, width: 10, height: 10 }}></div>
)

function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', border: '1px solid black' }}>
      {map.map((line: any, j: number) => (
        <div key={`j${j}`} style={{ display: 'flex' }}>
          {line.map((tile: any, i: number) => (
            <SQ key={`i${i}j${j}`} color={tile[tile.length - 1]} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default App
