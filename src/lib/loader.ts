import fs from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import {
  AgentDef,
  TeamDef,
  SkillEntry,
  PackDef,
  StarterDef,
  DemoProjectIndex,
  type DemoProjectDef,
  Manifest,
  Lockfile,
} from "./schema.js";
import {
  resolveAgentTemplatesDir,
  resolveTeamTemplatesDir,
  resolveSkillTemplatesDir,
  resolvePacksDir,
  resolveStartersDir,
  resolveDemoProjectsIndexPath,
  resolveManifestPath,
  resolveLockfilePath,
  resolveOverlayTemplatesDir,
} from "./paths.js";

async function readYaml<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return parseYaml(raw) as T;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listYamlIds(dirs: string[]): Promise<string[]> {
  const ids = new Set<string>();

  for (const dir of dirs) {
    try {
      const entries = await fs.readdir(dir);
      for (const entry of entries) {
        if (entry.endsWith(".yaml")) {
          ids.add(entry.replace(/\.yaml$/, ""));
        }
      }
    } catch {
      // ignore missing overlay directories
    }
  }

  return [...ids].sort();
}

// ── Agent templates ──────────────────────────────────────────────────────────

export async function loadAgent(agentId: string): Promise<AgentDef> {
  const overlay = resolveOverlayTemplatesDir();
  if (overlay) {
    const overlayPath = path.join(overlay, "agents", `${agentId}.yaml`);
    if (await fileExists(overlayPath)) {
      const raw = await readYaml<unknown>(overlayPath);
      return AgentDef.parse(raw);
    }
  }
  const filePath = path.join(resolveAgentTemplatesDir(), `${agentId}.yaml`);
  const raw = await readYaml<unknown>(filePath);
  return AgentDef.parse(raw);
}

export async function listAgentIds(): Promise<string[]> {
  const overlay = resolveOverlayTemplatesDir();
  return listYamlIds([
    ...(overlay ? [path.join(overlay, "agents")] : []),
    resolveAgentTemplatesDir(),
  ]);
}

export async function loadAllAgents(): Promise<AgentDef[]> {
  const ids = await listAgentIds();
  return Promise.all(ids.map(loadAgent));
}

// ── Team templates ───────────────────────────────────────────────────────────

export async function loadTeam(teamId: string): Promise<TeamDef> {
  const overlay = resolveOverlayTemplatesDir();
  if (overlay) {
    const overlayPath = path.join(overlay, "teams", `${teamId}.yaml`);
    if (await fileExists(overlayPath)) {
      const raw = await readYaml<unknown>(overlayPath);
      return TeamDef.parse(raw);
    }
  }
  const filePath = path.join(resolveTeamTemplatesDir(), `${teamId}.yaml`);
  const raw = await readYaml<unknown>(filePath);
  return TeamDef.parse(raw);
}

export async function listTeamIds(): Promise<string[]> {
  const overlay = resolveOverlayTemplatesDir();
  return listYamlIds([
    ...(overlay ? [path.join(overlay, "teams")] : []),
    resolveTeamTemplatesDir(),
  ]);
}

export async function loadAllTeams(): Promise<TeamDef[]> {
  const ids = await listTeamIds();
  return Promise.all(ids.map(loadTeam));
}

// ── Skill templates ──────────────────────────────────────────────────────────

export async function loadSkill(skillId: string): Promise<SkillEntry> {
  const overlay = resolveOverlayTemplatesDir();
  if (overlay) {
    const overlayPath = path.join(overlay, "skills", `${skillId}.yaml`);
    if (await fileExists(overlayPath)) {
      const raw = await readYaml<unknown>(overlayPath);
      return SkillEntry.parse(raw);
    }
  }
  const filePath = path.join(resolveSkillTemplatesDir(), `${skillId}.yaml`);
  try {
    const raw = await readYaml<unknown>(filePath);
    return SkillEntry.parse(raw);
  } catch {
    const { loadSkillEntryFromDiscovery } = await import("./openclaw-skills.js");
    const discovered = await loadSkillEntryFromDiscovery(skillId);
    if (discovered) {
      return discovered;
    }
    throw new Error(`Skill "${skillId}" not found.`);
  }
}

