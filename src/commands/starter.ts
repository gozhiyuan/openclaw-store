import fs from "node:fs/promises";
import path from "node:path";
import { stringify } from "yaml";
import { loadAllStarters, loadDemoProject, loadDemoProjectIndex, loadStarter, writeManifest } from "../lib/loader.js";
import { defaultProjectId, defaultProjectName } from "../lib/project-meta.js";
import type { StarterDef } from "../lib/schema.js";

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function tokenize(input: string): string[] {
  return input.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function starterScore(starter: StarterDef, query: string): number {
  const q = tokenize(query);
  if (q.length === 0) return 0;
  const hay = [
    starter.id,
    starter.name,
    starter.description,
    starter.entry_team,
    ...starter.tags,
    ...starter.packs,
    ...starter.external_requirements,
  ].join(" ").toLowerCase();

  let score = 0;
  for (const token of q) {
    if (starter.id.includes(token)) score += 4;
    if (starter.name.toLowerCase().includes(token)) score += 3;
    if (hay.includes(token)) score += 1;
  }
  return score;
}

function buildStarterManifest(starter: StarterDef, targetDir: string) {
  const projectId = defaultProjectId(targetDir);
  const projectName = defaultProjectName(targetDir);
  const skills = starter.project_skills.map((id) => ({
    id,
    targets: id === "openclaw-store-manager"
      ? { teams: [starter.entry_team] }
      : undefined,
  }));

  return {
    version: 1 as const,
    project: {
      id: projectId,
      name: projectName,
      starter: starter.id,
      entry_team: starter.entry_team,
      description: starter.description,
    },
    packs: starter.packs.map((id) => ({ id })),
    skills,
  };
}

function buildStarterReadme(starter: StarterDef, targetDir: string): string {
  const projectName = defaultProjectName(targetDir);
  const lines = [
    `# Starter: ${starter.name}`,
    "",
    `This project was initialized from the \`${starter.id}\` starter in openclaw-store.`,
    "",
    `## Project`,
    "",
    `- Name: ${projectName}`,
    `- Starter: ${starter.id}`,
    `- Entry Team: ${starter.entry_team}`,
    `- Packs: ${starter.packs.join(", ") || "—"}`,
    `- Project Skills: ${starter.project_skills.join(", ") || "—"}`,
    "",
    `## Source Use Case`,
    "",
    `- Title: ${starter.source_usecase}`,
  ];

  if (starter.source_path) {
    lines.push(`- Path: ${starter.source_path}`);
  }

  lines.push("", "## Description", "", starter.description);

  if (starter.external_requirements.length > 0) {
    lines.push("", "## External Requirements", "");
    for (const req of starter.external_requirements) {
      lines.push(`- ${req}`);
    }
  }

  if (starter.bootstrap_prompt) {
    lines.push("", "## Bootstrap Prompt", "", "```text", starter.bootstrap_prompt, "```");
  }

  lines.push(
    "",
    "## Next Steps",
    "",
    "1. Review `openclaw-store.yaml`.",
    "2. Run `openclaw-store install --dry-run`.",
    "3. Run `openclaw-store install`.",
    "4. Open the project entry-point agent in OpenClaw.",
    "",
  );

  return lines.join("\n");
}

export async function starterList(search?: string): Promise<void> {
  const starters = await loadAllStarters();
  const demoIndex = await loadDemoProjectIndex();
  const demoMap = new Map(demoIndex.demos.map((demo) => [demo.starter, demo]));
  const filtered = search
    ? starters
      .map((starter) => ({ starter, score: starterScore(starter, search) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.starter.id.localeCompare(b.starter.id))
      .map((x) => x.starter)
    : starters.sort((a, b) => a.id.localeCompare(b.id));

  if (filtered.length === 0) {
    console.log(search ? `No starters matched "${search}".` : "No starters found.");
    return;
  }

  console.log(`\nStarters (${filtered.length}):\n`);
  for (const starter of filtered) {
    const demo = demoMap.get(starter.id);
    console.log(`  ${starter.name} (${starter.id})`);
    console.log(`    entry: ${starter.entry_team}  packs: ${starter.packs.join(", ")}`);
    if (demo) {
      console.log(`    category: ${demo.category}  recommended: ${demo.recommended_mode}`);
    }
    console.log(`    ${starter.description}`);
  }
}

export async function starterShow(starterId: string): Promise<void> {
  let starter: StarterDef;
  try {
    starter = await loadStarter(starterId);
  } catch {
    console.error(`Starter "${starterId}" not found.`);
    process.exit(1);
  }
  const demo = await loadDemoProject(starterId).catch(() => null);

  console.log(`\n${starter.name} (${starter.id})\n`);
  console.log(`Description: ${starter.description}`);
  console.log(`Source:      ${starter.source_usecase}`);
  if (starter.source_path) {
    console.log(`Source path: ${starter.source_path}`);
  }
  console.log(`Entry team:  ${starter.entry_team}`);
  console.log(`Packs:       ${starter.packs.join(", ") || "—"}`);
  console.log(`Proj skills: ${starter.project_skills.join(", ") || "—"}`);
  if (demo) {
    console.log(`Category:    ${demo.category}`);
    console.log(`Recommended: ${demo.recommended_mode}`);
    console.log(`Card path:   ${demo.card_path}`);
  }
  if (starter.tags.length > 0) {
    console.log(`Tags:        ${starter.tags.join(", ")}`);
  }

  if (demo) {
    console.log("\nExecution modes:");
    console.log(`  - Default workflow: ${demo.execution.default_workflow}`);
    console.log(`  - Managed workflow: ${demo.execution.managed_workflow}`);
  }

  if (demo?.setup_guidance.length) {
    console.log("\nSetup guidance:");
    for (const step of demo.setup_guidance) {
      console.log(`  - ${step}`);
    }
  }

  if (starter.external_requirements.length > 0) {
    console.log("\nExternal requirements:");
    for (const req of starter.external_requirements) {
      console.log(`  - ${req}`);
    }
  }

  if (starter.bootstrap_prompt) {
    console.log("\nBootstrap prompt:\n");
    console.log(starter.bootstrap_prompt);
  }
}

export async function starterSuggest(query: string): Promise<void> {
  const starters = await loadAllStarters();
  const ranked = starters
    .map((starter) => ({ starter, score: starterScore(starter, query) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.starter.id.localeCompare(b.starter.id))
    .slice(0, 5);

  if (ranked.length === 0) {
    console.log(`No close starter matches for "${query}".`);
    return;
  }

  console.log(`\nSuggested starters for "${query}":\n`);
  for (const { starter } of ranked) {
    console.log(`  ${starter.name} (${starter.id})`);
    console.log(`    entry: ${starter.entry_team}  packs: ${starter.packs.join(", ")}`);
    console.log(`    ${starter.description}`);
  }
}

export async function starterInit(
  starterId: string,
  targetDir: string,
  opts: { force?: boolean } = {},
): Promise<void> {
  let starter: StarterDef;
  try {
    starter = await loadStarter(starterId);
  } catch {
    console.error(`Starter "${starterId}" not found.`);
    process.exit(1);
  }

  const absTarget = path.resolve(targetDir);
  const manifestPath = path.join(absTarget, "openclaw-store.yaml");
  const starterReadmePath = path.join(absTarget, "STARTER.md");
  const demoProjectPath = path.join(absTarget, "DEMO_PROJECT.md");

  if (
    !opts.force
    && ((await pathExists(manifestPath))
      || (await pathExists(starterReadmePath))
      || (await pathExists(demoProjectPath)))
  ) {
    console.error(`Target directory already contains starter files. Re-run with --force to overwrite.`);
    process.exit(1);
  }

  await fs.mkdir(absTarget, { recursive: true });

  const manifest = buildStarterManifest(starter, absTarget);
  await writeManifest(manifest, absTarget);
  await fs.writeFile(starterReadmePath, buildStarterReadme(starter, absTarget), "utf-8");
  const demo = await loadDemoProject(starter.id).catch(() => null);
  if (demo) {
    await fs.copyFile(demo.card_path, demoProjectPath);
  }

  console.log(`Initialized starter ${starter.id} in ${absTarget}`);
  console.log(`Project id: ${manifest.project.id}`);
  console.log(`Entry team: ${starter.entry_team}`);
  console.log(`Run: openclaw-store install --dry-run`);
}

export async function starterExportIndex(targetPath: string): Promise<void> {
  const starters = await loadAllStarters();
  const absPath = path.resolve(targetPath);
  await fs.mkdir(path.dirname(absPath), { recursive: true });
  await fs.writeFile(absPath, stringify(starters), "utf-8");
  console.log(`Wrote starter index: ${absPath}`);
}
