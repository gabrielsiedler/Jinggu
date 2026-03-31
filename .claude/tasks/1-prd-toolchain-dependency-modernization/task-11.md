# Task 11: Align styled-components on v6 in map-editor

| Field        | Value                              |
|--------------|------------------------------------|
| Task ID      | 11                                 |
| Status       | completed                          |
| Phase        | 2 - Structural Improvements        |
| Complexity   | Low                                |
| Dependencies | Task 7                             |
| PRD Refs     | FR-13                              |

---

## Objective

Upgrade styled-components from v5 to v6 in the map-editor to align with sprite-editor (already on v6).

## Requirements

1. Update `styled-components` from `^5.3.9` to `^6.1.0` in `map-editor/package.json` dependencies
2. Remove `@types/styled-components` from devDependencies if present (types are built-in in v6)
3. Verify all styled components in map-editor still render correctly

## Files to Modify

- `map-editor/package.json`

## Implementation Details

### Breaking changes in styled-components v6:
- Dropped vendor prefixing by default (uses `shouldForwardProp` instead of `attrs` filtering)
- Removed `@types/styled-components` (types are built-in in v6)
- The `css` prop requires Babel plugin configuration, but the map-editor does not use the `css` prop

### Impact assessment:
The map-editor styled components (`app.s.ts`, `button.s.ts`, `input.s.ts`, `picker.s.ts`, `tile.s.ts`) use basic styled component patterns (tagged template literals). No API changes are expected to be needed.

## Verification

- [ ] Map editor launches without styled-components errors
- [ ] UI elements render correctly (picker, tiles, buttons)
- [ ] `npx tsc --noEmit` passes in map-editor/
