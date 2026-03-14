# Demo Project: Second Brain

You come up with ideas, find interesting links, hear about books to read — but you never have a good system for capturing them. Notion gets complex, Apple Notes becomes a graveyard of 10,000 unread entries. You need something as simple as texting a friend.

## Metadata

- Demo ID: second-brain
- Starter ID: second-brain
- Category: research
- Recommended Mode: managed-team
- Entry Team: research-lab
- Packs: research-lab
- Project Skills: openclaw-store-manager
- Source Use Case: Second Brain
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/second-brain.md
- Tags: research, second, brain

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

- Telegram, iMessage, or Discord integration (for text-based capture)
- Next.js (OpenClaw builds this for you — no coding needed)

## Bootstrap Prompt

```text
Start the Second Brain demo project from the openclaw-store starter `second-brain`. You come up with ideas, find interesting links, hear about books to read — but you never have a good system for capturing them. Notion gets complex, Apple Notes becomes a graveyard of 10,000 unread entries. You need something as simple as texting a friend. Use `research-lab` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show second-brain`.
2. Initialize it with `openclaw-store starter init second-brain <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
