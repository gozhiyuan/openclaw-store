import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createServer } from "../index.js";
import type { FastifyInstance } from "fastify";

describe("API routes", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createServer({ port: 0 }); // random port
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /api/ping returns ok", async () => {
    const res = await app.inject({ method: "GET", url: "/api/ping" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });

  it("GET /api/projects returns array", async () => {
    const res = await app.inject({ method: "GET", url: "/api/projects" });
    expect(res.statusCode).toBe(200);
    // Projects come from runtime state - may be empty array
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  it("GET /api/teams returns array", async () => {
    const res = await app.inject({ method: "GET", url: "/api/teams" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json())).toBe(true);
  });

  it("GET /api/agents returns array", async () => {
    const res = await app.inject({ method: "GET", url: "/api/agents" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json())).toBe(true);
  });

  it("GET /api/skills returns array", async () => {
    const res = await app.inject({ method: "GET", url: "/api/skills" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json())).toBe(true);
  });

  it("GET /api/health returns array of findings", async () => {
    const res = await app.inject({ method: "GET", url: "/api/health" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json())).toBe(true);
  });

  it("GET /api/starters returns array", async () => {
    const res = await app.inject({ method: "GET", url: "/api/starters" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json())).toBe(true);
  });

  it("GET /api/projects/nonexistent returns 404", async () => {
    const res = await app.inject({ method: "GET", url: "/api/projects/nonexistent" });
    expect(res.statusCode).toBe(404);
  });

  it("GET /api/usage returns usage summary", async () => {
    const res = await app.inject({ method: "GET", url: "/api/usage" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty("input_tokens");
    expect(body).toHaveProperty("output_tokens");
    expect(body).toHaveProperty("total_cost");
  });

  it("GET /api/usage/agents returns object", async () => {
    const res = await app.inject({ method: "GET", url: "/api/usage/agents" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(typeof body).toBe("object");
  });

  it("PUT /api/projects/test/kanban/dev-company without content returns 400", async () => {
    const res = await app.inject({
      method: "PUT",
      url: "/api/projects/test/kanban/dev-company",
      payload: {},
    });
    expect(res.statusCode).toBe(400);
  });

  it("GET /api/projects/test/blockers/dev-company returns content field", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/projects/test/blockers/dev-company",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty("content");
  });
});
