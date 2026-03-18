# malaclaw Dashboard — Design Spec

## Overview

A web-based dashboard for managing malaclaw projects, agent teams, skills, and configuration. It serves as a visual layer on top of the existing CLI, directly importing the store's TypeScript library modules with no separate database.

**Audience:** Solo developer (v1), designed to grow into multi-user team monitoring.

**Philosophy:** Orchestration layer with dashboard support. All heavy functionality (agent execution, sessions, memory indexing) remains on the OpenClaw side. The dashboard reads and manages store configuration, not runtime behavior.

## Prerequisites — Refactoring Required

Before building the dashboard, several CLI command functions must be extracted into side-effect-free library modules. Currently these functions call `console.log`, `process.exit()`, and interactive prompts — they cannot be imported by a server.

| Current location | Problem | Extraction target |
|-----------------|---------|-------------------|
| `src/commands/doctor.ts` → `runDoctor()` | Writes to stdout, calls `process.exit` | Extract check logic into `src/lib/doctor.ts` returning `Finding[]` |
| `src/commands/diff.ts` → `runDiff()` | Writes to stdout, returns `void` | Extract diff computation into `src/lib/diff.ts` returning `DiffEntry[]` |
| `src/commands/install.ts` → `runInstall()` | Uses `@clack/prompts`, calls `process.exit` | Extract headless install into `src/lib/install-headless.ts` with progress callbacks |
| `src/commands/skill.ts` → skill sync/check | CLI-coupled output | Extract `syncSkills()` and `checkSkills()` into `src/lib/skill-ops.ts` |
| `src/commands/starter.ts` → starter init | CLI-coupled, interactive | Extract `initStarter(id, targetDir, projectName)` into `src/lib/starter-ops.ts` |

Each extracted function should:
- Return structured data (not write to stdout)
- Accept options as parameters (not read from CLI args)
- Signal errors via thrown exceptions or result types (not `process.exit`)
- Accept optional progress callbacks for long-running operations (install, init)

The CLI commands should then become thin wrappers around these library functions.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tech stack | React SPA + Fastify server | React for contributor accessibility; Fastify for TypeScript-native + built-in WS support |
| Data layer | Direct import of `src/lib/` modules | No database — YAML/JSON files are the data layer. Zod schemas become API types. |
| Communication | REST API + WebSocket events | REST for data (curl-able, testable, cacheable); WS for real-time change notifications |
| Layout | Top tabs + dense grid (overview) | High information density; natural fit for real-time panels in phase b/c |
| Directory | `dashboard/` top-level | Own package.json and build, imports `src/lib/` via TypeScript project references. Clean separation without monorepo restructuring. |
| Network | LAN-accessible (`0.0.0.0`) | Cross-device access on same network. Auth gate documented for near-term addition. Remote access via user-configured Cloudflare Tunnel / Tailscale / SSH. |
| Virtual office | Lightweight CSS/SVG | Team-aware layout (rooms per team, agents by role). No game engine dependency. Animates with live status in phase b. |
| Cost tracking | Placeholder in v1 | Real data from Gateway in phase b. UI slot and component ready. |

## Architecture

```
Browser (React SPA)
  ├── React Query ←── REST fetch ──→ /api/*
  └── useWebSocket ←── WS events ──→ ws://host:PORT/ws
                         │
         dashboard/server/ (Fastify)
  ├── REST Routes ──→ server/routes/*.ts
  ├── WS Event Bus ──→ server/ws.ts (broadcast to all clients)
  ├── File Watcher ──→ server/watcher.ts (chokidar)
  └── Store Bridge ──→ server/services/store.ts
                         │
                    direct import
                         │
                    src/lib/ (existing store modules)
                    loader, resolver, runtime, schema, paths,
                    memory, team-graph, skill-fetch, renderer,
                    openclaw-skills, openclaw-agents, project-meta,
                    + new: doctor, diff, install, skill-ops, starter-ops
                         │
                    reads/writes
                         │
              ┌──────────┴──────────┐
              │ YAML / Lock files   │
              │ ~/.malaclaw/  │
              │   runtime.json      │
              │   workspaces/       │
              │   skills-index.json │
              └─────────────────────┘
```

