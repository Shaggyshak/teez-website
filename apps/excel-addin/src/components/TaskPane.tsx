import { useState } from "react";
import type { AssetType } from "@teez/shared";

type View = "upload" | "analyzing" | "results" | "chat";

export function TaskPane() {
  const [view, setView] = useState<View>("upload");
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>("multifamily");

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Teez AI</h1>
        <span style={styles.badge}>Beta</span>
      </header>

      {view === "upload" && (
        <UploadView
          assetType={selectedAssetType}
          onAssetTypeChange={setSelectedAssetType}
          onUpload={() => setView("analyzing")}
        />
      )}

      {view === "analyzing" && (
        <AnalyzingView onComplete={() => setView("results")} />
      )}

      {view === "results" && (
        <ResultsView
          onChat={() => setView("chat")}
          onNewDeal={() => setView("upload")}
        />
      )}

      {view === "chat" && (
        <ChatView onBack={() => setView("results")} />
      )}
    </div>
  );
}

function UploadView({
  assetType,
  onAssetTypeChange,
  onUpload,
}: {
  assetType: AssetType;
  onAssetTypeChange: (t: AssetType) => void;
  onUpload: () => void;
}) {
  const assetTypes: { value: AssetType; label: string }[] = [
    { value: "multifamily", label: "Multifamily" },
    { value: "industrial", label: "Industrial" },
    { value: "retail", label: "Retail" },
    { value: "mixed-use", label: "Mixed-Use" },
    { value: "office", label: "Office" },
  ];

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>New Deal</h2>

      <label style={styles.label}>Asset Type</label>
      <select
        value={assetType}
        onChange={(e) => onAssetTypeChange(e.target.value as AssetType)}
        style={styles.select}
      >
        {assetTypes.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <label style={styles.label}>Upload Documents</label>
      <div style={styles.dropzone}>
        <p style={styles.dropzoneText}>
          Drop rent roll, T-12, or OM here
        </p>
        <p style={styles.dropzoneHint}>PDF, CSV, or Excel files</p>
        <input
          type="file"
          accept=".pdf,.csv,.xlsx,.xls"
          multiple
          style={styles.fileInput}
          onChange={() => {
            // TODO: Handle file upload
            onUpload();
          }}
        />
      </div>

      <button style={styles.primaryButton} onClick={onUpload}>
        Analyze Documents
      </button>
    </div>
  );
}

function AnalyzingView({ onComplete }: { onComplete: () => void }) {
  // TODO: Replace with real progress tracking
  setTimeout(onComplete, 3000);

  return (
    <div style={{ ...styles.section, textAlign: "center" as const }}>
      <div style={styles.spinner} />
      <h2 style={styles.sectionTitle}>Analyzing Documents...</h2>
      <p style={styles.hint}>
        Extracting rent roll data, validating figures, and generating pro-forma
        projections.
      </p>
    </div>
  );
}

function ResultsView({
  onChat,
  onNewDeal,
}: {
  onChat: () => void;
  onNewDeal: () => void;
}) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Analysis Complete</h2>

      <div style={styles.metricGrid}>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>IRR</span>
          <span style={styles.metricValue}>18.4%</span>
        </div>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>Cash-on-Cash</span>
          <span style={styles.metricValue}>8.2%</span>
        </div>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>Cap Rate</span>
          <span style={styles.metricValue}>6.1%</span>
        </div>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>Equity Multiple</span>
          <span style={styles.metricValue}>2.1x</span>
        </div>
      </div>

      <div style={styles.riskFlag}>
        <strong>Risk Flag:</strong> 3 units 15%+ below market rent — potential
        upside on renewal.
      </div>

      <p style={styles.hint}>
        Pro-forma has been populated in your active worksheet.
      </p>

      <button style={styles.primaryButton} onClick={onChat}>
        Ask a Question
      </button>
      <button style={styles.secondaryButton} onClick={onNewDeal}>
        New Deal
      </button>
    </div>
  );
}

function ChatView({ onBack }: { onBack: () => void }) {
  const [message, setMessage] = useState("");

  return (
    <div style={styles.section}>
      <button style={styles.backButton} onClick={onBack}>
        ← Back to Results
      </button>
      <h2 style={styles.sectionTitle}>Sensitivity Analysis</h2>

      <div style={styles.chatMessages}>
        <div style={styles.aiMessage}>
          What would you like to explore? Try: &quot;What&apos;s the IRR if
          vacancy increases 2%?&quot;
        </div>
      </div>

      <div style={styles.chatInput}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about the deal..."
          style={styles.textInput}
        />
        <button style={styles.sendButton}>→</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    background: "#0c1117",
    color: "#e2e8f0",
    minHeight: "100vh",
    padding: 16,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: "1px solid #1e293b",
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: "#4ade80",
    margin: 0,
  },
  badge: {
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 100,
    background: "rgba(74,222,128,0.15)",
    color: "#4ade80",
    border: "1px solid rgba(74,222,128,0.2)",
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 16,
    marginTop: 0,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#94a3b8",
    marginBottom: 6,
    marginTop: 16,
  },
  select: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #1e293b",
    background: "#141b23",
    color: "#e2e8f0",
    fontSize: 14,
  },
  dropzone: {
    border: "2px dashed #1e293b",
    borderRadius: 12,
    padding: 32,
    textAlign: "center" as const,
    position: "relative" as const,
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  dropzoneText: { fontSize: 14, color: "#94a3b8", margin: "0 0 4px" },
  dropzoneHint: { fontSize: 12, color: "#64748b", margin: 0 },
  fileInput: {
    position: "absolute" as const,
    inset: 0,
    opacity: 0,
    cursor: "pointer",
  },
  primaryButton: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #22c55e, #4ade80)",
    color: "#0c1117",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 16,
  },
  secondaryButton: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: 8,
    border: "1px solid #1e293b",
    background: "transparent",
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    background: "#141b23",
    border: "1px solid #1e293b",
    borderRadius: 8,
    padding: 12,
    textAlign: "center" as const,
  },
  metricLabel: {
    display: "block",
    fontSize: 11,
    color: "#64748b",
    marginBottom: 4,
  },
  metricValue: {
    display: "block",
    fontSize: 20,
    fontWeight: 800,
    color: "#4ade80",
  },
  riskFlag: {
    background: "rgba(251,191,36,0.1)",
    border: "1px solid rgba(251,191,36,0.2)",
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: "#fbbf24",
    marginBottom: 16,
  },
  hint: { fontSize: 13, color: "#64748b", marginTop: 8 },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #1e293b",
    borderTop: "3px solid #4ade80",
    borderRadius: "50%",
    margin: "0 auto 16px",
    animation: "spin 1s linear infinite",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: 13,
    cursor: "pointer",
    padding: 0,
    marginBottom: 12,
  },
  chatMessages: { marginBottom: 16, minHeight: 100 },
  aiMessage: {
    background: "#141b23",
    border: "1px solid #1e293b",
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: "#94a3b8",
  },
  chatInput: { display: "flex", gap: 8 },
  textInput: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #1e293b",
    background: "#141b23",
    color: "#e2e8f0",
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #22c55e, #4ade80)",
    color: "#0c1117",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
};
