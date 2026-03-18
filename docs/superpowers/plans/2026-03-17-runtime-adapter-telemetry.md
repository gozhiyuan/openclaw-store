# Runtime Adapter & Telemetry Implementation Plan (v2)

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make MalaClaw a runtime-agnostic control plane with two primary tracking paths: OpenClaw (direct gateway) and ClawTeam (reads native state for Claude Code/Codex/OpenClaw agents running under ClawTeam). A generic heartbeat fallback is deferred to later.

**Architecture:** Two-path observer model:
1. **OpenClaw direct** — gateway WebSocket at `ws://localhost:18789` (existing, to be wrapped)
2. **ClawTeam-managed** — read `~/.clawteam/` JSON files (spawn_registry, tasks, config, costs) to get visibility into Claude Code / Codex / OpenClaw agents running under ClawTeam

Both paths write to a single normalized telemetry schema at `~/.malaclaw/agents/<id>/state.json`. The dashboard reads only the normalized files. The install/export flow dispatches to runtime-specific provisioners.

**Key strategic insight:** ClawTeam already tracks Claude Code, Codex, and OpenClaw agents. Instead of building separate heartbeat logic for each runtime, MalaClaw reads ClawTeam's native state. This gives MalaClaw multi-runtime observability through a single integration.

**Tech Stack:** TypeScript, Zod, Vitest, Fastify, WebSocket (ws), chokidar

---

## File Structure

### New Files

| File | Responsibility |
|------|----------------|
| `src/lib/telemetry.ts` | Zod schema for `AgentTelemetry`, read/write helpers for `~/.malaclaw/agents/<id>/state.json` |
| `src/lib/adapters/base.ts` | `RuntimeProvisioner` and `RuntimeObserver` interfaces |
| `src/lib/adapters/claude-code.ts` | Claude Code provisioner (generate CLAUDE.md per agent workspace) |
| `src/lib/adapters/codex.ts` | Codex provisioner (generate AGENTS.md per agent workspace) |
| `src/lib/adapters/clawteam.ts` | ClawTeam provisioner (export team.toml + spawn catalog) + ClawTeam observer (read ~/.clawteam/ state) |
| `src/lib/adapters/registry.ts` | `getProvisioner(runtime)` and `getObserver(runtime)` factory functions |
| `dashboard/server/services/runtime-status.ts` | `RuntimeStatusProvider` — replaces direct GatewayClient usage, dispatches to per-runtime observers |
| `tests/telemetry.test.ts` | Telemetry schema parsing, read/write, TTL auto-idle |
| `tests/adapter-base.test.ts` | Adapter interface compliance tests |
| `tests/adapter-registry.test.ts` | Registry dispatch tests |
| `tests/clawteam-observer.test.ts` | ClawTeam state reading + normalization tests |

### Modified Files

| File | Change |
|------|--------|
| `src/lib/schema.ts` | Add `RuntimeTarget` enum (with `clawteam`), add `runtime` field to `Manifest`, add `AgentTelemetry` schema |
| `src/lib/paths.ts` | Add `resolveAgentTelemetryDir()`, `resolveAgentTelemetryFile()`, `resolveClawTeamDataDir()` |
| `src/lib/install-headless.ts` | Dispatch to adapter based on `manifest.runtime`, write initial telemetry state |
| `src/lib/adapters/openclaw.ts` | Implement `RuntimeProvisioner` and `RuntimeObserver` interfaces (wrap existing functions) |
| `dashboard/server/index.ts` | Replace `GatewayClient` with `RuntimeStatusProvider` |
| `dashboard/server/routes/usage.ts` | Read from `RuntimeStatusProvider` instead of `GatewayClient` |
| `dashboard/server/watcher.ts` | Watch `~/.malaclaw/agents/*/state.json` and optionally `~/.clawteam/` for changes |
| `tests/schema.test.ts` | Add tests for new schema fields |

---

## Chunk 1: Telemetry Schema & Path Resolution

### Task 1: Add RuntimeTarget enum and telemetry schema to schema.ts

**Files:**
- Modify: `src/lib/schema.ts`
- Test: `tests/schema.test.ts`

- [ ] **Step 1: Write failing test for RuntimeTarget**

In `tests/schema.test.ts`, add:

```typescript
import { RuntimeTarget, AgentTelemetry, Manifest } from "../src/lib/schema.js";

describe("RuntimeTarget enum", () => {
  it("accepts valid runtime targets", () => {
    expect(RuntimeTarget.parse("openclaw")).toBe("openclaw");
    expect(RuntimeTarget.parse("claude-code")).toBe("claude-code");
    expect(RuntimeTarget.parse("codex")).toBe("codex");
    expect(RuntimeTarget.parse("clawteam")).toBe("clawteam");
  });

  it("rejects unknown runtime targets", () => {
    expect(() => RuntimeTarget.parse("unknown")).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npx vitest run tests/schema.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: FAIL — `RuntimeTarget` is not exported

- [ ] **Step 3: Add RuntimeTarget and AgentTelemetry schemas**

In `src/lib/schema.ts`, add after the existing `SkillInventory` schema (near end of file):

```typescript
/* ── Runtime & Telemetry ─────────────────────────────── */

export const RuntimeTarget = z.enum(["openclaw", "claude-code", "codex", "clawteam"]);
export type RuntimeTarget = z.infer<typeof RuntimeTarget>;

export const AgentTelemetry = z.object({
  agentId: z.string(),
  runtime: RuntimeTarget,
  status: z.enum(["idle", "working", "error", "offline"]),
  detail: z.string().optional(),
  updatedAt: z.string(),               // ISO 8601
  sessionId: z.string().optional(),
  pid: z.number().optional(),
  workspaceDir: z.string().optional(),
  lastHeartbeatAt: z.string().optional(), // ISO 8601
  ttlSeconds: z.number().default(300),
  source: z.enum(["gateway", "clawteam", "heartbeat", "manual"]).default("manual"),
});
export type AgentTelemetry = z.infer<typeof AgentTelemetry>;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/schema.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: PASS

- [ ] **Step 5: Write failing test for AgentTelemetry**

In `tests/schema.test.ts`, add:

```typescript
describe("AgentTelemetry schema", () => {
  it("parses a minimal valid telemetry entry", () => {
    const entry = AgentTelemetry.parse({
      agentId: "store__proj__team__agent",
      runtime: "openclaw",
      status: "idle",
      updatedAt: "2026-03-17T18:00:00Z",
    });
    expect(entry.ttlSeconds).toBe(300);
    expect(entry.source).toBe("manual");
  });

  it("parses a full telemetry entry with clawteam source", () => {
    const entry = AgentTelemetry.parse({
      agentId: "store__proj__team__agent",
      runtime: "clawteam",
      status: "working",
      detail: "running experiment batch 4",
      updatedAt: "2026-03-17T18:20:00Z",
      sessionId: "abc123",
      pid: 12345,
      workspaceDir: "/tmp/workspace",
      lastHeartbeatAt: "2026-03-17T18:20:00Z",
      ttlSeconds: 600,
      source: "clawteam",
    });
    expect(entry.runtime).toBe("clawteam");
    expect(entry.source).toBe("clawteam");
  });

  it("rejects invalid status", () => {
    expect(() =>
      AgentTelemetry.parse({
        agentId: "x",
        runtime: "openclaw",
        status: "running",
        updatedAt: "2026-03-17T18:00:00Z",
      })
    ).toThrow();
  });
});
```

- [ ] **Step 6: Run test to verify it passes**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npx vitest run tests/schema.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: PASS

- [ ] **Step 7: Write failing test for runtime field in Manifest**

In `tests/schema.test.ts`, add:

```typescript
describe("Manifest runtime field", () => {
  it("defaults runtime to openclaw when omitted", () => {
    const m = Manifest.parse({ version: 1 });
    expect(m.runtime).toBe("openclaw");
  });

  it("accepts explicit runtime target", () => {
    const m = Manifest.parse({ version: 1, runtime: "clawteam" });
    expect(m.runtime).toBe("clawteam");
  });

  it("accepts claude-code runtime", () => {
    const m = Manifest.parse({ version: 1, runtime: "claude-code" });
    expect(m.runtime).toBe("claude-code");
  });

  it("rejects invalid runtime", () => {
    expect(() => Manifest.parse({ version: 1, runtime: "invalid" })).toThrow();
  });
});
```

