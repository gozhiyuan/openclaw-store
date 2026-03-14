# Demo Project: Semantic Memory Search

OpenClaw's built-in memory system stores everything as markdown files — but as memories grow over weeks and months, finding that one decision from last Tuesday becomes impossible. There is no search, just scrolling through files.

## Metadata

- Demo ID: semantic-memory-search
- Starter ID: semantic-memory-search
- Category: research
- Recommended Mode: managed-team
- Entry Team: research-lab
- Packs: research-lab
- Project Skills: openclaw-store-manager
- Source Use Case: Semantic Memory Search
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/semantic-memory-search.md
- Tags: research, semantic, memory, search

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

- No OpenClaw skills required — memsearch is a standalone Python CLI/library
- Python 3.10+ with pip or uv

## Bootstrap Prompt

```text
Start the Semantic Memory Search demo project from the openclaw-store starter `semantic-memory-search`. OpenClaw's built-in memory system stores everything as markdown files — but as memories grow over weeks and months, finding that one decision from last Tuesday becomes impossible. There is no search, just scrolling through files. Use `research-lab` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show semantic-memory-search`.
2. Initialize it with `openclaw-store starter init semantic-memory-search <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
