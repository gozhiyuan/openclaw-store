# Design: Demo Agent Teams, Per-Agent Skills, and Interactive Install Flow

**Date:** 2026-03-14
**Status:** Approved
**Scope:** openclaw-store — new agent teams, skill templates, demo re-mapping, manager skill install flow

---

## Problem Statement

The current `openclaw-store` has 4 agent teams and 3 skill templates. Of the 37 demo projects, 21 are assigned to `autonomous-startup` (a single generic CEO agent) because no purpose-built team exists for their category. Skills are not wired to demos or agents — most demos have `installable_skills: []` despite requiring real integrations (email, calendar, Slack, Twilio, etc.).

The target workflow is: user installs `openclaw-store-manager` into OpenClaw, chats to spin up a demo project, and ends up with the right agent team, each agent having its specific skills installed and configured — no manual YAML editing required.

---

## Architecture Principles

1. **Team = coordination structure.** Teams define roles, delegation graph, and shared memory ownership. They do not own skills.
2. **Agent = unit of capability.** Each agent YAML declares its own `skills: []` list. Skills are installed per agent, not per team.
3. **`sessions_spawn` belongs in the agent YAML.** `capabilities.coordination.sessions_spawn: true` is set on lead agents only. It is NOT a field on `TeamMember` in the team YAML. The tables below note which agents require it as a reminder for the agent YAML author.
4. **Manifest `targets` = project overrides.** The project `openclaw-store.yaml` can add skills to specific agents on top of what the agent YAML declares. Used for optional or project-specific skills.
5. **`openclaw-store install` = reconciliation point.** Changing the manifest or agent YAMLs has no effect until install is re-run.
6. **OpenClaw is the runtime.** OpenClaw installs skills (via ClawHub or its own skill manager). `openclaw-store` declares which skills each agent needs and wires them in during install.

---

## Section 1: New Agent Teams (5 teams)

> **Schema note:** `sessions_spawn` in the tables below is a reminder that the agent YAML must set `capabilities.coordination.sessions_spawn: true`. It is not a field in the team YAML's `members:` block.

---

### 1.1 `personal-assistant` team

**Covers:** habit-tracker, health-symptom-tracker, family-calendar-household-assistant, meeting-notes-action-items, personal-crm, second-brain

**Pack:** `personal-assistant` — version `1.0.0`, default_skills: `google-calendar`, `brainz-tasks`

**Agents:**

| Agent ID | Display Name | Role | `sessions_spawn` (in agent YAML) | Model | Skills |
|---|---|---|---|---|---|
| `personal-assistant-lead` | Personal Assistant Lead | lead / entry point | true | `claude-sonnet-4-5` | `google-calendar`, `clawemail`, `brainz-tasks` |
| `life-organizer` | Life Organizer | specialist | false | `claude-haiku-4-5` | `google-calendar`, `apple-calendar`, `brainz-tasks`, `apple-reminders` |
| `health-wellness-tracker` | Health & Wellness Tracker | specialist | false | `claude-haiku-4-5` | `apple-health-skill` |
| `knowledge-manager` | Knowledge Manager | specialist | false | `claude-haiku-4-5` | `danube`, `faster-whisper`, `apple-contacts` |

**Soul persona seeds (for agent YAML `soul.persona`):**

- `personal-assistant-lead`: "You are the Personal Assistant Lead on the {{team.name}} team. You orchestrate your user's daily life — calendar, tasks, health, and knowledge — by delegating to specialist agents and synthesising their outputs into a clear daily brief."
- `life-organizer`: "You are the Life Organizer on the {{team.name}} team. You own calendar management, task tracking, habit accountability, and reminders. You keep schedules consistent and surface upcoming commitments proactively."
- `health-wellness-tracker`: "You are the Health & Wellness Tracker on the {{team.name}} team. You read and summarise health data, track symptoms and trends, and surface patterns to help the user understand their wellbeing."
- `knowledge-manager`: "You are the Knowledge Manager on the {{team.name}} team. You handle meeting transcription, note capture, second-brain organisation, and contact management."

