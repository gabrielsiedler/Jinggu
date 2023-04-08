import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useRecoilState } from 'recoil'

import availableIds from '../../available-sprite-ids.json'
import sprites from '../../sprites.json'
import { pickerSelectedTileState } from '../../recoil/picker'
import { Input } from '../input/Input'
import * as s from './picker.s'

export const Picker = () => {
  const [selectedTile, selectTile] = useRecoilState(pickerSelectedTileState)

  const [suggestions, setSuggestions]: any = useState(availableIds)

  const onChangeSearch = (e: any) => {
    const { value } = e.target

    if (!value?.length || value.length < 2) {
      setSuggestions(availableIds)
      return
    }

    const found = availableIds.filter((id: any) => String(id).indexOf(value) >= 0)

    setSuggestions(found)
  }

  return (
    <s.Picker>
      <s.Title>Tiles</s.Title>
      <s.Suggestions>
        <p>Search</p>
        <Input placeholder="tile id" onChange={onChangeSearch} />
        {suggestions.map((id: any) => (
          <s.Suggestion onClick={() => selectTile(id)} selected={selectedTile === id}>
            <s.Sprite title={id} src={`sprites/${id}.png`} />
            <FontAwesomeIcon icon={faPlus} />
          </s.Suggestion>
        ))}
      </s.Suggestions>
    </s.Picker>
  )
}
