import FileSaver from 'file-saver'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { SelectableGroup } from 'react-selectable-fast'

import { mapState } from '../recoil/map'
import * as s from './app.s'
import { Button } from './button/Button'
import { Picker } from './picker/Picker'
import { Tile } from './tile/Tile'
import { pickerSelectedTileState } from '../recoil/picker'

const App = () => {
  const [map, setMap] = useRecoilState(mapState)
  const [selectedTile] = useRecoilState(pickerSelectedTileState)
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

    console.log(minI, maxI)
    console.log(minJ, maxJ)

    const selected: any = {}
    for (let i = minI; i <= maxI; i += 1) {
      for (let j = minJ; j <= maxJ; j += 1) {
        selected[`tile-${i}-${j}`] = false
        newMap[j][i] = [selectedTile]
      }
    }

    setSelectedTiles(selected)

    setMap(newMap)
  }

  console.log(selectedTiles)
  return (
    <s.Container>
      <Picker />
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
      <Button style={{ position: 'fixed', right: 0, top: 0 }} onClick={onSave}>
        Save map
      </Button>
    </s.Container>
  )
}

export default App
