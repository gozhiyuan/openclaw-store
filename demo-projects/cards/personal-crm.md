# Demo Project: Personal CRM with Automatic Contact Discovery

Keeping track of who you've met, when, and what you discussed is impossible to do manually. Important follow-ups slip through the cracks, and you forget context before important meetings.

## Metadata

- Demo ID: personal-crm
- Starter ID: personal-crm
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: malaclaw-cook
- Installable OpenClaw Skills: crm-query, gog
- Required APIs / Services: Telegram topic for CRM queries
- Required Capabilities / Tools: —
- Source Use Case: Personal CRM with Automatic Contact Discovery
- Tags: automation, personal, crm

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

- crm-query
- gog

## Required APIs / Services

- Telegram topic for CRM queries

## Requirement Summary

- gog CLI (for Gmail and Google Calendar)
- Custom CRM database (SQLite or similar) or use the crm-query skill if available
- Telegram topic for CRM queries

## Bootstrap Prompt

```text
Start the Personal CRM with Automatic Contact Discovery demo project from the malaclaw starter `personal-crm`. Keeping track of who you've met, when, and what you discussed is impossible to do manually. Important follow-ups slip through the cracks, and you forget context before important meetings. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show personal-crm`.
2. Initialize it with `malaclaw starter init personal-crm <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `clawemail` | `clawhub install clawemail` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | https://console.cloud.google.com/ |
| `apple-contacts` | `clawhub install apple-contacts` | `none (macOS)` | — |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `danube` | `clawhub install danube` | Multi-service data connectors for richer contact discovery |
