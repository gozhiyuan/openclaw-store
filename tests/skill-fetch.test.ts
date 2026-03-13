import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { installSkillToWorkspaces } from "../src/lib/skill-fetch.js";
import { SkillEntry } from "../src/lib/schema.js";

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-skill-"));
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

const makeLocalSkill = (skillDir: string): SkillEntry =>
  SkillEntry.parse({
    id: "test-skill",
    version: 1,
    name: "Test Skill",
    source: { type: "local", url: skillDir },
    trust_tier: "local",
    disabled_until_configured: false,
  });

describe("installSkillToWorkspaces", () => {
  it("installs local skill into cache and exposes it in workspace skills directory", async () => {
    // Set up a fake skill source
    const skillSrc = path.join(tmpDir, "skill-src");
    await fs.mkdir(skillSrc);
    await fs.writeFile(path.join(skillSrc, "SKILL.md"), "# Test Skill\n");

    const workspaceDir = path.join(tmpDir, "workspace");
    await fs.mkdir(workspaceDir);

    const results = await installSkillToWorkspaces(makeLocalSkill(skillSrc), [workspaceDir], "active");
    expect(results).toHaveLength(1);
    expect(results[0].status).toBe("installed");

    const installedFile = path.join(workspaceDir, "skills", "test-skill", "SKILL.md");
    const content = await fs.readFile(installedFile, "utf-8");
    expect(content).toContain("Test Skill");
  });

  it("skips installation when skill is inactive", async () => {
    const workspaceDir = path.join(tmpDir, "workspace");
    const results = await installSkillToWorkspaces(makeLocalSkill("/nonexistent"), [workspaceDir], "inactive");
    expect(results[0].status).toBe("skipped");
  });

  it("returns failed when skill source not found", async () => {
    const workspaceDir = path.join(tmpDir, "workspace");
    await fs.mkdir(workspaceDir);
    const results = await installSkillToWorkspaces(makeLocalSkill("/does/not/exist"), [workspaceDir], "active");
    expect(results[0].status).toBe("failed");
  });
});
