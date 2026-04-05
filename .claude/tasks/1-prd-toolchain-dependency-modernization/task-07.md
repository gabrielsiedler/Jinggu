# Task 7: Set up npm workspaces

| Field        | Value                              |
|--------------|------------------------------------|
| Task ID      | 7                                  |
| Status       | completed                          |
| Phase        | 2 - Structural Improvements        |
| Complexity   | Medium                             |
| Dependencies | Tasks 1-6 (Phase 1 complete)       |
| PRD Refs     | FR-9                               |

---

## Objective

Migrate the monorepo from manual `cd && npm install` scripts to npm workspaces for centralized dependency management.

## Requirements

1. Add `"workspaces"` field to root `package.json`: `["client", "server", "shared", "map-editor", "sprite-editor"]`
2. Update package names to use `@jinggu/` scope:
   - `client/package.json`: `"name": "@jinggu/client"`
   - `server/package.json`: `"name": "@jinggu/server"`
   - `map-editor/package.json`: `"name": "@jinggu/map-editor"`
   - `sprite-editor/package.json`: `"name": "@jinggu/sprite-editor"`
3. Add `"private": true` to all packages that do not already have it (client, server)
4. Remove manual install scripts from root `package.json`:
   - Remove `postinstall` script
   - Remove `install:server` script
   - Remove `install:client` script
5. Update start scripts to use workspace syntax:
   - `"start:server": "npm -w server run dev"`
   - `"start:client": "npm -w client run dev"`
6. Delete all existing `node_modules` directories and `package-lock.json` files, then run `npm install` from root

## Files to Modify

- `package.json` (root)
- `client/package.json`
- `server/package.json`
- `map-editor/package.json`
- `sprite-editor/package.json`

## Implementation Details

npm workspaces will hoist common dependencies to the root `node_modules`. Each package retains its own `package.json` for package-specific dependencies. A single `npm install` from the root installs all dependencies across all workspaces.

The `shared` workspace is listed in the workspaces array but does not exist yet -- it will be created in Task 8. npm handles this gracefully (skips missing directories during install, or we can create a minimal placeholder).

## Verification

- [ ] `npm install` from root succeeds and installs all workspace dependencies
- [ ] `npm start` from root launches server and client
- [ ] `npm -w server run dev` starts the server
- [ ] `npm -w client run dev` starts the client
- [ ] `npm -w map-editor run dev` starts the map editor
- [ ] `npm -w sprite-editor run dev` starts the sprite editor
- [ ] No individual `package-lock.json` files in sub-packages (single root lock file)
