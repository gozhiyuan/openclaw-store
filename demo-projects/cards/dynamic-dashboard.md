# Demo Project: Dynamic Dashboard with Sub-agent Spawning

Static dashboards show stale data and require constant manual updates. You want real-time visibility across multiple data sources without building a custom frontend or hitting API rate limits.

## Metadata

- Demo ID: dynamic-dashboard
- Starter ID: dynamic-dashboard
- Category: development
- Recommended Mode: managed-team
- Entry Team: dev-company
- Packs: dev-company
- Project Skills: malaclaw-cook
- Installable OpenClaw Skills: bird, github, postgres
- Required APIs / Services: web_search or web_fetch for external APIs, Discord or Canvas for rendering the dashboard
- Required Capabilities / Tools: github (gh CLI) for GitHub metrics, Cron jobs for scheduled updates
- Source Use Case: Dynamic Dashboard with Sub-agent Spawning
- Tags: development, dynamic, dashboard

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `dev-company` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `dev-company` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.

## Installable OpenClaw Skills

- bird
- github
- postgres

## Required APIs / Services

- web_search or web_fetch for external APIs
- Discord or Canvas for rendering the dashboard

## Required Capabilities / Tools

- github (gh CLI) for GitHub metrics
- Cron jobs for scheduled updates

## Requirement Summary

- Sub-agent spawning for parallel execution
- github (gh CLI) for GitHub metrics
- bird (Twitter) for social data
- web_search or web_fetch for external APIs
- postgres for storing historical metrics
- Discord or Canvas for rendering the dashboard
- Cron jobs for scheduled updates

## Bootstrap Prompt

```text
Start the Dynamic Dashboard with Sub-agent Spawning demo project from the malaclaw starter `dynamic-dashboard`. Static dashboards show stale data and require constant manual updates. You want real-time visibility across multiple data sources without building a custom frontend or hitting API rate limits. Use `dev-company` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show dynamic-dashboard`.
2. Initialize it with `malaclaw starter init dynamic-dashboard <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `duckdb-en` | `clawhub install duckdb-en` | `none (local CLI)` | — |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `nocodb` | `clawhub install nocodb` | NocoDB backend for storing and visualizing dashboard data |
| `github` | `clawhub install github` | GitHub metrics integration for developer dashboards |
