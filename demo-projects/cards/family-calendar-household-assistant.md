# Demo Project: Family Calendar Aggregation & Household Assistant

Modern families juggle five or more calendars — work, personal, shared family, kids' school, extracurriculars — across different platforms and formats. Important events slip through the cracks because no single view exists. Meanwhile, household coordination (grocery lists, pantry inventory, appointment scheduling) happens through scattered text messages that get buried.

## Metadata

- Demo ID: family-calendar-household-assistant
- Starter ID: family-calendar-household-assistant
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: openclaw-store-manager
- Source Use Case: Family Calendar Aggregation & Household Assistant
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/family-calendar-household-assistant.md
- Tags: automation, family, calendar, household, assistant

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

- Calendar API access (Google Calendar, Apple Calendar via ical)
- imessage skill for message monitoring (macOS only)
- Telegram or Slack for the shared family chat interface
- File system access for inventory tracking
- Camera/photo processing for OCR of physical calendars

## Bootstrap Prompt

```text
Start the Family Calendar Aggregation & Household Assistant demo project from the openclaw-store starter `family-calendar-household-assistant`. Modern families juggle five or more calendars — work, personal, shared family, kids' school, extracurriculars — across different platforms and formats. Important events slip through the cracks because no single view exists. Meanwhile, household coordination (grocery lists, pantry inventory, appointment scheduling) happens through scattered text messages that get buried. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show family-calendar-household-assistant`.
2. Initialize it with `openclaw-store starter init family-calendar-household-assistant <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
