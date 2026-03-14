import fs from "node:fs/promises";
import path from "node:path";
import { resolveStoreRoot, resolveStoreSkillsIndexFile } from "./paths.js";
import { SkillEntry, SkillInventory, type DiscoveredSkill } from "./schema.js";

type SkillSource = DiscoveredSkill["source"];

async function listSkillDirs(root: string, source: SkillSource): Promise<DiscoveredSkill[]> {
  try {
    const entries = await fs.readdir(root, { withFileTypes: true });
    const skills: DiscoveredSkill[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const rawId = entry.name;
      const [id, version] = source === "store-cache"
        ? rawId.split("@")
        : [rawId, undefined];
      if (!id) continue;
      skills.push({
        id,
        source,
        path: path.join(root, entry.name),
        version,
        managed_by_store: source === "store-cache",
      });
    }
    return skills;
  } catch {
    return [];
  }
}

function sourcePriority(source: SkillSource): number {
  switch (source) {
    case "template":
      return 4;
    case "openclaw-workspace":
      return 3;
    case "openclaw-global":
      return 2;
    case "store-cache":
      return 1;
  }
}

function dedupeSkills(skills: DiscoveredSkill[]): DiscoveredSkill[] {
  const byId = new Map<string, DiscoveredSkill>();
  for (const skill of skills) {
    const existing = byId.get(skill.id);
    if (!existing || sourcePriority(skill.source) > sourcePriority(existing.source)) {
      byId.set(skill.id, skill);
    }
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export async function discoverSkills(): Promise<DiscoveredSkill[]> {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  const discovered = await Promise.all([
    listSkillDirs(path.join(home, ".openclaw", "workspace", "skills"), "openclaw-workspace"),
    listSkillDirs(path.join(home, ".openclaw", "skills"), "openclaw-global"),
    listSkillDirs(path.join(resolveStoreRoot(), "cache", "skills"), "store-cache"),
  ]);

  const merged = dedupeSkills([
    ...discovered.flat(),
  ]);

  for (const skill of merged) {
    if (!skill.name) {
      skill.name = skill.id;
    }
  }

  return merged;
}

export async function writeSkillInventory(skills: DiscoveredSkill[]): Promise<void> {
  const filePath = resolveStoreSkillsIndexFile();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const payload = SkillInventory.parse({
    version: 1,
    updated_at: new Date().toISOString(),
    skills,
  });
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

export async function syncSkillsInventory(): Promise<DiscoveredSkill[]> {
  const skills = await discoverSkills();
  await writeSkillInventory(skills);
  return skills;
}

export async function loadDiscoveredSkill(skillId: string): Promise<DiscoveredSkill | null> {
  const skills = await discoverSkills();
  return skills.find((skill) => skill.id === skillId) ?? null;
}

export async function loadSkillEntryFromDiscovery(skillId: string): Promise<SkillEntry | null> {
  const discovered = await loadDiscoveredSkill(skillId);
  if (!discovered || discovered.source === "template") {
    return null;
  }
  return SkillEntry.parse({
    id: discovered.id,
    version: discovered.version ? Number.parseInt(discovered.version, 10) || 1 : 1,
    name: discovered.name ?? discovered.id,
    description: "Discovered native OpenClaw skill",
    source: {
      type: discovered.source === "store-cache" ? "clawhub" : "openclaw-bundled",
    },
    trust_tier: discovered.source === "store-cache" ? "community" : "local",
    disabled_until_configured: false,
    install_hints: [
      "Install or configure this skill in OpenClaw, then re-run openclaw-store install.",
    ],
  });
}
