import React, { useState, useEffect, useCallback } from "react";
import { ArrowUpRight, Bookmark, Tag, Trash2 } from "lucide-react";
import { AtlasEntry, AtlasCluster } from "../../lib/atlasData";
import { analyzeEntry } from "../../lib/semanticEngine";
import { SemanticPreview } from "./SemanticPreview";

interface WritingDeskProps {
  existingEntry: AtlasEntry | null;
  entryCount: number;
  draft: string | null;
  saveDraft: (text: string) => void;
  clearDraft: () => void;
  onSaveEntry: (entry: AtlasEntry) => void;
  onDeleteEntry: (id: string) => void;
  onUpdateEntry: (id: string, updates: Partial<AtlasEntry>) => void;
  themes: AtlasCluster[];
  onNavigateToMap: (entryId: string) => void;
}

export function WritingDesk({
  existingEntry,
  entryCount,
  draft,
  saveDraft,
  clearDraft,
  onSaveEntry,
  onDeleteEntry,
  onUpdateEntry,
  themes,
  onNavigateToMap
}: WritingDeskProps) {
  const [text, setText] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [bookmarked, setBookmarked] = useState(false);
  const [stage, setStage] = useState<"idle" | "tracing" | "mapped">("idle");
  const [detectedThemes, setDetectedThemes] = useState<AtlasCluster[]>([]);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [createdEntryId, setCreatedEntryId] = useState<string | null>(null);

  // Initialize from existing or draft
  useEffect(() => {
    if (existingEntry) {
      setText(existingEntry.text);
      setDate(existingEntry.date);
      setBookmarked(existingEntry.bookmarked || false);
      setShowDraftPrompt(false);
      setStage("idle");
    } else if (draft && draft.trim().length > 0) {
      setShowDraftPrompt(true);
    } else {
      setText("");
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
      setBookmarked(false);
    }
  }, [existingEntry]);

  // Debounced semantic analysis for preview
  useEffect(() => {
    if (stage !== "idle" || !text.trim()) {
      setDetectedThemes([]);
      return;
    }
    const timer = setTimeout(async () => {
      const result = await analyzeEntry(text, true); // fast mode
      const theme = themes.find(t => t.id === result.clusterId);
      if (theme) setDetectedThemes([theme]);
    }, 1000);
    return () => clearTimeout(timer);
  }, [text, stage, themes]);

  // Autosave draft
  useEffect(() => {
    if (!existingEntry && text.trim() && stage === "idle") {
      const timer = setTimeout(() => {
        saveDraft(text);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [text, existingEntry, stage, saveDraft]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (showDraftPrompt) setShowDraftPrompt(false);
  };

  const handleChartEntry = async () => {
    if (!text.trim()) return;
    setStage("tracing");

    // "TRACING THE THREAD..."
    const result = await analyzeEntry(text, false); // slow mode for cinematic effect
    const finalTheme = themes.find(t => t.id === result.clusterId);
    if (finalTheme) setDetectedThemes([finalTheme]);

    setTimeout(() => {
      setStage("mapped");
      if (existingEntry) {
        onUpdateEntry(existingEntry.id, {
          text,
          date,
          bookmarked,
          clusterId: result.clusterId,
          embedding: result.embedding,
          language: result.language
        });
      } else {
        const newId = `journal-${Date.now()}`;
        const newEntry: AtlasEntry = {
          id: newId,
          text: text.trim(),
          date,
          clusterId: result.clusterId,
          language: result.language,
          embedding: result.embedding,
          bookmarked,
          createdAt: new Date().toISOString()
        };
        onSaveEntry(newEntry);
        setCreatedEntryId(newId);
        clearDraft();
      }
    }, 2000); // Give user time to see "THE LANDSCAPE SHIFTED"
  };

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="journal-desk">
      <div className={`journal-paper ${stage !== "idle" ? stage : ""}`}>
        <div className="journal-ruled-bg" />
        
        <div className="journal-metadata-bar">
          <input 
            type="date" 
            className="journal-date-input"
            value={date}
            onChange={e => setDate(e.target.value)}
            disabled={stage !== "idle"}
          />
          <span className="journal-entry-number">
            ENTRY {String(existingEntry ? entryCount : entryCount + 1).padStart(3, "0")}
          </span>
        </div>

        <textarea 
          className="journal-textarea"
          value={text}
          onChange={handleTextChange}
          placeholder="Begin with whatever is still on your mind..."
          disabled={stage !== "idle"}
        />

        <div className="journal-toolbar">
          <div className="journal-tools">
            <span style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#8c978e", alignSelf: "center", marginRight: "16px" }}>
              {wordCount} WORDS
            </span>
            <button 
              className={`journal-tool-btn ${bookmarked ? "active" : ""}`}
              onClick={() => setBookmarked(!bookmarked)}
              disabled={stage !== "idle"}
            >
              <Bookmark size={12} fill={bookmarked ? "currentColor" : "none"} /> 
              {bookmarked ? "BOOKMARKED" : "BOOKMARK"}
            </button>
            {existingEntry && (
              <button 
                className="journal-tool-btn"
                onClick={() => {
                  if (window.confirm("REMOVE THIS FIELD NOTE?")) {
                    onDeleteEntry(existingEntry.id);
                  }
                }}
                disabled={stage !== "idle"}
              >
                <Trash2 size={12} /> DELETE
              </button>
            )}
          </div>

          {stage === "idle" && (
            <div style={{ display: "flex", gap: "12px" }}>
              {existingEntry && (
                <button 
                  className="journal-chart-btn" 
                  style={{ background: "transparent", border: "1px solid var(--ink)", color: "var(--ink)" }}
                  onClick={() => onNavigateToMap(existingEntry.id)}
                >
                  VIEW ON MAP
                </button>
              )}
              <button 
                className="journal-chart-btn" 
                onClick={handleChartEntry}
                disabled={!text.trim()}
              >
                {existingEntry ? "UPDATE ENTRY" : "CHART THIS ENTRY"} <ArrowUpRight size={14} />
              </button>
            </div>
          )}
          {stage === "tracing" && (
            <button className="journal-chart-btn" disabled>
              TRACING THE THREAD...
            </button>
          )}
          {stage === "mapped" && (
            <button className="journal-chart-btn" onClick={() => onNavigateToMap(existingEntry ? existingEntry.id : (createdEntryId || `journal-new`))}>
              VIEW ON MAP <ArrowUpRight size={14} />
            </button>
          )}
        </div>

        <SemanticPreview isVisible={stage === "idle"} themes={detectedThemes} />

        {stage === "mapped" && (
          <div className="chart-sequence-overlay">
            <h3>The landscape shifted.</h3>
            <div className="chart-sequence-themes">
              {detectedThemes.map(t => (
                <span key={t.id} className="chart-sequence-theme" style={{ borderColor: t.color, color: t.color }}>
                  {t.label.toUpperCase()} +1 ENTRY
                </span>
              ))}
            </div>
            <button className="engraved-button primary" onClick={() => onNavigateToMap(existingEntry ? existingEntry.id : (createdEntryId || `journal-new`))}>
              VIEW ON MAP <ArrowUpRight size={15} />
            </button>
          </div>
        )}
      </div>

      {showDraftPrompt && draft && (
        <div className="draft-recovery">
          <span>UNSAVED DRAFT FOUND</span>
          <button onClick={() => { setText(draft); setShowDraftPrompt(false); }}>RESUME</button>
          <button className="discard" onClick={() => { clearDraft(); setShowDraftPrompt(false); }}>DISCARD</button>
        </div>
      )}
    </div>
  );
}
