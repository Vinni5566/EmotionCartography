import React from "react";
import { AtlasCluster, AtlasEntry } from "../../lib/atlasData";

interface MapListViewProps {
  themes: AtlasCluster[];
  entries: AtlasEntry[];
  onEntrySelect: (entry: AtlasEntry) => void;
  onEntryDelete: (id: string) => void;
}

export function MapListView({ themes, entries, onEntrySelect, onEntryDelete }: MapListViewProps) {
  return (
    <div className="map-hero-list-view">
      <div className="list-view-header">
        <span className="section-kicker">NON-VISUAL INDEX</span>
        <h2>The atlas, readable.</h2>
      </div>

      <div className="list-view-content">
        {themes.map(theme => {
          const themeEntries = entries.filter(e => e.clusterId === theme.id);
          if (themeEntries.length === 0) return null;

          return (
            <details key={theme.id} className="list-view-theme">
              <summary>
                <div className="theme-summary">
                  <span className="theme-color-dot" style={{ backgroundColor: theme.color }} />
                  <h3>{theme.label}</h3>
                  <span className="theme-count">{themeEntries.length} entries</span>
                </div>
                <p className="theme-interpretation">{theme.interpretation}</p>
              </summary>
              <ul className="theme-entries">
                {themeEntries.map(entry => (
                  <li key={entry.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                    <button onClick={() => onEntrySelect(entry)} style={{ flex: 1, textAlign: "left" }}>
                      <span className="entry-date">{new Date(entry.date).toLocaleDateString()}</span>
                      <span className="entry-text">"{entry.text}"</span>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEntryDelete(entry.id); }}
                      style={{ background: "none", border: "none", color: "#8c978e", cursor: "pointer", padding: "4px", marginTop: "4px" }}
                      aria-label="Delete entry"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </div>
  );
}
