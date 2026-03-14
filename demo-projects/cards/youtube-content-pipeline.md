# Demo Project: YouTube Content Pipeline

As a daily YouTube creator, finding fresh, timely video ideas across the web and X/Twitter is time-consuming. Tracking what you've already covered prevents duplicates and helps you stay ahead of trends.

## Metadata

- Demo ID: youtube-content-pipeline
- Starter ID: youtube-content-pipeline
- Category: content
- Recommended Mode: managed-team
- Entry Team: content-factory
- Packs: content-factory
- Project Skills: openclaw-store-manager
- Installable OpenClaw Skills: gog, knowledge-base, search, x-research-v2
- Required APIs / Services: Asana integration (or Todoist), Telegram topic for receiving pitches
- Required Capabilities / Tools: —
- Source Use Case: YouTube Content Pipeline
- Tags: content, youtube, pipeline

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run openclaw-store install, then open the `content-factory` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `content-factory` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run openclaw-store install.

## Installable OpenClaw Skills

- gog
- knowledge-base
- search
- x-research-v2

## Required APIs / Services

- Asana integration (or Todoist)
- Telegram topic for receiving pitches

## Requirement Summary

- web_search (built-in)
- x-research-v2 or custom X/Twitter search skill
- knowledge-base skill for RAG
- Asana integration (or Todoist)
- gog CLI for YouTube Analytics
- Telegram topic for receiving pitches

## Bootstrap Prompt

```text
Start the YouTube Content Pipeline demo project from the openclaw-store starter `youtube-content-pipeline`. As a daily YouTube creator, finding fresh, timely video ideas across the web and X/Twitter is time-consuming. Tracking what you've already covered prevents duplicates and helps you stay ahead of trends. Use `content-factory` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show youtube-content-pipeline`.
2. Initialize it with `openclaw-store starter init youtube-content-pipeline <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `openclaw-store install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `youtube-pro` | `clawhub install youtube-pro` | `YOUTUBE_API_KEY` | https://console.cloud.google.com/ |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `fal-ai` | `clawhub install fal-ai` | AI-generated thumbnails and visual assets for video content |
