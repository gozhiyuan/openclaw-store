# Demo Project: Personal Knowledge Base (RAG)

You read articles, tweets, and watch videos all day but can never find that one thing you saw last week. Bookmarks pile up and become useless.

## Metadata

- Demo ID: knowledge-base-rag
- Starter ID: knowledge-base-rag
- Category: research
- Recommended Mode: managed-team
- Entry Team: research-lab
- Packs: research-lab
- Project Skills: openclaw-store-manager
- Source Use Case: Personal Knowledge Base (RAG)
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/knowledge-base-rag.md
- Tags: research, knowledge, base, rag

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

- knowledge-base skill (or build custom RAG with embeddings)
- web_fetch (built-in)
- Telegram topic or Slack channel for ingestion

## Bootstrap Prompt

```text
Start the Personal Knowledge Base (RAG) demo project from the openclaw-store starter `knowledge-base-rag`. You read articles, tweets, and watch videos all day but can never find that one thing you saw last week. Bookmarks pile up and become useless. Use `research-lab` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show knowledge-base-rag`.
2. Initialize it with `openclaw-store starter init knowledge-base-rag <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
