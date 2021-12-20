import { useRecoilState } from 'recoil'
import { mapState } from '../../recoil/map'

import { pickerIdsState, pickerOpenState, pickerPositionState, pickerTileState } from '../../recoil/picker'
import * as s from './tile.s'

interface Props {
  ids: number[]
  i: number
  j: number
}

export const Tile = ({ ids, i, j }: Props) => {
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
    <s.Tile onClick={onOpen}>
      {ids.map((id: number, i: number) => (
        <s.Sprite key={`${i}-${id}`} src={`sprites/${id}.png`} />
      ))}
    </s.Tile>
  )
}
