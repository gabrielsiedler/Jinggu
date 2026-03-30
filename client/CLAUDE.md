# CLAUDE.md - Jinggu Client

## Project Overview

Jinggu is a 2D multiplayer browser game (Tibia-inspired) rendered on HTML5 Canvas with real-time networking via Socket.IO. This is the **client** directory of a monorepo that also includes `server/`, `map-editor/`, and `sprite-editor/`.

## Tech Stack

- **Language:** TypeScript (strict mode, ES5 target)
- **Bundler:** Parcel 2.12.0
- **Networking:** Socket.IO client (WebSocket)
- **Rendering:** HTML5 Canvas 2D (no game framework)
- **Package Manager:** npm

## Commands

```bash
# Development (from client/)
npm run dev          # Parcel dev server on port 3000

# Build
npm run build        # Parcel production build

# From monorepo root (../):
npm start            # Runs server (port 3008) + client (port 3000) concurrently
npm install          # Installs deps for all subprojects via postinstall hook
```

There are no tests, no linter, and no CI/CD configured.

## Architecture

Entry point: `index.html` → `src/socket.ts`

### Core Modules

| File | Purpose |
|------|---------|
| `src/socket.ts` | Socket.IO connection, event handlers, global exports (`core`, `status`, `messageQueue`) |
| `src/Core.ts` | Game engine: loop (`requestAnimationFrame`), entity management, server event processing |
| `src/Canvas.ts` | HiDPI-aware canvas setup with virtual/real buffer |
| `src/input.ts` | Keyboard input (arrows=move, ctrl/alt+arrows=dance, enter=chat) |
| `src/constants.ts` | Game constants (tile size, canvas dimensions) |
| `src/sprites.ts` | Sprite loading, magenta (255,0,255) = transparency |
| `src/draw.ts` | Main draw orchestrator, called each frame |
| `src/GameMap.ts` | 2D tile array |
| `src/Tile.ts` | Tile class with sprite layers and walkability |
| `src/player/Player.ts` | Player entity: position, health, movement animation (16 ticks per tile) |
| `src/player/player.i.ts` | Player interfaces and Direction enum |
| `src/Message.ts` | Chat bubble (auto-wraps at 25 chars) |
| `src/MessageQueue.ts` | Message queue, auto-clears after 3s |
| `src/StatusMessage.ts` | Status display, auto-clears after 1.2s |

### Draw Modules (`src/draw/`)

Modular rendering: `map.ts`, `players.ts`, `health-bars.ts`, `messages.ts`, `status.ts`

### State Management

No framework. Global state exported from `socket.ts`. Player state as class instance properties. Server is authoritative; client renders.

### Networking Pattern

Event-driven Socket.IO. Server → Client: `initial-data`, `player-connected`, `player-disconnected`, `player-moved`, `player-danced`, `status`, `message`. Client → Server: `move`, `dance`, `message`.

## Code Style

- **Formatter:** Prettier (configured at monorepo root `../.prettierrc`)
  - No semicolons
  - Single quotes
  - Trailing commas
  - 120 char print width
  - Arrow parens: always
- **Indentation:** 2 spaces (`.editorconfig`)
- **Naming:** PascalCase for classes/files, camelCase for functions/variables
- **Types file convention:** `*.i.ts` suffix for interface/type files

## Environment

Requires `.env` file (copy from `.env-sample`):
```
SERVER_URL=http://localhost:3008
```

## Key Patterns

- Game loop at ~40 FPS (25ms frame interval)
- Tile-based world with camera centered on local player
- Smooth movement via linear interpolation over 16 animation ticks
- Static assets in `public/` (sprites are 32x32 PNGs)
- `.proxyrc.js` proxies `/sprites` path for dev server
