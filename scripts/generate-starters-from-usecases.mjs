import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stringify } from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const usecasesDir = path.resolve(repoRoot, "..", "awesome-openclaw-usecases", "usecases");
const startersDir = path.join(repoRoot, "starters");
const demoProjectsDir = path.join(repoRoot, "demo-projects");
const demoCardsDir = path.join(demoProjectsDir, "cards");
const capabilityKeywords = [
  "sessions_spawn",
  "sessions_send",
  "file system access",
  "git",
  "ssh",
  "cron",
  "webhook",
  "browser automation",
];

const contentStarters = new Set([
  "content-factory",
  "daily-reddit-digest",
  "daily-youtube-digest",
  "podcast-production-pipeline",
  "x-account-analysis",
  "youtube-content-pipeline",
]);

const contentResearchStarters = new Set([
  "market-research-product-factory",
  "custom-morning-brief",
  "multi-source-tech-news-digest",
]);

const researchStarters = new Set([
  "earnings-tracker",
  "knowledge-base-rag",
  "pre-build-idea-validator",
  "semantic-memory-search",
  "second-brain",
]);

const devStarters = new Set([
  "autonomous-game-dev-pipeline",
  "autonomous-project-management",
  "dynamic-dashboard",
  "n8n-workflow-orchestration",
  "project-state-management",
  "self-healing-home-server",
  "todoist-task-manager",
]);

const autonomousStarters = new Set([
  "aionui-cowork-desktop",
  "event-guest-confirmation",
  "family-calendar-household-assistant",
  "habit-tracker-accountability-coach",
  "health-symptom-tracker",
  "inbox-declutter",
  "meeting-notes-action-items",
  "multi-agent-team",
  "multi-channel-assistant",
  "multi-channel-customer-service",
  "overnight-mini-app-builder",
  "personal-crm",
  "phone-based-personal-assistant",
  "phone-call-notifications",
  "polymarket-autopilot",
]);

function classifyStarter(id) {
  if (contentResearchStarters.has(id)) {
    return {
      category: "content-research",
      entry_team: "research-lab",
      packs: ["research-lab", "content-factory"],
      tags: ["research", "content"],
    };
  }
  if (contentStarters.has(id)) {
    return {
      category: "content",
      entry_team: "content-factory",
      packs: ["content-factory"],
      tags: ["content"],
    };
  }
  if (researchStarters.has(id)) {
    return {
      category: "research",
      entry_team: "research-lab",
      packs: ["research-lab"],
      tags: ["research"],
    };
  }
  if (devStarters.has(id)) {
    return {
      category: "development",
      entry_team: "dev-company",
      packs: ["dev-company"],
      tags: ["development"],
    };
  }
  if (autonomousStarters.has(id)) {
    return {
      category: "automation",
      entry_team: "autonomous-startup",
      packs: ["autonomous-startup"],
      tags: ["automation"],
    };
  }
  return {
    category: "general",
    entry_team: "autonomous-startup",
    packs: ["autonomous-startup"],
    tags: ["general"],
  };
}

function extractTitle(markdown, fileName) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? fileName.replace(/-/g, " ");
}

function extractDescription(markdown) {
  const lines = markdown.split("\n");
  let inFence = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line || line.startsWith("#") || line.startsWith("|") || line.startsWith(">")) {
      continue;
    }
    if (/^(Skills|How to Set|Pain Point|What It Does|Prompts|Related Links)/i.test(line)) {
      continue;
    }
    return line;
  }
  return "Demo project starter generated from awesome-openclaw-usecases.";
}

function extractRequirementEntries(markdown) {
  return extractSectionEntries(markdown, /^##\s+Skills (You Need|Needed)/i);
}

function extractSectionEntries(markdown, headingPattern) {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => headingPattern.test(line.trim()));
  if (start === -1) return [];

  const results = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith("## ")) break;
    if (line.startsWith("```")) continue;
    const raw = line
      .replace(/^[-*]\s*/, "")
      .replace(/^\d+\.\s*/, "")
      .trim();
    if (raw) results.push(raw);
  }
  return [...new Set(results)].slice(0, 8);
}

