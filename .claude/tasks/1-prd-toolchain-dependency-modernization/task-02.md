# Task 2: Update TypeScript to 5.8 across all packages

| Field        | Value                              |
|--------------|------------------------------------|
| Task ID      | 2                                  |
| Status       | completed                          |
| Phase        | 1 - Quick Wins                     |
| Complexity   | Low                                |
| Dependencies | None                               |
| PRD Refs     | FR-2                               |

---

## Objective

Upgrade TypeScript from 4.x to 5.8 in all four packages (client, server, map-editor, sprite-editor).

## Requirements

1. Update `typescript` to `^5.8.0` in:
   - `server/package.json` (dependencies -- currently in dependencies, not devDependencies)
   - `client/package.json` (devDependencies)
   - `map-editor/package.json` (devDependencies)
   - `sprite-editor/package.json` (devDependencies)
2. Run `npx tsc --noEmit` in each package to verify no new type errors

## Files to Modify

- `server/package.json`
- `client/package.json`
- `map-editor/package.json`
- `sprite-editor/package.json`

## Implementation Details

TypeScript 5.8 is backwards-compatible with 4.x for the language features used in this codebase. All packages use `strict: true` already. The server uses `module: commonjs`, client uses `module: esnext`, and map-editor/sprite-editor use `module: ESNext` -- all remain valid in TS 5.8.

Note: `typescript` is listed under `dependencies` in the server package.json (not devDependencies). Move it to `devDependencies` while updating the version, as TypeScript is a build tool, not a runtime dependency.

## Verification

- [ ] `npx tsc --noEmit` passes in server/
- [ ] `npx tsc --noEmit` passes in client/
- [ ] `npx tsc --noEmit` passes in map-editor/
- [ ] `npx tsc --noEmit` passes in sprite-editor/
