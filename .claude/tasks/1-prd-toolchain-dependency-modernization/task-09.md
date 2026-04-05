# Task 9: Migrate client from Parcel to Vite

| Field        | Value                              |
|--------------|------------------------------------|
| Task ID      | 9                                  |
| Status       | completed                          |
| Phase        | 2 - Structural Improvements        |
| Complexity   | High                               |
| Dependencies | Task 7                             |
| PRD Refs     | FR-10                              |

---

## Objective

Replace Parcel with Vite as the bundler for the client package. All existing client functionality (Canvas rendering, Socket.IO connection, sprite loading) must continue to work.

## Requirements

### Dependencies to Remove
1. `parcel` (^2.12.0) from devDependencies
2. `@parcel/resolver-glob` (^2.16.4) from devDependencies
3. `@parcel/transformer-typescript-tsc` (^2.12.0) from devDependencies
4. `parcel-reporter-static-files-copy` (^1.5.3) from devDependencies

### Dependencies to Add
1. `vite` (^6.0.0) to devDependencies

### Files to Delete
1. `client/.parcelrc` -- Parcel pipeline configuration
2. `client/.proxyrc.js` -- Parcel dev server proxy (unnecessary with Vite)

### Files to Create
1. `client/vite.config.ts` -- Vite configuration
2. `client/src/vite-env.d.ts` -- Vite environment type declarations

### Files to Modify
1. `client/package.json` -- swap dependencies and update scripts
2. `client/index.html` -- update asset paths for Vite conventions
3. `client/src/socket.ts` -- replace `process.env.SERVER_URL` with `import.meta.env.SERVER_URL`
4. `client/tsconfig.json` -- add `"types": ["vite/client"]`
5. `client/.env-sample` -- ensure it still works (no changes needed, variable name stays `SERVER_URL`)

### Script Updates
```json
"scripts": {
  "dev": "vite --port 3000",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Remove from package.json
- `"staticFiles"` configuration block (Parcel-specific)

## Implementation Details

### vite.config.ts
```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  envPrefix: 'SERVER_',
})
```

### index.html Changes
Vite serves `public/` at the root, so asset paths change:
- `href="public/reset.css"` becomes `href="/reset.css"`
- `href="public/favicon.png"` becomes `href="/favicon.png"`
- `url('./public/bg.png')` becomes `url('/bg.png')`
- The script tag `<script type="module" src="src/socket.ts">` remains correct for Vite

### socket.ts Changes
Replace `process.env.SERVER_URL` with `import.meta.env.SERVER_URL` (2 occurrences).

### vite-env.d.ts
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Static Assets
Sprites at `client/public/sprites/` will be served at `/sprites/` automatically by Vite. No proxy configuration needed.

### Client @types/node
The client currently has `@types/node: ^17.0.31` in devDependencies. This was primarily needed by Parcel. Evaluate whether it can be removed after Vite migration. If `process.env` references are fully replaced with `import.meta.env`, the Node types may no longer be needed. Keep it for now if any other Node type references exist.

## Verification

- [ ] `npm -w client run dev` starts Vite dev server on port 3000
- [ ] Client connects to server and renders the game map
- [ ] Sprites load and display correctly (no blank tiles)
- [ ] Player movement works
- [ ] Chat messages work
- [ ] Dance animation works
- [ ] `npm -w client run build` produces a production build without errors
- [ ] `.env` file with `SERVER_URL=http://localhost:3008` is correctly read by Vite
