# Demo Project: Goal-Driven Autonomous Tasks

Your AI agent is powerful but reactive — it only works when you tell it what to do. What if it knew your goals and proactively came up with tasks to move you closer to them every single day, without being asked?

## Metadata

- Demo ID: overnight-mini-app-builder
- Starter ID: overnight-mini-app-builder
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: malaclaw-manager
- Installable OpenClaw Skills: —
- Required APIs / Services: Telegram or Discord integration
- Required Capabilities / Tools: sessions_spawn / sessions_send for autonomous task execution
- Source Use Case: Goal-Driven Autonomous Tasks
- Tags: automation, overnight, mini, app, builder

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `autonomous-startup` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `autonomous-startup` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.

## Required APIs / Services

- Telegram or Discord integration

## Required Capabilities / Tools

- sessions_spawn / sessions_send for autonomous task execution

## Requirement Summary

- Telegram or Discord integration
- sessions_spawn / sessions_send for autonomous task execution
- Next.js or similar (for the Kanban board — OpenClaw builds it for you)

## Bootstrap Prompt

```text
Start the Goal-Driven Autonomous Tasks demo project from the malaclaw starter `overnight-mini-app-builder`. Your AI agent is powerful but reactive — it only works when you tell it what to do. What if it knew your goals and proactively came up with tasks to move you closer to them every single day, without being asked? Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show overnight-mini-app-builder`.
2. Initialize it with `malaclaw starter init overnight-mini-app-builder <dir>`.
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
| `agentic-devops` | `clawhub install agentic-devops` | Docker-based deployment for built apps and services |
