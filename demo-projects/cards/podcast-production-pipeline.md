# Demo Project: Podcast Production Pipeline

You have a podcast idea, maybe even a backlog of episode topics. But between researching guests, writing outlines, drafting intros, generating show notes, and writing social media posts for promotion — the production overhead kills your momentum. What if you handed off a topic and got back a full production package?

## Metadata

- Demo ID: podcast-production-pipeline
- Starter ID: podcast-production-pipeline
- Category: content
- Recommended Mode: managed-team
- Entry Team: content-factory
- Packs: content-factory
- Project Skills: malaclaw-manager
- Installable OpenClaw Skills: feed, research
- Required APIs / Services: Slack, Discord, or Telegram integration (for delivering assets)
- Required Capabilities / Tools: File system access (for reading transcripts and writing output files), Optional: sessions_spawn for running research and writing agents in parallel
- Source Use Case: Podcast Production Pipeline
- Tags: content, podcast, production, pipeline

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `content-factory` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `content-factory` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.

## Installable OpenClaw Skills

- feed
- research

## Required APIs / Services

- Slack, Discord, or Telegram integration (for delivering assets)

## Required Capabilities / Tools

- File system access (for reading transcripts and writing output files)
- Optional: sessions_spawn for running research and writing agents in parallel

## Requirement Summary

- Web search / research skill (for guest research and topic deep-dives)
- File system access (for reading transcripts and writing output files)
- Slack, Discord, or Telegram integration (for delivering assets)
- Optional: sessions_spawn for running research and writing agents in parallel
- Optional: RSS feed skill (for monitoring competitor podcasts)

## Bootstrap Prompt

```text
Start the Podcast Production Pipeline demo project from the malaclaw starter `podcast-production-pipeline`. You have a podcast idea, maybe even a backlog of episode topics. But between researching guests, writing outlines, drafting intros, generating show notes, and writing social media posts for promotion — the production overhead kills your momentum. What if you handed off a topic and got back a full production package? Use `content-factory` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show podcast-production-pipeline`.
2. Initialize it with `malaclaw starter init podcast-production-pipeline <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `rss-skill` | `clawhub install rss-skill` | `none` | — |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `aluvia-brave-search` | `clawhub install aluvia-brave-search` | Web research for guest backgrounds and episode topic deep-dives |
| `faster-whisper` | `clawhub install faster-whisper` | Local audio transcription for existing podcast episodes |
