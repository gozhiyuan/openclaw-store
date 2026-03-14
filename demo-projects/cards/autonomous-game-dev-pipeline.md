# Demo Project: Autonomous Educational Game Development Pipeline

**The Origin Story:** A "LANero of the old school" dad wanted to create a safe, ad-free, and high-quality gaming portal for his daughters, Susana (3) and Julieta (coming soon). Existing sites were plagued with spam, aggressive ads, and deceptive buttons (dark patterns) that frustrated his toddler.

## Metadata

- Demo ID: autonomous-game-dev-pipeline
- Starter ID: autonomous-game-dev-pipeline
- Category: development
- Recommended Mode: managed-team
- Entry Team: dev-company
- Packs: dev-company
- Project Skills: openclaw-store-manager
- Source Use Case: Autonomous Educational Game Development Pipeline
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/autonomous-game-dev-pipeline.md
- Tags: development, autonomous, game, dev, pipeline

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run openclaw-store install, then open the `dev-company` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `dev-company` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which external skills, tools, or APIs are still missing before execution.
- Install or configure those missing skills and API keys in OpenClaw, then re-run openclaw-store install.

## External Requirements

- **Git**: To manage branches, commits, and merges.

## Bootstrap Prompt

```text
Start the Autonomous Educational Game Development Pipeline demo project from the openclaw-store starter `autonomous-game-dev-pipeline`. **The Origin Story:** A "LANero of the old school" dad wanted to create a safe, ad-free, and high-quality gaming portal for his daughters, Susana (3) and Julieta (coming soon). Existing sites were plagued with spam, aggressive ads, and deceptive buttons (dark patterns) that frustrated his toddler. Use `dev-company` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show autonomous-game-dev-pipeline`.
2. Initialize it with `openclaw-store starter init autonomous-game-dev-pipeline <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
