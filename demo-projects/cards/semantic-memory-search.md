# Demo Project: Semantic Memory Search

OpenClaw's built-in memory system stores everything as markdown files — but as memories grow over weeks and months, finding that one decision from last Tuesday becomes impossible. There is no search, just scrolling through files.

## Metadata

- Demo ID: semantic-memory-search
- Starter ID: semantic-memory-search
- Category: research
- Recommended Mode: managed-team
- Entry Team: research-lab
- Packs: research-lab
- Project Skills: malaclaw-cook
- Installable OpenClaw Skills: —
- Required APIs / Services: memsearch Documentation — full CLI reference, Python API, and architecture
- Required Capabilities / Tools: —
- Source Use Case: Semantic Memory Search
- Tags: research, semantic, memory, search

## Execution Paths

- Default workflow: Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.
- Managed workflow: Initialize this starter, run malaclaw install, then open the `research-lab` project entry-point agent for structured multi-agent execution.

## Setup Guidance

- Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.
- If you want managed execution, initialize the starter and use `research-lab` as the entry-point team.
- Review the generated STARTER.md and confirm the project scope before running install.
- Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.
- Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.

## Required APIs / Services

- memsearch Documentation — full CLI reference, Python API, and architecture

## Requirement Summary

- No OpenClaw skills required — memsearch is a standalone Python CLI/library
- Python 3.10+ with pip or uv

## Bootstrap Prompt

```text
Start the Semantic Memory Search demo project from the malaclaw starter `semantic-memory-search`. OpenClaw's built-in memory system stores everything as markdown files — but as memories grow over weeks and months, finding that one decision from last Tuesday becomes impossible. There is no search, just scrolling through files. Use `research-lab` as the initial entry team. Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.
```

## Suggested Flow

1. Inspect the starter with `malaclaw starter show semantic-memory-search`.
2. Initialize it with `malaclaw starter init semantic-memory-search <dir>`.
3. Review STARTER.md and this demo card.
4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.
5. Run `malaclaw install` and execute through the project entry-point agent.

## Skills Setup

### Required (install before `malaclaw install`)

| Skill | Install | Env var | Get key |
|---|---|---|---|
| `duckdb-en` | `clawhub install duckdb-en` | `none (local CLI)` | — |

### Optional (install anytime to enhance capability)

| Skill | Install | What it adds |
|---|---|---|
| `nocodb` | `clawhub install nocodb` | NocoDB UI for browsing and managing memory records |
| `aluvia-brave-search` | `clawhub install aluvia-brave-search` | Web search to supplement memory results with live context |
