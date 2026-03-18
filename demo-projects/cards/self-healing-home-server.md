# Demo Project: Self-Healing Home Server & Infrastructure Management

Running a home server means being on-call 24/7 for your own infrastructure. Services go down at 3 AM, certificates expire silently, disk fills up, and pods crash-loop — all while you're asleep or away.

## Metadata

- Demo ID: self-healing-home-server
- Starter ID: self-healing-home-server
- Category: development
- Recommended Mode: managed-team
- Entry Team: dev-company
- Packs: dev-company
- Project Skills: malaclaw-cook
- Installable OpenClaw Skills: 1password, gog, kubectl, ssh, terraform
- Required APIs / Services: Calendar API access
- Required Capabilities / Tools: ssh access to home network machines
- Source Use Case: Self-Healing Home Server & Infrastructure Management
- Tags: development, self, healing, home, server

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `dev-company` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `dev-company` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.

## Installable OpenClaw Skills

- 1password
- gog
- kubectl
- ssh
- terraform

## Required APIs / Services

- Calendar API access

## Required Capabilities / Tools

- ssh access to home network machines

## Requirement Summary

- ssh access to home network machines
- kubectl for Kubernetes cluster management
- terraform and ansible for infrastructure-as-code
- 1password CLI for secrets management
- gog CLI for email access
- Calendar API access
- Obsidian vault or notes directory (for knowledge base)
- openclaw doctor for self-diagnostics

## Bootstrap Prompt

```text
Start the Self-Healing Home Server & Infrastructure Management demo project from the malaclaw starter `self-healing-home-server`. Running a home server means being on-call 24/7 for your own infrastructure. Services go down at 3 AM, certificates expire silently, disk fills up, and pods crash-loop — all while you're asleep or away. Use `dev-company` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show self-healing-home-server`.
2. Initialize it with `malaclaw starter init self-healing-home-server <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `agentic-devops` | `clawhub install agentic-devops` | `none (requires Docker)` | — |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `publora-telegram` | `clawhub install publora-telegram` | Alert delivery and remote control commands via Telegram |
