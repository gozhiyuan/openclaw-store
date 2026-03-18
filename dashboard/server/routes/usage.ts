import type { FastifyPluginAsync } from "fastify";
import type { RuntimeStatusProvider } from "../services/runtime-status.js";

export function createUsageRoutes(statusProvider: RuntimeStatusProvider): FastifyPluginAsync {
  return async (app) => {
    app.get("/api/usage", async () => statusProvider.getUsage());
    app.get("/api/usage/agents", async () => {
      const statuses = await statusProvider.getAgentStatuses();
      const map: Record<string, unknown> = {};
      for (const s of statuses) map[s.agentId] = s;
      return map;
    });
  };
}
