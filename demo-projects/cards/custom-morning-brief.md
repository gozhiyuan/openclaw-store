# Demo Project: Custom Morning Brief

You wake up and spend the first 30 minutes of your day catching up — scrolling news, checking your calendar, reviewing your to-do list, trying to figure out what matters today. What if all of that was already done and waiting for you as a text message?

## Metadata

- Demo ID: custom-morning-brief
- Starter ID: custom-morning-brief
- Category: content-research
- Recommended Mode: managed-team
- Entry Team: research-lab
- Packs: research-lab, content-factory
- Project Skills: openclaw-store-manager
- Installable OpenClaw Skills: x-research-v2
- Required APIs / Services: Telegram, Discord, or iMessage integration, Todoist / Apple Reminders / Asana integration (whichever you use for tasks)
- Required Capabilities / Tools: —
- Source Use Case: Custom Morning Brief
- Tags: research, content, custom, morning, brief

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run openclaw-store install, then open the `research-lab` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `research-lab` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run openclaw-store install.

## Installable OpenClaw Skills

- x-research-v2

## Required APIs / Services

- Telegram, Discord, or iMessage integration
- Todoist / Apple Reminders / Asana integration (whichever you use for tasks)

## Requirement Summary

- Telegram, Discord, or iMessage integration
- Todoist / Apple Reminders / Asana integration (whichever you use for tasks)
- x-research-v2 for social media trend research (optional)

## Bootstrap Prompt

```text
Start the Custom Morning Brief demo project from the openclaw-store starter `custom-morning-brief`. You wake up and spend the first 30 minutes of your day catching up — scrolling news, checking your calendar, reviewing your to-do list, trying to figure out what matters today. What if all of that was already done and waiting for you as a text message? Use `research-lab` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show custom-morning-brief`.
2. Initialize it with `openclaw-store starter init custom-morning-brief <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `openclaw-store install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `aluvia-brave-search` | `clawhub install aluvia-brave-search` | `BRAVE_API_KEY` | https://brave.com/search/api/ |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `social-intelligence` | `clawhub install social-intelligence` | Social media trend research for richer daily context |
| `rss-skill` | `clawhub install rss-skill` | RSS feed monitoring for news and blogs |
| `publora-telegram` | `clawhub install publora-telegram` | Delivers the morning brief via Telegram message |
