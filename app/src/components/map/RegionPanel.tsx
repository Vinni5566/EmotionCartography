import React, { useState } from "react";
import { ArrowUpRight, X, Trash2 } from "lucide-react";
import { AtlasCluster, AtlasEntry } from "../../lib/atlasData";

interface RegionPanelProps {
  region: AtlasCluster;
  entries: AtlasEntry[];
  onClose: () => void;
  onEntrySelect: (entry: AtlasEntry) => void;
  onEntryDelete: (id: string) => void;
}

export function RegionPanel({ region, entries, onClose, onEntrySelect, onEntryDelete }: RegionPanelProps) {
  const [showAll, setShowAll] = useState(false);
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const visibleEntries = showAll ? sortedEntries : sortedEntries.slice(0, 5);

  return (
    <aside className="map-hero-panel">
      <div className="panel-header">
        <span className="panel-kicker" style={{ color: region.color }}>
          REGION / {region.label}
        </span>
        <button onClick={onClose} aria-label="Close panel" className="panel-close">
          <X size={18} />
        </button>
      </div>

      <div className="panel-content">
        <h2>{region.label}</h2>
        <div className="panel-stats">
          <span>{entries.length} ENTRIES</span>
          <span className="dot-divider" />
          <span>{Math.max(1, Math.floor(entries.length / 3))} THREADS</span>
        </div>

        <p className="panel-interpretation">{region.interpretation}</p>

        <div className="panel-divider" />

        <h3 className="panel-subheading">FIELD NOTES</h3>
        
        <ul className="panel-entry-list">
          {visibleEntries.map(entry => (
            <li key={entry.id}>
              <div className="entry-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span className="entry-date">{new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}</span>
                <button 
                  className="entry-delete" 
                  onClick={(e) => { e.stopPropagation(); onEntryDelete(entry.id); }}
                  aria-label="Delete entry"
                  style={{ background: "none", border: "none", color: "#8c978e", cursor: "pointer", padding: "4px" }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <p onClick={() => onEntrySelect(entry)}>"{entry.text}"</p>
            </li>
          ))}
        </ul>

        {entries.length > 5 && !showAll && (
          <button className="panel-view-all" onClick={() => setShowAll(true)}>
            VIEW ALL ENTRIES <ArrowUpRight size={14} />
          </button>
        )}
      </div>
    </aside>
  );
}