- [ ] **Step 8: Run test to verify it fails**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/schema.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: FAIL — Manifest doesn't have runtime field

- [ ] **Step 9: Add runtime field to Manifest schema**

In `src/lib/schema.ts`, modify the `Manifest` schema:

```typescript
export const Manifest = z.object({
  version: z.number().default(1),
  runtime: RuntimeTarget.default("openclaw"),
  project: ManifestProject.optional(),
  packs: z.array(ManifestPackRef).optional().default([]),
  skills: z.array(ManifestSkillRef).optional().default([]),
});
```

- [ ] **Step 10: Run all schema tests**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/schema.test.ts --reporter=verbose 2>&1 | tail -30`
Expected: ALL PASS

- [ ] **Step 11: Commit**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add src/lib/schema.ts tests/schema.test.ts
git commit -m "feat: add RuntimeTarget enum, AgentTelemetry schema, and runtime field to Manifest"
```

---

### Task 2: Add telemetry and ClawTeam path resolution to paths.ts

**Files:**
- Modify: `src/lib/paths.ts`
- Create: `tests/telemetry.test.ts`

- [ ] **Step 1: Write failing test for path resolution**

Create `tests/telemetry.test.ts`:

```typescript
import { describe, it, expect, afterEach } from "vitest";
import path from "node:path";

import {
  resolveAgentTelemetryDir,
  resolveAgentTelemetryFile,
  resolveClawTeamDataDir,
} from "../src/lib/paths.js";

const originalMalaclaw = process.env.MALACLAW_DIR;
const originalClawteam = process.env.CLAWTEAM_DATA_DIR;

afterEach(() => {
  if (originalMalaclaw === undefined) delete process.env.MALACLAW_DIR;
  else process.env.MALACLAW_DIR = originalMalaclaw;
  if (originalClawteam === undefined) delete process.env.CLAWTEAM_DATA_DIR;
  else process.env.CLAWTEAM_DATA_DIR = originalClawteam;
});

describe("telemetry path resolution", () => {
  it("resolveAgentTelemetryDir returns agents dir under store root", () => {
    process.env.MALACLAW_DIR = "/tmp/test-malaclaw";
    expect(resolveAgentTelemetryDir()).toBe("/tmp/test-malaclaw/agents");
  });

  it("resolveAgentTelemetryFile returns state.json for given agent ID", () => {
    process.env.MALACLAW_DIR = "/tmp/test-malaclaw";
    expect(resolveAgentTelemetryFile("store__proj__team__pm")).toBe(
      "/tmp/test-malaclaw/agents/store__proj__team__pm/state.json"
    );
  });
});

describe("ClawTeam path resolution", () => {
  it("resolveClawTeamDataDir uses env var when set", () => {
    process.env.CLAWTEAM_DATA_DIR = "/tmp/test-clawteam";
    expect(resolveClawTeamDataDir()).toBe("/tmp/test-clawteam");
  });

  it("resolveClawTeamDataDir falls back to ~/.clawteam", () => {
    delete process.env.CLAWTEAM_DATA_DIR;
    const result = resolveClawTeamDataDir();
    expect(result).toContain(".clawteam");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/telemetry.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: FAIL — functions not exported

- [ ] **Step 3: Add path functions to paths.ts**

In `src/lib/paths.ts`, add after existing exports:

```typescript
/** Root dir for per-agent telemetry state files: ~/.malaclaw/agents/ */
export function resolveAgentTelemetryDir(): string {
  return path.join(resolveStoreRoot(), "agents");
}

/** Telemetry state file for one agent: ~/.malaclaw/agents/<agentId>/state.json */
export function resolveAgentTelemetryFile(agentId: string): string {
  return path.join(resolveAgentTelemetryDir(), agentId, "state.json");
}

/** ClawTeam data directory: ~/.clawteam/ (respects CLAWTEAM_DATA_DIR env var) */
export function resolveClawTeamDataDir(): string {
  return process.env.CLAWTEAM_DATA_DIR || path.join(os.homedir(), ".clawteam");
}
```

Also add `import os from "node:os"` if not already present.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/telemetry.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add src/lib/paths.ts tests/telemetry.test.ts
git commit -m "feat: add telemetry and ClawTeam path resolution"
```

---

### Task 3: Telemetry read/write helpers with TTL auto-idle

**Files:**
- Create: `src/lib/telemetry.ts`
- Modify: `tests/telemetry.test.ts`

- [ ] **Step 1: Write failing tests for telemetry helpers**

Append to `tests/telemetry.test.ts`:

```typescript
import fs from "node:fs/promises";
import os from "node:os";
import {
  readAgentTelemetry,
  writeAgentTelemetry,
  readAllAgentTelemetry,
} from "../src/lib/telemetry.js";
import type { AgentTelemetry } from "../src/lib/schema.js";

let tmpDir: string | null = null;

afterEach(async () => {
  if (tmpDir) {
    await fs.rm(tmpDir, { recursive: true, force: true });
    tmpDir = null;
  }
});

async function setupTmpStore(): Promise<string> {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "telemetry-test-"));
  process.env.MALACLAW_DIR = tmpDir;
  return tmpDir;
}

describe("writeAgentTelemetry / readAgentTelemetry", () => {
  it("writes and reads a telemetry entry", async () => {
    await setupTmpStore();
    const entry: AgentTelemetry = {
      agentId: "store__p__t__a",
      runtime: "openclaw",
      status: "working",
      detail: "processing",
      updatedAt: new Date().toISOString(),
      ttlSeconds: 300,
      source: "gateway",
    };
    await writeAgentTelemetry(entry);
    const read = await readAgentTelemetry("store__p__t__a");
    expect(read).not.toBeNull();
    expect(read!.status).toBe("working");
    expect(read!.source).toBe("gateway");
  });

  it("returns null for nonexistent agent", async () => {
    await setupTmpStore();
    const read = await readAgentTelemetry("nonexistent");
    expect(read).toBeNull();
  });

  it("auto-idles stale working agents", async () => {
    await setupTmpStore();
    const staleTime = new Date(Date.now() - 400_000).toISOString();
    const entry: AgentTelemetry = {
      agentId: "store__p__t__stale",
      runtime: "clawteam",
      status: "working",
      detail: "was busy",
      updatedAt: staleTime,
      ttlSeconds: 300,
      source: "clawteam",
    };
    await writeAgentTelemetry(entry);
    const read = await readAgentTelemetry("store__p__t__stale");
    expect(read).not.toBeNull();
    expect(read!.status).toBe("idle");
    expect(read!.detail).toContain("auto-idle");
  });

  it("does not auto-idle agents within TTL", async () => {
    await setupTmpStore();
    const recentTime = new Date(Date.now() - 100_000).toISOString();
    const entry: AgentTelemetry = {
      agentId: "store__p__t__fresh",
      runtime: "openclaw",
      status: "working",
      detail: "still busy",
      updatedAt: recentTime,
      ttlSeconds: 300,
      source: "gateway",
    };
    await writeAgentTelemetry(entry);
    const read = await readAgentTelemetry("store__p__t__fresh");
    expect(read!.status).toBe("working");
  });
});

describe("readAllAgentTelemetry", () => {
  it("reads all agents from telemetry dir", async () => {
    await setupTmpStore();
    await writeAgentTelemetry({
      agentId: "agent-1", runtime: "openclaw", status: "idle",
      updatedAt: new Date().toISOString(), ttlSeconds: 300, source: "manual",
    });
    await writeAgentTelemetry({
      agentId: "agent-2", runtime: "clawteam", status: "working",
      updatedAt: new Date().toISOString(), ttlSeconds: 300, source: "clawteam",
    });
    const all = await readAllAgentTelemetry();
    expect(all).toHaveLength(2);
    expect(all.map((a) => a.agentId).sort()).toEqual(["agent-1", "agent-2"]);
  });

  it("returns empty array when no agents exist", async () => {
    await setupTmpStore();
    expect(await readAllAgentTelemetry()).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/telemetry.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: FAIL — module not found

- [ ] **Step 3: Implement telemetry.ts**

Create `src/lib/telemetry.ts`:

```typescript
import fs from "node:fs/promises";
import path from "node:path";
import { AgentTelemetry } from "./schema.js";
import { resolveAgentTelemetryDir, resolveAgentTelemetryFile } from "./paths.js";

