# Demo Project: Event Guest Confirmation

You're hosting an event — a dinner party, a wedding, a company offsite — and you need to confirm attendance from a list of guests. Manually calling 20+ people is tedious: you play phone tag, forget who said what, and lose track of dietary restrictions or plus-ones. Texting works sometimes, but people ignore messages. A real phone call gets a much higher response rate.

## Metadata

- Demo ID: event-guest-confirmation
- Starter ID: event-guest-confirmation
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: openclaw-store-manager
- Source Use Case: Event Guest Confirmation
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/event-guest-confirmation.md
- Tags: automation, event, guest, confirmation

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

- SuperCall — install via openclaw plugins install @xonder/supercall
- A Twilio account with a phone number (for making outbound calls)
- An OpenAI API key (for the GPT-4o Realtime voice AI)
- ngrok (for webhook tunneling — free tier works)
- See the SuperCall README for full configuration instructions.

## Bootstrap Prompt

```text
Start the Event Guest Confirmation demo project from the openclaw-store starter `event-guest-confirmation`. You're hosting an event — a dinner party, a wedding, a company offsite — and you need to confirm attendance from a list of guests. Manually calling 20+ people is tedious: you play phone tag, forget who said what, and lose track of dietary restrictions or plus-ones. Texting works sometimes, but people ignore messages. A real phone call gets a much higher response rate. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show event-guest-confirmation`.
2. Initialize it with `openclaw-store starter init event-guest-confirmation <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
