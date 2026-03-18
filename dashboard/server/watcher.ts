import { watch, type FSWatcher } from "chokidar";
import { broadcast } from "./ws.js";
import {
  resolveStoreRuntimeFile,
  resolveStoreSkillsIndexFile,
  resolveStoreWorkspacesRoot,
  resolveAgentTelemetryDir,
} from "../../dist/lib/paths.js";
import { loadRuntimeState } from "../../dist/lib/runtime.js";
import path from "node:path";

let watcher: FSWatcher | null = null;
const debounceTimers = new Map<string, NodeJS.Timeout>();

function debounced(key: string, fn: () => void, ms = 500): void {
  const existing = debounceTimers.get(key);
  if (existing) clearTimeout(existing);
  debounceTimers.set(key, setTimeout(() => {
    debounceTimers.delete(key);
    fn();
  }, ms));
}

export async function startWatcher(): Promise<FSWatcher> {
  const runtimeFile = resolveStoreRuntimeFile();
  const skillsIndexFile = resolveStoreSkillsIndexFile();
  const workspacesRoot = resolveStoreWorkspacesRoot();

  // Collect known project dirs
  let projectDirs: string[] = [];
  try {
    const state = await loadRuntimeState();
    projectDirs = state.projects.map((p) => p.project_dir).filter(Boolean);
  } catch {
    // No runtime state yet — that's fine
  }

  const watchPaths = [
    runtimeFile,
    skillsIndexFile,
    path.join(workspacesRoot, "**/shared/memory/*.md"),
    path.join(resolveAgentTelemetryDir(), "**", "state.json"),
    ...projectDirs.flatMap((dir) => [
      path.join(dir, "malaclaw.yaml"),
      path.join(dir, "malaclaw.lock"),
    ]),
  ];

  watcher = watch(watchPaths, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 300 },
  });

  watcher.on("change", (filePath) => {
    if (filePath === runtimeFile) {
      debounced("projects", () => {
        broadcast({ type: "projects:changed" });
        // Re-initialize watcher to pick up new project dirs
        stopWatcher().then(() => startWatcher());
      });
    } else if (filePath === skillsIndexFile) {
      debounced("skills", () => broadcast({ type: "skills:changed" }));
    } else if (filePath.endsWith("malaclaw.yaml")) {
      debounced("manifest:" + filePath, () =>
        broadcast({ type: "manifest:changed", projectDir: path.dirname(filePath) })
      );
    } else if (filePath.endsWith("malaclaw.lock")) {
      debounced("lockfile:" + filePath, () =>
        broadcast({ type: "lockfile:changed", projectDir: path.dirname(filePath) })
      );
    } else if (filePath.includes("/agents/") && filePath.endsWith("/state.json")) {
      const agentId = path.basename(path.dirname(filePath));
      debounced(`agent:${agentId}`, () =>
        broadcast({ type: "agent:status-changed", agentId })
      );
    } else if (filePath.includes("/shared/memory/")) {
      const parts = filePath.split(path.sep);
      const memIdx = parts.indexOf("memory");
      const sharedIdx = parts.indexOf("shared");
      if (sharedIdx >= 2) {
        const teamId = parts[sharedIdx - 1];
        const projectId = parts[sharedIdx - 2];
        debounced(`memory:${projectId}:${teamId}`, () =>
          broadcast({
            type: "memory:changed",
            projectId,
            teamId,
            file: parts[memIdx + 1],
          })
        );
      }
    }
  });

  return watcher;
}

export async function stopWatcher(): Promise<void> {
  if (watcher) {
    await watcher.close();
    watcher = null;
  }
  for (const timer of debounceTimers.values()) clearTimeout(timer);
  debounceTimers.clear();
}
