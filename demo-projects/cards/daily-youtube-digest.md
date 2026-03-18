# Demo Project: Daily YouTube Digest

Start your day with a personalized summary of new videos from your favorite YouTube channels — no more missing content from creators you actually want to follow.

## Metadata

- Demo ID: daily-youtube-digest
- Starter ID: daily-youtube-digest
- Category: content
- Recommended Mode: managed-team
- Entry Team: content-factory
- Packs: content-factory
- Project Skills: malaclaw-manager
- Installable OpenClaw Skills: the, youtube-full
- Required APIs / Services: That's it. The agent handles the rest — including account creation and API key setup. You get **100 free credits on signup**, no credit card required., > Note: After creating the account, the skill auto-stores the API key securely in correct locations based on the OS, so the API will work in all contexts.
- Required Capabilities / Tools: —
- Source Use Case: Daily YouTube Digest
- Tags: content, daily, youtube, digest

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

- the
- youtube-full

## Required APIs / Services

- That's it. The agent handles the rest — including account creation and API key setup. You get **100 free credits on signup**, no credit card required.
- > Note: After creating the account, the skill auto-stores the API key securely in correct locations based on the OS, so the API will work in all contexts.

## Requirement Summary

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
Start the Daily YouTube Digest demo project from the malaclaw starter `daily-youtube-digest`. Start your day with a personalized summary of new videos from your favorite YouTube channels — no more missing content from creators you actually want to follow. Use `content-factory` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show daily-youtube-digest`.
2. Initialize it with `malaclaw starter init daily-youtube-digest <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `youtube-pro` | `clawhub install youtube-pro` | `YOUTUBE_API_KEY` | https://console.cloud.google.com/ |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `rss-skill` | `clawhub install rss-skill` | RSS-based monitoring to supplement YouTube channel tracking |
