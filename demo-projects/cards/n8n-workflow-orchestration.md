# Demo Project: OpenClaw + n8n Workflow Orchestration

Letting your AI agent directly manage API keys and call external services is a recipe for security incidents. Every new integration means another credential in `.env.local`, another surface for the agent to accidentally leak or misuse.

## Metadata

- Demo ID: n8n-workflow-orchestration
- Starter ID: n8n-workflow-orchestration
- Category: development
- Recommended Mode: managed-team
- Entry Team: dev-company
- Packs: dev-company
- Project Skills: malaclaw-cook
- Installable OpenClaw Skills: fetch, n8n
- Required APIs / Services: n8n API access (for creating/triggering workflows), fetch or curl for webhook calls, n8n credential management (manual, one-time setup per integration), n8n Webhook Trigger Docs
- Required Capabilities / Tools: fetch or curl for webhook calls
- Source Use Case: OpenClaw + n8n Workflow Orchestration
- Tags: development, n8n, workflow, orchestration

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

- fetch
- n8n

## Required APIs / Services

- n8n API access (for creating/triggering workflows)
- fetch or curl for webhook calls
- n8n credential management (manual, one-time setup per integration)
- n8n Webhook Trigger Docs

## Required Capabilities / Tools

- fetch or curl for webhook calls

## Requirement Summary

- n8n API access (for creating/triggering workflows)
- fetch or curl for webhook calls
- Docker (if using the pre-configured stack)
- n8n credential management (manual, one-time setup per integration)

## Bootstrap Prompt

```text
Start the OpenClaw + n8n Workflow Orchestration demo project from the malaclaw starter `n8n-workflow-orchestration`. Letting your AI agent directly manage API keys and call external services is a recipe for security incidents. Every new integration means another credential in `.env.local`, another surface for the agent to accidentally leak or misuse. Use `dev-company` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show n8n-workflow-orchestration`.
2. Initialize it with `malaclaw starter init n8n-workflow-orchestration <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `n8n` | `clawhub install n8n` | `N8N_BASE_URL`, `N8N_API_KEY` | Your n8n instance dashboard |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `github` | `clawhub install github` | GitHub workflow triggers and repository automation via n8n |
| `agentic-devops` | `clawhub install agentic-devops` | Docker-based DevOps for self-hosted n8n deployment |
