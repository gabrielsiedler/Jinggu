import FileSaver from 'file-saver'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { SelectableGroup } from 'react-selectable-fast'

import { mapState } from '../recoil/map'
import { pickerOpenState } from '../recoil/picker'
import * as s from './app.s'
import { Button } from './button/Button'
import { Picker } from './picker/Picker'
import { Tile } from './tile/Tile'

const App = () => {
  const [isPickerOpen] = useRecoilState(pickerOpenState)
  const [map, setMap] = useRecoilState(mapState)
  const [selectedTiles, setSelectedTiles]: any = useState({})

  const onSave = () => {
    const asString = JSON.stringify(map)
    const blob = new Blob([asString], { type: 'application/json' })

    FileSaver.saveAs(blob, 'map.json')
  }

  const handleSelectionFinish = (items: any) => {
    if (!items || !items.length) return

    const newMap = JSON.parse(JSON.stringify(map))

    const minI = Math.min(items[0].props.i, items[items.length - 1].props.i)
    const minJ = Math.min(items[0].props.j, items[items.length - 1].props.j)
    const maxI = Math.max(items[0].props.i, items[items.length - 1].props.i)
    const maxJ = Math.max(items[0].props.j, items[items.length - 1].props.j)

    const selectedTile = '339'

    console.log(minI, maxI)
    console.log(minJ, maxJ)

    const selected: any = {}
    for (let i = minI; i <= maxI; i += 1) {
      for (let j = minJ; j <= maxJ; j += 1) {
        selected[`tile-${i}-${j}`] = true
        // newMap[j][i] = [selectedTile]
      }
    }

    setSelectedTiles(selected)

    // setMap(newMap)
  }

  console.log(selectedTiles)
  return (
    <s.Container>
      <SelectableGroup
        className="main"
        clickClassName="tick"
        resetOnStart
        tolerance={0}
        onSelectionFinish={handleSelectionFinish}
        ignoreList={['.not-selectable', '.item:nth-child(10)', '.item:nth-child(27)']}
      >
        {map.map((line: any, j: number) => (
          <div key={`j${j}`} style={{ display: 'flex' }}>
            {line.map((tile: any, i: number) => {
              const key = `tile-${i}-${j}`

              return <Tile key={key} i={i} j={j} ids={tile} selectedVar={selectedTiles[key]} />
            })}
          </div>
        ))}
      </SelectableGroup>
      {isPickerOpen && <Picker />}
      <Button style={{ position: 'fixed', left: 0, top: 0 }} onClick={onSave}>
        Save map
      </Button>
    </s.Container>
  )
}

export default App
