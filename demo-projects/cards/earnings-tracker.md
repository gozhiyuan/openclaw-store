# Demo Project: AI-Powered Earnings Tracker

Following earnings season across dozens of tech companies means checking multiple sources and remembering report dates. You want to stay on top of AI/tech earnings without manually tracking every company.

## Metadata

- Demo ID: earnings-tracker
- Starter ID: earnings-tracker
- Category: research
- Recommended Mode: managed-team
- Entry Team: research-lab
- Packs: research-lab
- Project Skills: openclaw-store-manager
- Source Use Case: AI-Powered Earnings Tracker
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/earnings-tracker.md
- Tags: research, earnings, tracker

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run openclaw-store install, then open the `research-lab` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `research-lab` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which external skills, tools, or APIs are still missing before execution.
- Install or configure those missing skills and API keys in OpenClaw, then re-run openclaw-store install.

## External Requirements

- web_search (built-in)
- Cron job support in OpenClaw
- Telegram topic for earnings updates

## Bootstrap Prompt

```text
Start the AI-Powered Earnings Tracker demo project from the openclaw-store starter `earnings-tracker`. Following earnings season across dozens of tech companies means checking multiple sources and remembering report dates. You want to stay on top of AI/tech earnings without manually tracking every company. Use `research-lab` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show earnings-tracker`.
2. Initialize it with `openclaw-store starter init earnings-tracker <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
