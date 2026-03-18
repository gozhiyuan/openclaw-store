import { useTaskLog } from "../hooks/useApi";

interface TimelineEntry {
  timestamp: string;
  description: string;
}

function parseTaskLog(content: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  for (const line of content.split("\n")) {
    // Match lines like: - 2024-01-15T10:30:00 Some description
    // Or: - [2024-01-15] Some description
    // Or: - some bullet entry
    const tsMatch = line.match(/^[-*]\s+\[?(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}(?::\d{2})?Z?)\]?\s+(.*)/);
    if (tsMatch) {
      entries.push({ timestamp: tsMatch[1].trim(), description: tsMatch[2].trim() });
    } else {
      const bulletMatch = line.match(/^[-*]\s+(.+)/);
      if (bulletMatch) {
        entries.push({ timestamp: "", description: bulletMatch[1].trim() });
      }
    }
  }
  return entries;
}

const timelineContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
  position: "relative",
  paddingLeft: 20,
};

const lineStyle: React.CSSProperties = {
  position: "absolute",
  left: 7,
  top: 8,
  bottom: 8,
  width: 2,
  background: "#30363d",
};

const entryStyle: React.CSSProperties = {
  position: "relative",
  paddingLeft: 16,
  paddingBottom: 12,
};

const dotStyle: React.CSSProperties = {
  position: "absolute",
  left: -13,
  top: 4,
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#388bfd",
  border: "2px solid #161b22",
};

const timestampStyle: React.CSSProperties = {
  color: "#8b949e",
  fontSize: 11,
  marginBottom: 2,
};

const descStyle: React.CSSProperties = {
  color: "#c9d1d9",
  fontSize: 13,
};

export function TaskTimeline({ projectId, teamId }: { projectId: string; teamId: string }) {
  const { data, isLoading, error } = useTaskLog(projectId, teamId);

  if (isLoading) return <div style={{ color: "#8b949e" }}>Loading task log...</div>;
  if (error) return <div style={{ color: "#f85149" }}>Error loading task log.</div>;
  if (!data?.content) return <div style={{ color: "#8b949e" }}>No task log found.</div>;

  const entries = parseTaskLog(data.content);
  if (entries.length === 0) return <div style={{ color: "#8b949e" }}>Empty task log.</div>;

  return (
    <div style={timelineContainerStyle}>
      <div style={lineStyle} />
      {entries.map((entry, i) => (
        <div key={i} style={entryStyle}>
          <div style={dotStyle} />
          {entry.timestamp && <div style={timestampStyle}>{entry.timestamp}</div>}
          <div style={descStyle}>{entry.description}</div>
        </div>
      ))}
    </div>
  );
}
