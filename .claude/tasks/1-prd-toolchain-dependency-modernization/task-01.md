# Task 1: Replace ts-node-dev with tsx in server

| Field        | Value                              |
|--------------|------------------------------------|
| Task ID      | 1                                  |
| Status       | completed                          |
| Phase        | 1 - Quick Wins                     |
| Complexity   | Low                                |
| Dependencies | None                               |
| PRD Refs     | FR-1                               |

---

## Objective

Replace the stale `ts-node-dev` development runner with `tsx` (esbuild-powered) in the server package for faster TypeScript transpilation and file watching.

## Requirements

1. Remove `ts-node-dev` from `server/package.json` devDependencies
2. Add `tsx` (`^4.19`) to `server/package.json` devDependencies
3. Update `server/package.json` dev script from `ts-node-dev src/index.ts` to `tsx watch src/index.ts`
4. Verify the server starts and runs correctly with `tsx watch`

## Files to Modify

- `server/package.json` -- swap dependency and update script

## Implementation Details

The `tsx` package uses esbuild under the hood for near-instant TypeScript transpilation. The `watch` subcommand provides file-watching with automatic restart, equivalent to `ts-node-dev`. No source code changes are needed since `tsx` supports CommonJS modules.

## Verification

- [ ] `cd server && npm run dev` starts the server on port 3008
- [ ] Server logs "Jinggu server on at 3008"
- [ ] No runtime errors on startup
