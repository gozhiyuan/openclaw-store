import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { HealthChecks } from "../components/HealthChecks";
import { SkillTable } from "../components/SkillTable";
import type { Finding, Skill } from "../lib/types";

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary name="Test">
        <div data-testid="child">Hello</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId("child")).toBeDefined();
    expect(screen.getByTestId("child").textContent).toBe("Hello");
  });

  it("renders fallback on error", () => {
    function Bomb(): JSX.Element {
      throw new Error("boom");
    }
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary name="BombPanel">
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText("boom")).toBeDefined();
    spy.mockRestore();
  });
});

describe("HealthChecks", () => {
  it("renders findings", () => {
    const findings: Finding[] = [
      { check: "manifest", severity: "ok", message: "Manifest found" },
      { check: "lockfile", severity: "warning", message: "Lockfile outdated" },
    ];
    const { container } = render(<HealthChecks findings={findings} />);
    expect(container.textContent).toContain("Manifest found");
    expect(container.textContent).toContain("Lockfile outdated");
  });

  it("renders empty state", () => {
    render(<HealthChecks findings={[]} />);
    expect(screen.getByText("No health data yet.")).toBeDefined();
  });
});

describe("SkillTable", () => {
  it("renders skills", () => {
    const skills: Skill[] = [
      { id: "github", name: "GitHub", trust_tier: "official" },
      { id: "last30days", name: "Last 30 Days", trust_tier: "community" },
    ];
    render(<SkillTable skills={skills} />);
    expect(screen.getByText("GitHub")).toBeDefined();
    expect(screen.getByText("Last 30 Days")).toBeDefined();
  });

  it("renders empty state", () => {
    render(<SkillTable skills={[]} />);
    expect(screen.getByText("No skills registered.")).toBeDefined();
  });
});
