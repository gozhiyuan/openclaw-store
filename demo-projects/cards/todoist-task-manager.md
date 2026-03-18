# Demo Project: Todoist Task Manager: Agent Task Visibility

Maximize transparency for long-running agentic workflows by syncing internal reasoning and progress logs directly to Todoist.

## Metadata

- Demo ID: todoist-task-manager
- Starter ID: todoist-task-manager
- Category: development
- Recommended Mode: managed-team
- Entry Team: dev-company
- Packs: dev-company
- Project Skills: malaclaw-cook
- Installable OpenClaw Skills: —
- Required APIs / Services: Todoist REST API Documentation
- Required Capabilities / Tools: —
- Source Use Case: Todoist Task Manager: Agent Task Visibility
- Tags: development, todoist, task, manager

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `dev-company` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `dev-company` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.

## Required APIs / Services

- Todoist REST API Documentation

## Requirement Summary

- You don't need a pre-built skill. Simply prompt your OpenClaw agent to create the bash scripts described in the **Setup Guide** below. Since OpenClaw can manage its own filesystem and execute shell commands, it will effectively "build" the skill for you upon request.

## Bootstrap Prompt

```text
Start the Todoist Task Manager: Agent Task Visibility demo project from the malaclaw starter `todoist-task-manager`. Maximize transparency for long-running agentic workflows by syncing internal reasoning and progress logs directly to Todoist. Use `dev-company` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show todoist-task-manager`.
2. Initialize it with `malaclaw starter init todoist-task-manager <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `brainz-tasks` | `clawhub install brainz-tasks` | `TODOIST_API_TOKEN` | https://todoist.com/prefs/integrations |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `google-calendar` | `clawhub install google-calendar` | Sync task deadlines and milestones with Google Calendar |
