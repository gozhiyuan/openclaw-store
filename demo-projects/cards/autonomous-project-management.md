# Demo Project: Autonomous Project Management with Subagents

Managing complex projects with multiple parallel workstreams is exhausting. You end up context-switching constantly, tracking status across tools, and manually coordinating handoffs.

## Metadata

- Demo ID: autonomous-project-management
- Starter ID: autonomous-project-management
- Category: development
- Recommended Mode: managed-team
- Entry Team: dev-company
- Packs: dev-company
- Project Skills: openclaw-store-manager
- Source Use Case: Autonomous Project Management with Subagents
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/autonomous-project-management.md
- Tags: development, autonomous, project, management

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

- sessions_spawn / sessions_send for subagent management
- File system access for STATE.yaml
- Git for state versioning (optional but recommended)

## Bootstrap Prompt

```text
Start the Autonomous Project Management with Subagents demo project from the openclaw-store starter `autonomous-project-management`. Managing complex projects with multiple parallel workstreams is exhausting. You end up context-switching constantly, tracking status across tools, and manually coordinating handoffs. Use `dev-company` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show autonomous-project-management`.
2. Initialize it with `openclaw-store starter init autonomous-project-management <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
