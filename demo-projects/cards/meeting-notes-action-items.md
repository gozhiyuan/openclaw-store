# Demo Project: Automated Meeting Notes & Action Items

You just finished a 45-minute team call. Now you need to write up the summary, pull out action items, and distribute them to Jira, Linear, or Todoist — manually. By the time you're done, the next meeting is starting. What if your agent handled all of that the moment the transcript lands?

## Metadata

- Demo ID: meeting-notes-action-items
- Starter ID: meeting-notes-action-items
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: openclaw-store-manager
- Source Use Case: Automated Meeting Notes & Action Items
- Source Path: /Users/ll/Documents/Zhiyuan Liu/github/openclaw-dir/awesome-openclaw-usecases/usecases/meeting-notes-action-items.md
- Tags: automation, meeting, notes, action, items

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run openclaw-store install, then open the `autonomous-startup` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `autonomous-startup` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which external skills, tools, or APIs are still missing before execution.
- Install or configure those missing skills and API keys in OpenClaw, then re-run openclaw-store install.

## External Requirements

- Jira, Linear, Todoist, or Notion integration (for task creation)
- Slack or Discord integration (for posting summaries)
- File system access (for reading transcript files)
- Scheduling / cron (for follow-up reminders)
- Optional: Otter.ai, Fireflies.ai, or Google Meet API for automatic transcript retrieval

## Bootstrap Prompt

```text
Start the Automated Meeting Notes & Action Items demo project from the openclaw-store starter `meeting-notes-action-items`. You just finished a 45-minute team call. Now you need to write up the summary, pull out action items, and distribute them to Jira, Linear, or Todoist — manually. By the time you're done, the next meeting is starting. What if your agent handled all of that the moment the transcript lands? Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `openclaw-store starter show meeting-notes-action-items`.
2. Initialize it with `openclaw-store starter init meeting-notes-action-items <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing skills or API configuration in OpenClaw if needed.
5. Run `openclaw-store install` and execute through the project entry-point agent.
