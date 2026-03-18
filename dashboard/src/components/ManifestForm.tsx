import { useState, useEffect } from "react";
import { useManifest, useInstall, useSaveManifest } from "../hooks/useApi";

const card: React.CSSProperties = {
  background: "#161b22",
  border: "1px solid #30363d",
  borderRadius: 8,
  padding: 16,
};

const textareaBase: React.CSSProperties = {
  background: "#0d1117",
  border: "1px solid #30363d",
  borderRadius: 4,
  padding: 12,
  color: "#c9d1d9",
  fontSize: 12,
  width: "100%",
  maxHeight: 300,
  minHeight: 120,
  margin: "8px 0",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontFamily: "monospace",
  resize: "vertical",
  boxSizing: "border-box",
  display: "block",
};

const btn: React.CSSProperties = {
  background: "#238636",
  color: "#f0f6fc",
  border: "none",
  borderRadius: 6,
  padding: "6px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  background: "#21262d",
  color: "#f0f6fc",
  border: "1px solid #30363d",
  borderRadius: 6,
  padding: "6px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  marginRight: 8,
};

export function ManifestForm() {
  const { data, isLoading, error } = useManifest();
  const install = useInstall();
  const saveManifest = useSaveManifest();

  const [text, setText] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);

  // Sync textarea with fetched data (only on initial load or when data changes from server)
  useEffect(() => {
    if (data !== undefined) {
      setText(JSON.stringify(data, null, 2));
      setParseError(null);
    }
  }, [data]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setText(val);
    try {
      JSON.parse(val);
      setParseError(null);
    } catch {
      setParseError("Invalid JSON");
    }
  }

  function handleSave() {
    if (parseError) return;
    try {
      const parsed = JSON.parse(text);
      saveManifest.mutate(parsed);
    } catch {
      setParseError("Invalid JSON");
    }
  }

  if (isLoading) return <div style={{ color: "#8b949e" }}>Loading manifest...</div>;
  if (error) return <div style={{ color: "#f85149" }}>Error loading manifest.</div>;

  const isInvalid = !!parseError;

  return (
    <div style={card}>
      <h4 style={{ margin: "0 0 4px", color: "#f0f6fc", fontSize: 14 }}>Manifest</h4>
      <textarea
        style={{
          ...textareaBase,
          border: isInvalid ? "1px solid #f85149" : "1px solid #30363d",
          outline: "none",
        }}
        value={text}
        onChange={handleChange}
        spellCheck={false}
      />
      {parseError && (
        <div style={{ color: "#f85149", fontSize: 12, marginBottom: 6 }}>{parseError}</div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <button
          style={{
            ...btnSecondary,
            opacity: saveManifest.isPending || isInvalid ? 0.6 : 1,
            marginRight: 0,
          }}
          disabled={saveManifest.isPending || isInvalid}
          onClick={handleSave}
        >
          {saveManifest.isPending ? "Saving..." : "Save"}
        </button>
        <button
          style={{
            ...btn,
            opacity: install.isPending ? 0.6 : 1,
          }}
          disabled={install.isPending}
          onClick={() => install.mutate({})}
        >
          {install.isPending ? "Installing..." : "Install"}
        </button>
      </div>
      {saveManifest.isError && (
        <div style={{ color: "#f85149", fontSize: 12, marginTop: 6 }}>
          Save failed: {String(saveManifest.error)}
        </div>
      )}
      {saveManifest.isSuccess && (
        <div style={{ color: "#3fb950", fontSize: 12, marginTop: 6 }}>Manifest saved.</div>
      )}
      {install.isError && (
        <div style={{ color: "#f85149", fontSize: 12, marginTop: 6 }}>
          Install failed: {String(install.error)}
        </div>
      )}
      {install.isSuccess && (
        <div style={{ color: "#3fb950", fontSize: 12, marginTop: 6 }}>Install complete.</div>
      )}
    </div>
  );
}
