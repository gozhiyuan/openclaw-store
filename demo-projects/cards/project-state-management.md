# Demo Project: Project State Management System: Event-Driven Alternative to Kanban

Traditional Kanban boards are static and require manual updates. You forget to move cards, lose context between sessions, and can't track the "why" behind state changes. Projects drift without clear visibility.

## Metadata

- Demo ID: project-state-management
- Starter ID: project-state-management
- Category: development
- Recommended Mode: managed-team
- Entry Team: dev-company
- Packs: dev-company
- Project Skills: openclaw-store-manager
- Source Use Case: Project State Management System: Event-Driven Alternative to Kanban
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/project-state-management.md
- Tags: development, project, state, management

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

- postgres or SQLite for project state database
- github (gh CLI) for commit tracking
- Discord or Telegram for updates and queries
- Cron jobs for daily summaries
- Sub-agents for parallel project analysis

## Bootstrap Prompt

```text
Start the Project State Management System: Event-Driven Alternative to Kanban demo project from the openclaw-store starter `project-state-management`. Traditional Kanban boards are static and require manual updates. You forget to move cards, lose context between sessions, and can't track the "why" behind state changes. Projects drift without clear visibility. Use `dev-company` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show project-state-management`.
2. Initialize it with `openclaw-store starter init project-state-management <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
