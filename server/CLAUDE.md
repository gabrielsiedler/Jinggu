# CLAUDE.md - Jinggu Server

## Project Overview

Real-time multiplayer game server for Jinggu, a 2D Tibia-inspired browser game. Server-authoritative architecture — all game logic (movement validation, collision, player management) runs here. Clients are purely reactive.

This is the **server** directory of a monorepo that also includes `client/`, `map-editor/`, and `sprite-editor/`.

## Tech Stack

- **Language:** TypeScript (strict mode, ES5 target)
- **Runtime:** Node.js with ts-node-dev (hot reload)
- **Networking:** Socket.IO 4.2 (WebSocket server)
- **Package Manager:** npm

## Commands

```bash
# Development (from server/)
npm run dev              # ts-node-dev with hot reload on port 3008

# From monorepo root (../):
npm start                # Runs server (port 3008) + client (port 3000) concurrently
npm install              # Installs deps for all subprojects via postinstall hook
```

No tests, no linter, no CI/CD configured.

## Architecture

Entry point: `src/index.ts` → creates Socket.IO server on port 3008 with CORS `origin: '*'`.

### Core Modules

| File | Purpose |
|------|---------|
| `src/index.ts` | Entry point — Socket.IO server creation |
| `src/socket.ts` | Connection lifecycle, event handlers, broadcasting |
| `src/core.ts` | Singleton exports: `map`, `memory`, `sprites`, constants (`VIEW_WIDTH=42`, `VIEW_HEIGHT=24`) |
| `src/core.i.ts` | Memory interface definition |
| `src/lib/Player.ts` | Player class: position, movement validation, speed calculation |
| `src/lib/Map.ts` | Map generation from `data/map.json` into 2D Tile array |
| `src/lib/Tile.ts` | Tile class: sprite layers, walkability (all layers must be walkable) |
| `src/lib/Memory.ts` | Connected player registry (add, remove, list) |
| `src/lib/sprite.i.ts` | Sprite and Sprites type interfaces |
| `src/data/map.json` | 24x42 tile grid — each cell is an array of sprite IDs (layered) |
| `src/data/sprites.json` | ~1957 sprite entries with IDs and walkability flags |

### Connection Lifecycle

1. Client connects → `onConnection()` creates Player, stores in `socket.data.player`, adds to Memory
2. Server sends `initial-data` (player, map, sprites, other players) to connecting client
3. Server broadcasts `player-connected` to all other clients
4. Client actions (move/dance/message) → validated server-side → broadcast to all clients
5. Client disconnects → removed from Memory → `player-disconnected` broadcast

### Socket Events

**Client → Server:**
- `move` — Direction enum → validated (bounds + walkability) → broadcasts `player-moved`
- `dance` — Direction enum → broadcasts `player-danced`
- `message` — String → broadcasts `message` with player ID

**Server → Client:**
- `initial-data` — `{ player, map, sprites, entities }` (full game state on join)
- `player-connected` — Player object (new player joined)
- `player-disconnected` — Player object (player left)
- `player-moved` — `{ playerId, direction }` (movement confirmed)
- `player-danced` — `{ playerId, direction }` (dance animation)
- `status` — Error string (e.g., "You can't walk there.")
- `message` — `{ playerId, message }` (chat)

### Movement System

Validation chain in `Player.move(direction)`:
1. Reject if player already walking (animation lock)
2. Calculate destination tile from direction
3. Boundary check: 0 ≤ x < 42, 0 ≤ y < 24
4. Walkability check via `map.tiles[destY][destX].walkable`
5. On success: set `walking = true`, schedule position update after `speed` ms

Speed formula: `Math.max(800 - level * 5, 200)` ms per tile (higher level = faster, floor 200ms).

### Player Initialization

- Spawn position: (13, 13)
- Sprite: random between `creature_man1` and `creature_woman1`
- Level: 150 (fixed)
- Health: random 1–100
- Name: `"Player" + random 4-digit number`

### Data Model

**Player:** `{ id, x, y, spriteBase, level, speed, health, name, walking }`
**Tile:** `{ x, y, sprites: Sprite[], walkable }` — walkable only if ALL sprite layers allow it
**Sprite:** `{ id: string | number, walkable?: boolean }`
**Memory:** `{ players: Player[] }` — in-memory only, no persistence

### Map Structure

- Dimensions: 42 columns × 24 rows (accessed as `tiles[y][x]`)
- Generated once at startup from `data/map.json`
- Each cell contains an array of sprite IDs for layering (e.g., `["terrain_water_var1", "overlay_grassborder_left_var2"]`)

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
- **TypeScript:** Strict mode, CommonJS modules, ES5 target

## Key Constraints

- **No persistence** — all state is in-memory, lost on server restart
- **No authentication** — any client gets a new player on connection
- **Broadcast-only** — all events sent to all connected clients (no spatial filtering)
- **Fixed map** — generated once from static JSON at startup
- **No NPC/AI** — players only, no server-side entities beyond connected users
