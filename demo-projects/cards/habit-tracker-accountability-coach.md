# Demo Project: Habit Tracker & Accountability Coach

You've tried every habit tracker app out there. They all work for a week, then you stop opening them. The problem isn't the app — it's that tracking habits is passive. What if your agent actively reached out to you, asked how your day went, and adapted its approach based on whether you're on a streak or falling off?

## Metadata

- Demo ID: habit-tracker-accountability-coach
- Starter ID: habit-tracker-accountability-coach
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: openclaw-store-manager
- Source Use Case: Habit Tracker & Accountability Coach
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/habit-tracker-accountability-coach.md
- Tags: automation, habit, tracker, accountability, coach

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

- Telegram or SMS integration (Twilio for SMS, or Telegram Bot API)
- Scheduling / cron for timed check-ins
- File system or database access for storing habit data
- Optional: Google Sheets integration for a visual habit dashboard

## Bootstrap Prompt

```text
Start the Habit Tracker & Accountability Coach demo project from the openclaw-store starter `habit-tracker-accountability-coach`. You've tried every habit tracker app out there. They all work for a week, then you stop opening them. The problem isn't the app — it's that tracking habits is passive. What if your agent actively reached out to you, asked how your day went, and adapted its approach based on whether you're on a streak or falling off? Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show habit-tracker-accountability-coach`.
2. Initialize it with `openclaw-store starter init habit-tracker-accountability-coach <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
