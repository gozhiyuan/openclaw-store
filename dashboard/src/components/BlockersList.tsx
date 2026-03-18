import { useBlockers } from "../hooks/useApi";

interface BlockerItem {
  text: string;
  severity: "high" | "medium" | "low";
}

function parseBlockers(content: string): BlockerItem[] {
  const items: BlockerItem[] = [];
  for (const line of content.split("\n")) {
    const match = line.match(/^[-*]\s+(.+)/);
    if (match) {
      const text = match[1].trim();
      // Detect severity hints
      const lower = text.toLowerCase();
      const severity: BlockerItem["severity"] =
        lower.includes("critical") || lower.includes("blocker") || lower.includes("high")
          ? "high"
          : lower.includes("medium") || lower.includes("moderate")
          ? "medium"
          : "low";
      items.push({ text, severity });
    }
  }
  return items;
}

const severityColors: Record<BlockerItem["severity"], string> = {
  high: "#f85149",
  medium: "#d29922",
  low: "#8b949e",
};

const severityDotColors: Record<BlockerItem["severity"], string> = {
  high: "#f85149",
  medium: "#e3b341",
  low: "#57ab5a",
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

function BlockerItem({ item }: { item: BlockerItem }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        background: "#161b22",
        border: `1px solid ${severityColors[item.severity]}40`,
        borderLeft: `3px solid ${severityColors[item.severity]}`,
        borderRadius: 4,
        padding: "8px 12px",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: severityDotColors[item.severity],
          flexShrink: 0,
          marginTop: 4,
        }}
      />
      <span style={{ color: "#c9d1d9", fontSize: 13 }}>{item.text}</span>
    </div>
  );
}

export function BlockersList({ projectId, teamId }: { projectId: string; teamId: string }) {
  const { data, isLoading, error } = useBlockers(projectId, teamId);

  if (isLoading) return <div style={{ color: "#8b949e" }}>Loading blockers...</div>;
  if (error) return <div style={{ color: "#f85149" }}>Error loading blockers.</div>;
  if (!data?.content) return <div style={{ color: "#8b949e" }}>No blockers found.</div>;

  const items = parseBlockers(data.content);
  if (items.length === 0) return <div style={{ color: "#57ab5a", fontSize: 13 }}>No active blockers.</div>;

  return (
    <div style={containerStyle}>
      {items.map((item, i) => (
        <BlockerItem key={i} item={item} />
      ))}
    </div>
  );
}
