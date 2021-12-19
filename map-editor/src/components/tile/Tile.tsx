import { useRecoilState } from 'recoil'

import { pickerIdsState, pickerOpenState, pickerPositionState } from '../../recoil/picker'
import * as s from './tile.s'

interface Props {
  ids: number[]
}

export const Tile = ({ ids }: Props) => {
  const [_, setPickerOpen] = useRecoilState(pickerOpenState)
  const [_noop, setPickerPosition] = useRecoilState(pickerPositionState)
  const [_noop2, setPickerIds] = useRecoilState(pickerIdsState)

  const onOpen = (e: any) => {
    const { clientX, clientY } = e

    setPickerIds(ids as any)
    setPickerPosition([clientX / 32, clientY])
    setPickerOpen(true)
  }

  return (
    <s.Tile onClick={onOpen}>
      {ids.map((id: number, i: number) => (
        <s.Sprite key={`${i}-${id}`} src={`sprites/${id}.png`} />
      ))}
    </s.Tile>
  )
}
