import { useUsage } from "../hooks/useApi";

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: "1px solid #30363d",
  fontSize: 13,
};

function formatTokens(n: number): string {
  if (n === 0) return "\u2014";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function formatCost(n: number): string {
  if (n === 0) return "\u2014";
  return `$${n.toFixed(4)}`;
}

export function CostTracker() {
  const { data: usage, isLoading } = useUsage();

  const hasData = usage && (usage.input_tokens > 0 || usage.output_tokens > 0 || usage.total_cost > 0);

  return (
    <div>
      <div style={row}>
        <span style={{ color: "#c9d1d9" }}>Input tokens</span>
        <span style={{ color: hasData ? "#f0f6fc" : "#8b949e" }}>
          {isLoading ? "..." : formatTokens(usage?.input_tokens ?? 0)}
        </span>
      </div>
      <div style={row}>
        <span style={{ color: "#c9d1d9" }}>Output tokens</span>
        <span style={{ color: hasData ? "#f0f6fc" : "#8b949e" }}>
          {isLoading ? "..." : formatTokens(usage?.output_tokens ?? 0)}
        </span>
      </div>
      <div style={{ ...row, borderBottom: "none" }}>
        <span style={{ color: "#c9d1d9", fontWeight: 600 }}>Total cost</span>
        <span style={{ color: hasData ? "#3fb950" : "#8b949e", fontWeight: 600 }}>
          {isLoading ? "..." : formatCost(usage?.total_cost ?? 0)}
        </span>
      </div>
      {!hasData && !isLoading && (
        <div style={{ color: "#8b949e", fontSize: 11, marginTop: 8 }}>
          Available with Gateway connection.
        </div>
      )}
    </div>
  );
}
