import { useRecoilState } from 'recoil'

import { mapState } from '../recoil/map'
import { pickerOpenState } from '../recoil/picker'
import { Picker } from './picker/Picker'
import { Tile } from './tile/Tile'

const App = () => {
  const [isPickerOpen] = useRecoilState(pickerOpenState)
  const [map] = useRecoilState(mapState)

  return (
    <div className="App">
      {map.map((line: any, j: number) => (
        <div key={`j${j}`} style={{ display: 'flex' }}>
          {line.map((tile: any, i: number) => (
            <Tile i={i} j={j} key={`tile-${i}-${j}`} ids={tile} />
          ))}
        </div>
      ))}
      {isPickerOpen && <Picker />}
    </div>
  )
}

export default App