**Team graph (delegation edges):**
```yaml
graph:
  - from: personal-assistant-lead
    to: life-organizer
    relationship: delegates_to
  - from: personal-assistant-lead
    to: health-wellness-tracker
    relationship: delegates_to
  - from: personal-assistant-lead
    to: knowledge-manager
    relationship: delegates_to
```

**Shared memory:**
```yaml
shared_memory:
  dir: "~/.openclaw-store/workspaces/store/<project-id>/personal-assistant/shared/memory/"
  files:
    - path: daily-brief.md
      access: single-writer
      writer: personal-assistant-lead
    - path: action-log.md
      access: append-only
      writer: "*"
```

---

### 1.2 `automation-ops` team

**Covers:** inbox-declutter, phone-based-personal-assistant, phone-call-notifications, multi-channel-assistant, event-guest-confirmation, n8n-workflow-orchestration, todoist-task-manager

**Pack:** `automation-ops` — version `1.0.0`, default_skills: `clawemail`, `n8n`

**Agents:**

| Agent ID | Display Name | Role | `sessions_spawn` (in agent YAML) | Model | Skills |
|---|---|---|---|---|---|
| `automation-lead` | Automation Lead | lead / entry point | true | `claude-sonnet-4-5` | `n8n`, `connect-apps`, `clawemail` |
| `communications-agent` | Communications Agent | specialist | false | `claude-haiku-4-5` | `clawemail`, `connect-apps`, `publora-telegram`, `microsoft365` |
| `integration-specialist` | Integration Specialist | specialist | false | `claude-haiku-4-5` | `n8n`, `agentic-devops` |
| `notification-agent` | Notification Agent | specialist | false | `claude-haiku-4-5` | `outbound-call`, `publora-telegram` |

**Soul persona seeds:**

- `automation-lead`: "You are the Automation Lead on the {{team.name}} team. You design and orchestrate workflows, route tasks to specialist agents, and monitor automation health. You translate user goals into running pipelines."
- `communications-agent`: "You are the Communications Agent on the {{team.name}} team. You send, receive, and route messages across email, Slack, Telegram, and Microsoft Teams. You handle inbox management and outbound messaging."
- `integration-specialist`: "You are the Integration Specialist on the {{team.name}} team. You build and manage webhook pipelines, n8n workflows, and API integrations. You connect disparate systems into coherent automations."
- `notification-agent`: "You are the Notification Agent on the {{team.name}} team. You handle outbound phone calls, SMS, and push notifications. You ensure the right alerts reach the right people at the right time."

**Team graph:**
```yaml
graph:
  - from: automation-lead
    to: communications-agent
    relationship: delegates_to
  - from: automation-lead
    to: integration-specialist
    relationship: delegates_to
  - from: automation-lead
    to: notification-agent
    relationship: delegates_to
```

**Shared memory:**
```yaml
shared_memory:
  dir: "~/.openclaw-store/workspaces/store/<project-id>/automation-ops/shared/memory/"
  files:
    - path: workflow-state.md
      access: single-writer
      writer: automation-lead
    - path: event-log.md
      access: append-only
      writer: "*"
```

---

### 1.3 `customer-service` team

**Covers:** multi-channel-customer-service

**Pack:** `customer-service` — version `1.0.0`, default_skills: `clawemail`, `connect-apps`

**Agents:**

| Agent ID | Display Name | Role | `sessions_spawn` (in agent YAML) | Model | Skills |
|---|---|---|---|---|---|
| `service-lead` | Service Lead | lead / entry point | true | `claude-sonnet-4-5` | `clawemail`, `connect-apps` |
| `response-agent` | Response Agent | specialist | false | `claude-haiku-4-5` | `clawemail`, `connect-apps`, `publora-telegram` |
| `channel-coordinator` | Channel Coordinator | specialist | false | `claude-haiku-4-5` | `connect-apps`, `publora-telegram`, `microsoft365` |
| `escalation-reviewer` | Escalation Reviewer | reviewer | false | `claude-sonnet-4-5` | `clawemail` |

