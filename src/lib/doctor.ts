import fs from "node:fs/promises";
import path from "node:path";
import { loadLockfile } from "./loader.js";
import { readOpenClawConfig } from "./adapters/openclaw.js";
import { resolveOpenClawConfigPath, resolveManifestPath } from "./paths.js";
import type { PackDef } from "./schema.js";
import { describeWorkflowMode, detectWorkflowMode } from "./workflow-mode.js";

export type Finding = {
  check: string;
  severity: "ok" | "warning" | "error";
  message: string;
  fix?: string;
};

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function deriveTeamId(pack: { id: string; team_id?: string; agents: Array<{ workspace: string }> }): string {
  if (pack.team_id) return pack.team_id;
  const firstAgentWorkspace = pack.agents[0]?.workspace;
  if (firstAgentWorkspace) {
    return path.basename(path.dirname(firstAgentWorkspace));
  }
  return pack.id.includes("__") ? pack.id.split("__").slice(1).join("__") : pack.id;
}

function deriveSourcePackId(
  pack: { id: string; source_id?: string; team_id?: string; agents: Array<{ workspace: string }> },
): string {
  if (pack.source_id) return pack.source_id;
  const teamId = deriveTeamId(pack);
  const suffix = `__${teamId}`;
  if (pack.id.endsWith(suffix)) {
    return pack.id.slice(0, -suffix.length);
  }
  return pack.id.includes("__") ? pack.id.split("__")[0] : pack.id;
}

export async function runChecks(opts?: { projectDir?: string }): Promise<Finding[]> {
  const projectDir = opts?.projectDir;
  const findings: Finding[] = [];
  const workflowMode = await detectWorkflowMode(projectDir);

  findings.push({
    check: "workflow-mode",
    severity: "ok",
    message: `Workflow mode: ${describeWorkflowMode(workflowMode)}`,
  });

  // Check 1: manifest exists
  const manifestPath = resolveManifestPath(projectDir);
  if (await pathExists(manifestPath)) {
    findings.push({ check: "manifest", severity: "ok", message: "openclaw-store.yaml found" });
  } else {
    if (workflowMode === "claude-code-default" || workflowMode === "openclaw-default") {
      findings.push({
        check: "manifest",
        severity: "warning",
        message: "openclaw-store.yaml not found — using default workflow instead of openclaw-store project management",
        fix: "Run: openclaw-store init if you want managed projects, teams, and skills",
      });
    } else {
      findings.push({
        check: "manifest",
        severity: "warning",
        message: "openclaw-store.yaml not found in current directory",
        fix: "Run: openclaw-store init",
      });
    }
  }

  // Check 2: openclaw.json accessible
  const configPath = resolveOpenClawConfigPath();
  if (await pathExists(configPath)) {
    findings.push({ check: "openclaw-config", severity: "ok", message: `openclaw.json found at ${configPath}` });
  } else {
    if (workflowMode === "claude-code-default") {
      findings.push({
        check: "openclaw-config",
        severity: "warning",
        message: "openclaw.json not found — acceptable for default Claude Code workflow",
        fix: "Install OpenClaw first, then run `openclaw-store install`",
      });
    } else {
      findings.push({
        check: "openclaw-config",
        severity: "error",
        message: `openclaw.json not found at ${configPath}`,
        fix: "Ensure OpenClaw is installed and ~/.openclaw/openclaw.json exists",
      });
    }
  }

  // Check 3: lockfile
  const lockfile = await loadLockfile(projectDir);
  if (!lockfile) {
    if (workflowMode === "claude-code-default" || workflowMode === "openclaw-default") {
      findings.push({
        check: "lockfile",
        severity: "warning",
        message: "No openclaw-store lockfile found — repo is currently using the default workflow",
        fix: "Run: openclaw-store init and openclaw-store install if you want store-managed projects",
      });
    } else {
      findings.push({
        check: "lockfile",
        severity: "warning",
        message: "No lockfile found — nothing installed yet",
        fix: "Run: openclaw-store install",
      });
    }
  } else {
    findings.push({
      check: "lockfile",
      severity: "ok",
      message: `Lockfile found: ${lockfile.packs?.length ?? 0} pack(s), ${lockfile.skills?.length ?? 0} skill(s)`,
    });
  }

  // Check 4: agent workspaces exist for installed agents
  if (lockfile) {
    for (const pack of lockfile.packs ?? []) {
      for (const agent of pack.agents) {
        if (await pathExists(agent.workspace)) {
          findings.push({ check: "workspace", severity: "ok", message: `Workspace OK: ${agent.id}` });
        } else {
          findings.push({
            check: "workspace",
            severity: "error",
            message: `Workspace missing: ${agent.id} → ${agent.workspace}`,
            fix: "Run: openclaw-store install --force",
          });
        }
      }
    }
  }

  // Check 5: agent entries in openclaw.json
  if (lockfile && (await pathExists(configPath))) {
    try {
      const { config } = await readOpenClawConfig();
      const agentList = Array.isArray(config.agents?.list) ? config.agents!.list! : [];
      const registeredIds = new Set(agentList.map((a) => String(a.id)));

      for (const pack of lockfile.packs ?? []) {
        for (const agent of pack.agents) {
          if (registeredIds.has(agent.id)) {
            findings.push({
              check: "agent-registration",
              severity: "ok",
              message: `openclaw.json: ${agent.id} registered`,
            });
          } else {
            findings.push({
              check: "agent-registration",
              severity: "error",
              message: `openclaw.json missing agent: ${agent.id}`,
              fix: "Run: openclaw-store install --force",
            });
          }
        }
      }
    } catch (err) {
      findings.push({
        check: "agent-registration",
        severity: "error",
        message: `Failed to read openclaw.json: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  // Check 6: inactive skills
  if (lockfile) {
    for (const skill of lockfile.skills ?? []) {
      if (skill.status === "inactive") {
        findings.push({
          check: "skill-status",
          severity: "warning",
          message: `[INACTIVE] ${skill.id} — missing env: ${skill.missing_env?.join(", ")}`,
          fix: `Set the required environment variable(s), then re-run: openclaw-store install`,
        });
      } else if (skill.status === "failed") {
        findings.push({
          check: "skill-status",
          severity: "error",
          message: `[FAILED] ${skill.id} — ${skill.install_error ?? "install failed"}`,
          fix: "Ensure the skill source is available, then re-run: openclaw-store install --force",
        });
      } else {
        findings.push({ check: "skill-status", severity: "ok", message: `Skill active: ${skill.id}` });
      }
    }
  }

  // Check 7: pack compatibility
  if (lockfile) {
    const { checkPackCompatibility } = await import("./compat.js");
    const { loadPack } = await import("./loader.js");
    const installedPackIds = [...new Set((lockfile.packs ?? []).map((p) => deriveSourcePackId(p)))];
    const packDefs = await Promise.all(installedPackIds.map((id) =>
      loadPack(id).catch(() => null)
    ));
    const validPacks = packDefs.filter((p): p is PackDef => p !== null);
    const compatResult = await checkPackCompatibility(validPacks);
    for (const e of compatResult.errors) {
      findings.push({ check: "pack-compat", severity: "error", message: e });
    }
    for (const w of compatResult.warnings) {
      findings.push({ check: "pack-compat", severity: "warning", message: w });
    }
    if (compatResult.ok && validPacks.length > 0) {
      findings.push({ check: "pack-compat", severity: "ok", message: "Pack compatibility OK" });
    }
  }

  return findings;
}
