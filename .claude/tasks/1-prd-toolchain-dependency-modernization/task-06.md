# Task 6: Update ancillary dependencies (concurrently, React types)

| Field        | Value                              |
|--------------|------------------------------------|
| Task ID      | 6                                  |
| Status       | completed                          |
| Phase        | 1 - Quick Wins                     |
| Complexity   | Low                                |
| Dependencies | None                               |
| PRD Refs     | FR-7, FR-8                         |

---

## Objective

Update `concurrently` in the root package and React type definitions in map-editor and sprite-editor.

## Requirements

1. Update `concurrently` from `^8.2.2` to `^9.0.0` in root `package.json` dependencies
2. Update `@types/react` from `^18.0.28` to `^18.3.0` in `map-editor/package.json` devDependencies
3. Update `@types/react-dom` from `^18.0.11` to `^18.3.0` in `map-editor/package.json` devDependencies
4. Update `@types/react` from `^18.0.28` to `^18.3.0` in `sprite-editor/package.json` devDependencies
5. Update `@types/react-dom` from `^18.0.11` to `^18.3.0` in `sprite-editor/package.json` devDependencies

## Files to Modify

- `package.json` (root)
- `map-editor/package.json`
- `sprite-editor/package.json`

## Implementation Details

Concurrently 9.x has no breaking changes for the usage pattern in this project (simple string commands in the `start` script). The React type definition updates are minor patch-level updates within React 18.

## Verification

- [ ] `npm start` from root launches both server and client via concurrently
- [ ] `npx tsc --noEmit` passes in map-editor/
- [ ] `npx tsc --noEmit` passes in sprite-editor/