**Soul persona seeds:**

- `service-lead`: "You are the Service Lead on the {{team.name}} team. You own ticket routing, SLA management, and escalation decisions. You assign incoming requests to the correct agent and review complex cases."
- `response-agent`: "You are the Response Agent on the {{team.name}} team. You draft and send first-line customer replies across email, Slack, and Telegram. You keep responses consistent, accurate, and on-brand."
- `channel-coordinator`: "You are the Channel Coordinator on the {{team.name}} team. You monitor and manage inboxes across Slack, Discord, WhatsApp, and email. You surface unread tickets and coordinate handoffs."
- `escalation-reviewer`: "You are the Escalation Reviewer on the {{team.name}} team. You handle sensitive or complex cases that the response agent cannot resolve. You approve escalation responses before they are sent."

**Team graph:**
```yaml
graph:
  - from: service-lead
    to: response-agent
    relationship: delegates_to
  - from: service-lead
    to: channel-coordinator
    relationship: delegates_to
  - from: response-agent
    to: escalation-reviewer
    relationship: requests_review
  - from: service-lead
    to: escalation-reviewer
    relationship: requests_review
```

**Shared memory:**
```yaml
shared_memory:
  dir: "~/.openclaw-store/workspaces/store/<project-id>/customer-service/shared/memory/"
  files:
    - path: ticket-queue.md
      access: single-writer
      writer: service-lead
    - path: response-log.md
      access: append-only
      writer: "*"
```

---

### 1.4 `finance-ops` team

**Covers:** earnings-tracker, polymarket-autopilot

**Pack:** `finance-ops` — version `1.0.0`, default_skills: `aluvia-brave-search`

**Agents:**

| Agent ID | Display Name | Role | `sessions_spawn` (in agent YAML) | Model | Skills |
|---|---|---|---|---|---|
| `finance-lead` | Finance Lead | lead / entry point | true | `claude-sonnet-4-5` | `reef-polymarket-research`, `aluvia-brave-search` |
| `market-analyst` | Market Analyst | specialist | false | `claude-haiku-4-5` | `aluvia-brave-search`, `social-intelligence` |
| `trade-executor` | Trade Executor | specialist | false | `claude-haiku-4-5` | `reef-polymarket-research` |
| `risk-reviewer` | Risk Reviewer | reviewer | false | `claude-sonnet-4-5` | `aluvia-brave-search` |

**Soul persona seeds:**

- `finance-lead`: "You are the Finance Lead on the {{team.name}} team. You set strategy, size positions, and make portfolio decisions. You delegate research to the analyst and execution to the trade executor, but you own every final call."
- `market-analyst`: "You are the Market Analyst on the {{team.name}} team. You gather financial data, track earnings, monitor social sentiment, and surface trends. You produce clear, evidenced research briefs for the lead."
- `trade-executor`: "You are the Trade Executor on the {{team.name}} team. You place orders, track open positions, and report P&L. You execute only when authorised by the lead and log every action in the trade log."
- `risk-reviewer`: "You are the Risk Reviewer on the {{team.name}} team. You review positions and proposals for risk exposure, flag anything outside approved parameters, and approve or block large moves before execution."

**Team graph:**
```yaml
graph:
  - from: finance-lead
    to: market-analyst
    relationship: delegates_to
  - from: finance-lead
    to: trade-executor
    relationship: delegates_to
  - from: trade-executor
    to: risk-reviewer
    relationship: requests_review
  - from: finance-lead
    to: risk-reviewer
    relationship: requests_review
```

**Shared memory:**
```yaml
shared_memory:
  dir: "~/.openclaw-store/workspaces/store/<project-id>/finance-ops/shared/memory/"
  files:
    - path: portfolio-state.md
      access: single-writer
      writer: finance-lead
    - path: trade-log.md
      access: append-only
      writer: "*"
```

---

### 1.5 `data-ops` team

**Covers:** dynamic-dashboard, knowledge-base-rag, semantic-memory-search

