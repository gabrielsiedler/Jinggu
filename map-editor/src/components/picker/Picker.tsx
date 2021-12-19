import { useRecoilState } from 'recoil'

import { pickerIdsState, pickerOpenState, pickerPositionState } from '../../recoil/picker'
import * as s from './picker.s'

export const Picker = () => {
  const [pickerPosition] = useRecoilState(pickerPositionState)
  const [pickerIds] = useRecoilState(pickerIdsState)
  const [_, setPickerOpen] = useRecoilState(pickerOpenState)

  return (
    <s.Picker pos={pickerPosition}>
      <s.Container>
        Current:
        <s.Current>
          {pickerIds.map((id) => (
            <img style={{ width: '32', height: '32' }} src={`sprites/${id}.png`} />
          ))}
        </s.Current>
      </s.Container>
      <s.Buttons>
        <button>Save</button>
        <button onClick={() => setPickerOpen(false)}>Cancel</button>
      </s.Buttons>
    </s.Picker>
  )
}
