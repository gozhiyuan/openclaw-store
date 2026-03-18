# Demo Project: Multi-Channel Personal Assistant

Context-switching between apps to manage tasks, schedule events, send messages, and track work is exhausting. You want one interface that routes to all your tools.

## Metadata

- Demo ID: multi-channel-assistant
- Starter ID: multi-channel-assistant
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: malaclaw-cook
- Installable OpenClaw Skills: gog, or
- Required APIs / Services: Slack integration (bot + user tokens), Todoist API or skill, Asana API or skill, Telegram channel with multiple topics configured, config — bot settings and debugging
- Required Capabilities / Tools: —
- Source Use Case: Multi-Channel Personal Assistant
- Tags: automation, multi, channel, assistant

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `autonomous-startup` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `autonomous-startup` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.

## Installable OpenClaw Skills

- gog
- or

## Required APIs / Services

- Slack integration (bot + user tokens)
- Todoist API or skill
- Asana API or skill
- Telegram channel with multiple topics configured
- config — bot settings and debugging

## Requirement Summary

- gog CLI (Google Workspace)
- Slack integration (bot + user tokens)
- Todoist API or skill
- Asana API or skill
- Telegram channel with multiple topics configured

## Bootstrap Prompt

```text
Start the Multi-Channel Personal Assistant demo project from the malaclaw starter `multi-channel-assistant`. Context-switching between apps to manage tasks, schedule events, send messages, and track work is exhausting. You want one interface that routes to all your tools. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show multi-channel-assistant`.
2. Initialize it with `malaclaw starter init multi-channel-assistant <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `clawemail` | `clawhub install clawemail` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | https://console.cloud.google.com/ |
| `connect-apps` | `clawhub install connect-apps` | `none (configure per-service)` | — |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `publora-telegram` | `clawhub install publora-telegram` | Telegram channel as the primary unified control interface |
| `microsoft365` | `clawhub install microsoft365` | Microsoft 365 / Outlook integration for tasks and calendar |