**Pack:** `data-ops` — version `1.0.0`, default_skills: `duckdb-en`, `nocodb`

**Agents:**

| Agent ID | Display Name | Role | `sessions_spawn` (in agent YAML) | Model | Skills |
|---|---|---|---|---|---|
| `data-lead` | Data Lead | lead / entry point | true | `claude-sonnet-4-5` | `duckdb-en`, `nocodb` |
| `data-engineer` | Data Engineer | specialist | false | `claude-haiku-4-5` | `duckdb-en`, `nocodb`, `agentic-devops` |
| `analytics-agent` | Analytics Agent | specialist | false | `claude-haiku-4-5` | `duckdb-en`, `aluvia-brave-search` |
| `storage-manager` | Storage Manager | specialist | false | `claude-haiku-4-5` | `nocodb`, `duckdb-en` |

**Soul persona seeds:**

- `data-lead`: "You are the Data Lead on the {{team.name}} team. You own pipeline design, schema decisions, and data quality. You coordinate ingestion, transformation, and delivery of data to downstream consumers."
- `data-engineer`: "You are the Data Engineer on the {{team.name}} team. You build and maintain ETL pipelines, transform raw data into clean formats, and manage storage infrastructure."
- `analytics-agent`: "You are the Analytics Agent on the {{team.name}} team. You query structured data, produce trend reports, build dashboards, and answer data questions with evidence."
- `storage-manager`: "You are the Storage Manager on the {{team.name}} team. You manage database tables, vector indexes, and file storage. You maintain schema hygiene and handle backups and indexing."

**Team graph:**
```yaml
graph:
  - from: data-lead
    to: data-engineer
    relationship: delegates_to
  - from: data-lead
    to: analytics-agent
    relationship: delegates_to
  - from: data-lead
    to: storage-manager
    relationship: delegates_to
```

**Shared memory:**
```yaml
shared_memory:
  dir: "~/.openclaw-store/workspaces/store/<project-id>/data-ops/shared/memory/"
  files:
    - path: pipeline-state.md
      access: single-writer
      writer: data-lead
    - path: pipeline-log.md
      access: append-only
      writer: "*"
```

---

### 1.6 Existing team — skill additions per agent

Skills to add to `skills: []` in existing agent YAMLs. Confirm each file's `id:` field matches before editing.

| Team | Agent file | Agent `id:` to verify | Skills to add |
|---|---|---|---|
| `content-factory` | `templates/agents/editor.yaml` | `editor` | `fal-ai`, `rss-skill` |
| `content-factory` | `templates/agents/writer.yaml` | `writer` | `aluvia-brave-search` |
| `content-factory` | `templates/agents/seo-specialist.yaml` | `seo-specialist` | `aluvia-brave-search`, `x-research-but-cheaper` |
| `content-factory` | `templates/agents/social-media-manager.yaml` | `social-media-manager` | `x-research-but-cheaper`, `social-intelligence`, `publora-telegram` |
| `content-factory` | `templates/agents/video-producer.yaml` | `video-producer` | `youtube-pro`, `fal-ai` |
| `research-lab` | `templates/agents/research-lead.yaml` | `research-lead` | `aluvia-brave-search`, `social-intelligence` |
| `research-lab` | `templates/agents/researcher.yaml` | `researcher` | `aluvia-brave-search`, `arxiv-watcher`, `rss-skill` |
| `research-lab` | `templates/agents/analyst.yaml` | `analyst` | `duckdb-en`, `aluvia-brave-search` |
| `research-lab` | `templates/agents/report-writer.yaml` | `report-writer` | `danube` |
| `dev-company` | `templates/agents/devops-engineer.yaml` | `devops-engineer` | `agentic-devops` |
| `dev-company` | `templates/agents/backend-dev.yaml` | `backend-dev` | `duckdb-en` |

---

## Section 2: New Skill Templates (25 skills)

All new skill templates live in `templates/skills/`. All use `source.type: clawhub` with full HTTPS URLs. `trust_tier` is set per skill based on curation status in `awesome-openclaw-skills`.

