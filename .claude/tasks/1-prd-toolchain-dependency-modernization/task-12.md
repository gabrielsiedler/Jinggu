# Task 12: Replace Recoil with Jotai in map-editor

| Field        | Value                              |
|--------------|------------------------------------|
| Task ID      | 12                                 |
| Status       | completed                          |
| Phase        | 3 - Larger Migrations              |
| Complexity   | Medium                             |
| Dependencies | Tasks 10, 11                       |
| PRD Refs     | FR-14                              |

---

## Objective

Replace the abandoned Recoil state management library with Jotai in the map-editor. All existing state management behavior must remain identical.

## Requirements

1. Remove `recoil` (^0.7.7) from `map-editor/package.json` dependencies
2. Add `jotai` (^2.x) to `map-editor/package.json` dependencies
3. Rename `map-editor/src/recoil/` directory to `map-editor/src/atoms/`
4. Rewrite atom definitions to use Jotai API
5. Update all component imports from `useRecoilState` to `useAtom`
6. Remove `<RecoilRoot>` from `main.tsx`

## Files to Create

- `map-editor/src/atoms/map.ts` (replaces `recoil/map.ts`)
- `map-editor/src/atoms/picker.ts` (replaces `recoil/picker.ts`)

## Files to Delete

- `map-editor/src/recoil/map.ts`
- `map-editor/src/recoil/picker.ts`
- `map-editor/src/recoil/` directory

## Files to Modify

- `map-editor/package.json` -- swap dependency
- `map-editor/src/main.tsx` -- remove RecoilRoot import and wrapper
- `map-editor/src/components/App.tsx` -- replace useRecoilState with useAtom, update imports
- `map-editor/src/components/picker/Picker.tsx` -- replace useRecoilState with useAtom, update imports

## Recoil to Jotai Mapping

### atoms/map.ts
```typescript
// Before (Recoil):
import { atom } from 'recoil'
import map from '../map.json'
export const mapState = atom({ key: 'map', default: map })

// After (Jotai):
import { atom } from 'jotai'
import map from '../map.json'
export const mapAtom = atom(map)
```

### atoms/picker.ts
```typescript
// Before (Recoil):
import { atom } from 'recoil'
export const pickerSelectedTileState = atom({ key: 'tile-picker-selected-tile', default: '339' })

// After (Jotai):
import { atom } from 'jotai'
export const pickerSelectedTileAtom = atom('339')
```

### main.tsx
```typescript
// Remove: import { RecoilRoot } from 'recoil'
// Remove: <RecoilRoot> wrapper
// Jotai uses default store, no provider needed
```

### App.tsx
```typescript
// Before:
import { useRecoilState } from 'recoil'
import { mapState } from '../recoil/map'
import { pickerSelectedTileState } from '../recoil/picker'
const [map, setMap] = useRecoilState(mapState)
const [selectedTile] = useRecoilState(pickerSelectedTileState)

// After:
import { useAtom } from 'jotai'
import { mapAtom } from '../atoms/map'
import { pickerSelectedTileAtom } from '../atoms/picker'
const [map, setMap] = useAtom(mapAtom)
const [selectedTile] = useAtom(pickerSelectedTileAtom)
```

### Picker.tsx
```typescript
// Same pattern as App.tsx -- replace useRecoilState with useAtom
```

## Verification

- [ ] Map editor launches without errors
- [ ] Tile picker shows sprites and allows selection
- [ ] Selecting tiles on the map applies the chosen sprite
- [ ] Saving the map produces correct JSON output
- [ ] `npx tsc --noEmit` passes in map-editor/
- [ ] No Recoil references remain in the codebase
