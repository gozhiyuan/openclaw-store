# Demo Project: Inbox De-clutter

Newsletters can take up the inbox like nothing else. Often times they pile-up without being opened at all.

## Metadata

- Demo ID: inbox-declutter
- Starter ID: inbox-declutter
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: openclaw-store-manager
- Source Use Case: Inbox De-clutter
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/inbox-declutter.md
- Tags: automation, inbox, declutter

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

- Gmail OAuth Setup.

## Bootstrap Prompt

```text
Start the Inbox De-clutter demo project from the openclaw-store starter `inbox-declutter`. Newsletters can take up the inbox like nothing else. Often times they pile-up without being opened at all. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show inbox-declutter`.
2. Initialize it with `openclaw-store starter init inbox-declutter <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
