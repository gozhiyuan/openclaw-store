import fs from "node:fs/promises";
import path from "node:path";
import { resolveManifestPath, resolveOpenClawConfigPath } from "./paths.js";

export type WorkflowMode =
  | "managed"
  | "claude-code-default"
  | "openclaw-default"
  | "unconfigured";

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function detectWorkflowMode(projectDir: string = process.cwd()): Promise<WorkflowMode> {
  const manifestPath = resolveManifestPath(projectDir);
  if (await pathExists(manifestPath)) {
    return "managed";
  }

  const claudeMd = path.join(projectDir, "CLAUDE.md");
  const claudeDir = path.join(projectDir, ".claude");
  if ((await pathExists(claudeMd)) || (await pathExists(claudeDir))) {
    return "claude-code-default";
  }

  if (await pathExists(resolveOpenClawConfigPath())) {
    return "openclaw-default";
  }

  return "unconfigured";
}

export function describeWorkflowMode(mode: WorkflowMode): string {
  switch (mode) {
    case "managed":
      return "openclaw-store managed project";
    case "claude-code-default":
      return "default Claude Code workflow";
    case "openclaw-default":
      return "default OpenClaw workflow";
    default:
      return "unconfigured workflow";
  }
}
