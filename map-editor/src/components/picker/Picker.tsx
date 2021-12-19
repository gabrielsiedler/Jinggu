import { useRecoilState } from 'recoil'

import { pickerIdsState, pickerOpenState, pickerPositionState } from '../../recoil/picker'
import { Button } from '../button/Button'
import * as s from './picker.s'

export const Picker = () => {
  const [pickerPosition] = useRecoilState(pickerPositionState)
  const [pickerIds] = useRecoilState(pickerIdsState)
  const [_, setPickerOpen] = useRecoilState(pickerOpenState)

  const close = () => setPickerOpen(false)
  return (
    <s.Picker pos={pickerPosition}>
      <s.Title>
        Tile picker
        <button onClick={close}>x</button>
      </s.Title>
      <s.Container>
        <s.Section>
          Current:
          <s.Current>
            {pickerIds.map((id) => (
              <s.Sprite src={`sprites/${id}.png`} />
            ))}
          </s.Current>
        </s.Section>
        <s.Section>
          Add:
          <input />
          <s.Current>
            {pickerIds.map((id) => (
              <s.Sprite src={`sprites/${id}.png`} />
            ))}
          </s.Current>
        </s.Section>
      </s.Container>
      <s.Buttons>
        <Button secondary onClick={close}>
          Cancel
        </Button>
        <Button>Apply</Button>
      </s.Buttons>
    </s.Picker>
  )
}
