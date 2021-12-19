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

  const [current, setCurrent]: any = useState(pickerIds)
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

  const onRemoveCurrent = (id: any) => {
    const newCurrent = current.filter((i: any) => i !== id)

    setCurrent(newCurrent)
  }

  const onAddSuggestion = (id: any) => {
    setCurrent([...current, id])
  }

  const onDrop = (e: any) => {
    console.log('dropped', e)
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
            {current.map((id: any) => (
              <div
                onClick={() => onRemoveCurrent(id)}
                draggable
                onDrop={onDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                }}
              >
                <s.Sprite title={id} src={`sprites/${id}.png`} />
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
              <div onClick={() => onAddSuggestion(id)}>
                <s.Sprite title={id} src={`sprites/${id}.png`} />
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
