# Demo Project: Autonomous Educational Game Development Pipeline

**The Origin Story:** A "LANero of the old school" dad wanted to create a safe, ad-free, and high-quality gaming portal for his daughters, Susana (3) and Julieta (coming soon). Existing sites were plagued with spam, aggressive ads, and deceptive buttons (dark patterns) that frustrated his toddler.

## Metadata

- Demo ID: autonomous-game-dev-pipeline
- Starter ID: autonomous-game-dev-pipeline
- Category: development
- Recommended Mode: managed-team
- Entry Team: dev-company
- Packs: dev-company
- Project Skills: malaclaw-cook
- Installable OpenClaw Skills: —
- Required APIs / Services: —
- Required Capabilities / Tools: **Git**: To manage branches, commits, and merges.
- Source Use Case: Autonomous Educational Game Development Pipeline
- Tags: development, autonomous, game, dev, pipeline

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `dev-company` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `dev-company` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.

## Required Capabilities / Tools

- **Git**: To manage branches, commits, and merges.

## Requirement Summary

- **Git**: To manage branches, commits, and merges.

## Bootstrap Prompt

```text
Start the Autonomous Educational Game Development Pipeline demo project from the malaclaw starter `autonomous-game-dev-pipeline`. **The Origin Story:** A "LANero of the old school" dad wanted to create a safe, ad-free, and high-quality gaming portal for his daughters, Susana (3) and Julieta (coming soon). Existing sites were plagued with spam, aggressive ads, and deceptive buttons (dark patterns) that frustrated his toddler. Use `dev-company` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show autonomous-game-dev-pipeline`.
2. Initialize it with `malaclaw starter init autonomous-game-dev-pipeline <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `github` | `clawhub install github` | `GITHUB_TOKEN` | https://github.com/settings/tokens |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `agentic-devops` | `clawhub install agentic-devops` | Docker-based DevOps automation for CI/CD and deployment tasks |