function cleanRequirement(requirement) {
  return requirement
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/`/g, "")
    .trim();
}

function extractRequirementLines(markdown) {
  return extractRequirementEntries(markdown).map(cleanRequirement);
}

function extractInstallableSkills(requirements) {
  const ids = new Set();
  for (const requirement of requirements) {
    if (/don't need a pre-built skill/i.test(requirement)) continue;

    for (const match of requirement.matchAll(/\[([a-z0-9][a-z0-9-]*)\]\((.*?)\)/gi)) {
      const id = match[1].toLowerCase();
      const url = match[2].toLowerCase();
      if (url.includes("clawhub.ai") || url.includes("github.com/openclaw/skills")) {
        ids.add(id);
      }
    }

    const inlineSkill = requirement.match(/([a-z0-9][a-z0-9-]+)\s+skill\b/i);
    if (inlineSkill) {
      ids.add(inlineSkill[1].toLowerCase());
    }

    const inlineSlug = requirement.match(/`([a-z0-9][a-z0-9-]+)`/i);
    if (inlineSlug) {
      ids.add(inlineSlug[1].toLowerCase());
    }
  }
  return [...ids].sort();
}

function extractRequiredApis(requirements) {
  return requirements.filter((requirement) => {
    if (/don't need a pre-built skill/i.test(requirement)) return false;
    return /api|integration|webhook|bot|oauth|auth|sms|discord|telegram|slack|todoist/i.test(requirement);
  });
}

function extractRequiredCapabilities(requirements) {
  return requirements.filter((requirement) =>
    capabilityKeywords.some((keyword) => requirement.toLowerCase().includes(keyword)));
}

function extractSupplementalApis(markdown) {
  const setupEntries = [
    ...extractSectionEntries(markdown, /^##\s+How to Set It Up/i),
    ...extractSectionEntries(markdown, /^##\s+Detailed Setup Guide/i),
    ...extractSectionEntries(markdown, /^##\s+Related Links/i),
  ].map(cleanRequirement);

  return [...new Set(setupEntries.filter((entry) =>
    entry.length <= 80
    && !entry.startsWith("#")
    && !/script/i.test(entry)
    && /api|webhook|oauth|bot|integration|sms/i.test(entry),
  ))].slice(0, 8);
}

function buildBootstrapPrompt(title, description, starterId, entryTeam) {
  return [
    `Start the ${title} demo project from the malaclaw starter \`${starterId}\`.`,
    description,
    `Use \`${entryTeam}\` as the initial entry team.`,
    "Review STARTER.md, confirm any missing external integrations, then break the work into clear team tasks.",
  ].join(" ");
}

function buildSetupGuidance(entryTeam, metadata) {
  const hasSetupDependencies = metadata.installable_skills.length > 0
    || metadata.required_apis.length > 0
    || metadata.required_capabilities.length > 0;
  const steps = [
    "Choose between the default OpenClaw or Claude Code workflow and the managed multi-agent workflow.",
    `If you want managed execution, initialize the starter and use \`${entryTeam}\` as the entry-point team.`,
    "Review the generated STARTER.md and confirm the project scope before running install.",
  ];
  if (hasSetupDependencies) {
    steps.push("Use OpenClaw to verify which recommended skills, required services, and runtime capabilities are still missing before execution.");
    steps.push("Install any missing OpenClaw skills, configure required APIs and auth, then re-run malaclaw install.");
  } else {
    steps.push("No additional external integrations are required beyond the selected team and bundled management skill.");
  }
  return steps;
}

function buildExecution(entryTeam) {
  return {
    default_workflow:
      "Stay in the normal OpenClaw or Claude Code default workflow if you only need one generalist agent or want to prototype without managed teams.",
    managed_workflow:
      `Initialize this starter, run malaclaw install, then open the \`${entryTeam}\` project entry-point agent for structured multi-agent execution.`,
  };
}

