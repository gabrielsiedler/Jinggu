import { useRecoilState } from 'recoil'
import { mapState } from '../../recoil/map'
import { TSelectableItemProps, createSelectable } from 'react-selectable-fast'

import { pickerIdsState, pickerOpenState, pickerPositionState, pickerTileState } from '../../recoil/picker'
import * as s from './tile.s'

interface Props {
  ids: number[]
  i: number
  j: number
}

interface SelectableProps {
  selectableRef: any
  isSelecting: boolean
}

const TileComponent = ({ ids, i, j, selectableRef, isSelecting }: Props & any) => {
  const setPickerTile = useRecoilState(pickerTileState)[1]
  const setPickerOpen = useRecoilState(pickerOpenState)[1]
  const setPickerPosition = useRecoilState(pickerPositionState)[1]
  const setPickerIds = useRecoilState(pickerIdsState)[1]
  const [map, setMap] = useRecoilState(mapState)

  const onOpen = (e: any) => {
    const { clientX, clientY } = e

    setPickerIds(ids as any)
    setPickerPosition([clientX / 32, clientY])
    setPickerOpen(true)
    setPickerTile([i, j])
  }

  return (
    <s.Tile ref={selectableRef} draggable={false} style={{ opacity: isSelecting ? 0.5 : 1 }}>
      {ids.map((id: number, i: number) => (
        <s.Sprite draggable={false} key={`${i}-${j}-${id}`} src={`sprites/${id}.png`} />
      ))}
      <s.Draggable draggable />
    </s.Tile>
  )
}

export const Tile = createSelectable(TileComponent)
