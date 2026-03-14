# Demo Project: Multi-Agent Content Factory

You're a content creator juggling research, writing, and design across multiple platforms. Each step — finding trending topics, writing scripts, generating thumbnails — eats hours of your day. What if a team of specialized agents handled all of it overnight?

## Metadata

- Demo ID: content-factory
- Starter ID: content-factory
- Category: content
- Recommended Mode: managed-team
- Entry Team: content-factory
- Packs: content-factory
- Project Skills: openclaw-store-manager
- Source Use Case: Multi-Agent Content Factory
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/content-factory.md
- Tags: content, factory

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run openclaw-store install, then open the `content-factory` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `content-factory` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which external skills, tools, or APIs are still missing before execution.
- Install or configure those missing skills and API keys in OpenClaw, then re-run openclaw-store install.

## External Requirements

- Discord integration with multiple channels
- sessions_spawn / sessions_send for multi-agent orchestration
- x-research-v2 or similar for social media research
- Local image generation (e.g., Nano Banana) or an image generation API
- knowledge-base skill (optional, for RAG-powered research)

## Bootstrap Prompt

```text
Start the Multi-Agent Content Factory demo project from the openclaw-store starter `content-factory`. You're a content creator juggling research, writing, and design across multiple platforms. Each step — finding trending topics, writing scripts, generating thumbnails — eats hours of your day. What if a team of specialized agents handled all of it overnight? Use `content-factory` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show content-factory`.
2. Initialize it with `openclaw-store starter init content-factory <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
