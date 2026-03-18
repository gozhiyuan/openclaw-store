# Demo Project: Inbox De-clutter

Newsletters can take up the inbox like nothing else. Often times they pile-up without being opened at all.

## Metadata

- Demo ID: inbox-declutter
- Starter ID: inbox-declutter
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: malaclaw-manager
- Installable OpenClaw Skills: —
- Required APIs / Services: Gmail OAuth Setup.
- Required Capabilities / Tools: —
- Source Use Case: Inbox De-clutter
- Tags: automation, inbox, declutter

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `autonomous-startup` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `autonomous-startup` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.

## Required APIs / Services

- Gmail OAuth Setup.

## Requirement Summary

- Gmail OAuth Setup.

## Bootstrap Prompt

```text
Start the Inbox De-clutter demo project from the malaclaw starter `inbox-declutter`. Newsletters can take up the inbox like nothing else. Often times they pile-up without being opened at all. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show inbox-declutter`.
2. Initialize it with `malaclaw starter init inbox-declutter <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `clawemail` | `clawhub install clawemail` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | https://console.cloud.google.com/ |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `microsoft365` | `clawhub install microsoft365` | Outlook/Microsoft 365 inbox decluttering support |