**Data flow:**
1. Frontend makes REST call (e.g., `GET /api/projects`)
2. Route handler calls `store.getProjects()` in the services layer
3. Services layer calls `runtime.loadRuntimeState()` from `src/lib/`
4. Response returns Zod-validated data; frontend types match server types
5. File watcher detects changes → pushes WS event → React Query invalidates matching query

**Write operations:**
1. Frontend sends `PUT /api/manifest` with updated manifest
2. Server validates against Zod schema, writes `malaclaw.yaml`
3. Frontend sends `POST /api/install` to trigger install pipeline
4. Server calls existing install logic from `src/lib/`
5. File watcher detects lockfile change → WS event → all panels refresh

## Module Import Mechanism

The dashboard server imports `src/lib/` modules using **TypeScript project references**:

1. Root `tsconfig.json` adds `"composite": true` and `"declaration": true`
2. `dashboard/tsconfig.server.json` adds `"references": [{ "path": ".." }]`
3. Dashboard server imports from the compiled `dist/lib/` output, getting full type checking via `.d.ts` files
4. Build order: `tsc --build` compiles root first, then dashboard server

This avoids workspace protocol complexity while giving the dashboard type-safe access to all `src/lib/` exports. The root project's compiled output (`dist/lib/`) becomes a stable import target.

**Dev workflow:** Run `npm run build` in root once, then `npm run dev` in `dashboard/`. Vite handles the frontend; the server process uses `tsx` (or `ts-node`) for development with live reload.

**CLI command registration:** A new `src/commands/dashboard.ts` file registers the `dashboard` subcommand. It imports and starts the Fastify server from `dashboard/server/` compiled output (`dashboard/dist/server/`). Build order: root → dashboard → CLI can reference dashboard dist.

## Directory Structure

```
dashboard/
├── package.json
├── tsconfig.server.json   ← references root tsconfig for src/lib/ types
├── tsconfig.json          ← frontend (Vite handles this separately)
├── vite.config.ts
├── server/
│   ├── index.ts              ← Fastify entry: routes, WS, static files
│   ├── routes/
│   │   ├── projects.ts       ← GET /api/projects, GET /api/projects/:id
│   │   ├── agents.ts         ← GET /api/agents, GET /api/agents/:id
│   │   ├── teams.ts          ← GET /api/teams, GET /api/teams/:id
│   │   ├── skills.ts         ← GET /api/skills, POST /api/skills/sync, /check
│   │   ├── health.ts         ← GET /api/health
│   │   ├── starters.ts       ← GET /api/starters, POST /api/starters/:id/init
│   │   ├── manifest.ts       ← GET/PUT /api/manifest, POST /api/install
│   │   └── diff.ts           ← GET /api/diff
│   ├── ws.ts                 ← WebSocket upgrade + broadcast
│   ├── watcher.ts            ← chokidar file watcher → WS events
│   └── services/
│       └── store.ts          ← Thin wrapper around src/lib/ imports
├── src/
│   ├── main.tsx
│   ├── App.tsx               ← Router + layout shell
│   ├── hooks/
│   │   ├── useApi.ts         ← React Query hooks
│   │   └── useWs.ts          ← WS subscription + query invalidation
│   ├── pages/
│   │   ├── Dashboard.tsx     ← Overview grid
│   │   ├── Project.tsx       ← Single project detail
│   │   ├── Starters.tsx      ← Browse + init
│   │   └── Config.tsx        ← Manifest editor + diff + install
│   ├── components/
│   │   ├── ProjectCard.tsx
│   │   ├── AgentList.tsx
│   │   ├── TeamGraph.tsx
│   │   ├── SkillTable.tsx
│   │   ├── HealthChecks.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── DiffView.tsx
│   │   ├── ManifestForm.tsx
│   │   ├── VirtualOffice.tsx
│   │   ├── CostTracker.tsx
│   │   └── ActivityFeed.tsx
│   └── lib/
│       └── types.ts          ← Re-exports Zod inferred types
└── public/
```

## REST API

### Projects

