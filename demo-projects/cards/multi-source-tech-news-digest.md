# Demo Project: Multi-Source Tech News Digest

Automatically aggregate, score, and deliver tech news from 109+ sources across RSS, Twitter/X, GitHub releases, and web search — all managed through natural language.

## Metadata

- Demo ID: multi-source-tech-news-digest
- Starter ID: multi-source-tech-news-digest
- Category: content-research
- Recommended Mode: managed-team
- Entry Team: research-lab
- Packs: research-lab, content-factory
- Project Skills: openclaw-store-manager
- Source Use Case: Multi-Source Tech News Digest
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/multi-source-tech-news-digest.md
- Tags: research, content, multi, source, tech, news, digest

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

- tech-news-digest — Install via clawhub install tech-news-digest
- gog (optional) — For email delivery via Gmail

## Bootstrap Prompt

```text
Start the Multi-Source Tech News Digest demo project from the openclaw-store starter `multi-source-tech-news-digest`. Automatically aggregate, score, and deliver tech news from 109+ sources across RSS, Twitter/X, GitHub releases, and web search — all managed through natural language. Use `research-lab` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show multi-source-tech-news-digest`.
2. Initialize it with `openclaw-store starter init multi-source-tech-news-digest <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
