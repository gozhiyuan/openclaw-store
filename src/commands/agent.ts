import { loadAgent, loadAllAgents, loadAllTeams } from "../lib/loader.js";
import { loadLockfile } from "../lib/loader.js";
import { findAgentTeams } from "../lib/team-graph.js";
import { listOpenClawAgents } from "../lib/openclaw-agents.js";

export async function agentList(): Promise<void> {
  // Show installed agents from lockfile if it exists
  const lockfile = await loadLockfile();
  if (lockfile && lockfile.packs && lockfile.packs.length > 0) {
    console.log("\nInstalled agents:\n");
    for (const pack of lockfile.packs) {
      console.log(`Pack: ${pack.id} (v${pack.version})`);
      for (const agent of pack.agents) {
        console.log(`  ${agent.id}`);
        console.log(`    workspace: ${agent.workspace}`);
      }
    }
    const nativeAgents = (await listOpenClawAgents()).filter((agent) => agent.source === "openclaw-native");
    if (nativeAgents.length > 0) {
      console.log(`\nAvailable native OpenClaw agents (${nativeAgents.length}):\n`);
      for (const agent of nativeAgents) {
        console.log(`  ${agent.id}${agent.name ? ` — ${agent.name}` : ""}`);
        if (agent.workspace) {
          console.log(`    workspace: ${agent.workspace}`);
        }
      }
    }
    return;
  }

  // Fall back to available templates
  const agents = await loadAllAgents();
  console.log(`\nAvailable agent templates (${agents.length}):\n`);
  for (const a of agents) {
    const emoji = a.identity?.emoji ?? "🤖";
    console.log(`  ${emoji} ${a.name} (${a.id})  [${a.team_role?.role ?? "—"}]`);
  }

  const nativeAgents = (await listOpenClawAgents()).filter((agent) => agent.source === "openclaw-native");
  if (nativeAgents.length > 0) {
    console.log(`\nAvailable native OpenClaw agents (${nativeAgents.length}):\n`);
    for (const agent of nativeAgents) {
      console.log(`  ${agent.id}${agent.name ? ` — ${agent.name}` : ""}`);
      if (agent.workspace) {
        console.log(`    workspace: ${agent.workspace}`);
      }
    }
  }
}

export async function agentShow(agentId: string): Promise<void> {
  let agentDef;
  try {
    agentDef = await loadAgent(agentId);
  } catch {
    const openclawAgent = (await listOpenClawAgents()).find((agent) => agent.id === agentId);
    if (!openclawAgent) {
      console.error(`Agent "${agentId}" not found in templates or OpenClaw config.`);
      process.exit(1);
    }
    console.log(`\n${openclawAgent.name ?? openclawAgent.id} (${openclawAgent.id})\n`);
    console.log(`Source:    ${openclawAgent.source}`);
    if (openclawAgent.workspace) {
      console.log(`Workspace: ${openclawAgent.workspace}`);
    }
    if (openclawAgent.agentDir) {
      console.log(`Agent dir: ${openclawAgent.agentDir}`);
    }
    if (openclawAgent.skills !== undefined) {
      console.log(`Skills:    ${openclawAgent.skills.length > 0 ? openclawAgent.skills.join(", ") : "(explicitly none)"}`);
    } else {
      console.log("Skills:    unrestricted (no explicit allowlist)");
    }
    if (openclawAgent.projectId) {
      console.log(`Project:   ${openclawAgent.projectId}`);
    }
    if (openclawAgent.teamId) {
      console.log(`Team:      ${openclawAgent.teamId}`);
    }
    return;
  }

  const allTeams = await loadAllTeams();
  const teams = findAgentTeams(agentId, allTeams);

  const emoji = agentDef.identity?.emoji ?? "🤖";
  console.log(`\n${emoji} ${agentDef.name} (${agentId})\n`);
  console.log(`Vibe:     ${agentDef.identity?.vibe ?? "—"}`);
  console.log(`Role:     ${agentDef.team_role?.role ?? "—"}`);
  console.log(`Model:    ${agentDef.model.primary}`);
  if (agentDef.model.fallback) {
    console.log(`Fallback: ${agentDef.model.fallback}`);
  }

  console.log(`\nCapabilities:`);
  const cap = agentDef.capabilities;
  console.log(`  sessions_spawn: ${cap.coordination.sessions_spawn}`);
  console.log(`  sessions_send:  ${cap.coordination.sessions_send}`);
  console.log(`  write/edit:     ${cap.file_access.write}/${cap.file_access.edit}`);
  console.log(`  exec:           ${cap.system.exec}`);
  console.log(`  cron:           ${cap.system.cron}`);

  if (agentDef.skills && agentDef.skills.length > 0) {
    console.log(`\nSkills: ${agentDef.skills.join(", ")}`);
  }

  if (teams.length > 0) {
    console.log(`\nTeams:`);
    for (const { team, role } of teams) {
      console.log(`  ${team.name ?? team.id} (${team.id}) — ${role}`);
    }
  }

  if (agentDef.team_role?.delegates_to && agentDef.team_role.delegates_to.length > 0) {
    console.log(`\nDelegates to: ${agentDef.team_role.delegates_to.join(", ")}`);
  }
}

export async function agentRefresh(agentId: string): Promise<void> {
  // Re-render and overwrite workspace files for an installed agent
  const lockfile = await loadLockfile();
  if (!lockfile) {
    console.error("No lockfile found. Run: openclaw-store install");
    process.exit(1);
  }

  let foundPack: string | null = null;
  for (const pack of lockfile.packs ?? []) {
    if (pack.agents.some((a) => a.id.endsWith(`__${agentId}`))) {
      foundPack = pack.id;
      break;
    }
  }

  if (!foundPack) {
    console.error(`Agent "${agentId}" not found in lockfile.`);
    process.exit(1);
  }

  console.log(`Refreshing ${agentId} from pack ${foundPack}...`);
  // Re-run the current project's install with force=true.
  const { runInstall } = await import("./install.js");
  await runInstall({ force: true });
  console.log(`✓ ${agentId} refreshed.`);
}
