import type { RuntimeObserver } from "../../../dist/lib/adapters/base.js";
import type { AgentTelemetry } from "../../../dist/lib/schema.js";
import { getObserver } from "../../../dist/lib/adapters/registry.js";
import { readAllAgentTelemetry } from "../../../dist/lib/telemetry.js";

export interface UsageSummary {
  input_tokens: number;
  output_tokens: number;
  total_cost: number;
}

export class RuntimeStatusProvider {
  private observers: Map<string, RuntimeObserver> = new Map();
  private usage: UsageSummary = { input_tokens: 0, output_tokens: 0, total_cost: 0 };

  async addRuntime(
    runtime: "openclaw" | "claude-code" | "codex" | "clawteam",
    onEvent?: (event: { type: string; data: unknown }) => void,
  ): Promise<void> {
    if (this.observers.has(runtime)) return;
    const observer = getObserver(runtime);
    this.observers.set(runtime, observer);
    await observer.start((event) => {
      if (event.type === "usage:update" && typeof event.data === "object" && event.data) {
        const d = event.data as Record<string, number>;
        this.usage = {
          input_tokens: d.input_tokens ?? this.usage.input_tokens,
          output_tokens: d.output_tokens ?? this.usage.output_tokens,
          total_cost: d.total_cost ?? this.usage.total_cost,
        };
      }
      onEvent?.(event);
    });
  }

  async stop(): Promise<void> {
    for (const observer of this.observers.values()) await observer.stop();
    this.observers.clear();
  }

  async getAgentStatuses(): Promise<AgentTelemetry[]> {
    return readAllAgentTelemetry();
  }

  getUsage(): UsageSummary {
    return { ...this.usage };
  }
}
