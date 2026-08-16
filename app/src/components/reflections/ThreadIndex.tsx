import React from "react";
import { ArrowUpRight, Bookmark, EyeOff } from "lucide-react";
import { AtlasReflection, AtlasEntry, clusters } from "../../lib/atlasData";

interface ThreadIndexProps {
  reflections: AtlasReflection[];
  entries: AtlasEntry[];
  filter: string;
  setFilter: (f: string) => void;
  onExplore: (r: AtlasReflection) => void;
  onToggleSaved: (id: string) => void;
  onHide: (id: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  recurring: "RECURRING THREAD",
  theme: "SHARED THEME",
  emerging: "EMERGING THREAD",
  shift: "THREAD IN MOTION",
};

const FILTERS = ["ALL", "RECURRING", "EMERGING", "SHIFT", "SAVED"];

export function ThreadIndex({
  reflections,
  entries,
  filter,
  setFilter,
  onExplore,
  onToggleSaved,
  onHide,
}: ThreadIndexProps) {
  const visible = reflections
    .filter((r) => !r.hidden)
    .filter((r) => {
      if (filter === "ALL") return true;
      if (filter === "SAVED") return r.saved;
      return r.type.toUpperCase() === filter;
    });

  const getCluster = (id: string) =>
    clusters.find((c) => c.id === id) ?? clusters[0];

  return (
    <div className="thread-index">
      <div className="thread-filters">
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`thread-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="filter-count">
          {visible.length} THREAD{visible.length !== 1 ? "S" : ""}
        </span>
      </div>

      <div className="thread-list" role="list">
        {visible.length === 0 && (
          <div className="reflections-empty">
            <p>No threads here yet. Add more field notes and they will begin to appear.</p>
          </div>
        )}
        {visible.map((reflection, i) => {
          const themes = reflection.themeIds.map(getCluster);
          const evidenceCount = reflection.evidenceEntryIds.length;

          return (
            <div
              key={reflection.id}
              className="thread-artifact"
              role="listitem"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Quick action buttons */}
              <div className="artifact-action-btns">
                <button
                  className={`artifact-icon-btn ${reflection.saved ? "saved" : ""}`}
                  onClick={(e) => { e.stopPropagation(); onToggleSaved(reflection.id); }}
                  aria-label={reflection.saved ? "Unsave thread" : "Save thread"}
                  title={reflection.saved ? "Unsave" : "Save"}
                >
                  <Bookmark size={13} fill={reflection.saved ? "currentColor" : "none"} />
                </button>
                <button
                  className="artifact-icon-btn"
                  onClick={(e) => { e.stopPropagation(); onHide(reflection.id); }}
                  aria-label="Hide thread"
                  title="Hide"
                >
                  <EyeOff size={13} />
                </button>
              </div>

              {/* Type label */}
              <div className="thread-type-label" aria-label={`Thread type: ${TYPE_LABELS[reflection.type]}`}>
                {reflection.metadata?.entryCount && reflection.metadata.entryCount > 5
                  ? "RETURNING · "
                  : ""}
                {TYPE_LABELS[reflection.type]}
              </div>

              {/* Visual theme connection */}
              <div className="thread-visual-preview">
                {themes.map((theme, ti) => (
                  <React.Fragment key={theme.id}>
                    <span
                      className="theme-label-inline"
                      style={{ color: theme.color }}
                    >
                      {theme.label}
                    </span>
                    {ti < themes.length - 1 && (
                      <span className="thread-connection-vis" aria-hidden="true">↔</span>
                    )}
                  </React.Fragment>
                ))}
                <span className="thread-entry-count" style={{ marginLeft: "auto" }}>
                  {evidenceCount} FIELD NOTE{evidenceCount !== 1 ? "S" : ""}
                </span>
              </div>

              {/* Time span + explore */}
              <div className="thread-artifact-footer">
                {reflection.metadata?.firstSeen && reflection.metadata?.lastSeen ? (
                  <span className="thread-time-span">
                    {reflection.metadata.firstSeen}
                    <span className="time-span-line" aria-hidden="true" />
                    {reflection.metadata.lastSeen}
                  </span>
                ) : <span />}
                <button
                  className="explore-btn"
                  onClick={() => onExplore(reflection)}
                  aria-label={`Explore thread: ${themes.map(t => t.label).join(" and ")}`}
                >
                  EXPLORE THREAD <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
