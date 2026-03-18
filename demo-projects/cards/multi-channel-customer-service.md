# Demo Project: Multi-Channel AI Customer Service Platform

Small businesses juggle WhatsApp, Instagram DMs, emails, and Google Reviews across multiple apps. Customers expect instant responses 24/7, but hiring staff for round-the-clock coverage is expensive.

## Metadata

- Demo ID: multi-channel-customer-service
- Starter ID: multi-channel-customer-service
- Category: automation
- Recommended Mode: managed-team
- Entry Team: autonomous-startup
- Packs: autonomous-startup
- Project Skills: malaclaw-manager
- Installable OpenClaw Skills: gog
- Required APIs / Services: WhatsApp Business API integration, Instagram Graph API (via Meta Business), Google Business Profile API for reviews, WhatsApp Business API (through 360dialog or official API), Gmail via gog OAuth, Google Business Profile API token, WhatsApp Business API, Instagram Messaging API, Google Business Profile API
- Required Capabilities / Tools: —
- Source Use Case: Multi-Channel AI Customer Service Platform
- Tags: automation, multi, channel, customer, service

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `autonomous-startup` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `autonomous-startup` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.

## Installable OpenClaw Skills

- gog

## Required APIs / Services

- WhatsApp Business API integration
- Instagram Graph API (via Meta Business)
- Google Business Profile API for reviews
- WhatsApp Business API (through 360dialog or official API)
- Gmail via gog OAuth
- Google Business Profile API token
- WhatsApp Business API
- Instagram Messaging API
- Google Business Profile API

## Requirement Summary

- WhatsApp Business API integration
- Instagram Graph API (via Meta Business)
- gog CLI for Gmail
- Google Business Profile API for reviews
- Message routing logic in AGENTS.md

## Bootstrap Prompt

```text
Start the Multi-Channel AI Customer Service Platform demo project from the malaclaw starter `multi-channel-customer-service`. Small businesses juggle WhatsApp, Instagram DMs, emails, and Google Reviews across multiple apps. Customers expect instant responses 24/7, but hiring staff for round-the-clock coverage is expensive. Use `autonomous-startup` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show multi-channel-customer-service`.
2. Initialize it with `malaclaw starter init multi-channel-customer-service <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `clawemail` | `clawhub install clawemail` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | https://console.cloud.google.com/ |
| `connect-apps` | `clawhub install connect-apps` | `none (configure per-service)` | — |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `publora-telegram` | `clawhub install publora-telegram` | Telegram-based customer service channel support |
| `microsoft365` | `clawhub install microsoft365` | Microsoft 365 / Outlook email channel support |
