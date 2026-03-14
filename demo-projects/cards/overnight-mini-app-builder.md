# Demo Project: Goal-Driven Autonomous Tasks

Your AI agent is powerful but reactive — it only works when you tell it what to do. What if it knew your goals and proactively came up with tasks to move you closer to them every single day, without being asked?

## Metadata

- Demo ID: overnight-mini-app-builder
- Starter ID: overnight-mini-app-builder
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: openclaw-store-manager
- Source Use Case: Goal-Driven Autonomous Tasks
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/overnight-mini-app-builder.md
- Tags: automation, overnight, mini, app, builder

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

- Telegram or Discord integration
- sessions_spawn / sessions_send for autonomous task execution
- Next.js or similar (for the Kanban board — OpenClaw builds it for you)

## Bootstrap Prompt

```text
Start the Goal-Driven Autonomous Tasks demo project from the openclaw-store starter `overnight-mini-app-builder`. Your AI agent is powerful but reactive — it only works when you tell it what to do. What if it knew your goals and proactively came up with tasks to move you closer to them every single day, without being asked? Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show overnight-mini-app-builder`.
2. Initialize it with `openclaw-store starter init overnight-mini-app-builder <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