export async function listSkillIds(): Promise<string[]> {
  const overlay = resolveOverlayTemplatesDir();
  return listYamlIds([
    ...(overlay ? [path.join(overlay, "skills")] : []),
    resolveSkillTemplatesDir(),
  ]);
}

export async function loadAllSkills(): Promise<SkillEntry[]> {
  const ids = await listSkillIds();
  return Promise.all(ids.map(loadSkill));
}

// ── Pack definitions ─────────────────────────────────────────────────────────

export async function loadPack(packId: string): Promise<PackDef> {
  const overlay = resolveOverlayTemplatesDir();
  if (overlay) {
    const overlayPath = path.join(overlay, "packs", `${packId}.yaml`);
    if (await fileExists(overlayPath)) {
      const raw = await readYaml<unknown>(overlayPath);
      return PackDef.parse(raw);
    }
  }
  const filePath = path.join(resolvePacksDir(), `${packId}.yaml`);
  const raw = await readYaml<unknown>(filePath);
  return PackDef.parse(raw);
}

export async function listPackIds(): Promise<string[]> {
  const overlay = resolveOverlayTemplatesDir();
  return listYamlIds([
    ...(overlay ? [path.join(overlay, "packs")] : []),
    resolvePacksDir(),
  ]);
}

export async function loadAllPacks(): Promise<PackDef[]> {
  const ids = await listPackIds();
  return Promise.all(ids.map(loadPack));
}

// ── Starter definitions ─────────────────────────────────────────────────────

export async function loadStarter(starterId: string): Promise<StarterDef> {
  const filePath = path.join(resolveStartersDir(), `${starterId}.yaml`);
  const raw = await readYaml<unknown>(filePath);
  return StarterDef.parse(raw);
}

export async function listStarterIds(): Promise<string[]> {
  return listYamlIds([resolveStartersDir()]);
}

export async function loadAllStarters(): Promise<StarterDef[]> {
  const ids = await listStarterIds();
  return Promise.all(ids.map(loadStarter));
}

export async function loadDemoProjectIndex(): Promise<DemoProjectIndex> {
  const raw = await readYaml<unknown>(resolveDemoProjectsIndexPath());
  return DemoProjectIndex.parse(raw);
}

export async function loadDemoProject(demoId: string): Promise<DemoProjectDef> {
  const index = await loadDemoProjectIndex();
  const demo = index.demos.find((entry) => entry.id === demoId);
  if (!demo) {
    throw new Error(`Demo project "${demoId}" not found.`);
  }
  return demo;
}

// ── Project manifest & lockfile ──────────────────────────────────────────────

export async function loadManifest(projectDir?: string): Promise<Manifest> {
  const filePath = resolveManifestPath(projectDir);
  if (!(await fileExists(filePath))) {
    throw new Error(
      `No openclaw-store.yaml found in ${projectDir ?? process.cwd()}.\nRun: openclaw-store init`,
    );
  }
  const raw = await readYaml<unknown>(filePath);
  return Manifest.parse(raw);
}

export async function loadLockfile(projectDir?: string): Promise<Lockfile | null> {
  const filePath = resolveLockfilePath(projectDir);
  if (!(await fileExists(filePath))) return null;
  const raw = await readYaml<unknown>(filePath);
  return Lockfile.parse(raw);
}

export async function writeLockfile(lockfile: Lockfile, projectDir?: string): Promise<void> {
  const { stringify } = await import("yaml");
  const filePath = resolveLockfilePath(projectDir);
  await fs.writeFile(filePath, stringify(lockfile), "utf-8");
}

export async function writeManifest(manifest: Manifest, projectDir?: string): Promise<void> {
  const { stringify } = await import("yaml");
  const filePath = resolveManifestPath(projectDir);
  await fs.writeFile(filePath, stringify(manifest), "utf-8");
}
