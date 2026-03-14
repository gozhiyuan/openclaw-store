# Demo Project: Pre-Build Idea Validator

Before OpenClaw starts building anything new, it automatically checks whether the idea already exists across GitHub, Hacker News, npm, PyPI, and Product Hunt — and adjusts its approach based on what it finds.

## Metadata

- Demo ID: pre-build-idea-validator
- Starter ID: pre-build-idea-validator
- Category: research
- Recommended Mode: managed-team
- Entry Team: research-lab
- Packs: research-lab
- Project Skills: openclaw-store-manager
- Source Use Case: Pre-Build Idea Validator
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/pre-build-idea-validator.md
- Tags: research, pre, build, idea, validator

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run openclaw-store install, then open the `research-lab` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `research-lab` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which external skills, tools, or APIs are still missing before execution.
- Install or configure those missing skills and API keys in OpenClaw, then re-run openclaw-store install.

## External Requirements

- idea-reality-mcp — MCP server that scans real data sources and returns a competition score

## Bootstrap Prompt

```text
Start the Pre-Build Idea Validator demo project from the openclaw-store starter `pre-build-idea-validator`. Before OpenClaw starts building anything new, it automatically checks whether the idea already exists across GitHub, Hacker News, npm, PyPI, and Product Hunt — and adjusts its approach based on what it finds. Use `research-lab` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show pre-build-idea-validator`.
2. Initialize it with `openclaw-store starter init pre-build-idea-validator <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
