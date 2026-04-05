# Task 10: Upgrade Vite to 6.x in map-editor and sprite-editor

| Field        | Value                              |
|--------------|------------------------------------|
| Task ID      | 10                                 |
| Status       | completed                          |
| Phase        | 2 - Structural Improvements        |
| Complexity   | Medium                             |
| Dependencies | Task 7                             |
| PRD Refs     | FR-12                              |

---

## Objective

Upgrade Vite from 4.x to 6.x and `@vitejs/plugin-react` from 3.x to 4.x in both map-editor and sprite-editor.

## Requirements

1. Update in `map-editor/package.json` devDependencies:
   - `vite`: `^4.2.0` to `^6.0.0`
   - `@vitejs/plugin-react`: `^3.1.0` to `^4.3.0`

2. Update in `sprite-editor/package.json` devDependencies:
   - `vite`: `^4.2.0` to `^6.0.0`
   - `@vitejs/plugin-react`: `^3.1.0` to `^4.3.0`

3. Update `tsconfig.node.json` in both packages:
   - Change `"moduleResolution": "Node"` to `"moduleResolution": "bundler"` (Vite 6 requirement)

## Files to Modify

- `map-editor/package.json`
- `map-editor/tsconfig.node.json`
- `sprite-editor/package.json`
- `sprite-editor/tsconfig.node.json`

## Implementation Details

### Breaking changes in Vite 5/6 relevant to this project:
- Vite 5 dropped Node 14/16 support (not relevant, we are on Node 22)
- Vite 5 changed CJS Node API to ESM only (both packages already use `"type": "module"`)
- Vite 6 `Environment API` -- default configs remain compatible
- `moduleResolution: "Node"` in `tsconfig.node.json` must change to `"bundler"` for Vite 6 compatibility

### vite.config.ts
The existing configs are minimal (`plugins: [react()]`) and require no changes beyond ensuring the imports resolve correctly with the new version.

## Verification

- [ ] `npm -w map-editor run dev` starts the map editor dev server
- [ ] `npm -w sprite-editor run dev` starts the sprite editor dev server
- [ ] `npm -w map-editor run build` completes without errors
- [ ] `npm -w sprite-editor run build` completes without errors
- [ ] Map editor can select and place tiles
- [ ] Sprite editor displays sprite grid
