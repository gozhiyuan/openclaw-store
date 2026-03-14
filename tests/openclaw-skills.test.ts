import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { discoverSkills, loadSkillEntryFromDiscovery, syncSkillsInventory } from "../src/lib/openclaw-skills.js";

let tmpDir: string;
let originalHome: string | undefined;
let originalStoreDir: string | undefined;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ocs-native-skills-"));
  originalHome = process.env.HOME;
  originalStoreDir = process.env.OPENCLAW_STORE_DIR;
  process.env.HOME = path.join(tmpDir, "home");
  process.env.OPENCLAW_STORE_DIR = path.join(tmpDir, "store");
  await fs.mkdir(path.join(process.env.HOME!, ".openclaw", "workspace", "skills", "native-skill"), { recursive: true });
  await fs.writeFile(path.join(process.env.HOME!, ".openclaw", "workspace", "skills", "native-skill", "SKILL.md"), "# Native Skill\n");
});

afterEach(async () => {
  if (originalHome === undefined) delete process.env.HOME;
  else process.env.HOME = originalHome;
  if (originalStoreDir === undefined) delete process.env.OPENCLAW_STORE_DIR;
  else process.env.OPENCLAW_STORE_DIR = originalStoreDir;
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe("OpenClaw skill discovery", () => {
  it("discovers native skills and writes inventory", async () => {
    const skills = await syncSkillsInventory();
    expect(skills.some((skill) => skill.id === "native-skill")).toBe(true);

    const inventoryPath = path.join(process.env.OPENCLAW_STORE_DIR!, "skills-index.json");
    const raw = JSON.parse(await fs.readFile(inventoryPath, "utf-8"));
    expect(raw.skills.some((skill: { id: string }) => skill.id === "native-skill")).toBe(true);
  });

  it("creates a synthetic skill entry for discovered native skills", async () => {
    const discovered = await discoverSkills();
    expect(discovered.find((skill) => skill.id === "native-skill")?.source).toBe("openclaw-workspace");

    const entry = await loadSkillEntryFromDiscovery("native-skill");
    expect(entry?.id).toBe("native-skill");
    expect(entry?.source.type).toBe("openclaw-bundled");
  });
});
