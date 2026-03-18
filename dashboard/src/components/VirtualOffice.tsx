import type { Team, AgentStatusEntry } from "../lib/types";
import { useAgentStatuses } from "../hooks/useApi";

const ROLE_CONFIG: Record<string, { color: string; label: string; area: string }> = {
  lead: { color: "#a371f7", label: "Lead", area: "manager-desk" },
  specialist: { color: "#3fb950", label: "Specialist", area: "workstation" },
  reviewer: { color: "#d29922", label: "Reviewer", area: "review-area" },
};

function getRoleConfig(role: string) {
  const key = role.toLowerCase();
  if (key.includes("lead") || key.includes("manager") || key.includes("pm")) {
    return ROLE_CONFIG.lead;
  }
  if (key.includes("review")) {
    return ROLE_CONFIG.reviewer;
  }
  return ROLE_CONFIG.specialist;
}

const roomStyle: React.CSSProperties = {
  background: "#161b22",
  border: "1px dashed #30363d",
  borderRadius: 8,
  padding: 12,
};

const roomHeaderStyle: React.CSSProperties = {
  margin: "0 0 10px",
  color: "#f0f6fc",
  fontSize: 13,
  fontWeight: 600,
  borderBottom: "1px solid #30363d",
  paddingBottom: 6,
};

const areaLabelStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#8b949e",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 6,
};

const areaStyle: React.CSSProperties = {
  background: "#0d1117",
  borderRadius: 6,
  padding: "8px 10px",
  minHeight: 52,
};

const statusColors: Record<string, string> = {
  active: "#3fb950",
  spawning: "#58a6ff",
  idle: "#8b949e",
};

function AgentAvatar({ agent, role, status }: { agent: string; role: string; status?: AgentStatusEntry }) {
  const cfg = getRoleConfig(role);
  const liveStatus = status?.status ?? "idle";
  const isActive = liveStatus === "active";
  const isSpawning = liveStatus === "spawning";
  return (
    <div
      title={`${agent} (${role}) — ${liveStatus}`}
      style={{
        position: "relative",
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "#21262d",
        border: `2px solid ${cfg.color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        fontWeight: 600,
        color: cfg.color,
        cursor: "default",
        opacity: liveStatus === "idle" && status ? 0.5 : 1,
        transition: "opacity 0.3s ease",
        animation: isActive ? "pulse 2s infinite" : undefined,
      }}
    >
      {agent.charAt(0).toUpperCase()}
      {/* Status dot */}
      <span style={{
        position: "absolute",
        bottom: -1,
        right: -1,
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: statusColors[liveStatus] ?? "#8b949e",
        border: "2px solid #161b22",
      }} />
      {/* Spawning speech bubble */}
      {isSpawning && (
        <span style={{
          position: "absolute",
          top: -8,
          right: -12,
          fontSize: 10,
          background: "#58a6ff",
          color: "#0d1117",
          padding: "1px 4px",
          borderRadius: 4,
          fontWeight: 700,
        }}>...</span>
      )}
    </div>
  );
}

function RoleArea({
  areaLabel,
  members,
  statuses,
}: {
  areaLabel: string;
  members: { agent: string; role: string }[];
  statuses?: Record<string, AgentStatusEntry>;
}) {
  if (members.length === 0) return null;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={areaLabelStyle}>{areaLabel}</div>
      <div style={areaStyle}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {members.map((m) => (
            <AgentAvatar key={m.agent} agent={m.agent} role={m.role} status={statuses?.[m.agent]} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamRoom({ team, statuses }: { team: Team; statuses?: Record<string, AgentStatusEntry> }) {
  const leads = team.members.filter((m) => {
    const key = m.role.toLowerCase();
    return key.includes("lead") || key.includes("manager") || key.includes("pm");
  });
  const reviewers = team.members.filter((m) => m.role.toLowerCase().includes("review"));
  const specialists = team.members.filter((m) => {
    const key = m.role.toLowerCase();
    return (
      !key.includes("lead") &&
      !key.includes("manager") &&
      !key.includes("pm") &&
      !key.includes("review")
    );
  });

  return (
    <div style={roomStyle}>
      <h4 style={roomHeaderStyle}>{team.name}</h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: leads.length > 0 ? "1fr 2fr 1fr" : "1fr 1fr",
          gap: 8,
        }}
      >
        {leads.length > 0 && (
          <div>
            <RoleArea areaLabel="Manager Desk" members={leads} statuses={statuses} />
          </div>
        )}
        <div>
          <RoleArea areaLabel="Workstations" members={specialists} statuses={statuses} />
        </div>
        {reviewers.length > 0 && (
          <div>
            <RoleArea areaLabel="Review Area" members={reviewers} statuses={statuses} />
          </div>
        )}
      </div>
    </div>
  );
}

export function VirtualOffice({ teams }: { teams: Team[] }) {
  const { data: statuses } = useAgentStatuses();

  if (teams.length === 0) {
    return <div style={{ color: "#8b949e" }}>No teams loaded.</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {teams.map((team) => (
        <TeamRoom key={team.id} team={team} statuses={statuses} />
      ))}
    </div>
  );
}
