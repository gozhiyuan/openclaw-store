# Demo Project: OpenClaw + n8n Workflow Orchestration

Letting your AI agent directly manage API keys and call external services is a recipe for security incidents. Every new integration means another credential in `.env.local`, another surface for the agent to accidentally leak or misuse.

## Metadata

- Demo ID: n8n-workflow-orchestration
- Starter ID: n8n-workflow-orchestration
- Category: development
- Recommended Mode: managed-team
- Entry Team: dev-company
- Packs: dev-company
- Project Skills: openclaw-store-manager
- Source Use Case: OpenClaw + n8n Workflow Orchestration
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/n8n-workflow-orchestration.md
- Tags: development, n8n, workflow, orchestration

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run openclaw-store install, then open the `dev-company` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `dev-company` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which external skills, tools, or APIs are still missing before execution.
- Install or configure those missing skills and API keys in OpenClaw, then re-run openclaw-store install.

## External Requirements

- n8n API access (for creating/triggering workflows)
- fetch or curl for webhook calls
- Docker (if using the pre-configured stack)
- n8n credential management (manual, one-time setup per integration)

## Bootstrap Prompt

```text
Start the OpenClaw + n8n Workflow Orchestration demo project from the openclaw-store starter `n8n-workflow-orchestration`. Letting your AI agent directly manage API keys and call external services is a recipe for security incidents. Every new integration means another credential in `.env.local`, another surface for the agent to accidentally leak or misuse. Use `dev-company` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show n8n-workflow-orchestration`.
2. Initialize it with `openclaw-store starter init n8n-workflow-orchestration <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