export async function writeAgentTelemetry(entry: AgentTelemetry): Promise<void> {
  const filePath = resolveAgentTelemetryFile(entry.agentId);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(entry, null, 2) + "\n", "utf-8");
}

export async function readAgentTelemetry(agentId: string): Promise<AgentTelemetry | null> {
  const filePath = resolveAgentTelemetryFile(agentId);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }

  let entry: AgentTelemetry;
  try {
    entry = AgentTelemetry.parse(JSON.parse(raw));
  } catch {
    return null;
  }

  // TTL-based auto-idle (Star-Office-UI pattern)
  if (entry.status === "working") {
    const age = (Date.now() - new Date(entry.updatedAt).getTime()) / 1000;
    if (age > entry.ttlSeconds) {
      entry = {
        ...entry,
        status: "idle",
        detail: `auto-idle: no update in ${entry.ttlSeconds}s`,
      };
    }
  }

  return entry;
}

export async function readAllAgentTelemetry(): Promise<AgentTelemetry[]> {
  const dir = resolveAgentTelemetryDir();
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const results: AgentTelemetry[] = [];
  for (const name of entries) {
    const entry = await readAgentTelemetry(name);
    if (entry) results.push(entry);
  }
  return results;
}

export async function removeAgentTelemetry(agentId: string): Promise<void> {
  const dir = path.dirname(resolveAgentTelemetryFile(agentId));
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/telemetry.test.ts --reporter=verbose 2>&1 | tail -30`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add src/lib/telemetry.ts tests/telemetry.test.ts
git commit -m "feat: add telemetry read/write helpers with TTL-based auto-idle"
```

---

## Chunk 2: Adapter Interface & Registry

### Task 4: Define RuntimeProvisioner and RuntimeObserver interfaces

**Files:**
- Create: `src/lib/adapters/base.ts`
- Create: `tests/adapter-base.test.ts`

- [ ] **Step 1: Write failing test for adapter interfaces**

Create `tests/adapter-base.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import type { RuntimeProvisioner, RuntimeObserver } from "../src/lib/adapters/base.js";

describe("RuntimeProvisioner interface", () => {
  it("can be implemented with required methods", () => {
    const provisioner: RuntimeProvisioner = {
      runtime: "openclaw",
      async installTeam() { return; },
      async uninstallTeam() { return; },
      async planInstallTeam() { return []; },
    };
    expect(provisioner.runtime).toBe("openclaw");
  });
});

describe("RuntimeObserver interface", () => {
  it("can be implemented with required methods", () => {
    const observer: RuntimeObserver = {
      runtime: "openclaw",
      async start() { return; },
      async stop() { return; },
      async getAgentStatuses() { return []; },
    };
    expect(observer.runtime).toBe("openclaw");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/adapter-base.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: FAIL — module not found

- [ ] **Step 3: Implement base.ts**

Create `src/lib/adapters/base.ts`:

```typescript
import type { AgentTelemetry, RuntimeTarget } from "../schema.js";
import type { AgentDef, TeamDef, TeamMember } from "../schema.js";

export interface InstallAction {
  type: "create_workspace" | "write_file" | "patch_config" | "update_guidance" | "create_agent_dir" | "export_template";
  path: string;
  description: string;
}

export interface InstallTeamParams {
  projectId: string;
  teamDef: TeamDef;
  agents: Array<{
    agentDef: AgentDef;
    member: TeamMember;
    workspaceDir: string;
    agentDir: string;
  }>;
  overwrite?: boolean;
  dryRun?: boolean;
}

export interface RuntimeProvisioner {
  readonly runtime: RuntimeTarget;
  installTeam(params: InstallTeamParams): Promise<void>;
  uninstallTeam(projectId: string, teamId: string, workspaceRoot: string, agentIds?: string[]): Promise<void>;
  planInstallTeam(params: InstallTeamParams): Promise<InstallAction[]>;
}

export interface RuntimeObserver {
  readonly runtime: RuntimeTarget;
  start(onEvent?: (event: { type: string; data: unknown }) => void): Promise<void>;
  stop(): Promise<void>;
  getAgentStatuses(): Promise<AgentTelemetry[]>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/adapter-base.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add src/lib/adapters/base.ts tests/adapter-base.test.ts
git commit -m "feat: define RuntimeProvisioner and RuntimeObserver interfaces"
```

---

### Task 5: Build the adapter registry

**Files:**
- Create: `src/lib/adapters/registry.ts`
- Create: `tests/adapter-registry.test.ts`

- [ ] **Step 1: Write failing test**

Create `tests/adapter-registry.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { getProvisioner, getObserver } from "../src/lib/adapters/registry.js";

describe("getProvisioner", () => {
  it("returns OpenClaw provisioner for 'openclaw'", () => {
    expect(getProvisioner("openclaw").runtime).toBe("openclaw");
  });

  it("returns Claude Code provisioner for 'claude-code'", () => {
    expect(getProvisioner("claude-code").runtime).toBe("claude-code");
  });

  it("returns Codex provisioner for 'codex'", () => {
    expect(getProvisioner("codex").runtime).toBe("codex");
  });

  it("returns ClawTeam provisioner for 'clawteam'", () => {
    expect(getProvisioner("clawteam").runtime).toBe("clawteam");
  });
});

describe("getObserver", () => {
  it("returns OpenClaw observer for 'openclaw'", () => {
    expect(getObserver("openclaw").runtime).toBe("openclaw");
  });

  it("returns ClawTeam observer for 'clawteam'", () => {
    expect(getObserver("clawteam").runtime).toBe("clawteam");
  });

  it("returns ClawTeam observer for 'claude-code' (ClawTeam tracks these)", () => {
    expect(getObserver("claude-code").runtime).toBe("claude-code");
  });

  it("returns ClawTeam observer for 'codex' (ClawTeam tracks these)", () => {
    expect(getObserver("codex").runtime).toBe("codex");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/adapter-registry.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: FAIL — module not found

- [ ] **Step 3: Implement registry.ts**

Create `src/lib/adapters/registry.ts`:

```typescript
import type { RuntimeTarget } from "../schema.js";
import type { RuntimeProvisioner, RuntimeObserver } from "./base.js";
import { OpenClawProvisioner, OpenClawObserver } from "./openclaw.js";
import { ClaudeCodeProvisioner } from "./claude-code.js";
import { CodexProvisioner } from "./codex.js";
import { ClawTeamProvisioner, ClawTeamObserver } from "./clawteam.js";

export function getProvisioner(runtime: RuntimeTarget): RuntimeProvisioner {
  switch (runtime) {
    case "openclaw":
      return new OpenClawProvisioner();
    case "claude-code":
      return new ClaudeCodeProvisioner();
    case "codex":
      return new CodexProvisioner();
    case "clawteam":
      return new ClawTeamProvisioner();
    default:
      throw new Error(`Unknown runtime: ${runtime}`);
  }
}

export function getObserver(runtime: RuntimeTarget): RuntimeObserver {
  switch (runtime) {
    case "openclaw":
      return new OpenClawObserver();
    case "clawteam":
      return new ClawTeamObserver("clawteam");
    // Claude Code and Codex agents run under ClawTeam — use ClawTeam observer
    // which reads ~/.clawteam/ state. Falls back to no-op if ClawTeam not installed.
    case "claude-code":
      return new ClawTeamObserver("claude-code");
    case "codex":
      return new ClawTeamObserver("codex");
    default:
      throw new Error(`Unknown runtime: ${runtime}`);
  }
}
```

**Note:** This will compile only after Tasks 6-9 create the imported classes. Mark as blocked until then.

- [ ] **Step 4: Run test after all adapter implementations exist (after Task 9)**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/adapter-registry.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add src/lib/adapters/registry.ts tests/adapter-registry.test.ts
git commit -m "feat: add adapter registry with ClawTeam as primary multi-runtime observer"
```

---

## Chunk 3: Adapter Implementations

### Task 6: Wrap existing OpenClaw adapter as RuntimeProvisioner + RuntimeObserver

**Files:**
- Modify: `src/lib/adapters/openclaw.ts`

- [ ] **Step 1: Write failing test for OpenClaw adapter classes**

Add to `tests/adapter-base.test.ts`:

```typescript
import { OpenClawProvisioner, OpenClawObserver } from "../src/lib/adapters/openclaw.js";

describe("OpenClawProvisioner", () => {
  it("implements RuntimeProvisioner with runtime='openclaw'", () => {
    const p = new OpenClawProvisioner();
    expect(p.runtime).toBe("openclaw");
    expect(typeof p.installTeam).toBe("function");
    expect(typeof p.uninstallTeam).toBe("function");
    expect(typeof p.planInstallTeam).toBe("function");
  });
});

describe("OpenClawObserver", () => {
  it("implements RuntimeObserver with runtime='openclaw'", () => {
    const o = new OpenClawObserver();
    expect(o.runtime).toBe("openclaw");
    expect(typeof o.start).toBe("function");
    expect(typeof o.stop).toBe("function");
    expect(typeof o.getAgentStatuses).toBe("function");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/adapter-base.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: FAIL — classes not exported

- [ ] **Step 3: Add class wrappers to end of openclaw.ts**

Append to `src/lib/adapters/openclaw.ts`:

```typescript
import type { RuntimeProvisioner, RuntimeObserver, InstallTeamParams as BaseInstallTeamParams, InstallAction as BaseInstallAction } from "./base.js";
import type { AgentTelemetry } from "../schema.js";
import { writeAgentTelemetry, readAllAgentTelemetry } from "../telemetry.js";
import WebSocket from "ws";

export class OpenClawProvisioner implements RuntimeProvisioner {
  readonly runtime = "openclaw" as const;

  async installTeam(params: BaseInstallTeamParams): Promise<void> {
    return installTeam(params as unknown as InstallTeamParams);
  }

  async uninstallTeam(projectId: string, teamId: string, workspaceRoot: string, agentIds?: string[]): Promise<void> {
    return uninstallTeam(projectId, teamId, workspaceRoot, agentIds);
  }

  async planInstallTeam(params: BaseInstallTeamParams): Promise<BaseInstallAction[]> {
    return planInstallTeam(params as unknown as InstallTeamParams);
  }
}

export class OpenClawObserver implements RuntimeObserver {
  readonly runtime = "openclaw" as const;
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private onEvent?: (event: { type: string; data: unknown }) => void;

  async start(onEvent?: (event: { type: string; data: unknown }) => void): Promise<void> {
    this.onEvent = onEvent;
    this.connect();
  }

  async stop(): Promise<void> {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) this.ws.close();
    this.ws = null;
  }

  async getAgentStatuses(): Promise<AgentTelemetry[]> {
    return (await readAllAgentTelemetry()).filter((a) => a.runtime === "openclaw");
  }

  private connect(): void {
    try {
      this.ws = new WebSocket("ws://localhost:18789");
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.on("message", async (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "agent:status") {
          await writeAgentTelemetry({
            agentId: msg.agentId ?? msg.agent_id ?? "unknown",
            runtime: "openclaw",
            status: msg.status === "active" ? "working" : msg.status === "spawning" ? "working" : "idle",
            detail: msg.detail,
            updatedAt: new Date().toISOString(),
            sessionId: msg.sessionId ?? msg.session_id,
            ttlSeconds: 300,
            source: "gateway",
          });
        }
        this.onEvent?.({ type: msg.type, data: msg });
      } catch { /* ignore parse errors */ }
    });

    this.ws.on("close", () => this.scheduleReconnect());
    this.ws.on("error", () => {});
  }

  private scheduleReconnect(): void {
    this.reconnectTimer = setTimeout(() => this.connect(), 5000);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/adapter-base.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add src/lib/adapters/openclaw.ts tests/adapter-base.test.ts
git commit -m "feat: wrap OpenClaw adapter in RuntimeProvisioner and RuntimeObserver classes"
```

---

### Task 7: Implement ClawTeam adapter (provisioner + observer)

This is the key new adapter. The provisioner exports a `team.toml` + spawn catalog. The observer reads `~/.clawteam/` state files.

**Files:**
- Create: `src/lib/adapters/clawteam.ts`
- Create: `tests/clawteam-observer.test.ts`

- [ ] **Step 1: Write failing tests for ClawTeam observer**

Create `tests/clawteam-observer.test.ts`:

```typescript
import { describe, it, expect, afterEach } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { ClawTeamObserver, readClawTeamState } from "../src/lib/adapters/clawteam.js";

let tmpDir: string | null = null;
const originalEnv = process.env.CLAWTEAM_DATA_DIR;

afterEach(async () => {
  if (originalEnv === undefined) delete process.env.CLAWTEAM_DATA_DIR;
  else process.env.CLAWTEAM_DATA_DIR = originalEnv;
  if (tmpDir) {
    await fs.rm(tmpDir, { recursive: true, force: true });
    tmpDir = null;
  }
});

async function setupClawTeamFixture(): Promise<string> {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "clawteam-test-"));
  process.env.CLAWTEAM_DATA_DIR = tmpDir;

  // Create team config
  const teamDir = path.join(tmpDir, "teams", "test-team");
  await fs.mkdir(teamDir, { recursive: true });
  await fs.writeFile(path.join(teamDir, "config.json"), JSON.stringify({
    name: "test-team",
    description: "Test team",
    leadAgentId: "abc123",
    createdAt: "2026-03-17T10:00:00Z",
    members: [
      { name: "leader", user: "test", agentId: "abc123", agentType: "lead", joinedAt: "2026-03-17T10:00:00Z" },
      { name: "worker-1", user: "test", agentId: "def456", agentType: "researcher", joinedAt: "2026-03-17T10:01:00Z" },
    ],
  }));

  // Create spawn registry
  await fs.writeFile(path.join(teamDir, "spawn_registry.json"), JSON.stringify({
    leader: { backend: "tmux", tmux_target: "sess:0", pid: 99999, command: ["claude"] },
    "worker-1": { backend: "subprocess", tmux_target: "", pid: 99998, command: ["codex"] },
  }));

  // Create tasks
  const taskDir = path.join(tmpDir, "tasks", "test-team");
  await fs.mkdir(taskDir, { recursive: true });
  await fs.writeFile(path.join(taskDir, "task-001.json"), JSON.stringify({
    id: "001",
    subject: "Research market trends",
    status: "in_progress",
    owner: "worker-1",
    createdAt: "2026-03-17T10:05:00Z",
    updatedAt: "2026-03-17T10:10:00Z",
  }));
  await fs.writeFile(path.join(taskDir, "task-002.json"), JSON.stringify({
    id: "002",
    subject: "Write report",
    status: "pending",
    owner: "leader",
    blockedBy: ["001"],
    createdAt: "2026-03-17T10:05:00Z",
    updatedAt: "2026-03-17T10:05:00Z",
  }));

  return tmpDir;
}

describe("readClawTeamState", () => {
  it("reads team config, members, and tasks", async () => {
    await setupClawTeamFixture();
    const state = await readClawTeamState("test-team");
    expect(state).not.toBeNull();
    expect(state!.team.name).toBe("test-team");
    expect(state!.members).toHaveLength(2);
    expect(state!.tasks).toHaveLength(2);
  });

  it("returns null for nonexistent team", async () => {
    await setupClawTeamFixture();
    const state = await readClawTeamState("nonexistent");
    expect(state).toBeNull();
  });
});

describe("ClawTeamObserver", () => {
  it("implements RuntimeObserver with runtime='clawteam'", () => {
    const o = new ClawTeamObserver("clawteam");
    expect(o.runtime).toBe("clawteam");
    expect(typeof o.start).toBe("function");
    expect(typeof o.stop).toBe("function");
    expect(typeof o.getAgentStatuses).toBe("function");
  });

  it("returns normalized telemetry from ClawTeam state", async () => {
    await setupClawTeamFixture();
    // Also set up malaclaw dir for telemetry writes
    const malDir = path.join(tmpDir!, "malaclaw");
    process.env.MALACLAW_DIR = malDir;

    const o = new ClawTeamObserver("clawteam");
    // Sync state to telemetry files
    await o.syncTeamState("test-team");

    const statuses = await o.getAgentStatuses();
    expect(statuses.length).toBeGreaterThanOrEqual(2);

    const workerStatus = statuses.find((s) => s.agentId.includes("worker-1"));
    expect(workerStatus).toBeDefined();
    expect(workerStatus!.source).toBe("clawteam");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/clawteam-observer.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: FAIL — module not found

- [ ] **Step 3: Implement clawteam.ts**

Create `src/lib/adapters/clawteam.ts`:

```typescript
import fs from "node:fs/promises";
import path from "node:path";
import type { RuntimeProvisioner, RuntimeObserver, InstallTeamParams, InstallAction } from "./base.js";
import type { AgentTelemetry, RuntimeTarget } from "../schema.js";
import { writeAgentTelemetry, readAllAgentTelemetry } from "../telemetry.js";
import { resolveClawTeamDataDir } from "../paths.js";
import { renderBootstrapFiles } from "../renderer.js";

/* ── ClawTeam State Reading ─────────────────────────── */

interface ClawTeamMember {
  name: string;
  user?: string;
  agentId: string;
  agentType?: string;
  joinedAt?: string;
}

interface ClawTeamConfig {
  name: string;
  description?: string;
  leadAgentId?: string;
  createdAt?: string;
  members: ClawTeamMember[];
  budgetCents?: number;
}

interface ClawTeamSpawnEntry {
  backend: string;
  tmux_target?: string;
  pid?: number;
  command?: string[];
}

interface ClawTeamTask {
  id: string;
  subject: string;
  description?: string;
  status: string;
  owner?: string;
  lockedBy?: string;
  blockedBy?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ClawTeamState {
  team: ClawTeamConfig;
  members: ClawTeamMember[];
  spawnRegistry: Record<string, ClawTeamSpawnEntry>;
  tasks: ClawTeamTask[];
}

/** Read ClawTeam's native state for a given team. Returns null if not found. */
export async function readClawTeamState(teamName: string): Promise<ClawTeamState | null> {
  const dataDir = resolveClawTeamDataDir();
  const teamDir = path.join(dataDir, "teams", teamName);

  // Read team config
  let config: ClawTeamConfig;
  try {
    config = JSON.parse(await fs.readFile(path.join(teamDir, "config.json"), "utf-8"));
  } catch {
    return null;
  }

  // Read spawn registry
  let spawnRegistry: Record<string, ClawTeamSpawnEntry> = {};
  try {
    spawnRegistry = JSON.parse(await fs.readFile(path.join(teamDir, "spawn_registry.json"), "utf-8"));
  } catch {
    // No spawn registry — team may not have active agents
  }

  // Read tasks
  const tasks: ClawTeamTask[] = [];
  const taskDir = path.join(dataDir, "tasks", teamName);
  try {
    const taskFiles = await fs.readdir(taskDir);
    for (const f of taskFiles) {
      if (!f.startsWith("task-") || !f.endsWith(".json")) continue;
      try {
        const task = JSON.parse(await fs.readFile(path.join(taskDir, f), "utf-8"));
        tasks.push(task);
      } catch {
        // skip malformed tasks
      }
    }
  } catch {
    // no tasks dir
  }

  return {
    team: config,
    members: config.members || [],
    spawnRegistry,
    tasks,
  };
}

/** Map ClawTeam task status to MalaClaw agent status */
function inferAgentStatus(
  agentName: string,
  spawnRegistry: Record<string, ClawTeamSpawnEntry>,
  tasks: ClawTeamTask[],
): "idle" | "working" | "offline" {
  // Check if agent has active tasks
  const activeTasks = tasks.filter(
    (t) => t.owner === agentName && t.status === "in_progress"
  );
  if (activeTasks.length > 0) return "working";

  // Check if agent is in spawn registry (has a PID)
  const spawn = spawnRegistry[agentName];
  if (!spawn?.pid) return "offline";

  return "idle";
}

/* ── ClawTeam Observer ──────────────────────────────── */

export class ClawTeamObserver implements RuntimeObserver {
  readonly runtime: RuntimeTarget;

  constructor(runtime: RuntimeTarget) {
    this.runtime = runtime;
  }

  async start(_onEvent?: (event: { type: string; data: unknown }) => void): Promise<void> {
    // ClawTeam state is file-based — the dashboard watcher handles change detection.
    // On start, do an initial sync of all known teams.
    await this.syncAllTeams();
  }

  async stop(): Promise<void> {
    // No active connection to close.
  }

  async getAgentStatuses(): Promise<AgentTelemetry[]> {
    const all = await readAllAgentTelemetry();
    return all.filter((a) => a.source === "clawteam");
  }

  /** Sync one ClawTeam team's state into MalaClaw telemetry files */
  async syncTeamState(teamName: string): Promise<void> {
    const state = await readClawTeamState(teamName);
    if (!state) return;

    for (const member of state.members) {
      const status = inferAgentStatus(member.name, state.spawnRegistry, state.tasks);
      const activeTasks = state.tasks.filter(
        (t) => t.owner === member.name && t.status === "in_progress"
      );
      const detail = activeTasks.length > 0
        ? activeTasks.map((t) => t.subject).join("; ")
        : undefined;

      await writeAgentTelemetry({
        agentId: `clawteam__${teamName}__${member.name}`,
        runtime: this.runtime,
        status,
        detail,
        updatedAt: new Date().toISOString(),
        pid: state.spawnRegistry[member.name]?.pid,
        ttlSeconds: 300,
        source: "clawteam",
      });
    }
  }

  /** Sync all discovered ClawTeam teams */
  private async syncAllTeams(): Promise<void> {
    const dataDir = resolveClawTeamDataDir();
    try {
      const teamsDir = path.join(dataDir, "teams");
      const entries = await fs.readdir(teamsDir);
      for (const teamName of entries) {
        await this.syncTeamState(teamName);
      }
    } catch {
      // ClawTeam not installed or no teams — that's OK
    }
  }
}

/* ── ClawTeam Provisioner ───────────────────────────── */

/**
 * ClawTeam provisioner — exports MalaClaw team definitions as ClawTeam launch packages.
 *
 * Generates:
 * - team.toml — ClawTeam template with leader + agents
 * - Per-agent prompt files (SOUL.md, IDENTITY.md, etc.)
 * - spawn-catalog.json — role catalog for dynamic spawning
 */
export class ClawTeamProvisioner implements RuntimeProvisioner {
  readonly runtime = "clawteam" as const;

  async installTeam(params: InstallTeamParams): Promise<void> {
    const exportDir = path.join(params.agents[0]?.workspaceDir ?? ".", "..", ".clawteam-export");
    await fs.mkdir(exportDir, { recursive: true });

    // Generate team.toml
    const toml = buildTeamToml(params);
    await fs.writeFile(path.join(exportDir, "team.toml"), toml, "utf-8");

    // Generate spawn catalog
    const catalog = buildSpawnCatalog(params);
    await fs.writeFile(
      path.join(exportDir, "spawn-catalog.json"),
      JSON.stringify(catalog, null, 2) + "\n",
      "utf-8",
    );

    // Generate per-agent prompt files
    const promptsDir = path.join(exportDir, "prompts");
    await fs.mkdir(promptsDir, { recursive: true });
    for (const agent of params.agents) {
      const files = renderBootstrapFiles({
        agentDef: agent.agentDef,
        teamDef: params.teamDef,
        member: agent.member,
        allMembers: params.agents.map((a) => a.member),
      });
      const agentPromptDir = path.join(promptsDir, agent.agentDef.id);
      await fs.mkdir(agentPromptDir, { recursive: true });
      for (const [name, content] of Object.entries(files)) {
        await fs.writeFile(path.join(agentPromptDir, name), content, "utf-8");
      }
    }
  }

  async uninstallTeam(
    _projectId: string,
    _teamId: string,
    workspaceRoot: string,
  ): Promise<void> {
    const exportDir = path.join(workspaceRoot, ".clawteam-export");
    await fs.rm(exportDir, { recursive: true, force: true });
  }

  async planInstallTeam(params: InstallTeamParams): Promise<InstallAction[]> {
    const exportDir = path.join(params.agents[0]?.workspaceDir ?? ".", "..", ".clawteam-export");
    const actions: InstallAction[] = [
      { type: "export_template", path: path.join(exportDir, "team.toml"), description: "Generate ClawTeam team template" },
      { type: "export_template", path: path.join(exportDir, "spawn-catalog.json"), description: "Generate spawn role catalog" },
    ];
    for (const agent of params.agents) {
      actions.push({
        type: "write_file",
        path: path.join(exportDir, "prompts", agent.agentDef.id),
        description: `Generate prompt files for ${agent.agentDef.id}`,
      });
    }
    return actions;
  }
}

/* ── TOML / Catalog Generators ──────────────────────── */

function buildTeamToml(params: InstallTeamParams): string {
  const { teamDef, agents } = params;
  const leader = agents.find((a) => a.member.role === "lead") ?? agents[0];
  const workers = agents.filter((a) => a !== leader);

  const lines: string[] = [];
  lines.push("[template]");
  lines.push(`name = "${teamDef.id}"`);
  if (teamDef.name) lines.push(`description = "${teamDef.name}"`);
  lines.push(`command = ["claude"]`);
  lines.push(`backend = "tmux"`);
  lines.push("");

  // Leader
  lines.push("[template.leader]");
  lines.push(`name = "${leader.agentDef.id}"`);
  lines.push(`type = "${leader.member.role}"`);
  lines.push(`task = """`);
  lines.push(`You are ${leader.agentDef.name ?? leader.agentDef.id}, the team lead.`);
  lines.push(`${leader.agentDef.soul.persona}`);
  lines.push(`"""`);
  lines.push("");

  // Workers
  for (const worker of workers) {
    lines.push("[[template.agents]]");
    lines.push(`name = "${worker.agentDef.id}"`);
    lines.push(`type = "${worker.member.role}"`);
    lines.push(`task = """`);
    lines.push(`You are ${worker.agentDef.name ?? worker.agentDef.id}.`);
    lines.push(`${worker.agentDef.soul.persona}`);
    lines.push(`"""`);
    lines.push("");
  }

  return lines.join("\n");
}

interface SpawnCatalogEntry {
  role: string;
  agentId: string;
  name: string;
  runtime: string;
  promptDir: string;
  model: string;
  capabilities: Record<string, boolean>;
}

function buildSpawnCatalog(params: InstallTeamParams): { version: number; team: string; roles: SpawnCatalogEntry[] } {
  return {
    version: 1,
    team: params.teamDef.id,
    roles: params.agents.map((a) => ({
      role: a.member.role,
      agentId: a.agentDef.id,
      name: a.agentDef.name ?? a.agentDef.id,
      runtime: "claude",  // default command for ClawTeam
      promptDir: `prompts/${a.agentDef.id}`,
      model: a.agentDef.model.primary,
      capabilities: {
        sessions_spawn: a.agentDef.capabilities.sessions_spawn ?? false,
        sessions_send: a.agentDef.capabilities.sessions_send ?? false,
      },
    })),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/clawteam-observer.test.ts --reporter=verbose 2>&1 | tail -30`
Expected: ALL PASS

- [ ] **Step 5: Write adapter-base test for ClawTeam classes**

Add to `tests/adapter-base.test.ts`:

```typescript
import { ClawTeamProvisioner, ClawTeamObserver } from "../src/lib/adapters/clawteam.js";

describe("ClawTeamProvisioner", () => {
  it("implements RuntimeProvisioner with runtime='clawteam'", () => {
    const p = new ClawTeamProvisioner();
    expect(p.runtime).toBe("clawteam");
    expect(typeof p.installTeam).toBe("function");
    expect(typeof p.uninstallTeam).toBe("function");
    expect(typeof p.planInstallTeam).toBe("function");
  });
});

describe("ClawTeamObserver", () => {
  it("implements RuntimeObserver with runtime='clawteam'", () => {
    const o = new ClawTeamObserver("clawteam");
    expect(o.runtime).toBe("clawteam");
  });
});
```

- [ ] **Step 6: Run all adapter-base tests**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/adapter-base.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: ALL PASS

- [ ] **Step 7: Commit**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add src/lib/adapters/clawteam.ts tests/clawteam-observer.test.ts tests/adapter-base.test.ts
git commit -m "feat: add ClawTeam adapter with native state reading and team.toml export"
```

---

### Task 8: Implement Claude Code provisioner

**Files:**
- Rewrite: `src/lib/adapters/claude-code.ts`

- [ ] **Step 1: Write failing test**

Add to `tests/adapter-base.test.ts`:

```typescript
import { ClaudeCodeProvisioner } from "../src/lib/adapters/claude-code.js";

describe("ClaudeCodeProvisioner", () => {
  it("implements RuntimeProvisioner with runtime='claude-code'", () => {
    const p = new ClaudeCodeProvisioner();
    expect(p.runtime).toBe("claude-code");
    expect(typeof p.installTeam).toBe("function");
    expect(typeof p.uninstallTeam).toBe("function");
    expect(typeof p.planInstallTeam).toBe("function");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/adapter-base.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: FAIL — class not exported

- [ ] **Step 3: Implement claude-code.ts**

Create/rewrite `src/lib/adapters/claude-code.ts`:

```typescript
import fs from "node:fs/promises";
import path from "node:path";
import type { RuntimeProvisioner, InstallTeamParams, InstallAction } from "./base.js";
import { renderBootstrapFiles } from "../renderer.js";

export class ClaudeCodeProvisioner implements RuntimeProvisioner {
  readonly runtime = "claude-code" as const;

  async installTeam(params: InstallTeamParams): Promise<void> {
    for (const agent of params.agents) {
      await fs.mkdir(agent.workspaceDir, { recursive: true });

      const files = renderBootstrapFiles({
        agentDef: agent.agentDef,
        teamDef: params.teamDef,
        member: agent.member,
        allMembers: params.agents.map((a) => a.member),
      });

      // CLAUDE.md is the primary prompt for Claude Code
      const claudeMd = buildClaudeMd(files, agent.agentDef.id);
      await fs.writeFile(path.join(agent.workspaceDir, "CLAUDE.md"), claudeMd, "utf-8");

      // Also write individual files for reference
      for (const [name, content] of Object.entries(files)) {
        await fs.writeFile(path.join(agent.workspaceDir, name), content, "utf-8");
      }
    }
  }

  async uninstallTeam(_projectId: string, _teamId: string, workspaceRoot: string, agentIds?: string[]): Promise<void> {
    if (agentIds) {
      for (const id of agentIds) await fs.rm(path.join(workspaceRoot, id), { recursive: true, force: true });
    } else {
      await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
  }

  async planInstallTeam(params: InstallTeamParams): Promise<InstallAction[]> {
    return params.agents.flatMap((a) => [
      { type: "create_workspace" as const, path: a.workspaceDir, description: `Create workspace for ${a.agentDef.id}` },
      { type: "write_file" as const, path: path.join(a.workspaceDir, "CLAUDE.md"), description: `Write CLAUDE.md for ${a.agentDef.id}` },
    ]);
  }
}

function buildClaudeMd(files: Record<string, string>, agentId: string): string {
  const sections: string[] = [`# CLAUDE.md — ${agentId}\n`, `> Auto-generated by malaclaw. Do not edit manually.\n`];
  if (files["SOUL.md"]) sections.push(`## Persona\n\n${files["SOUL.md"]}`);
  if (files["IDENTITY.md"]) sections.push(`## Identity\n\n${files["IDENTITY.md"]}`);
  if (files["TOOLS.md"]) sections.push(`## Tools\n\n${files["TOOLS.md"]}`);
  if (files["AGENTS.md"]) sections.push(`## Team\n\n${files["AGENTS.md"]}`);
  return sections.join("\n---\n\n");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/adapter-base.test.ts --reporter=verbose 2>&1 | tail -20`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add src/lib/adapters/claude-code.ts tests/adapter-base.test.ts
git commit -m "feat: implement Claude Code provisioner with CLAUDE.md generation"
```

---

### Task 9: Implement Codex provisioner

**Files:**
- Create: `src/lib/adapters/codex.ts`

- [ ] **Step 1: Write failing test**

Add to `tests/adapter-base.test.ts`:

```typescript
import { CodexProvisioner } from "../src/lib/adapters/codex.js";

describe("CodexProvisioner", () => {
  it("implements RuntimeProvisioner with runtime='codex'", () => {
    const p = new CodexProvisioner();
    expect(p.runtime).toBe("codex");
  });
});
```

- [ ] **Step 2: Run test to verify it fails, then implement**

Create `src/lib/adapters/codex.ts`:

```typescript
import fs from "node:fs/promises";
import path from "node:path";
import type { RuntimeProvisioner, InstallTeamParams, InstallAction } from "./base.js";
import { renderBootstrapFiles } from "../renderer.js";

export class CodexProvisioner implements RuntimeProvisioner {
  readonly runtime = "codex" as const;

  async installTeam(params: InstallTeamParams): Promise<void> {
    for (const agent of params.agents) {
      await fs.mkdir(agent.workspaceDir, { recursive: true });

      const files = renderBootstrapFiles({
        agentDef: agent.agentDef,
        teamDef: params.teamDef,
        member: agent.member,
        allMembers: params.agents.map((a) => a.member),
      });

      // AGENTS.md is the primary prompt for Codex
      const agentsMd = buildAgentsMd(files, agent.agentDef.id);
      await fs.writeFile(path.join(agent.workspaceDir, "AGENTS.md"), agentsMd, "utf-8");

      for (const [name, content] of Object.entries(files)) {
        await fs.writeFile(path.join(agent.workspaceDir, name), content, "utf-8");
      }
    }
  }

  async uninstallTeam(_projectId: string, _teamId: string, workspaceRoot: string, agentIds?: string[]): Promise<void> {
    if (agentIds) {
      for (const id of agentIds) await fs.rm(path.join(workspaceRoot, id), { recursive: true, force: true });
    } else {
      await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
  }

  async planInstallTeam(params: InstallTeamParams): Promise<InstallAction[]> {
    return params.agents.flatMap((a) => [
      { type: "create_workspace" as const, path: a.workspaceDir, description: `Create workspace for ${a.agentDef.id}` },
      { type: "write_file" as const, path: path.join(a.workspaceDir, "AGENTS.md"), description: `Write AGENTS.md for ${a.agentDef.id}` },
    ]);
  }
}

function buildAgentsMd(files: Record<string, string>, agentId: string): string {
  const sections: string[] = [`# Agent: ${agentId}\n`, `> Auto-generated by malaclaw. Do not edit manually.\n`];
  if (files["SOUL.md"]) sections.push(`## Persona\n\n${files["SOUL.md"]}`);
  if (files["IDENTITY.md"]) sections.push(`## Identity\n\n${files["IDENTITY.md"]}`);
  if (files["TOOLS.md"]) sections.push(`## Tools\n\n${files["TOOLS.md"]}`);
  if (files["AGENTS.md"]) sections.push(`## Team\n\n${files["AGENTS.md"]}`);
  return sections.join("\n---\n\n");
}
```

- [ ] **Step 3: Run all adapter tests + registry tests**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run tests/adapter-base.test.ts tests/adapter-registry.test.ts --reporter=verbose 2>&1 | tail -30`
Expected: ALL PASS

- [ ] **Step 4: Commit**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add src/lib/adapters/codex.ts src/lib/adapters/registry.ts tests/adapter-base.test.ts tests/adapter-registry.test.ts
git commit -m "feat: add Codex provisioner and complete adapter suite with registry"
```

---

## Chunk 4: Dashboard Integration

### Task 10: Create RuntimeStatusProvider and wire into dashboard

**Files:**
- Create: `dashboard/server/services/runtime-status.ts`
- Modify: `dashboard/server/index.ts`
- Modify: `dashboard/server/routes/usage.ts`
- Modify: `dashboard/server/watcher.ts`

- [ ] **Step 1: Implement RuntimeStatusProvider**

Create `dashboard/server/services/runtime-status.ts`:

```typescript
import type { RuntimeObserver } from "../../../dist/lib/adapters/base.js";
import type { AgentTelemetry } from "../../../dist/lib/schema.js";
import { getObserver } from "../../../dist/lib/adapters/registry.js";
import { readAllAgentTelemetry } from "../../../dist/lib/telemetry.js";

export interface UsageSummary {
  input_tokens: number;
  output_tokens: number;
  total_cost: number;
}

export class RuntimeStatusProvider {
  private observers: Map<string, RuntimeObserver> = new Map();
  private usage: UsageSummary = { input_tokens: 0, output_tokens: 0, total_cost: 0 };

  async addRuntime(
    runtime: "openclaw" | "claude-code" | "codex" | "clawteam",
    onEvent?: (event: { type: string; data: unknown }) => void,
  ): Promise<void> {
    if (this.observers.has(runtime)) return;
    const observer = getObserver(runtime);
    this.observers.set(runtime, observer);
    await observer.start((event) => {
      if (event.type === "usage:update" && typeof event.data === "object" && event.data) {
        const d = event.data as Record<string, number>;
        this.usage = {
          input_tokens: d.input_tokens ?? this.usage.input_tokens,
          output_tokens: d.output_tokens ?? this.usage.output_tokens,
          total_cost: d.total_cost ?? this.usage.total_cost,
        };
      }
      onEvent?.(event);
    });
  }

  async stop(): Promise<void> {
    for (const observer of this.observers.values()) await observer.stop();
    this.observers.clear();
  }

  async getAgentStatuses(): Promise<AgentTelemetry[]> {
    return readAllAgentTelemetry();
  }

  getUsage(): UsageSummary {
    return { ...this.usage };
  }
}
```

- [ ] **Step 2: Update dashboard/server/index.ts**

Replace `GatewayClient` import and usage:

**Find:** `import { GatewayClient } from "./services/gateway.js";`
**Replace:** `import { RuntimeStatusProvider } from "./services/runtime-status.js";`

**Find** GatewayClient init block, **replace** with:

```typescript
const statusProvider = new RuntimeStatusProvider();
// Start OpenClaw observer by default (existing behavior)
statusProvider.addRuntime("openclaw", (event) => {
  broadcast({ type: "runtime:" + event.type, ...(typeof event.data === "object" ? event.data : {}) });
}).catch(() => { /* OpenClaw gateway not available */ });
// Start ClawTeam observer (reads ~/.clawteam/ state)
statusProvider.addRuntime("clawteam", (event) => {
  broadcast({ type: "runtime:" + event.type, ...(typeof event.data === "object" ? event.data : {}) });
}).catch(() => { /* ClawTeam not installed */ });
```

**Replace** `gateway.disconnect()` with `await statusProvider.stop()`

**Replace** `createUsageRoutes(gateway)` with `createUsageRoutes(statusProvider)`

- [ ] **Step 3: Update usage.ts routes**

Rewrite `dashboard/server/routes/usage.ts`:

```typescript
import type { FastifyPluginAsync } from "fastify";
import type { RuntimeStatusProvider } from "../services/runtime-status.js";

export function createUsageRoutes(statusProvider: RuntimeStatusProvider): FastifyPluginAsync {
  return async (app) => {
    app.get("/api/usage", async () => statusProvider.getUsage());
    app.get("/api/usage/agents", async () => {
      const statuses = await statusProvider.getAgentStatuses();
      const map: Record<string, unknown> = {};
      for (const s of statuses) map[s.agentId] = s;
      return map;
    });
  };
}
```

- [ ] **Step 4: Update watcher.ts to watch telemetry + ClawTeam files**

Add imports:

```typescript
import { resolveAgentTelemetryDir } from "../../dist/lib/paths.js";
```

Add to watch paths:

```typescript
path.join(resolveAgentTelemetryDir(), "**", "state.json")
```

Add handler for telemetry changes:

```typescript
if (changedPath.includes("/agents/") && changedPath.endsWith("/state.json")) {
  const agentId = path.basename(path.dirname(changedPath));
  broadcast({ type: "agent:status-changed", agentId });
}
```

- [ ] **Step 5: Verify build**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && cd dashboard && npx tsc -p tsconfig.server.json --noEmit 2>&1 | tail -20`
Expected: No errors

- [ ] **Step 6: Run existing dashboard tests**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw/dashboard && npx vitest run --reporter=verbose 2>&1 | tail -30`
Expected: Tests pass (may need minor fixture updates for gateway → statusProvider rename)

- [ ] **Step 7: Commit**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add dashboard/server/services/runtime-status.ts dashboard/server/index.ts dashboard/server/routes/usage.ts dashboard/server/watcher.ts
git commit -m "feat: replace GatewayClient with RuntimeStatusProvider supporting OpenClaw + ClawTeam"
```

---

### Task 11: Wire install-headless.ts to use adapter registry

**Files:**
- Modify: `src/lib/install-headless.ts`

- [ ] **Step 1: Add import for adapter registry and telemetry**

```typescript
import { getProvisioner } from "./adapters/registry.js";
import { writeAgentTelemetry } from "./telemetry.js";
```

- [ ] **Step 2: Get provisioner from manifest runtime**

After resolving the manifest, add:

```typescript
const runtime = manifest.runtime ?? "openclaw";
const provisioner = getProvisioner(runtime);
```

- [ ] **Step 3: Replace direct openclaw adapter calls**

Replace `installTeam(...)` calls with `provisioner.installTeam(...)`.

Guard OpenClaw-specific operations:

```typescript
if (runtime === "openclaw") {
  await updateStoreGuidance();
  // ... allowlist patching with addSkillsToAgentAllowlists
}
```

- [ ] **Step 4: Write initial telemetry state after provisioning**

After each team install, add:

```typescript
for (const agent of resolvedPack.agents) {
  await writeAgentTelemetry({
    agentId: agent.agentId,
    runtime,
    status: "idle",
    detail: "Provisioned by malaclaw install",
    updatedAt: new Date().toISOString(),
    workspaceDir: agent.workspaceDir,
    ttlSeconds: 300,
    source: "manual",
  });
}
```

- [ ] **Step 5: Run full test suite**

Run: `cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build && npx vitest run --reporter=verbose 2>&1 | tail -40`
Expected: ALL PASS

- [ ] **Step 6: Commit**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add src/lib/install-headless.ts
git commit -m "feat: dispatch install to runtime-specific provisioner via adapter registry"
```

---

## Chunk 5: Documentation & Verification

### Task 12: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add runtime adapter documentation**

Add after "State File Summary" section:

```markdown
## Runtime Adapters

MalaClaw is a runtime-agnostic control plane. It provisions agents to different runtimes via adapters.

### Supported Runtimes

| Runtime | Manifest value | Provisioner | Observer |
|---|---|---|---|
| OpenClaw | `openclaw` (default) | Patches `~/.openclaw/openclaw.json`, creates agent dirs | Gateway WebSocket at `ws://localhost:18789` |
| Claude Code | `claude-code` | Generates `CLAUDE.md` per agent workspace | ClawTeam observer (if running under ClawTeam) |
| Codex | `codex` | Generates `AGENTS.md` per agent workspace | ClawTeam observer (if running under ClawTeam) |
| ClawTeam | `clawteam` | Exports `team.toml` + spawn catalog | Reads `~/.clawteam/` native state (spawn_registry, tasks, config) |

### Two-Path Observer Model

1. **OpenClaw direct:** Gateway WebSocket → writes to `~/.malaclaw/agents/<id>/state.json`
2. **ClawTeam-managed:** Reads `~/.clawteam/teams/*/` → writes to `~/.malaclaw/agents/<id>/state.json`

Both paths normalize to the same telemetry schema. The dashboard reads only the normalized files.

### Setting Runtime Target

```yaml
# malaclaw.yaml
version: 1
runtime: clawteam    # or openclaw (default), claude-code, codex
packs:
  - id: dev-company
```

### Telemetry Contract

All runtimes write normalized agent state to `~/.malaclaw/agents/<agentId>/state.json`:

```json
{
  "agentId": "store__proj__team__pm",
  "runtime": "clawteam",
  "status": "working",
  "detail": "Research market trends",
  "updatedAt": "2026-03-17T18:20:00Z",
  "ttlSeconds": 300,
  "source": "clawteam"
}
```

**Status values:** `idle`, `working`, `error`, `offline`
**Source values:** `gateway` (OpenClaw), `clawteam` (ClawTeam state), `heartbeat` (future), `manual` (install-time)

### Adapter Architecture

```
src/lib/adapters/
├── base.ts              ← RuntimeProvisioner + RuntimeObserver interfaces
├── registry.ts          ← getProvisioner(runtime) + getObserver(runtime)
├── openclaw.ts          ← OpenClaw adapter (existing) + class wrappers
├── claude-code.ts       ← Claude Code provisioner (CLAUDE.md)
├── codex.ts             ← Codex provisioner (AGENTS.md)
└── clawteam.ts          ← ClawTeam provisioner (team.toml export) + observer (native state reader)
```
```

- [ ] **Step 2: Commit**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add CLAUDE.md
git commit -m "docs: add runtime adapter architecture with ClawTeam integration to CLAUDE.md"
```

---

### Task 13: Full verification

- [ ] **Step 1: Build**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw && npm run build
```

- [ ] **Step 2: Run all tests**

```bash
npx vitest run --reporter=verbose 2>&1
```
Expected: ALL PASS

- [ ] **Step 3: Run malaclaw validate**

```bash
node dist/cli.js validate
```
Expected: All templates valid

- [ ] **Step 4: Dashboard type check**

```bash
cd dashboard && npx tsc -p tsconfig.server.json --noEmit
```
Expected: No errors

- [ ] **Step 5: Final commit if needed**

```bash
cd /Users/zhiyuanparis/github/openclaw-dir/MalaClaw
git add -A && git commit -m "fix: address any remaining issues from runtime adapter integration"
```

---

## Summary

| # | Task | Key Output |
|---|------|------------|
| 1 | RuntimeTarget + AgentTelemetry schemas | `schema.ts` — 4 runtimes, telemetry schema with `source: "clawteam"` |
| 2 | Path resolution | `paths.ts` — telemetry dirs + ClawTeam data dir |
| 3 | Telemetry read/write + TTL auto-idle | `telemetry.ts` — Star-Office-UI pattern |
| 4 | Adapter interfaces | `adapters/base.ts` — Provisioner + Observer |
| 5 | Adapter registry | `adapters/registry.ts` — ClawTeam as default observer for claude-code/codex |
| 6 | OpenClaw wrapper | `adapters/openclaw.ts` — existing code wrapped in classes |
| 7 | **ClawTeam adapter** | `adapters/clawteam.ts` — reads `~/.clawteam/` state + exports `team.toml` |
| 8 | Claude Code provisioner | `adapters/claude-code.ts` — generates `CLAUDE.md` |
| 9 | Codex provisioner | `adapters/codex.ts` — generates `AGENTS.md` |
| 10 | Dashboard integration | `runtime-status.ts` — OpenClaw + ClawTeam observers |
| 11 | Install flow dispatch | `install-headless.ts` — provisioner per runtime |
| 12 | Documentation | `CLAUDE.md` — runtime adapter docs |
| 13 | Verification | Full test suite + build + validate |

### Strategic Result

```
User defines team in malaclaw.yaml (runtime: clawteam)
    ↓ malaclaw install
MalaClaw exports team.toml + spawn-catalog.json + prompt files
    ↓ clawteam launch <template>
ClawTeam spawns agents (Claude Code, Codex, OpenClaw — any CLI agent)
    ↓ ClawTeam writes to ~/.clawteam/
MalaClaw dashboard reads ~/.clawteam/ state → normalized telemetry
    ↓ Dashboard shows unified view
User sees all agents, tasks, costs in one place
```

**Deferred to later:**
- Standalone heartbeat bridge (only needed for non-ClawTeam Claude Code/Codex runs)
- `malaclaw run --runtime clawteam` (thin launcher — skip if no value beyond export)
- Dependency-aware task metadata in manifest
