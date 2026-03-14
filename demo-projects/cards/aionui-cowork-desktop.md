# Demo Project: OpenClaw as Desktop Cowork (AionUi) — Remote Rescue & Multi-Agent Hub

Use OpenClaw from a desktop Cowork UI, access it from Telegram or WebUI when you’re away, and fix it remotely when it won’t connect. AionUi is a free, open-source app that runs **OpenClaw as a first-class agent** alongside 12+ others (Claude Code, Codex, Qwen Code, etc.), with a built-in **OpenClaw deployment expert** for install, diagnose, and repair — including **remote rescue** when OpenClaw is down and you’re not at the machine.

## Metadata

- Demo ID: aionui-cowork-desktop
- Starter ID: aionui-cowork-desktop
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: openclaw-store-manager
- Source Use Case: OpenClaw as Desktop Cowork (AionUi) — Remote Rescue & Multi-Agent Hub
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/aionui-cowork-desktop.md
- Tags: automation, aionui, cowork, desktop

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

- **OpenClaw** (e.g. npm install -g openclaw@latest). AionUi’s **OpenClaw Setup** assistant can guide install, gateway, and config.
- API keys or auth for your models (OpenClaw config + any built-in agent keys in AionUi).

## Bootstrap Prompt

```text
Start the OpenClaw as Desktop Cowork (AionUi) — Remote Rescue & Multi-Agent Hub demo project from the openclaw-store starter `aionui-cowork-desktop`. Use OpenClaw from a desktop Cowork UI, access it from Telegram or WebUI when you’re away, and fix it remotely when it won’t connect. AionUi is a free, open-source app that runs **OpenClaw as a first-class agent** alongside 12+ others (Claude Code, Codex, Qwen Code, etc.), with a built-in **OpenClaw deployment expert** for install, diagnose, and repair — including **remote rescue** when OpenClaw is down and you’re not at the machine. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show aionui-cowork-desktop`.
2. Initialize it with `openclaw-store starter init aionui-cowork-desktop <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
