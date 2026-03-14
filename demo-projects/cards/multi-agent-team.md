# Demo Project: Multi-Agent Specialized Team (Solo Founder Setup)

Solo founders wear every hat — strategy, development, marketing, sales, operations. Context-switching between these roles destroys deep work. Hiring is expensive and slow. What if you could spin up a small, specialized team of AI agents, each with a distinct role and personality, all controllable from a single chat interface?

## Metadata

- Demo ID: multi-agent-team
- Starter ID: multi-agent-team
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: openclaw-store-manager
- Installable OpenClaw Skills: telegram
- Required APIs / Services: telegram skill for the shared control interface, Individual API keys for different model providers (if using mixed models)
- Required Capabilities / Tools: sessions_spawn / sessions_send for multi-agent coordination
- Source Use Case: Multi-Agent Specialized Team (Solo Founder Setup)
- Tags: automation, multi, agent, team

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run openclaw-store install, then open the `autonomous-startup` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `autonomous-startup` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run openclaw-store install.

## Installable OpenClaw Skills

- telegram

## Required APIs / Services

- telegram skill for the shared control interface
- Individual API keys for different model providers (if using mixed models)

## Required Capabilities / Tools

- sessions_spawn / sessions_send for multi-agent coordination

## Requirement Summary

- telegram skill for the shared control interface
- sessions_spawn / sessions_send for multi-agent coordination
- Shared file system or note-taking tool for team memory
- Individual API keys for different model providers (if using mixed models)
- A VPS or always-on machine to run the agents

## Bootstrap Prompt

```text
Start the Multi-Agent Specialized Team (Solo Founder Setup) demo project from the openclaw-store starter `multi-agent-team`. Solo founders wear every hat — strategy, development, marketing, sales, operations. Context-switching between these roles destroys deep work. Hiring is expensive and slow. What if you could spin up a small, specialized team of AI agents, each with a distinct role and personality, all controllable from a single chat interface? Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show multi-agent-team`.
2. Initialize it with `openclaw-store starter init multi-agent-team <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `openclaw-store install`)

No additional required skills.

### Optional (install anytime to enhance capability)

No optional skills for this demo.
