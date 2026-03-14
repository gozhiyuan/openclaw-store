# Demo Project: Polymarket Autopilot: Automated Paper Trading

Manually monitoring prediction markets for arbitrage opportunities and executing trades is time-consuming and requires constant attention. You want to test and refine trading strategies without risking real capital.

## Metadata

- Demo ID: polymarket-autopilot
- Starter ID: polymarket-autopilot
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: openclaw-store-manager
- Source Use Case: Polymarket Autopilot: Automated Paper Trading
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/polymarket-autopilot.md
- Tags: automation, polymarket, autopilot

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run openclaw-store install, then open the `autonomous-startup` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `autonomous-startup` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which external skills, tools, or APIs are still missing before execution.
- Install or configure those missing skills and API keys in OpenClaw, then re-run openclaw-store install.

## External Requirements

- web_search or web_fetch (for Polymarket API data)
- postgres or SQLite for trade logs and portfolio tracking
- Discord integration for daily reports
- Cron jobs for continuous monitoring
- Sub-agent spawning for parallel market analysis

## Bootstrap Prompt

```text
Start the Polymarket Autopilot: Automated Paper Trading demo project from the openclaw-store starter `polymarket-autopilot`. Manually monitoring prediction markets for arbitrage opportunities and executing trades is time-consuming and requires constant attention. You want to test and refine trading strategies without risking real capital. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show polymarket-autopilot`.
2. Initialize it with `openclaw-store starter init polymarket-autopilot <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
