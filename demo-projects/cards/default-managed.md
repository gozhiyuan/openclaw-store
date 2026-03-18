# Demo Project: Default Managed Project

Minimal managed OpenClaw project that keeps the normal default workflow available while adding a single generalist entry-point team for structured installs.

## Metadata

- Demo ID: default-managed
- Starter ID: default-managed
- Category: general
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: malaclaw-cook
- Installable OpenClaw Skills: —
- Required APIs / Services: —
- Required Capabilities / Tools: —
- Source Use Case: Default Managed Project
- Tags: default, managed, general, bootstrap

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `autonomous-startup` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `autonomous-startup` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- No additional external integrations are required beyond the selected team and bundled management skill.

## Bootstrap Prompt

```text
Start the Default Managed Project demo project from the malaclaw starter `default-managed`. Minimal managed OpenClaw project that keeps the normal default workflow available while adding a single generalist entry-point team for structured installs. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show default-managed`.
2. Initialize it with `malaclaw starter init default-managed <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

No additional required skills.

### Optional (install anytime to enhance capability)

No optional skills for this demo.