### Communication & Messaging (6 skills)

| Template ID | ClawHub URL | Trust tier | Env vars | Notes |
|---|---|---|---|---|
| `clawemail` | `https://clawhub.ai/cto1/clawemail` | community | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Gmail + Google Drive/Docs/Sheets |
| `microsoft365` | `https://clawhub.ai/robert-janssen/microsoft365` | community | `MS365_CLIENT_ID`, `MS365_CLIENT_SECRET` | Outlook, Teams, Calendar, OneDrive |
| `connect-apps` | `https://clawhub.ai/sohamganatra/connect-apps` | community | service-dependent | Multi-connector: Gmail, Slack, GitHub. Best available for Slack until a dedicated Slack skill is verified. |
| `publora-telegram` | `https://clawhub.ai/sergebulaev/publora-telegram` | community | `PUBLORA_API_KEY` | Post/schedule to Telegram channels |
| `outbound-call` | `https://clawhub.ai/humanjesse/outbound-call` | community | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `ELEVENLABS_API_KEY` | Real phone calls via Twilio + ElevenLabs |
| `danube` | `https://clawhub.ai/preston-thiele/danube` | community | service-dependent | 100+ API connectors incl. Notion, Slack, GitHub |

> **Discord gap:** No dedicated Discord skill was found in the curated `awesome-openclaw-skills` registry. `connect-apps` is the best available substitute. Verify a dedicated Discord skill on ClawHub before finalising the `customer-service` team.

### Calendar & Productivity (4 skills)

| Template ID | ClawHub URL | Trust tier | Env vars |
|---|---|---|---|
| `google-calendar` | `https://clawhub.ai/adrianmiller99/google-calendar` | community | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| `apple-calendar` | `https://clawhub.ai/tyler6204/apple-calendar` | community | none (local macOS) |
| `apple-reminders` | `https://clawhub.ai/steipete/apple-reminders` | community | none (local macOS) |
| `brainz-tasks` | `https://clawhub.ai/xejrax/brainz-tasks` | community | `TODOIST_API_TOKEN` |

### Health & Personal Data (3 skills)

| Template ID | ClawHub URL | Trust tier | Env vars |
|---|---|---|---|
| `apple-health-skill` | `https://clawhub.ai/nftechie/apple-health-skill` | community | none (local macOS) |
| `apple-contacts` | `https://clawhub.ai/tyler6204/apple-contacts` | community | none (local macOS) |
| `faster-whisper` | `https://clawhub.ai/theplasmak/faster-whisper` | community | none (requires `faster-whisper` binary) |

### Research & Search (4 skills)

| Template ID | ClawHub URL | Trust tier | Env vars |
|---|---|---|---|
| `aluvia-brave-search` | `https://clawhub.ai/bertxtrella/aluvia-brave-search` | community | `BRAVE_API_KEY` |
| `social-intelligence` | `https://clawhub.ai/atyachin/social-intelligence` | community | `SOCIAL_INTEL_API_KEY` |
| `arxiv-watcher` | `https://clawhub.ai/rubenfb23/arxiv-watcher` | community | none |
| `rss-skill` | `https://clawhub.ai/myx0m0p/rss-skill` | community | none |

### Social & Media (3 skills)

| Template ID | ClawHub URL | Trust tier | Env vars |
|---|---|---|---|
| `youtube-pro` | `https://clawhub.ai/kjaylee/youtube-pro` | community | `YOUTUBE_API_KEY` |
| `x-research-but-cheaper` | `https://clawhub.ai/minilozio/x-research-but-cheaper` | community | `TWITTER_API_IO_KEY` |
| `fal-ai` | `https://clawhub.ai/agmmnn/fal-ai` | community | `FAL_KEY` |

### Data & Infrastructure (4 skills)