| Method | Endpoint | Source | Returns |
|--------|----------|--------|---------|
| GET | `/api/projects` | `runtime.loadRuntimeState()` | All installed projects |
| GET | `/api/projects/:id` | `runtime` + `loader.loadLockfile()` | Project with lockfile detail |
| GET | `/api/projects/:id/kanban/:teamId` | Read `kanban.md` from shared memory dir | Parsed kanban columns + cards |
| GET | `/api/projects/:id/log/:teamId` | Read `tasks-log.md` from shared memory dir | Parsed task log entries |

### Teams & Agents

| Method | Endpoint | Source | Returns |
|--------|----------|--------|---------|
| GET | `/api/teams` | `loader.loadAllTeams()` | All team templates |
| GET | `/api/teams/:id` | `loader.loadTeam()` | Team with members + delegation graph |
| GET | `/api/agents` | `loader.loadAllAgents()` | All agent templates |
| GET | `/api/agents/:id` | `loader.loadAgent()` | Agent with full definition |

### Skills

| Method | Endpoint | Source | Returns |
|--------|----------|--------|---------|
| GET | `/api/skills` | `loader.loadAllSkills()` + skill inventory | Skills with install status |
| POST | `/api/skills/sync` | `skillOps.syncSkills()` (extracted to `src/lib/skill-ops.ts`) | Sync result |
| GET | `/api/skills/check` | `skillOps.checkSkills()` (extracted to `src/lib/skill-ops.ts`) | Missing envs, failed skills |

### Health

| Method | Endpoint | Source | Returns |
|--------|----------|--------|---------|
| GET | `/api/health` | `doctor.runChecks()` (extracted to `src/lib/doctor.ts`) | `{ check, severity, message }[]` |

### Starters

| Method | Endpoint | Source | Returns |
|--------|----------|--------|---------|
| GET | `/api/starters` | `loader.loadAllStarters()` | All starters with tags, requirements |
| GET | `/api/starters/:id` | `loader.loadStarter()` | Starter + demo card content |
| POST | `/api/starters/:id/init` | `starterOps.initStarter()` (extracted to `src/lib/starter-ops.ts`) | Init result. Request body: `{ targetDir: string, projectName?: string }` |

### Manifest & Install

| Method | Endpoint | Source | Returns |
|--------|----------|--------|---------|
| GET | `/api/manifest` | `loader.loadManifest()` | Parsed `malaclaw.yaml` |
| PUT | `/api/manifest` | Validate + write YAML | Updated manifest |
| GET | `/api/diff` | `diff.computeDiff()` (extracted to `src/lib/diff.ts`) | `DiffEntry[]` — pending changes |
| POST | `/api/install` | `runHeadlessInstall()` (extracted to `src/lib/install-headless.ts`) | Install result. Streams progress via WS. |

## WebSocket Events

Events pushed to all connected clients when files change on disk:

| Event | Trigger | Payload |
|-------|---------|---------|
| `projects:changed` | `runtime.json` modified | `{}` |
| `manifest:changed` | `malaclaw.yaml` modified | `{ projectDir }` |
| `lockfile:changed` | `malaclaw.lock` modified | `{ projectDir }` |
| `skills:changed` | `skills-index.json` modified | `{}` |
| `memory:changed` | Any shared memory `.md` modified | `{ projectId, teamId, file }` |
| `install:progress` | Install pipeline emits progress | `{ phase, message, current?, total? }` |

Frontend `useWs` hook maps events to React Query invalidation keys:
- `projects:changed` → invalidate `["projects"]`
- `manifest:changed` → invalidate `["manifest"]`, `["diff"]`
- `lockfile:changed` → invalidate `["projects"]`, `["agents"]`, `["skills"]`
- `skills:changed` → invalidate `["skills"]`
- `memory:changed` → invalidate `["kanban", projectId, teamId]`, `["log", projectId, teamId]`

## Pages & Grid Layout

### Tab 1: Overview (default)

Dense grid with summary widgets. Project selector dropdown scopes the view.

```
┌─────────────────────────┬────────────┬───────────┐
│                         │ Agents (8) │ Cost (—)  │
│   Kanban Board          │ by team    │ phase b   │
│   (largest cell,        ├────────────┤───────────┤
│    spans 2 rows)        │ Skills (5) │ Health    │
│                         │ status     │ checks    │
├─────────────────────────┴────────────┤───────────┤
│                                      │ Activity  │
│   Virtual Office (full width)        │ feed      │
│   team rooms + agent avatars by role │           │
└──────────────────────────────────────┴───────────┘
```

