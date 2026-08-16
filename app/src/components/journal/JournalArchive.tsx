import React, { useState, useMemo } from "react";
import { AtlasEntry, AtlasCluster } from "../../lib/atlasData";
import { Search } from "lucide-react";

interface JournalArchiveProps {
  entries: AtlasEntry[];
  themes: AtlasCluster[];
  onSelectEntry: (entry: AtlasEntry) => void;
}

export function JournalArchive({ entries, themes, onSelectEntry }: JournalArchiveProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filteredEntries = useMemo(() => {
    let result = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (filter === "BOOKMARKED") {
      result = result.filter(e => e.bookmarked);
    } else if (filter !== "ALL") {
      result = result.filter(e => e.clusterId === filter || e.tags?.includes(filter));
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(e => e.text.toLowerCase().includes(s));
    }

    return result;
  }, [entries, filter, search]);

  return (
    <div className="journal-archive">
      <div className="archive-header">
        <span className="archive-count">{filteredEntries.length} FIELD NOTES</span>
        <div className="archive-search-container">
          <Search size={14} color="#8c978e" />
          <input 
            type="text" 
            placeholder="Search the archive..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="archive-filters">
        <button 
          className={`archive-filter-btn ${filter === "ALL" ? "active" : ""}`}
          onClick={() => setFilter("ALL")}
        >
          ALL
        </button>
        <button 
          className={`archive-filter-btn ${filter === "BOOKMARKED" ? "active" : ""}`}
          onClick={() => setFilter("BOOKMARKED")}
        >
          BOOKMARKED
        </button>
        {themes.map(t => (
          <button 
            key={t.id}
            className={`archive-filter-btn ${filter === t.id ? "active" : ""}`}
            onClick={() => setFilter(t.id)}
          >
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="archive-list">
        {filteredEntries.map(entry => {
          const theme = themes.find(t => t.id === entry.clusterId);
          return (
            <div 
              key={entry.id} 
              className="archive-item"
              onClick={() => onSelectEntry(entry)}
            >
              <div className="archive-item-meta">
                <span>{new Date(entry.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()}</span>
                {entry.bookmarked && <span style={{ color: "var(--terracotta)" }}>★</span>}
              </div>
              <p>"{entry.text}"</p>
              <div className="archive-item-themes">
                {theme?.label} {entry.tags?.map(tag => ` · ${tag.toUpperCase()}`)}
              </div>
            </div>
          );
        })}
        {filteredEntries.length === 0 && (
          <div className="archive-item" style={{ textAlign: "center", fontStyle: "italic", color: "#8c978e" }}>
            The page is waiting. Somewhere, the first mark begins.
          </div>
        )}
      </div>
    </div>
  );
}
