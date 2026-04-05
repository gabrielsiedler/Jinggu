# Task 3: Update ES target to ES2022 in client and server

| Field        | Value                              |
|--------------|------------------------------------|
| Task ID      | 3                                  |
| Status       | completed                          |
| Phase        | 1 - Quick Wins                     |
| Complexity   | Low                                |
| Dependencies | None                               |
| PRD Refs     | FR-3                               |

---

## Objective

Update the TypeScript compilation target from `es5` to `es2022` in the client and server tsconfig files. Map-editor and sprite-editor already use `ESNext` and need no changes.

## Requirements

1. In `server/tsconfig.json`: change `"target": "es5"` to `"target": "es2022"`
2. In `client/tsconfig.json`: change `"target": "es5"` to `"target": "es2022"`
3. Optionally update `"lib"` arrays from `["dom", "dom.iterable", "esnext"]` to `["dom", "dom.iterable", "es2022"]` for precision (not required since esnext is a superset)

## Files to Modify

- `server/tsconfig.json`
- `client/tsconfig.json`

## Implementation Details

ES2022 enables native output of class fields, nullish coalescing (`??`), optional chaining (`?.`), `Promise.allSettled`, `Array.at()`, top-level await, and private fields. This eliminates helper code that would be injected for ES5 downleveling. Node 22 and all modern browsers fully support ES2022.

## Verification

- [ ] `npx tsc --noEmit` passes in server/
- [ ] `npx tsc --noEmit` passes in client/
- [ ] Server starts and runs correctly