| Template ID | ClawHub URL | Trust tier | Env vars |
|---|---|---|---|
| `duckdb-en` | `https://clawhub.ai/camelsprout/duckdb-en` | community | none (local DuckDB) |
| `nocodb` | `https://clawhub.ai/nickian/nocodb` | community | `NOCODB_BASE_URL`, `NOCODB_API_TOKEN` |
| `agentic-devops` | `https://clawhub.ai/tkuehnl/agentic-devops` | community | none (local Docker) |
| `n8n` | `https://clawhub.ai/thomasansems/n8n` | community | `N8N_BASE_URL`, `N8N_API_KEY` |

### Finance (1 skill)

| Template ID | ClawHub URL | Trust tier | Env vars |
|---|---|---|---|
| `reef-polymarket-research` | `https://clawhub.ai/rimelucci/reef-polymarket-research` | community | `POLYMARKET_API_KEY` |

---

## Section 3: Demo → Team + Skills Mapping

All 37 demos. Required skills block `openclaw-store install`; optional skills install as inactive.

For `family-calendar-household-assistant`: the manager skill must ask the user during setup whether they use Google Calendar or Apple Calendar, then target the appropriate skill. Both are listed as required but only one will be selected per install.

| Demo | Team | Required skills | Optional skills |
|---|---|---|---|
| `aionui-cowork-desktop` | autonomous-startup | `openclaw-store-manager` | — |
| `autonomous-game-dev-pipeline` | dev-company | `gh` | `agentic-devops` |
| `autonomous-project-management` | dev-company | `gh` | `brainz-tasks` |
| `content-factory` | content-factory | `fal-ai` | `social-intelligence`, `x-research-but-cheaper` |
| `custom-morning-brief` | research-lab | `aluvia-brave-search` | `social-intelligence`, `rss-skill`, `publora-telegram` |
| `daily-reddit-digest` | content-factory | `social-intelligence` | `rss-skill` |
| `daily-youtube-digest` | content-factory | `youtube-pro` | `rss-skill` |
| `default-managed` | autonomous-startup | `openclaw-store-manager` | — |
| `dynamic-dashboard` | data-ops | `duckdb-en` | `nocodb`, `gh` |
| `earnings-tracker` | finance-ops | `aluvia-brave-search` | `social-intelligence`, `publora-telegram` |
| `event-guest-confirmation` | automation-ops | `clawemail` | `google-calendar`, `publora-telegram` |
| `family-calendar-household-assistant` | personal-assistant | `google-calendar` OR `apple-calendar` (user selects) | `publora-telegram`, `clawemail` |
| `habit-tracker-accountability-coach` | personal-assistant | `brainz-tasks`, `apple-reminders` | `publora-telegram` |
| `health-symptom-tracker` | personal-assistant | `apple-health-skill` | `apple-reminders` |
| `inbox-declutter` | automation-ops | `clawemail` | `microsoft365` |
| `knowledge-base-rag` | data-ops | `duckdb-en`, `nocodb` | `aluvia-brave-search` |
| `market-research-product-factory` | research-lab | `aluvia-brave-search` | `social-intelligence` |
| `meeting-notes-action-items` | personal-assistant | `faster-whisper` | `google-calendar`, `clawemail` |
| `multi-agent-team` | autonomous-startup | `openclaw-store-manager` | — |
| `multi-channel-assistant` | automation-ops | `clawemail`, `connect-apps` | `publora-telegram`, `microsoft365` |
| `multi-channel-customer-service` | customer-service | `clawemail`, `connect-apps` | `publora-telegram`, `microsoft365` |
| `multi-source-tech-news-digest` | research-lab | `rss-skill`, `aluvia-brave-search` | `arxiv-watcher` |
| `n8n-workflow-orchestration` | automation-ops | `n8n` | `gh`, `agentic-devops` |
| `overnight-mini-app-builder` | autonomous-startup | `gh` | `agentic-devops` |
| `personal-crm` | personal-assistant | `clawemail`, `apple-contacts` | `danube` |
| `phone-based-personal-assistant` | automation-ops | `outbound-call` | `publora-telegram` |
| `phone-call-notifications` | automation-ops | `outbound-call` | `clawemail` |
| `podcast-production-pipeline` | content-factory | `rss-skill` | `aluvia-brave-search`, `faster-whisper` |
| `polymarket-autopilot` | finance-ops | `reef-polymarket-research` | `aluvia-brave-search` |
| `pre-build-idea-validator` | research-lab | `aluvia-brave-search` | `social-intelligence` |
| `project-state-management` | dev-company | `gh` | — |
| `second-brain` | personal-assistant | `danube` | `duckdb-en`, `rss-skill` |
| `self-healing-home-server` | dev-company | `agentic-devops` | `publora-telegram` |
| `semantic-memory-search` | data-ops | `duckdb-en` | `nocodb`, `aluvia-brave-search` |
| `todoist-task-manager` | automation-ops | `brainz-tasks` | `google-calendar` |
| `x-account-analysis` | content-factory | `x-research-but-cheaper` | `social-intelligence` |
| `youtube-content-pipeline` | content-factory | `youtube-pro` | `fal-ai` |

