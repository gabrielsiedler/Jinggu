# Task 13: Migrate server from CommonJS to ESM

| Field        | Value                              |
|--------------|------------------------------------|
| Task ID      | 13                                 |
| Status       | completed                          |
| Phase        | 3 - Larger Migrations              |
| Complexity   | High                               |
| Dependencies | Task 8                             |
| PRD Refs     | FR-15                              |

---

## Objective

Migrate the server package from CommonJS to ESM module system, including adding `"type": "module"` to package.json, updating tsconfig module settings, and adding `.js` extensions to all relative imports.

## Requirements

1. Add `"type": "module"` to `server/package.json`
2. Update `server/tsconfig.json`:
   - Change `"module": "commonjs"` to `"module": "nodenext"`
   - Change `"moduleResolution": "node"` to `"moduleResolution": "nodenext"`
3. Add `.js` extensions to ALL relative imports in server source files
4. Add `with { type: 'json' }` import attributes to all JSON imports

## Files to Modify

- `server/package.json` -- add `"type": "module"`
- `server/tsconfig.json` -- update module and moduleResolution
- `server/src/index.ts` -- add .js extension to `./socket` import
- `server/src/socket.ts` -- add .js extensions to `./core` and `./lib/Player` imports, add JSON import attribute for `./data/sprites.json`
- `server/src/core.ts` -- add .js extensions to `./lib/Map`, `./lib/Memory`, `./lib/sprite.i` (or `@jinggu/shared`) imports, add JSON import attribute for `./data/sprites.json`
- `server/src/core.i.ts` -- add .js extension to `./lib/Player` import
- `server/src/lib/Player.ts` -- update Direction import (already from `@jinggu/shared` after Task 8), add .js extension to `../core` import
- `server/src/lib/Map.ts` -- add .js extensions to `../core`, `./Tile` imports, add JSON import attribute for `../data/map.json`
- `server/src/lib/Memory.ts` -- add .js extensions to any relative imports
- `server/src/lib/Tile.ts` -- add .js extensions to any relative imports

## Implementation Details

### Import extension pattern:
```typescript
// Before:
import { setupCommunication } from './socket'
// After:
import { setupCommunication } from './socket.js'
```

### JSON import pattern:
```typescript
// Before:
import sprites from './data/sprites.json'
// After:
import sprites from './data/sprites.json' with { type: 'json' }
```

Node 22 supports import attributes natively. TypeScript with `module: "nodenext"` requires explicit `.js` extensions for relative imports (even though source files are `.ts`, the compiled output would be `.js`).

### tsx compatibility:
`tsx` supports ESM natively. The `tsx watch` command works with `"type": "module"` without configuration changes.

### @jinggu/shared imports:
Package imports (like `@jinggu/shared`) do NOT need `.js` extensions -- only relative imports do.

## Verification

- [ ] Server starts with `tsx watch src/index.ts`
- [ ] Server logs "Jinggu server on at 3008"
- [ ] Client connects and receives initial data
- [ ] All socket events work (move, dance, message)
- [ ] `npx tsc --noEmit` passes in server/
- [ ] No CommonJS syntax remains (`require()`, `module.exports`)
