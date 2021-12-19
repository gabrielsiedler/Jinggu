import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useRecoilState } from 'recoil'

import availableIds from '../../available-sprite-ids.json'
import { pickerIdsState, pickerOpenState, pickerPositionState } from '../../recoil/picker'
import { Button } from '../button/Button'
import { Input } from '../input/Input'
import * as s from './picker.s'

export const Picker = () => {
  const [pickerPosition] = useRecoilState(pickerPositionState)
  const [pickerIds] = useRecoilState(pickerIdsState)
  const [_, setPickerOpen] = useRecoilState(pickerOpenState)

  const close = () => setPickerOpen(false)

  const [suggestions, setSuggestions]: any = useState([])

  const onChangeSearch = (e: any) => {
    const { value } = e.target

    if (!value?.length || value.length < 2) {
      setSuggestions([])
      return
    }

    const found = availableIds.filter((id: any) => String(id).indexOf(value) >= 0)

    setSuggestions(found)
  }

  return (
    <s.Picker pos={pickerPosition}>
      <s.Title>
        Tile picker
        <button onClick={close}>x</button>
      </s.Title>
      <s.Container>
        <s.Section>
          <p>Current</p>
          <s.Current>
            {pickerIds.map((id) => (
              <div>
                <s.Sprite src={`sprites/${id}.png`} />
                <FontAwesomeIcon icon={faTimes} />
              </div>
            ))}
          </s.Current>
        </s.Section>
        <s.Section>
          <p>Search</p>
          <Input placeholder="tile id" onChange={onChangeSearch} />
          <s.Suggestions>
            {suggestions.map((id: any) => (
              <div>
                <s.Sprite src={`sprites/${id}.png`} />
                <FontAwesomeIcon icon={faPlus} />
              </div>
            ))}
          </s.Suggestions>
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
