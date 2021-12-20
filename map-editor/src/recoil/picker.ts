import { atom } from 'recoil'

export const pickerOpenState = atom({
  key: 'tile-picker-open',
  default: false,
})

export const pickerPositionState = atom({
  key: 'tile-picker-position',
  default: [0, 0],
})

export const pickerIdsState = atom({
  key: 'tile-picker-ids',
  default: [],
})

export const pickerTileState = atom({
  key: 'tile-picker-tile',
  default: [0, 0],
})
