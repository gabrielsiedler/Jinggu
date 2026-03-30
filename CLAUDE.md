# CLAUDE.md - Jinggu

## Project Overview

Jinggu (脛骨) is a 2D multiplayer browser game (Tibia-inspired) built with TypeScript, HTML5 Canvas, and Socket.IO. Server-authoritative architecture with real-time WebSocket communication. No external game engine — pure Canvas 2D rendering.

## Monorepo Structure

```
├── client/          # Game client (Parcel, Canvas 2D, Socket.IO client)
├── server/          # Game server (Node.js, Socket.IO, ts-node-dev)
├── map-editor/      # Visual map builder (React 18, Vite, Recoil)
├── sprite-editor/   # Sprite definition tool (React 18, Vite, styled-components)
└── docs/            # Screenshots and architecture diagrams
```

Each service has its own `package.json` and `tsconfig.json`. The root `package.json` coordinates installs and concurrent dev startup.

## Commands

```bash
# From root — primary workflow
npm install          # Installs deps for root + server + client (via postinstall)
npm start            # Runs server (port 3008) + client (port 3000) concurrently

# Individual services
cd client && npm run dev       # Parcel dev server on port 3000
cd server && npm run dev       # ts-node-dev with hot reload on port 3008
cd map-editor && npm run dev   # Vite dev server
cd sprite-editor && npm run dev # Vite dev server

# Build
cd client && npm run build     # Parcel production build to dist/
cd map-editor && npm run build # tsc + Vite build
cd sprite-editor && npm run build
```

No tests, no linter, no CI/CD configured.

## Architecture

### Server (`server/src/`)

Entry: `index.ts` → Socket.IO server on port 3008.

- `socket.ts` — Connection handlers, event routing
- `core.ts` — Constants (VIEW_WIDTH=42, VIEW_HEIGHT=24), sprites, map, memory
- `lib/Player.ts` — Player class: position, movement validation, walkability checks
- `lib/Map.ts` — Map generation from sprite data
- `lib/Tile.ts` — Tile with sprite layers and walkability
- `lib/Memory.ts` — Connected players list
- `data/map.json` — 24x42 tile array (the game world)
- `data/sprites.json` — Sprite registry with IDs and walkability flags

**Socket events:**
- Client → Server: `move`, `dance`, `message`
- Server → Client: `initial-data`, `player-connected`, `player-disconnected`, `player-moved`, `player-danced`, `status`, `message`

**Movement:** Direction validated (bounds + walkability) → speed = max(800 - level*5, 200)ms per tile → player locked during animation.

### Client (`client/src/`)

Entry: `index.html` → `src/socket.ts` → creates `Core` engine on `initial-data`.

- Game loop via `requestAnimationFrame` at ~40 FPS (25ms frame interval)
- Draw pipeline: map → players → health bars → messages → status
- Movement animation: 16 ticks per tile, smooth linear interpolation
- Camera centered on local player within 42x24 tile viewport
- Global state exported from `socket.ts` (no state framework)
- Sprites are 32x32 PNGs; magenta (255,0,255) = transparency

See `client/CLAUDE.md` for detailed client architecture.

### Map Editor (`map-editor/`)

React + Recoil app for visual map creation. Drag-select tiles, apply sprites, export to `map.json`. Uses `react-selectable-fast` for batch selection.

### Sprite Editor (`sprite-editor/`)

React app for browsing and defining sprite properties. Displays sprites 0-1956 from `/sprites/` directory.

## Code Style

- **Formatter:** Prettier (root `.prettierrc`)
  - No semicolons, single quotes, trailing commas, 120 char width
- **Indentation:** 2 spaces (`.editorconfig`)
- **Naming:** PascalCase for classes/files, camelCase for functions/variables
- **Type files:** `*.i.ts` suffix for interface/type definitions
- **Styled components:** `*.s.ts` suffix
- **TypeScript:** Strict mode in all packages

## Key Data Structures

**Player:** `{ id, x, y, spriteBase, level, health, name, walking, speed }`
**Tile:** `{ x, y, sprites: Sprite[], walkable }` — walkable only if all sprite layers are walkable
**Sprite:** `{ id, walkable?, image? }`

Sprite naming: `creature_man1_down_standing` → `{prefix}_{variant}_{direction}_{animation}`
Directions: up/down/left/right. Animations: standing, walking1-8.

## Environment Setup

1. Copy `client/.env-sample` to `client/.env`
2. Set `SERVER_URL=http://localhost:3008`
3. From root: `npm install` then `npm start`

## Tech Stack Summary

| Service | Runtime | Bundler | Key Deps |
|---------|---------|---------|----------|
| Client | TypeScript/Browser | Parcel 2.12 | socket.io-client |
| Server | TypeScript/Node.js | ts-node-dev | socket.io |
| Map Editor | TypeScript/React 18 | Vite 4.2 | recoil, styled-components, react-selectable-fast |
| Sprite Editor | TypeScript/React 18 | Vite 4.2 | styled-components |