- Each widget has expand button (⛶) for full-page detail view
- Kanban reads `kanban.md` from shared memory (file read, no Gateway)
- Virtual Office groups agents into team rooms, positioned by role
- Activity feed powered by file watcher WS events
- Cost tracker shows placeholder dashes with "Available with Gateway" note

### Tab 2: Projects

Full project list. Expand a project to see teams, agents, delegation graph, kanban, task log.

### Empty State

When no projects are installed (`runtime.json` is empty or absent), the Overview tab shows a welcome screen with:
- Brief explanation of malaclaw
- Prominent link to the Starters tab to bootstrap a first project
- Quick health check (is OpenClaw installed? Is `openclaw.json` accessible?)

The dashboard works in all workflow modes detected by `workflow-mode.ts`, but v1 features are most useful in `managed` mode (manifest present). Other modes show a simplified view with a prompt to initialize a project.

### Tab 3: Starters

Browse/search/filter starters. Show requirements, tags, demo cards. One-click init.

### Tab 4: Config

Manifest editor (form-based). Diff preview. Install button with progress display.

## Virtual Office

CSS/SVG animated visualization of agent teams working in an office layout.

**v1 behavior (store-only):**
- Each team gets a "room" (dashed border container with team name label)
- Agents displayed as circular avatars with emoji, name, and role badge
- Leads positioned at "manager desks" (top of room)
- Specialists at "workstations" (middle)
- Reviewers in "review area" (side)
- Colors per role: purple (lead), green (specialist), yellow (reviewer)
- Static positioning based on team template data

**Phase b behavior (Gateway):**
- Agent avatars animate based on live session status:
  - Idle → in breakroom/sofa area
  - Active session → at desk, typing animation
  - Spawning sub-agent → speech bubble showing delegation
- Status polling via Gateway WebSocket
- Smooth CSS transitions between positions

**Data source:** `loader.loadAllTeams()` + `loader.loadAllAgents()` for v1. Gateway sessions API for phase b.

## Cost Tracking

**v1:** Placeholder UI component with empty slots for Input tokens, Output tokens, Total tokens, Cost. Shows "Available with Gateway (phase b)" message.

**Phase b:** `GET /api/usage` endpoint connects to Gateway, aggregates token counts from session data by agent/team/project. Supports time range filtering (today, 7d, 30d). Cost calculated from model pricing config.

## File Watcher

Server uses chokidar to monitor:

| Path | Events | WS Event |
|------|--------|----------|
| `~/.malaclaw/runtime.json` | change | `projects:changed` |
| Known project dirs from `runtime.json` → `malaclaw.yaml` | change | `manifest:changed` |
| Known project dirs from `runtime.json` → `malaclaw.lock` | change | `lockfile:changed` |
| `~/.malaclaw/skills-index.json` | change | `skills:changed` |
| `~/.malaclaw/workspaces/**/shared/memory/*.md` | change | `memory:changed` |

Debounced at 500ms to avoid duplicate events from rapid writes. Watch paths are scoped to known project directories from `runtime.json` — not recursive globs — to avoid matching unrelated files in `node_modules` or nested directories. The watcher re-reads `runtime.json` on change to discover newly installed projects.

## CLI Integration

Dashboard starts via CLI command:

```bash
malaclaw dashboard              # Start on default port (3456)
malaclaw dashboard --port 8080  # Custom port
malaclaw dashboard --host 0.0.0.0  # LAN access (default)
malaclaw dashboard --host 127.0.0.1  # Local only
```

In development:

```bash
cd dashboard
npm run dev          # Vite dev server (frontend HMR) + Fastify (API)
npm run build        # Build for production
npm run preview      # Preview production build
```

## Network Access

### v1: LAN

Server binds to `0.0.0.0` by default. Any device on the same WiFi can access via `http://<hostname>:3456`.

### Near-term: Auth Gate

Token-based authentication middleware. Config in `malaclaw.yaml` or env var:

```yaml
dashboard:
  auth:
    enabled: true
    token: "your-secret-token"
```

