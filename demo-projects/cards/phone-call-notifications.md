# Demo Project: Phone Call Notifications

Your agent already monitors things for you — stocks, emails, smart home, calendars — but notifications are easy to ignore. Push notifications pile up. Chat messages get buried. For the stuff that actually matters, you need something you can't swipe away.

## Metadata

- Demo ID: phone-call-notifications
- Starter ID: phone-call-notifications
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: openclaw-store-manager
- Source Use Case: Phone Call Notifications
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/phone-call-notifications.md
- Tags: automation, phone, call, notifications

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

- clawr.ing — install by pasting the setup prompt from the clawr.ing dashboard into your OpenClaw chat. No CLI install needed.
- That's it. No other dependencies. The setup prompt includes the API key and links to skill docs — the agent reads them and figures out the rest.

## Bootstrap Prompt

```text
Start the Phone Call Notifications demo project from the openclaw-store starter `phone-call-notifications`. Your agent already monitors things for you — stocks, emails, smart home, calendars — but notifications are easy to ignore. Push notifications pile up. Chat messages get buried. For the stuff that actually matters, you need something you can't swipe away. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show phone-call-notifications`.
2. Initialize it with `openclaw-store starter init phone-call-notifications <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
