import { useRecoilState } from 'recoil'
import FileSaver from 'file-saver'

import { mapState } from '../recoil/map'
import { pickerOpenState } from '../recoil/picker'
import { Button } from './button/Button'
import { Picker } from './picker/Picker'
import { Tile } from './tile/Tile'

const App = () => {
  const [isPickerOpen] = useRecoilState(pickerOpenState)
  const [map] = useRecoilState(mapState)

  const onSave = () => {
    const asString = JSON.stringify(map)
    const blob = new Blob([asString], { type: 'application/json' })

    FileSaver.saveAs(blob, 'map.json')
  }
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
      <Button style={{ position: 'fixed', left: 0, top: 0 }} onClick={onSave}>
        Save map
      </Button>
    </div>
  )
}

export default App
