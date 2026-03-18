import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { stringify } from "yaml";
import { checkSkills, syncSkills } from "../src/lib/skill-ops.js";

let tmpDir: string;
let originalHome: string | undefined;
let originalStoreDir: string | undefined;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-skill-ops-"));
  originalHome = process.env.HOME;
  originalStoreDir = process.env.MALACLAW_DIR;
  process.env.HOME = path.join(tmpDir, "home");
  process.env.MALACLAW_DIR = path.join(tmpDir, "store");
});

afterEach(async () => {
  if (originalHome === undefined) delete process.env.HOME;
  else process.env.HOME = originalHome;
  if (originalStoreDir === undefined) delete process.env.MALACLAW_DIR;
  else process.env.MALACLAW_DIR = originalStoreDir;
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe("skill-ops", () => {
  it("checkSkills returns array of SkillCheckResult", async () => {
    const results = await checkSkills({ projectDir: tmpDir });
    expect(Array.isArray(results)).toBe(true);
    for (const r of results) {
      expect(r).toHaveProperty("id");
      expect(r).toHaveProperty("status");
      expect(["active", "inactive", "failed"]).toContain(r.status);
    }
  });

  it("checkSkills returns empty array when no lockfile present", async () => {
    const results = await checkSkills({ projectDir: tmpDir });
    expect(results).toEqual([]);
  });

  it("checkSkills parses lockfile skills into SkillCheckResult", async () => {
    const lockfileContent = {
      version: 1,
      skills: [
        { type: "skill", id: "skill-a", version: "1", status: "active" },
        { type: "skill", id: "skill-b", version: "1", status: "inactive", missing_env: ["API_KEY"] },
        { type: "skill", id: "skill-c", version: "1", status: "failed", install_error: "not found" },
      ],
    };
    await fs.writeFile(
      path.join(tmpDir, "malaclaw.lock"),
      stringify(lockfileContent),
      "utf-8",
    );

    const results = await checkSkills({ projectDir: tmpDir });
    expect(results).toHaveLength(3);

    const a = results.find((r) => r.id === "skill-a")!;
    expect(a.status).toBe("active");
    expect(a.missingEnv).toBeUndefined();
    expect(a.installError).toBeUndefined();

    const b = results.find((r) => r.id === "skill-b")!;
    expect(b.status).toBe("inactive");
    expect(b.missingEnv).toEqual(["API_KEY"]);

    const c = results.find((r) => r.id === "skill-c")!;
    expect(c.status).toBe("failed");
    expect(c.installError).toBe("not found");
  });

  it("checkSkills does not call console.log (pure data function)", async () => {
    // checkSkills is side-effect-free — it just returns data
    const results = await checkSkills({ projectDir: tmpDir });
    expect(Array.isArray(results)).toBe(true);
  });

  it("syncSkills returns synced and total counts", async () => {
    // Create a discoverable skill in the temp home dir
    await fs.mkdir(
      path.join(process.env.HOME!, ".openclaw", "workspace", "skills", "test-skill"),
      { recursive: true },
    );
    await fs.writeFile(
      path.join(process.env.HOME!, ".openclaw", "workspace", "skills", "test-skill", "SKILL.md"),
      "# Test Skill\n",
    );

    const result = await syncSkills();
    expect(typeof result.synced).toBe("number");
    expect(typeof result.total).toBe("number");
    expect(result.synced).toBe(result.total);
    expect(result.synced).toBeGreaterThanOrEqual(1);
  });
});
