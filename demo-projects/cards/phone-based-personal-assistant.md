# Demo Project: Phone-Based Personal Assistant

You want to access your AI agent from any phone without needing a smartphone app or internet browser. You need hands-free voice assistance while driving, walking, or when your hands are occupied.

## Metadata

- Demo ID: phone-based-personal-assistant
- Starter ID: phone-based-personal-assistant
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: malaclaw-cook
- Installable OpenClaw Skills: calendar, jira, search
- Required APIs / Services: Telnyx API
- Required Capabilities / Tools: —
- Source Use Case: Phone-Based Personal Assistant
- Tags: automation, phone, based, personal, assistant

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

- calendar
- jira
- search

## Required APIs / Services

- Telnyx API

## Requirement Summary

- ClawdTalk
- Calendar skill (Google Calendar or Outlook)
- Jira skill
- Web search skill

## Bootstrap Prompt

```text
Start the Phone-Based Personal Assistant demo project from the malaclaw starter `phone-based-personal-assistant`. You want to access your AI agent from any phone without needing a smartphone app or internet browser. You need hands-free voice assistance while driving, walking, or when your hands are occupied. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show phone-based-personal-assistant`.
2. Initialize it with `malaclaw starter init phone-based-personal-assistant <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `outbound-call` | `clawhub install outbound-call` | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `ELEVENLABS_API_KEY` | https://twilio.com, https://elevenlabs.io |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `publora-telegram` | `clawhub install publora-telegram` | Telegram fallback interface when phone is not available |
