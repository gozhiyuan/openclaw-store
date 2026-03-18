import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";

export function createAuthHook(token: string | undefined) {
  if (!token) return null;
  return function authHook(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    // Skip auth for WS upgrade and static files
    if (request.url === "/ws" || !request.url.startsWith("/api/")) {
      return done();
    }
    // Skip ping endpoint
    if (request.url === "/api/ping") {
      return done();
    }
    const header = request.headers.authorization;
    if (header === `Bearer ${token}`) {
      return done();
    }
    reply.status(401).send({ error: "Unauthorized", code: "AUTH_REQUIRED", details: {} });
  };
}
