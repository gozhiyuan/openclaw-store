import fs from "node:fs/promises";
import path from "node:path";
import { loadLockfile, loadManifest, writeManifest } from "../lib/loader.js";
import { resolveSharedMemoryDir } from "../lib/paths.js";
import { formatProjectLabel, projectMetaFromLockfile, resolveProjectMeta } from "../lib/project-meta.js";
import { loadRuntimeState } from "../lib/runtime.js";
import { describeWorkflowMode, detectWorkflowMode } from "../lib/workflow-mode.js";
import { listOpenClawAgents } from "../lib/openclaw-agents.js";

async function readFileOrEmpty(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}

export async function projectStatus(projectDir?: string): Promise<void> {
  const mode = await detectWorkflowMode(projectDir);
  let manifest = null;
  try {
    manifest = await loadManifest(projectDir);
  } catch {
    manifest = null;
  }

  const lockfile = await loadLockfile(projectDir);
  const project = lockfile
    ? projectMetaFromLockfile(lockfile, projectDir)
    : resolveProjectMeta(manifest?.project, projectDir);

  console.log("\nProject Status\n");
  console.log(`Workflow: ${describeWorkflowMode(mode)}`);
  console.log(`Project: ${formatProjectLabel(project)}`);
  console.log(`Dir:     ${project.projectDir}`);
  if (project.entryTeam) {
    console.log(`Entry:   ${project.entryTeam}`);
  }
  if (project.attachedAgents.length > 0) {
    console.log(`Attached native agents: ${project.attachedAgents.join(", ")}`);
  }

  if (!lockfile) {
    if (mode === "claude-code-default") {
      console.log("\nNo malaclaw lockfile found. This repo appears to use the default Claude Code workflow.");
      console.log("Run: malaclaw init if you want project, team, and skill management from malaclaw.");
      return;
    }
    if (mode === "openclaw-default") {
      console.log("\nNo malaclaw lockfile found. This environment appears to use the default OpenClaw workflow.");
      console.log("Run: malaclaw init if you want project, team, and skill management from malaclaw.");
      return;
    }
    console.log("\nNo lockfile found. Run: malaclaw install");
    return;
  }

  console.log(`\nPacks installed: ${lockfile.packs?.length ?? 0}`);
  console.log(`Skills: ${lockfile.skills?.length ?? 0}`);

  for (const pack of lockfile.packs ?? []) {
    console.log(`\nPack: ${pack.id} (v${pack.version})`);
    if (pack.team_id) {
      console.log(`  Team: ${pack.team_id}`);
    }
    console.log(`  Agents: ${pack.agents.length}`);
    for (const agent of pack.agents) {
      console.log(`    - ${agent.id}`);
    }
  }

  if ((lockfile.skills?.length ?? 0) > 0) {
    const active = lockfile.skills!.filter((s) => s.status === "active");
    const inactive = lockfile.skills!.filter((s) => s.status === "inactive");
    const failed = lockfile.skills!.filter((s) => s.status === "failed");
    if (active.length > 0) {
      console.log(`\nActive skills: ${active.map((s) => s.id).join(", ")}`);
    }
    if (inactive.length > 0) {
      console.log(`Inactive skills: ${inactive.map((s) => s.id).join(", ")}`);
    }
    if (failed.length > 0) {
      console.log(`Failed skills: ${failed.map((s) => s.id).join(", ")}`);
    }
  }
}

export async function projectKanban(teamId: string, projectDir?: string): Promise<void> {
  const lockfile = await loadLockfile(projectDir);
  const project = projectMetaFromLockfile(lockfile, projectDir);
  const kanbanPath = path.join(resolveSharedMemoryDir(project.id, teamId), "kanban.md");
  const content = await readFileOrEmpty(kanbanPath);

  if (!content) {
    console.log(`No kanban board found for project "${project.id}" team "${teamId}".`);
    console.log(`Expected: ${kanbanPath}`);
    return;
  }

  console.log(content);
}

export async function projectList(): Promise<void> {
  const runtime = await loadRuntimeState();
  if (runtime.projects.length === 0) {
    console.log("No installed projects found.");
    return;
  }

  console.log(`\nInstalled projects (${runtime.projects.length}):\n`);
  for (const project of runtime.projects) {
    const label = project.name && project.name !== project.id
      ? `${project.name} (${project.id})`
      : project.id;
    const entry = project.entry_points[0]?.openclaw_agent_id ?? "—";
    console.log(`  ${label}`);
    console.log(`    dir: ${project.project_dir}`);
    console.log(`    entry: ${entry}`);
  }
}

export async function projectShow(projectId: string): Promise<void> {
  const runtime = await loadRuntimeState();
  const project = runtime.projects.find((p) => p.id === projectId);
  if (!project) {
    console.error(`Project "${projectId}" not found in runtime registry.`);
    process.exit(1);
  }

  console.log(`\n${project.name ?? project.id} (${project.id})\n`);
  console.log(`Dir: ${project.project_dir}`);
  if (project.manifest_path) {
    console.log(`Manifest: ${project.manifest_path}`);
  }
  if (project.lockfile_path) {
    console.log(`Lockfile: ${project.lockfile_path}`);
  }
  if (project.starter) {
    console.log(`Starter: ${project.starter}`);
  }

  if (project.entry_points.length > 0) {
    console.log("\nEntry points:");
    for (const entry of project.entry_points) {
      console.log(`  ${entry.team_id} -> ${entry.openclaw_agent_id}`);
    }
  }

  if (project.attached_agents.length > 0) {
    console.log("\nAttached native agents:");
    for (const agent of project.attached_agents) {
      console.log(`  ${agent.id}${agent.name ? ` — ${agent.name}` : ""}`);
      if (agent.workspace) {
        console.log(`    workspace: ${agent.workspace}`);
      }
    }
  }

  if (project.packs.length > 0) {
    console.log(`\nInstalled packs: ${project.packs.join(", ")}`);
  }
  if (project.skills.length > 0) {
    console.log(`Skills: ${project.skills.join(", ")}`);
  }
}

export async function projectAttachAgent(agentId: string, projectDir?: string): Promise<void> {
  const manifest = await loadManifest(projectDir);
  const agents = await listOpenClawAgents();
  const agent = agents.find((entry) => entry.id === agentId);
  if (!agent) {
    console.error(`OpenClaw agent "${agentId}" not found.`);
    process.exit(1);
  }
  if (agent.source === "store-managed") {
    console.error(`Agent "${agentId}" is already store-managed. Attach only native OpenClaw agents.`);
    process.exit(1);
  }

  const existing = new Set(manifest.project?.attached_agents ?? []);
  existing.add(agentId);

  await writeManifest({
    ...manifest,
    project: {
      ...manifest.project,
      attached_agents: [...existing].sort(),
    },
  }, projectDir);

  console.log(`Attached native OpenClaw agent "${agentId}" to this project.`);
  console.log("Run: malaclaw install");
}

export async function projectDetachAgent(agentId: string, projectDir?: string): Promise<void> {
  const manifest = await loadManifest(projectDir);
  const existing = new Set(manifest.project?.attached_agents ?? []);
  if (!existing.has(agentId)) {
    console.log(`Agent "${agentId}" is not attached to this project.`);
    return;
  }
  existing.delete(agentId);
  await writeManifest({
    ...manifest,
    project: {
      ...manifest.project,
      attached_agents: [...existing].sort(),
    },
  }, projectDir);
  console.log(`Detached native OpenClaw agent "${agentId}" from this project.`);
  console.log("Run: malaclaw install");
}
