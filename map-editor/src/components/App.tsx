import { useRecoilState } from 'recoil'

import map from '../map.json'
import { pickerOpenState } from '../recoil/picker'
import { Picker } from './picker/Picker'
import { Tile } from './tile/Tile'

const App = () => {
  const [isPickerOpen] = useRecoilState(pickerOpenState)

  return (
    <div className="App">
      {map.map((line: any, j: number) => (
        <div key={`j${j}`} style={{ display: 'flex' }}>
          {line.map((tile: any, i: number) => (
            <Tile key={`i${i}j${j}`} ids={tile} />
          ))}
        </div>
      ))}
      {isPickerOpen && <Picker />}
    </div>
  )
}

export default App
