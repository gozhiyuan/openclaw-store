import { describe, expect, it } from "vitest";
import { listAgentsFromConfig } from "../src/lib/openclaw-agents.js";

describe("listAgentsFromConfig", () => {
  it("classifies store-managed and native OpenClaw agents", () => {
    const agents = listAgentsFromConfig({
      agents: {
        list: [
          {
            id: "store__project__dev-company__pm",
            name: "PM",
            workspace: "/tmp/store-pm",
          },
          {
            id: "ops",
            name: "Ops",
            workspace: "/tmp/ops",
            skills: ["github"],
          },
        ],
      },
    });

    expect(agents).toHaveLength(2);
    expect(agents[0]).toMatchObject({
      id: "ops",
      source: "openclaw-native",
      skills: ["github"],
    });
    expect(agents[1]).toMatchObject({
      id: "store__project__dev-company__pm",
      source: "store-managed",
      projectId: "project",
      teamId: "dev-company",
    });
  });
});
