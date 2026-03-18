# Demo Project: AI-Powered Earnings Tracker

Following earnings season across dozens of tech companies means checking multiple sources and remembering report dates. You want to stay on top of AI/tech earnings without manually tracking every company.

## Metadata

- Demo ID: earnings-tracker
- Starter ID: earnings-tracker
- Category: research
- Recommended Mode: managed-team
- Entry Team: research-lab
- Packs: research-lab
- Project Skills: malaclaw-manager
- Installable OpenClaw Skills: —
- Required APIs / Services: Telegram topic for earnings updates
- Required Capabilities / Tools: Cron job support in OpenClaw
- Source Use Case: AI-Powered Earnings Tracker
- Tags: research, earnings, tracker

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `research-lab` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `research-lab` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.

## Required APIs / Services

- Telegram topic for earnings updates

## Required Capabilities / Tools

- Cron job support in OpenClaw

## Requirement Summary

- web_search (built-in)
- Cron job support in OpenClaw
- Telegram topic for earnings updates

## Bootstrap Prompt

```text
Start the AI-Powered Earnings Tracker demo project from the malaclaw starter `earnings-tracker`. Following earnings season across dozens of tech companies means checking multiple sources and remembering report dates. You want to stay on top of AI/tech earnings without manually tracking every company. Use `research-lab` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show earnings-tracker`.
2. Initialize it with `malaclaw starter init earnings-tracker <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `aluvia-brave-search` | `clawhub install aluvia-brave-search` | `BRAVE_API_KEY` | https://brave.com/search/api/ |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `social-intelligence` | `clawhub install social-intelligence` | Social sentiment tracking around earnings announcements |
| `publora-telegram` | `clawhub install publora-telegram` | Push earnings alerts and summaries via Telegram |
