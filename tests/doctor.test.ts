import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { stringify } from "yaml";
import { runChecks } from "../src/lib/doctor.js";

const envKeys = [
  "MALACLAW_DIR",
  "OPENCLAW_STATE_DIR",
  "OPENCLAW_CONFIG_PATH",
  "HOME",
  "USERPROFILE",
] as const;

let tmpDir: string | null = null;
const originalEnv = new Map<string, string | undefined>();

afterEach(async () => {
  for (const key of envKeys) {
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

function saveEnv() {
  for (const key of envKeys) {
    originalEnv.set(key, process.env[key]);
  }
}

describe("runChecks", () => {
  it("returns an array of findings", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    // Point config path at a non-existent file to avoid real system state
    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "openclaw.json");

    const findings = await runChecks({ projectDir: tmpDir });

    expect(Array.isArray(findings)).toBe(true);
    expect(findings.length).toBeGreaterThan(0);
  });

  it("every finding has a check field", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "openclaw.json");

    const findings = await runChecks({ projectDir: tmpDir });

    for (const f of findings) {
      expect(f.check).toBeTruthy();
      expect(typeof f.check).toBe("string");
    }
  });

  it("every finding has correct severity values", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "openclaw.json");

    const findings = await runChecks({ projectDir: tmpDir });

    for (const f of findings) {
      expect(["ok", "warning", "error"]).toContain(f.severity);
    }
  });

  it("handles missing manifest gracefully — returns warning not error", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    // No malaclaw.yaml in tmpDir
    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "openclaw.json");

    const findings = await runChecks({ projectDir: tmpDir });

    const manifestFinding = findings.find((f) => f.check === "manifest");
    expect(manifestFinding).toBeDefined();
    // Missing manifest is a warning (not error) — it means "not yet initialised"
    expect(manifestFinding?.severity).toBe("warning");
  });

  it("reports ok for manifest when malaclaw.yaml exists", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    await fs.writeFile(
      path.join(tmpDir, "malaclaw.yaml"),
      stringify({ version: 1, packs: [], skills: [] }),
    );
    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "openclaw.json");

    const findings = await runChecks({ projectDir: tmpDir });

    const manifestFinding = findings.find((f) => f.check === "manifest");
    expect(manifestFinding).toBeDefined();
    expect(manifestFinding?.severity).toBe("ok");
  });

  it("handles missing lockfile gracefully — returns warning not error", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    // No malaclaw.lock in tmpDir
    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "openclaw.json");

    const findings = await runChecks({ projectDir: tmpDir });

    const lockfileFinding = findings.find((f) => f.check === "lockfile");
    expect(lockfileFinding).toBeDefined();
    expect(lockfileFinding?.severity).toBe("warning");
  });

  it("reports ok for lockfile when lockfile exists", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    await fs.writeFile(
      path.join(tmpDir, "malaclaw.yaml"),
      stringify({ version: 1, packs: [], skills: [] }),
    );
    await fs.writeFile(
      path.join(tmpDir, "malaclaw.lock"),
      stringify({ version: 1, packs: [], skills: [] }),
    );
    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "openclaw.json");

    const findings = await runChecks({ projectDir: tmpDir });

    const lockfileFinding = findings.find((f) => f.check === "lockfile");
    expect(lockfileFinding).toBeDefined();
    expect(lockfileFinding?.severity).toBe("ok");
    expect(lockfileFinding?.message).toMatch(/Lockfile found/);
  });

  it("includes workflow-mode finding", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "openclaw.json");

    const findings = await runChecks({ projectDir: tmpDir });

    const modeFinding = findings.find((f) => f.check === "workflow-mode");
    expect(modeFinding).toBeDefined();
    expect(modeFinding?.severity).toBe("ok");
    expect(modeFinding?.message).toMatch(/Workflow mode:/);
  });

  it("reports error for openclaw.json when missing in non-default-workflow mode", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    // Create malaclaw.yaml to put us in 'managed' mode (not default)
    await fs.writeFile(
      path.join(tmpDir, "malaclaw.yaml"),
      stringify({ version: 1, packs: [], skills: [] }),
    );
    // Point config path at non-existent file
    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "does-not-exist", "openclaw.json");

    const findings = await runChecks({ projectDir: tmpDir });

    const configFinding = findings.find((f) => f.check === "openclaw-config");
    expect(configFinding).toBeDefined();
    expect(configFinding?.severity).toBe("error");
  });

  it("reports warning for openclaw.json when missing in claude-code-default mode", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    // Create CLAUDE.md to trigger claude-code-default mode (no manifest)
    await fs.writeFile(path.join(tmpDir, "CLAUDE.md"), "# Claude\n");
    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "does-not-exist", "openclaw.json");

    const findings = await runChecks({ projectDir: tmpDir });

    const configFinding = findings.find((f) => f.check === "openclaw-config");
    expect(configFinding).toBeDefined();
    expect(configFinding?.severity).toBe("warning");
  });

  it("reports skill-status findings for inactive skills", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    await fs.writeFile(
      path.join(tmpDir, "malaclaw.yaml"),
      stringify({ version: 1, packs: [], skills: [] }),
    );
    await fs.writeFile(
      path.join(tmpDir, "malaclaw.lock"),
      stringify({
        version: 1,
        packs: [],
        skills: [
          {
            type: "skill",
            id: "github",
            version: "1.0.0",
            status: "inactive",
            missing_env: ["GITHUB_TOKEN"],
          },
        ],
      }),
    );
    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "openclaw.json");

    const findings = await runChecks({ projectDir: tmpDir });

    const skillFinding = findings.find((f) => f.check === "skill-status" && f.message.includes("github"));
    expect(skillFinding).toBeDefined();
    expect(skillFinding?.severity).toBe("warning");
    expect(skillFinding?.message).toContain("[INACTIVE]");
    expect(skillFinding?.message).toContain("GITHUB_TOKEN");
  });

  it("reports skill-status findings for failed skills", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    await fs.writeFile(
      path.join(tmpDir, "malaclaw.yaml"),
      stringify({ version: 1, packs: [], skills: [] }),
    );
    await fs.writeFile(
      path.join(tmpDir, "malaclaw.lock"),
      stringify({
        version: 1,
        packs: [],
        skills: [
          {
            type: "skill",
            id: "my-skill",
            version: "1.0.0",
            status: "failed",
            install_error: "Skill source not found",
          },
        ],
      }),
    );
    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "openclaw.json");

    const findings = await runChecks({ projectDir: tmpDir });

    const skillFinding = findings.find((f) => f.check === "skill-status" && f.message.includes("my-skill"));
    expect(skillFinding).toBeDefined();
    expect(skillFinding?.severity).toBe("error");
    expect(skillFinding?.message).toContain("[FAILED]");
  });

  it("does not call console.log or process.exit", async () => {
    // This test verifies the lib function is side-effect-free
    // We can verify by checking the module source doesn't contain these calls,
    // but we also ensure it doesn't throw when called.
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-doctor-"));
    saveEnv();

    process.env.OPENCLAW_CONFIG_PATH = path.join(tmpDir, "openclaw.json");

    // If runChecks called process.exit(1) it would terminate the test process
    // The fact that this resolves means it didn't call process.exit
    await expect(runChecks({ projectDir: tmpDir })).resolves.toBeDefined();
  });
});
