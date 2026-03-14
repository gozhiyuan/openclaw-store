# Demo Project: Market Research & Product Factory

You want to build a product but don't know what to build. Or you have a business and need to understand what your customers are struggling with. This workflow uses the Last 30 Days skill to mine Reddit and X for real pain points, then has OpenClaw build solutions to those problems.

## Metadata

- Demo ID: market-research-product-factory
- Starter ID: market-research-product-factory
- Category: content-research
- Recommended Mode: managed-team
- Entry Team: research-lab
- Packs: research-lab, content-factory
- Project Skills: openclaw-store-manager
- Installable OpenClaw Skills: —
- Required APIs / Services: Telegram or Discord integration for receiving research reports
- Required Capabilities / Tools: —
- Source Use Case: Market Research & Product Factory
- Tags: research, content, market, product, factory

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run openclaw-store install, then open the `research-lab` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `research-lab` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run openclaw-store install.

## Required APIs / Services

- Telegram or Discord integration for receiving research reports

## Requirement Summary

- Last 30 Days skill by Matt Van Horde
- Telegram or Discord integration for receiving research reports

## Bootstrap Prompt

```text
Start the Market Research & Product Factory demo project from the openclaw-store starter `market-research-product-factory`. You want to build a product but don't know what to build. Or you have a business and need to understand what your customers are struggling with. This workflow uses the Last 30 Days skill to mine Reddit and X for real pain points, then has OpenClaw build solutions to those problems. Use `research-lab` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show market-research-product-factory`.
2. Initialize it with `openclaw-store starter init market-research-product-factory <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `openclaw-store install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `aluvia-brave-search` | `clawhub install aluvia-brave-search` | `BRAVE_API_KEY` | https://brave.com/search/api/ |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `social-intelligence` | `clawhub install social-intelligence` | Deep social media pain point mining from Reddit and X |