function buildDemoCard(demo, starter) {
  const lines = [
    `# Demo Project: ${demo.name}`,
    "",
    demo.summary,
    "",
    "## Metadata",
    "",
    `- Demo ID: ${demo.id}`,
    `- Starter ID: ${demo.starter}`,
    `- Category: ${demo.category}`,
    `- Recommended Mode: ${demo.recommended_mode}`,
    `- Entry Team: ${demo.entry_team}`,
    `- Packs: ${demo.packs.join(", ") || "—"}`,
    `- Project Skills: ${demo.project_skills.join(", ") || "—"}`,
    `- Installable OpenClaw Skills: ${demo.installable_skills.join(", ") || "—"}`,
    `- Required APIs / Services: ${demo.required_apis.join(", ") || "—"}`,
    `- Required Capabilities / Tools: ${demo.required_capabilities.join(", ") || "—"}`,
    `- Source Use Case: ${demo.source_usecase}`,
  ];

  if (demo.tags.length > 0) {
    lines.push(`- Tags: ${demo.tags.join(", ")}`);
  }

  lines.push(
    "",
    "## Execution Paths",
    "",
    `- Default workflow: ${demo.execution.default_workflow}`,
    `- Managed workflow: ${demo.execution.managed_workflow}`,
  );

  if (demo.setup_guidance.length > 0) {
    lines.push("", "## Setup Guidance", "");
    for (const step of demo.setup_guidance) {
      lines.push(`- ${step}`);
    }
  }

  if (demo.installable_skills.length > 0) {
    lines.push("", "## Installable OpenClaw Skills", "");
    for (const skill of demo.installable_skills) {
      lines.push(`- ${skill}`);
    }
  }

  if (demo.required_apis.length > 0) {
    lines.push("", "## Required APIs / Services", "");
    for (const api of demo.required_apis) {
      lines.push(`- ${api}`);
    }
  }

  if (demo.required_capabilities.length > 0) {
    lines.push("", "## Required Capabilities / Tools", "");
    for (const capability of demo.required_capabilities) {
      lines.push(`- ${capability}`);
    }
  }

  if (demo.external_requirements.length > 0) {
    lines.push("", "## Requirement Summary", "");
    for (const req of demo.external_requirements) {
      lines.push(`- ${req}`);
    }
  }

  if (starter.bootstrap_prompt) {
    lines.push("", "## Bootstrap Prompt", "", "```text", starter.bootstrap_prompt, "```");
  }

  lines.push(
    "",
    "## Suggested Flow",
    "",
    `1. Inspect the starter with \`malaclaw starter show ${demo.starter}\`.`,
    `2. Initialize it with \`malaclaw starter init ${demo.starter} <dir>\`.`,
    "3. Review STARTER.md and this demo card.",
    "4. Install missing OpenClaw skills or API configuration in OpenClaw if needed.",
    "5. Run `malaclaw install` and execute through the project entry-point agent.",
    "",
  );

  return lines.join("\n");
}

function buildDefaultManagedStarter() {
  const id = "default-managed";
  const title = "Default Managed Project";
  const description =
    "Minimal managed OpenClaw project that keeps the normal default workflow available while adding a single generalist entry-point team for structured installs.";
  const entryTeam = "autonomous-startup";
  const starter = {
    id,
    version: 1,
    name: title,
    description,
    source_usecase: title,
    entry_team: entryTeam,
    packs: ["autonomous-startup"],
    project_skills: ["malaclaw-cook"],
    installable_skills: [],
    tags: ["default", "managed", "general", "bootstrap"],
    required_apis: [],
    required_capabilities: [],
    external_requirements: [],
    bootstrap_prompt: buildBootstrapPrompt(title, description, id, entryTeam),
  };

  const demo = {
    id,
    starter: id,
    name: title,
    summary: description,
    category: "general",
    recommended_mode: "managed-team",
    source_usecase: title,
    entry_team: entryTeam,
    packs: starter.packs,
    project_skills: starter.project_skills,
    installable_skills: [],
    tags: starter.tags,
    required_apis: [],
    required_capabilities: [],
    external_requirements: [],
    setup_guidance: buildSetupGuidance(entryTeam, starter),
    card_path: path.join("cards", `${id}.md`),
    execution: buildExecution(entryTeam),
  };

  return { starter, demo };
}

