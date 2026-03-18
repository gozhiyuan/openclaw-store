import { describe, it, expect } from "vitest";
import type { RuntimeProvisioner, RuntimeObserver } from "../src/lib/adapters/base.js";

describe("RuntimeProvisioner interface", () => {
  it("can be implemented with required methods", () => {
    const provisioner: RuntimeProvisioner = {
      runtime: "openclaw",
      async installTeam() { return; },
      async uninstallTeam() { return; },
      async planInstallTeam() { return []; },
    };
    expect(provisioner.runtime).toBe("openclaw");
  });
});

describe("RuntimeObserver interface", () => {
  it("can be implemented with required methods", () => {
    const observer: RuntimeObserver = {
      runtime: "openclaw",
      async start() { return; },
      async stop() { return; },
      async getAgentStatuses() { return []; },
    };
    expect(observer.runtime).toBe("openclaw");
  });
});
