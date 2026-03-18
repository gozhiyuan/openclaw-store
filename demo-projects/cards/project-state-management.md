# Demo Project: Project State Management System: Event-Driven Alternative to Kanban

Traditional Kanban boards are static and require manual updates. You forget to move cards, lose context between sessions, and can't track the "why" behind state changes. Projects drift without clear visibility.

## Metadata

- Demo ID: project-state-management
- Starter ID: project-state-management
- Category: development
- Recommended Mode: managed-team
- Entry Team: dev-company
- Packs: dev-company
- Project Skills: malaclaw-manager
- Installable OpenClaw Skills: github, postgres
- Required APIs / Services: Discord or Telegram for updates and queries
- Required Capabilities / Tools: github (gh CLI) for commit tracking, Cron jobs for daily summaries
- Source Use Case: Project State Management System: Event-Driven Alternative to Kanban
- Tags: development, project, state, management

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

- github
- postgres

## Required APIs / Services

- Discord or Telegram for updates and queries

## Required Capabilities / Tools

- github (gh CLI) for commit tracking
- Cron jobs for daily summaries

## Requirement Summary

- postgres or SQLite for project state database
- github (gh CLI) for commit tracking
- Discord or Telegram for updates and queries
- Cron jobs for daily summaries
- Sub-agents for parallel project analysis

## Bootstrap Prompt

```text
Start the Project State Management System: Event-Driven Alternative to Kanban demo project from the malaclaw starter `project-state-management`. Traditional Kanban boards are static and require manual updates. You forget to move cards, lose context between sessions, and can't track the "why" behind state changes. Projects drift without clear visibility. Use `dev-company` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show project-state-management`.
2. Initialize it with `malaclaw starter init project-state-management <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `github` | `clawhub install github` | `GITHUB_TOKEN` | https://github.com/settings/tokens |

### Optional (install anytime to enhance capability)

No optional skills for this demo.
