import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { detectWorkflowMode } from "../src/lib/workflow-mode.js";

let tmpDir: string | null = null;
const originalEnv = new Map<string, string | undefined>();

afterEach(async () => {
  for (const key of ["OPENCLAW_STATE_DIR", "HOME", "USERPROFILE"] as const) {
    const value = originalEnv.get(key);
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  originalEnv.clear();

  if (tmpDir) {
    await fs.rm(tmpDir, { recursive: true, force: true });
    tmpDir = null;
  }
});

describe("detectWorkflowMode", () => {
  it("detects managed mode when openclaw-store.yaml exists", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-mode-"));
    await fs.writeFile(path.join(tmpDir, "openclaw-store.yaml"), "version: 1\n");
    await expect(detectWorkflowMode(tmpDir)).resolves.toBe("managed");
  });

  it("detects Claude Code default mode when CLAUDE.md exists", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-mode-"));
    await fs.writeFile(path.join(tmpDir, "CLAUDE.md"), "# Claude\n");
    await expect(detectWorkflowMode(tmpDir)).resolves.toBe("claude-code-default");
  });

  it("detects OpenClaw default mode when openclaw.json exists but no manifest", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-mode-"));
    const stateDir = path.join(tmpDir, "state");
    for (const key of ["OPENCLAW_STATE_DIR", "HOME", "USERPROFILE"] as const) {
      originalEnv.set(key, process.env[key]);
    }
    process.env.OPENCLAW_STATE_DIR = stateDir;
    process.env.HOME = tmpDir;
    process.env.USERPROFILE = tmpDir;
    await fs.mkdir(stateDir, { recursive: true });
    await fs.writeFile(path.join(stateDir, "openclaw.json"), "{}\n");
    await expect(detectWorkflowMode(tmpDir)).resolves.toBe("openclaw-default");
  });
});
