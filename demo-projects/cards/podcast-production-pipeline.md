# Demo Project: Podcast Production Pipeline

You have a podcast idea, maybe even a backlog of episode topics. But between researching guests, writing outlines, drafting intros, generating show notes, and writing social media posts for promotion — the production overhead kills your momentum. What if you handed off a topic and got back a full production package?

## Metadata

- Demo ID: podcast-production-pipeline
- Starter ID: podcast-production-pipeline
- Category: content
- Recommended Mode: managed-team
- Entry Team: content-factory
- Packs: content-factory
- Project Skills: openclaw-store-manager
- Source Use Case: Podcast Production Pipeline
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/podcast-production-pipeline.md
- Tags: content, podcast, production, pipeline

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

- Web search / research skill (for guest research and topic deep-dives)
- File system access (for reading transcripts and writing output files)
- Slack, Discord, or Telegram integration (for delivering assets)
- Optional: sessions_spawn for running research and writing agents in parallel
- Optional: RSS feed skill (for monitoring competitor podcasts)

## Bootstrap Prompt

```text
Start the Podcast Production Pipeline demo project from the openclaw-store starter `podcast-production-pipeline`. You have a podcast idea, maybe even a backlog of episode topics. But between researching guests, writing outlines, drafting intros, generating show notes, and writing social media posts for promotion — the production overhead kills your momentum. What if you handed off a topic and got back a full production package? Use `content-factory` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show podcast-production-pipeline`.
2. Initialize it with `openclaw-store starter init podcast-production-pipeline <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
