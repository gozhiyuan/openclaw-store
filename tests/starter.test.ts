import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { loadAllStarters, loadDemoProjectIndex, loadManifest } from "../src/lib/loader.js";
import { starterInit } from "../src/commands/starter.js";

let tmpDir: string | null = null;

afterEach(async () => {
  if (tmpDir) {
    await fs.rm(tmpDir, { recursive: true, force: true });
    tmpDir = null;
  }
});

describe("starters", () => {
  it("loads generated starter definitions", async () => {
    const starters = await loadAllStarters();
    expect(starters.length).toBeGreaterThanOrEqual(37);
    expect(starters.some((starter) => starter.id === "content-factory")).toBe(true);
    expect(starters.some((starter) => starter.id === "default-managed")).toBe(true);
  });

  it("loads the demo project catalog", async () => {
    const index = await loadDemoProjectIndex();
    expect(index.demos.length).toBeGreaterThanOrEqual(37);
    expect(index.demos.some((demo) => demo.id === "default-managed")).toBe(true);
    expect(index.demos.every((demo) => !path.isAbsolute(demo.card_path))).toBe(true);
  });

  it("initializes a project from a starter", async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-starter-"));
    const targetDir = path.join(tmpDir, "demo-project");

    await starterInit("content-factory", targetDir);

    const manifest = await loadManifest(targetDir);
    expect(manifest.project?.starter).toBe("content-factory");
    expect(manifest.project?.entry_team).toBe("content-factory");
    expect(manifest.skills.some((skill) => skill.id === "openclaw-store-manager")).toBe(true);
    expect(
      manifest.skills.find((skill) => skill.id === "openclaw-store-manager")?.targets?.teams,
    ).toContain("content-factory");

    await expect(fs.access(path.join(targetDir, "STARTER.md"))).resolves.not.toThrow();
    await expect(fs.access(path.join(targetDir, "DEMO_PROJECT.md"))).resolves.not.toThrow();
  });
});
