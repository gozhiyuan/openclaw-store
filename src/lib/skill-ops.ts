import { loadLockfile } from "./loader.js";
import { syncSkillsInventory } from "./openclaw-skills.js";

export type SkillCheckResult = {
  id: string;
  status: "active" | "inactive" | "failed";
  missingEnv?: string[];
  installError?: string;
};

export async function checkSkills(opts?: { projectDir?: string }): Promise<SkillCheckResult[]> {
  const lockfile = await loadLockfile(opts?.projectDir);
  if (!lockfile || !lockfile.skills || lockfile.skills.length === 0) {
    return [];
  }

  return lockfile.skills.map((s) => {
    const result: SkillCheckResult = {
      id: s.id,
      status: s.status,
    };
    if (s.missing_env && s.missing_env.length > 0) {
      result.missingEnv = s.missing_env;
    }
    if (s.install_error) {
      result.installError = s.install_error;
    }
    return result;
  });
}

export async function syncSkills(): Promise<{ synced: number; total: number }> {
  const skills = await syncSkillsInventory();
  return { synced: skills.length, total: skills.length };
}
