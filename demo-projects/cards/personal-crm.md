# Demo Project: Personal CRM with Automatic Contact Discovery

Keeping track of who you've met, when, and what you discussed is impossible to do manually. Important follow-ups slip through the cracks, and you forget context before important meetings.

## Metadata

- Demo ID: personal-crm
- Starter ID: personal-crm
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: openclaw-store-manager
- Source Use Case: Personal CRM with Automatic Contact Discovery
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/personal-crm.md
- Tags: automation, personal, crm

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

- gog CLI (for Gmail and Google Calendar)
- Custom CRM database (SQLite or similar) or use the crm-query skill if available
- Telegram topic for CRM queries

## Bootstrap Prompt

```text
Start the Personal CRM with Automatic Contact Discovery demo project from the openclaw-store starter `personal-crm`. Keeping track of who you've met, when, and what you discussed is impossible to do manually. Important follow-ups slip through the cracks, and you forget context before important meetings. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show personal-crm`.
2. Initialize it with `openclaw-store starter init personal-crm <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
