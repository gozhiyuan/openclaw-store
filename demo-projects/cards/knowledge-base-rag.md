# Demo Project: Personal Knowledge Base (RAG)

You read articles, tweets, and watch videos all day but can never find that one thing you saw last week. Bookmarks pile up and become useless.

## Metadata

- Demo ID: knowledge-base-rag
- Starter ID: knowledge-base-rag
- Category: research
- Recommended Mode: managed-team
- Entry Team: research-lab
- Packs: research-lab
- Project Skills: malaclaw-manager
- Installable OpenClaw Skills: knowledge-base
- Required APIs / Services: Telegram topic or Slack channel for ingestion
- Required Capabilities / Tools: —
- Source Use Case: Personal Knowledge Base (RAG)
- Tags: research, knowledge, base, rag

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `research-lab` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `research-lab` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.

## Installable OpenClaw Skills

- knowledge-base

## Required APIs / Services

- Telegram topic or Slack channel for ingestion

## Requirement Summary

- knowledge-base skill (or build custom RAG with embeddings)
- web_fetch (built-in)
- Telegram topic or Slack channel for ingestion

## Bootstrap Prompt

```text
Start the Personal Knowledge Base (RAG) demo project from the malaclaw starter `knowledge-base-rag`. You read articles, tweets, and watch videos all day but can never find that one thing you saw last week. Bookmarks pile up and become useless. Use `research-lab` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show knowledge-base-rag`.
2. Initialize it with `malaclaw starter init knowledge-base-rag <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `duckdb-en` | `clawhub install duckdb-en` | `none (local CLI)` | — |
| `nocodb` | `clawhub install nocodb` | `NOCODB_BASE_URL`, `NOCODB_API_TOKEN` | Self-hosted or https://nocodb.com |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `aluvia-brave-search` | `clawhub install aluvia-brave-search` | Web search to enrich and cross-reference knowledge base entries |
