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

  // TTL-based auto-idle
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