---

## Section 4: Interactive Install Flow in `openclaw-store-manager`

### Conversational flow

When a user asks to spin up a project or demo, the manager skill follows this sequence:

```
1. openclaw-store starter suggest "<user idea>"
   → present closest match: name, team, agents, required/optional skills

2. User confirms starter + target directory
   (If family-calendar demo: ask "Do you use Google Calendar or Apple Calendar?"
    then target the user's answer as the required skill)

3. openclaw-store starter init <starter-id> <dir>
   → generates openclaw-store.yaml, STARTER.md, DEMO_PROJECT.md

4. openclaw-store skill sync
   → detects what is already installed in OpenClaw
   → compares against each agent's declared skills
   If skill sync fails (OpenClaw offline / unreachable):
     → warn user: "Could not reach OpenClaw to check installed skills.
        Proceeding with manual skill confirmation."
     → ask user to confirm each required skill manually before continuing

5. For each REQUIRED skill not yet installed:
   - Tell user which skill is missing
   - Tell user which agent(s) need it and why
   - Provide: clawhub install <slug>
   - Provide: export ENV_VAR=<value>
   - Provide: where to get the API key (from demo card setup_guidance)
   - Wait for user confirmation

6. Re-run openclaw-store skill sync
   → confirm all required skills are now present
   → repeat step 5 if any remain

7. cd <dir> && openclaw-store install
   → provisions all agents, wires skills per agent
   → seeds shared memory files

8. openclaw-store doctor
   → verify all agents, workspaces, and required skills are healthy

9. Tell user:
   - Exact agent ID to open in OpenClaw
   - Concrete first task to give that agent
```

### Required vs optional skill handling

- **Required skills** (`project_skills` in starter YAML): manager blocks `openclaw-store install` until all are confirmed installed and active
- **Optional skills** (`installable_skills` in starter YAML): install proceeds, skills marked inactive, manager mentions them as "available when ready" — never blocking

### Demo card Skills Setup section (new addition to all 37 cards)

```markdown
## Skills Setup

### Required (needed before openclaw-store install)
| Skill | Agent(s) | Install | Env var | Get key |
|---|---|---|---|---|
| aluvia-brave-search | researcher, writer | `clawhub install aluvia-brave-search` | `BRAVE_API_KEY` | brave.com/search/api |

### Optional (install anytime)
| Skill | Agent(s) | Install | What it adds |
|---|---|---|---|
| faster-whisper | knowledge-manager | `clawhub install faster-whisper` | Audio transcription |
```

### Starter YAML skill tiers

```yaml
project_skills:          # required — placed in manifest, block install if missing
  - openclaw-store-manager
  - rss-skill

installable_skills:      # optional — listed in demo card, non-blocking
  - aluvia-brave-search
  - faster-whisper

required_apis:
  - "Brave Search API (BRAVE_API_KEY) — researcher + writer agents"

setup_guidance:
  - "Install aluvia-brave-search: clawhub install aluvia-brave-search"
  - "Get BRAVE_API_KEY at brave.com/search/api (free tier available)"
```

