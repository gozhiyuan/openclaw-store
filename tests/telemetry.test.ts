import { describe, it, expect, afterEach } from "vitest";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";

import {
  resolveAgentTelemetryDir,
  resolveAgentTelemetryFile,
  resolveClawTeamDataDir,
} from "../src/lib/paths.js";
import {
  readAgentTelemetry,
  writeAgentTelemetry,
  readAllAgentTelemetry,
} from "../src/lib/telemetry.js";
import type { AgentTelemetry } from "../src/lib/schema.js";

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
