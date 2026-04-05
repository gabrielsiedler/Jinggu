# Task 8: Create shared types package

| Field        | Value                              |
|--------------|------------------------------------|
| Task ID      | 8                                  |
| Status       | completed                          |
| Phase        | 2 - Structural Improvements        |
| Complexity   | Medium                             |
| Dependencies | Task 7                             |
| PRD Refs     | FR-11                              |

---

## Objective

Create a `shared/` package within the monorepo containing TypeScript type definitions used by both client and server. Update consumers to import from the shared package.

## Requirements

1. Create `shared/` directory with:
   - `shared/package.json` (name: `@jinggu/shared`, private: true, main/types pointing to `src/index.ts`)
   - `shared/tsconfig.json`
   - `shared/src/index.ts` (barrel export)
   - `shared/src/direction.ts` (Direction enum)
   - `shared/src/player.ts` (PlayerFromServer interface)
   - `shared/src/sprite.ts` (Sprite, Sprites interfaces)
   - `shared/src/types.ts` (Point interface)

2. Update consumers to import from `@jinggu/shared`:
   - `server/src/lib/Player.ts`: import `Direction` from `@jinggu/shared` instead of local enum
   - `server/src/lib/sprite.i.ts`: delete file, import `Sprite`/`Sprites` from `@jinggu/shared`
   - `server/src/core.ts`: update import for `Sprites`
   - `client/src/player/player.i.ts`: import `Direction` and `PlayerFromServer` from `@jinggu/shared`, remove local definitions
   - `client/src/types.i.ts`: delete file, consumers import `Point` from `@jinggu/shared`

3. Add `@jinggu/shared` as a dependency in both `client/package.json` and `server/package.json`:
   ```json
   "@jinggu/shared": "*"
   ```

## Types to Extract

### Direction (from `server/src/lib/Player.ts` and `client/src/player/player.i.ts`)
```typescript
export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}
```

### Sprite and Sprites (from `server/src/lib/sprite.i.ts`)
```typescript
export interface Sprite {
  id: string | number
  walkable?: boolean
}

export interface Sprites {
  [key: Sprite['id']]: Sprite
}
```

### Point (from `client/src/types.i.ts`)
```typescript
export interface Point {
  x: number
  y: number
}
```

### PlayerFromServer (from `client/src/player/player.i.ts`)
```typescript
export interface PlayerFromServer {
  id: number
  pos: Point
  x: number
  y: number
  spriteBase: string
  level: number
  health: number
  name: string
}
```

## Files to Create

- `shared/package.json`
- `shared/tsconfig.json`
- `shared/src/index.ts`
- `shared/src/direction.ts`
- `shared/src/player.ts`
- `shared/src/sprite.ts`
- `shared/src/types.ts`

## Files to Modify

- `server/src/lib/Player.ts` -- import Direction from shared
- `server/src/core.ts` -- import Sprites from shared
- `server/src/core.i.ts` -- import Player type (keep, just update import path if needed)
- `client/src/player/player.i.ts` -- re-export from shared
- `client/src/types.i.ts` -- re-export from shared (or delete and update all importers)

## Files to Delete (or convert to re-exports)

- `server/src/lib/sprite.i.ts` -- replaced by shared/src/sprite.ts

## Implementation Details

The shared package is consumed as raw TypeScript source (no build step). Both `tsx` (server) and `Vite` (client) can resolve and transpile TypeScript source directly via the `main` field pointing to `src/index.ts`. npm workspaces resolves `@jinggu/shared` via symlink.

For client type files (`player.i.ts`, `types.i.ts`), convert them to re-export from shared rather than deleting, to avoid updating every consumer file in the client. This minimizes the blast radius.

## Verification

- [ ] `npm install` from root resolves @jinggu/shared
- [ ] Server starts and runs correctly with shared imports
- [ ] Client builds and connects correctly with shared imports
- [ ] `npx tsc --noEmit` passes in shared/
- [ ] `npx tsc --noEmit` passes in server/
- [ ] `npx tsc --noEmit` passes in client/
