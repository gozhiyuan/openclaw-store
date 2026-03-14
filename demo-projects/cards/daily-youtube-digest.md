# Demo Project: Daily YouTube Digest

Start your day with a personalized summary of new videos from your favorite YouTube channels — no more missing content from creators you actually want to follow.

## Metadata

- Demo ID: daily-youtube-digest
- Starter ID: daily-youtube-digest
- Category: content
- Recommended Mode: managed-team
- Entry Team: content-factory
- Packs: content-factory
- Project Skills: openclaw-store-manager
- Source Use Case: Daily YouTube Digest
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/daily-youtube-digest.md
- Tags: content, daily, youtube, digest

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

- Install the youtube-full skill.
- Just tell your OpenClaw:
- "Install the youtube-full skill and set it up for me"
- or
- npx clawhub@latest install youtube-full
- That's it. The agent handles the rest — including account creation and API key setup. You get **100 free credits on signup**, no credit card required.
- > Note: After creating the account, the skill auto-stores the API key securely in correct locations based on the OS, so the API will work in all contexts.
- !youtube-full skill installation

## Bootstrap Prompt

```text
Start the Daily YouTube Digest demo project from the openclaw-store starter `daily-youtube-digest`. Start your day with a personalized summary of new videos from your favorite YouTube channels — no more missing content from creators you actually want to follow. Use `content-factory` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show daily-youtube-digest`.
2. Initialize it with `openclaw-store starter init daily-youtube-digest <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