---

## Section 5: Files to Create / Modify

### New files

**Agent templates** (`templates/agents/`): 20 files
```
personal-assistant-lead.yaml   life-organizer.yaml
health-wellness-tracker.yaml   knowledge-manager.yaml
automation-lead.yaml           communications-agent.yaml
integration-specialist.yaml    notification-agent.yaml
service-lead.yaml              response-agent.yaml
channel-coordinator.yaml       escalation-reviewer.yaml
finance-lead.yaml              market-analyst.yaml
trade-executor.yaml            risk-reviewer.yaml
data-lead.yaml                 data-engineer.yaml
analytics-agent.yaml           storage-manager.yaml
```

**Team templates** (`templates/teams/`): 5 files
```
personal-assistant.yaml   automation-ops.yaml   customer-service.yaml
finance-ops.yaml          data-ops.yaml
```

**Pack definitions** (`packs/`): 5 files, each following the same pattern as `dev-company.yaml`

| Pack file | `id` | `version` | `name` | `teams` | `default_skills` | `compatibility` |
|---|---|---|---|---|---|---|
| `personal-assistant.yaml` | personal-assistant | 1.0.0 | Personal Assistant | [personal-assistant] | google-calendar, brainz-tasks | openclaw_min: 2026.2.9, node_min: 22.0.0 |
| `automation-ops.yaml` | automation-ops | 1.0.0 | Automation Ops | [automation-ops] | clawemail, n8n | openclaw_min: 2026.2.9, node_min: 22.0.0 |
| `customer-service.yaml` | customer-service | 1.0.0 | Customer Service | [customer-service] | clawemail, connect-apps | openclaw_min: 2026.2.9, node_min: 22.0.0 |
| `finance-ops.yaml` | finance-ops | 1.0.0 | Finance Ops | [finance-ops] | aluvia-brave-search | openclaw_min: 2026.2.9, node_min: 22.0.0 |
| `data-ops.yaml` | data-ops | 1.0.0 | Data Ops | [data-ops] | duckdb-en, nocodb | openclaw_min: 2026.2.9, node_min: 22.0.0 |

**Skill templates** (`templates/skills/`): 25 new files as listed in Section 2.

### Modified files

**Existing agent YAMLs** — add skills per Section 1.6 (11 files):
- `templates/agents/editor.yaml`, `writer.yaml`, `seo-specialist.yaml`, `social-media-manager.yaml`, `video-producer.yaml`
- `templates/agents/research-lead.yaml`, `researcher.yaml`, `analyst.yaml`, `report-writer.yaml`
- `templates/agents/devops-engineer.yaml`, `backend-dev.yaml`

**All 37 starter YAMLs** (`starters/*.yaml`) — update `entry_team`, `packs`, `project_skills`, `installable_skills`, `required_apis`, `setup_guidance`

**All 37 demo cards** (`demo-projects/cards/*.md`) — add **Skills Setup** section

**`demo-projects/index.yaml`** — update `entry_team`, `packs`, `project_skills`, `installable_skills` per new mapping

**`skills/openclaw-store-manager/SKILL.md`** — add Project Initialization Flow, Skill Gap Detection loop (including offline fallback), Entry-point handoff, Calendar selection branching

**`skills/openclaw-store-manager/references/commands.md`** — update to reference new teams and packs

---

## Success Criteria

1. All 37 demo projects are assigned a purpose-built team (not `autonomous-startup` unless genuinely appropriate)
2. Every agent in every team has a `skills: []` list appropriate to its role
3. All 25 new skill templates validate against `SkillEntry` Zod schema (`openclaw-store validate` passes)
4. A user can chat with `openclaw-store-manager` in OpenClaw, spin up any demo, and have the right agents + skills installed without touching a terminal
5. `openclaw-store doctor` passes for any freshly installed demo project with required skills present
6. Required skills block install; optional skills never block install
7. `openclaw-store validate` passes for all 20 new agent templates, 5 team templates, 5 pack definitions, and 25 skill templates
