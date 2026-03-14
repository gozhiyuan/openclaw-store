# Demo Project: Health & Symptom Tracker

Identifying food sensitivities requires consistent logging over time, which is tedious to maintain. You need reminders to log and analysis to spot patterns.

## Metadata

- Demo ID: health-symptom-tracker
- Starter ID: health-symptom-tracker
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: openclaw-store-manager
- Source Use Case: Health & Symptom Tracker
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/health-symptom-tracker.md
- Tags: automation, health, symptom, tracker

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

- Cron jobs for reminders
- Telegram topic for logging
- File storage (markdown log file)

## Bootstrap Prompt

```text
Start the Health & Symptom Tracker demo project from the openclaw-store starter `health-symptom-tracker`. Identifying food sensitivities requires consistent logging over time, which is tedious to maintain. You need reminders to log and analysis to spot patterns. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show health-symptom-tracker`.
2. Initialize it with `openclaw-store starter init health-symptom-tracker <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
