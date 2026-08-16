import React, { useState } from "react";
import { ArrowLeft, ArrowUpRight, Bookmark, Map } from "lucide-react";
import { AtlasReflection, AtlasEntry, clusters } from "../../lib/atlasData";

interface ThreadExplorerProps {
  reflection: AtlasReflection;
  entries: AtlasEntry[];
  onBack: () => void;
  onOpenNote: (entry: AtlasEntry) => void;
  onViewOnMap: (clusterId: string) => void;
  onSaveResponse: (reflectionId: string, responseText: string) => void;
  onToggleSaved: (id: string) => void;
}

export function ThreadExplorer({
  reflection,
  entries,
  onBack,
  onOpenNote,
  onViewOnMap,
  onSaveResponse,
  onToggleSaved,
}: ThreadExplorerProps) {
  const [responseText, setResponseText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedText, setSubmittedText] = useState("");

  const evidenceEntries = reflection.evidenceEntryIds
    .map((id) => entries.find((e) => e.id === id))
    .filter(Boolean) as AtlasEntry[];

  const themes = reflection.themeIds.map(
    (id) => clusters.find((c) => c.id === id) ?? clusters[0]
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase();
  };

  const handleSubmit = () => {
    if (!responseText.trim()) return;
    setSubmittedText(responseText.trim());
    setSubmitted(true);
    onSaveResponse(reflection.id, responseText.trim());
    setResponseText("");
  };

  return (
    <div className="thread-explorer">
      {/* Nav */}
      <div className="explorer-nav">
        <button className="back-btn" onClick={onBack} aria-label="Back to all threads">
          <ArrowLeft size={13} /> ALL THREADS
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            className={`artifact-icon-btn ${reflection.saved ? "saved" : ""}`}
            onClick={() => onToggleSaved(reflection.id)}
            aria-label={reflection.saved ? "Unsave thread" : "Save thread"}
            title={reflection.saved ? "Unsave" : "Save thread"}
          >
            <Bookmark size={14} fill={reflection.saved ? "currentColor" : "none"} />
          </button>
          <span className="explorer-header-meta">
            THREAD {reflection.id.split("-")[1].padStart(2, "0")} / {reflection.type.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Visual thread connection */}
      <div className="thread-visualization" role="img" aria-label={`Thread connecting: ${themes.map(t => t.label).join(" and ")}`}>
        {themes.map((theme, i) => (
          <React.Fragment key={theme.id}>
            <div className="vis-theme-node" style={{ borderColor: theme.color }}>
              {theme.label}
            </div>
            {i < themes.length - 1 && (
              <div className="vis-connection" style={{ flex: 1 }}>
                <div className="vis-line-drawn" style={{ background: `linear-gradient(90deg, ${themes[0].color}, ${themes[1]?.color ?? themes[0].color})` }}>
                  <div className="vis-count-badge">
                    {evidenceEntries.length} SHARED FIELD NOTE{evidenceEntries.length !== 1 ? "S" : ""}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Observation */}
      <div className="observation-block">
        <span className="observation-label">THESE THEMES APPEAR TOGETHER</span>
        <p className="observation-text">{reflection.observation}</p>
      </div>

      {/* Evidence */}
      <div>
        <div className="evidence-section-header">
          FIELD NOTES / SHARED EVIDENCE
        </div>
        <div className="evidence-layer" role="list">
          {evidenceEntries.map((entry) => (
            <div key={entry.id} className="evidence-entry-item" role="listitem">
              <span className="evidence-entry-date">{formatDate(entry.date)}</span>
              <p className="evidence-entry-text">"{entry.text}"</p>
              <button
                className="open-note-btn"
                onClick={() => onOpenNote(entry)}
                aria-label="Open original field note"
              >
                OPEN FIELD NOTE →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reflection prompt */}
      <div className="reflection-prompt-block">
        <span className="prompt-label">OPEN QUESTION</span>
        <p className="prompt-question">{reflection.question}</p>
        <div className="prompt-divider" aria-hidden="true" />

        {submitted && submittedText ? (
          <div className="saved-response-display">
            <span className="saved-response-label">MY NOTE</span>
            <p className="saved-response-text">"{submittedText}"</p>
            <div className="saved-response-actions">
              <button
                className="journal-chart-btn"
                style={{ background: "transparent", border: "1px solid var(--ink)", color: "var(--ink)", fontSize: "10px", padding: "10px 20px", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                onClick={() => onViewOnMap(reflection.themeIds[0])}
              >
                <Map size={13} /> VIEW ON MAP
              </button>
              <button
                className="explore-btn"
                onClick={() => { setSubmitted(false); setSubmittedText(""); }}
                style={{ fontSize: "10px", letterSpacing: "0.15em" }}
              >
                EDIT NOTE
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="my-note-label">MY NOTE</span>
            <textarea
              className="reflection-textarea"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write what the question opens…"
              aria-label="Your reflection response"
              rows={4}
            />
            <div className="prompt-actions">
              {reflection.themeIds[0] && (
                <button
                  className="explore-btn"
                  onClick={() => onViewOnMap(reflection.themeIds[0])}
                  style={{ fontSize: "10px", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Map size={12} /> VIEW ON MAP
                </button>
              )}
              <button
                className="journal-chart-btn"
                onClick={handleSubmit}
                disabled={!responseText.trim()}
                style={{ fontSize: "10px", padding: "10px 24px", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: "6px", cursor: responseText.trim() ? "pointer" : "not-allowed", opacity: responseText.trim() ? 1 : 0.5 }}
              >
                ADD MY NOTE <ArrowUpRight size={13} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
