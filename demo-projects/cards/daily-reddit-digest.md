# Demo Project: Daily Reddit Digest

Run a daily digest everyday to give you the top performing posts from your favourite subreddits.

## Metadata

- Demo ID: daily-reddit-digest
- Starter ID: daily-reddit-digest
- Category: content
- Recommended Mode: managed-team
- Entry Team: content-factory
- Packs: content-factory
- Project Skills: malaclaw-cook
- Installable OpenClaw Skills: reddit-readonly
- Required APIs / Services: reddit-readonly skill. It doesn't need auth.
- Required Capabilities / Tools: —
- Source Use Case: Daily Reddit Digest
- Tags: content, daily, reddit, digest

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

- reddit-readonly

## Required APIs / Services

- reddit-readonly skill. It doesn't need auth.

## Requirement Summary

- reddit-readonly skill. It doesn't need auth.

## Bootstrap Prompt

```text
Start the Daily Reddit Digest demo project from the malaclaw starter `daily-reddit-digest`. Run a daily digest everyday to give you the top performing posts from your favourite subreddits. Use `content-factory` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show daily-reddit-digest`.
2. Initialize it with `malaclaw starter init daily-reddit-digest <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `social-intelligence` | `clawhub install social-intelligence` | `SOCIAL_INTEL_API_KEY` | Contact social-intelligence provider |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `rss-skill` | `clawhub install rss-skill` | Additional RSS feed sources to complement Reddit posts |
