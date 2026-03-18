import type { AgentTelemetry, RuntimeTarget } from "../schema.js";
import type { AgentDef, TeamDef, TeamMember } from "../schema.js";

export interface InstallAction {
  type: "create_workspace" | "write_file" | "patch_config" | "update_guidance" | "create_agent_dir" | "export_template";
  path: string;
  description: string;
}

export interface InstallTeamParams {
  projectId: string;
  teamDef: TeamDef;
  agents: Array<{
    agentDef: AgentDef;
    member: TeamMember;
    workspaceDir: string;
    agentDir: string;
  }>;
  overwrite?: boolean;
  dryRun?: boolean;
}

export interface RuntimeProvisioner {
  readonly runtime: RuntimeTarget;
  installTeam(params: InstallTeamParams): Promise<void>;
  uninstallTeam(projectId: string, teamId: string, workspaceRoot: string, agentIds?: string[]): Promise<void>;
  planInstallTeam(params: InstallTeamParams): Promise<InstallAction[]>;
}

export interface RuntimeObserver {
  readonly runtime: RuntimeTarget;
  start(onEvent?: (event: { type: string; data: unknown }) => void): Promise<void>;
  stop(): Promise<void>;
  getAgentStatuses(): Promise<AgentTelemetry[]>;
}