### Remote Access (user-configured, documented)

Three recommended approaches, documented in `docs/remote-access.md`:

1. **Cloudflare Tunnel** — `cloudflared tunnel --url http://localhost:3456`. Free, HTTPS, one command.
2. **Tailscale / ZeroTier** — Mesh VPN, all devices on same virtual network. Zero port exposure.
3. **SSH tunnel** — `ssh -L 3456:localhost:3456 user@home`. No setup on dashboard side.

## Phase Roadmap

### Phase a (v1) — Store-only dashboard

- All 10 panels with store data
- REST API + WS file watcher
- Kanban reads shared memory files from disk
- Virtual office shows static agent positions by role
- Cost tracking placeholder
- LAN access

### Phase b — Gateway integration

New module: `server/services/gateway.ts`

- WebSocket client connecting to OpenClaw Gateway (`ws://localhost:18789`)
- Live agent session status → animates virtual office
- Token usage / cost tracking from session data
- Session history viewing (chat transcript proxy)
- Gateway events merged into Activity feed
- New endpoints: `GET /api/usage`, `GET /api/projects/:id/sessions`

### Phase c — Shared memory write-back

New module: `server/services/memory-writer.ts`

- Kanban drag-and-drop writes back to `kanban.md` (respecting single-writer rules)
- Parsed timeline views of `tasks-log.md` and `blockers.md`
- Activity feed merges file watcher + Gateway + memory change events

### Phase d — Multi-user

Extends the auth gate (added near-term after v1) into full multi-user support:

New module: `server/middleware/auth.ts` (upgrades the simple token gate)

- Multiple user accounts with config-file based user list (no database)
- Session cookies with proper expiry
- Per-user project access controls (optional)
- User identity shown in Activity feed

## Dependencies

### Server (`dashboard/package.json`)

- `fastify` — HTTP server
- `@fastify/websocket` — WebSocket support
- `@fastify/static` — Serve built frontend
- `@fastify/cors` — CORS for dev mode
- `chokidar` — File watching

### Frontend (`dashboard/package.json`)

- `react`, `react-dom` — UI framework
- `@tanstack/react-query` — Data fetching + caching
- `react-router-dom` — Client-side routing
- `vite` — Build tool + dev server

### Shared

- `src/lib/schema.ts` Zod types — re-exported as API response types and frontend types. Single source of truth for all data shapes.

## Error Response Format

All API errors return a consistent JSON shape:

```json
{
  "error": "Human-readable message",
  "code": "MACHINE_CODE",
  "details": {}
}
```

| HTTP Status | When |
|-------------|------|
| 400 | Zod validation failure (details includes field-level errors) |
| 404 | Project, agent, team, skill, or starter not found |
| 409 | Install conflict (e.g., already running) |
| 500 | Unexpected server error |

Frontend `useApi` hooks parse the error shape and surface messages in toast notifications.

## Graceful Shutdown

On `SIGTERM`/`SIGINT`:
1. Close chokidar file watchers
2. Send close frame to all WebSocket clients
3. Drain in-flight HTTP requests (Fastify's built-in graceful close)
4. Exit cleanly

This matters when launched from the CLI (`malaclaw dashboard`) and terminated with Ctrl+C.

## Important Constraints

- **Manifest save does NOT auto-install.** The two-step flow (`PUT /api/manifest` then `POST /api/install`) is intentional. This matches the CLI behavior where "changing `malaclaw.yaml` has no effect until `malaclaw install` is re-run." The dashboard must not merge these steps.
- **CORS is dev-only.** In production, Fastify serves the built SPA from `@fastify/static`. In dev mode, Vite runs on port 5173 and proxies `/api/*` to Fastify on port 3456. `@fastify/cors` is only registered when `NODE_ENV !== 'production'`.

## Testing Strategy

- **Server routes:** Vitest + Fastify's built-in `inject()` method. Mock `src/lib/` imports with fixture data.
- **Frontend components:** Vitest + React Testing Library. Mock API responses.
- **Integration:** Playwright for critical flows (view project → expand kanban → edit config → install).
- **Existing tests unaffected:** Dashboard is additive. No changes to `tests/` or `src/lib/`.
