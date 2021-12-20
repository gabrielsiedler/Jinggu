import { atom } from 'recoil'

import map from '../map.json'

export const mapState = atom({
  key: 'map',
  default: map,
})