async function main() {
  await fs.rm(startersDir, { recursive: true, force: true });
  await fs.rm(demoProjectsDir, { recursive: true, force: true });
  await fs.mkdir(startersDir, { recursive: true });
  await fs.mkdir(demoCardsDir, { recursive: true });

  const entries = (await fs.readdir(usecasesDir))
    .filter((name) => name.endsWith(".md"))
    .sort();
  const demos = [];

  for (const name of entries) {
    const id = name.replace(/\.md$/, "");
    const filePath = path.join(usecasesDir, name);
    const markdown = await fs.readFile(filePath, "utf-8");
    const title = extractTitle(markdown, id);
    const description = extractDescription(markdown);
    const classification = classifyStarter(id);
    const requirementEntries = extractRequirementEntries(markdown);
    const externalRequirements = requirementEntries.map(cleanRequirement);
    const installableSkills = extractInstallableSkills(requirementEntries);
    const requiredApis = [...new Set([
      ...extractRequiredApis(externalRequirements),
      ...extractSupplementalApis(markdown),
    ])];
    const requiredCapabilities = extractRequiredCapabilities(externalRequirements);
    const starter = {
      id,
      version: 1,
      name: title,
      description,
      source_usecase: title,
      source_path: path.relative(repoRoot, filePath),
      entry_team: classification.entry_team,
      packs: classification.packs,
      project_skills: ["malaclaw-cook"],
      installable_skills: installableSkills,
      tags: [...new Set([...classification.tags, ...id.split("-")])],
      required_apis: requiredApis,
      required_capabilities: requiredCapabilities,
      external_requirements: externalRequirements,
      bootstrap_prompt: buildBootstrapPrompt(title, description, id, classification.entry_team),
    };
    const demo = {
      id,
      starter: id,
      name: title,
      summary: description,
      category: classification.category,
      recommended_mode: "managed-team",
      source_usecase: title,
      source_path: starter.source_path,
      entry_team: classification.entry_team,
      packs: classification.packs,
      project_skills: starter.project_skills,
      installable_skills: starter.installable_skills,
      tags: starter.tags,
      required_apis: starter.required_apis,
      required_capabilities: starter.required_capabilities,
      external_requirements: starter.external_requirements,
      setup_guidance: buildSetupGuidance(classification.entry_team, starter),
      card_path: path.join("cards", `${id}.md`),
      execution: buildExecution(classification.entry_team),
    };

    await fs.writeFile(
      path.join(startersDir, `${id}.yaml`),
      stringify(starter),
      "utf-8",
    );
    await fs.writeFile(path.join(demoProjectsDir, demo.card_path), buildDemoCard(demo, starter), "utf-8");
    demos.push(demo);
  }

  const defaultManaged = buildDefaultManagedStarter();
  await fs.writeFile(
    path.join(startersDir, `${defaultManaged.starter.id}.yaml`),
    stringify(defaultManaged.starter),
    "utf-8",
  );
  await fs.writeFile(
    path.join(demoProjectsDir, defaultManaged.demo.card_path),
    buildDemoCard(defaultManaged.demo, defaultManaged.starter),
    "utf-8",
  );
  demos.push(defaultManaged.demo);

  await fs.writeFile(
    path.join(demoProjectsDir, "index.yaml"),
    stringify({
      version: 1,
      generated_at: new Date().toISOString(),
      demos: demos.sort((a, b) => a.id.localeCompare(b.id)),
    }),
    "utf-8",
  );

  console.log(`Generated ${entries.length + 1} starter definitions in ${startersDir}`);
  console.log(`Generated demo project index and cards in ${demoProjectsDir}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
