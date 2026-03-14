# Demo Project: Daily Reddit Digest

Run a daily digest everyday to give you the top performing posts from your favourite subreddits.

## Metadata

- Demo ID: daily-reddit-digest
- Starter ID: daily-reddit-digest
- Category: content
- Recommended Mode: managed-team
- Entry Team: content-factory
- Packs: content-factory
- Project Skills: openclaw-store-manager
- Source Use Case: Daily Reddit Digest
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/daily-reddit-digest.md
- Tags: content, daily, reddit, digest

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

- reddit-readonly skill. It doesn't need auth.

## Bootstrap Prompt

```text
Start the Daily Reddit Digest demo project from the openclaw-store starter `daily-reddit-digest`. Run a daily digest everyday to give you the top performing posts from your favourite subreddits. Use `content-factory` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show daily-reddit-digest`.
2. Initialize it with `openclaw-store starter init daily-reddit-digest <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
