# Task 5: Clean up server dependencies

| Field        | Value                              |
|--------------|------------------------------------|
| Task ID      | 5                                  |
| Status       | completed                          |
| Phase        | 1 - Quick Wins                     |
| Complexity   | Low                                |
| Dependencies | None                               |
| PRD Refs     | FR-5, FR-6                         |

---

## Objective

Remove the unused `http-proxy-middleware` dependency from the server and add `@types/node` ^22 for proper Node.js type definitions.

## Requirements

1. Remove `http-proxy-middleware` from `server/package.json` dependencies (confirmed unused -- no imports found in server/src/)
2. Add `@types/node` `^22.0.0` to `server/package.json` devDependencies

## Files to Modify

- `server/package.json`

## Implementation Details

A search of `server/src/` confirms zero usage of `http-proxy-middleware`. It is safe to remove. The `@types/node` package is currently absent from the server's devDependencies but is needed for proper type checking with Node 22.

## Verification

- [ ] `npm install` in server/ succeeds without http-proxy-middleware
- [ ] Server starts and runs correctly
- [ ] `npx tsc --noEmit` passes (after TypeScript upgrade from Task 2)
