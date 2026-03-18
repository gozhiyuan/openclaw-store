import type { FastifyPluginAsync } from "fastify";
import type { GatewayClient } from "../services/gateway.js";

export function createUsageRoutes(gateway: GatewayClient): FastifyPluginAsync {
  return async (app) => {
    app.get("/api/usage", async () => gateway.getUsage());

    app.get("/api/usage/agents", async () => {
      const statuses = gateway.getAgentStatuses();
      return Object.fromEntries(statuses);
    });
  };
}
