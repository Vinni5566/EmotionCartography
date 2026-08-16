import React, { useState } from "react";
import { useCartography } from "../../lib/store";
import { AtlasEntry, AtlasReflection, clusters } from "../../lib/atlasData";
import { ThreadIndex } from "./ThreadIndex";
import { ThreadExplorer } from "./ThreadExplorer";
import "../../reflections.css";

type Mode = "home" | "map" | "journal" | "reflections" | "timeline";

interface ReflectionsPageProps {
  setMode: (mode: Mode) => void;
  setFocusedEntryId: (id: string | null) => void;
  setFocusedClusterId: (id: string | null) => void;
  onOpenEntry: (entry: AtlasEntry) => void;
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-kicker">
      <span className="kicker-rule" />
      {children}
    </div>
  );
}

export function ReflectionsPage({ setMode, setFocusedEntryId, setFocusedClusterId, onOpenEntry }: ReflectionsPageProps) {
  const { data, addEntry, updateReflection } = useCartography();
  const [activeThread, setActiveThread] = useState<AtlasReflection | null>(null);
  const [filter, setFilter] = useState("ALL");

  // User responses — tracked from entries added as notes
  const responseEntries = data.entries.filter(e => e.id.startsWith("reflection-response-"));

  const handleExplore = (r: AtlasReflection) => {
    setActiveThread(r);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setActiveThread(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleSaved = (id: string) => {
    const r = data.reflections.find(r => r.id === id);
    if (!r) return;
    updateReflection(id, { saved: !r.saved });
  };

  const handleHide = (id: string) => {
    updateReflection(id, { hidden: true });
  };

  const handleSaveResponse = (reflectionId: string, responseText: string) => {
    const reflection = data.reflections.find(r => r.id === reflectionId);
    if (!reflection) return;

    const themes = reflection.themeIds.map(id => clusters.find(c => c.id === id) ?? clusters[0]);
    const responseEntry: AtlasEntry = {
      id: `reflection-response-${Date.now()}`,
      text: responseText,
      date: new Date().toISOString().slice(0, 10),
      clusterId: reflection.themeIds[0] ?? "expectations",
      language: "English",
      embedding: [0.5, 0.5, 0.5],
      tags: ["reflection", ...reflection.themeIds],
      createdAt: new Date().toISOString(),
    };
    addEntry(responseEntry);
    updateReflection(reflectionId, { userResponseId: responseEntry.id });
  };

  const handleViewOnMap = (clusterId: string) => {
    setFocusedClusterId(clusterId);
    setMode("map");
  };

  const handleOpenNote = (entry: AtlasEntry) => {
    onOpenEntry(entry);
    setMode("journal");
  };

  // Merge stored reflections; ensure they have the right shape
  const reflections = data.reflections ?? [];

  return (
    <div className="reflections-wrapper">
      {/* Header */}
      <header className="reflections-hero-header">
        <SectionKicker>THE OBSERVATION DESK</SectionKicker>
        <h1>Some threads only<br /><em>become visible</em></h1>
        <p className="reflections-tagline">
          when you step back.
        </p>
      </header>

      {/* Main content */}
      {activeThread ? (
        <ThreadExplorer
          reflection={activeThread}
          entries={data.entries}
          onBack={handleBack}
          onOpenNote={handleOpenNote}
          onViewOnMap={handleViewOnMap}
          onSaveResponse={handleSaveResponse}
          onToggleSaved={handleToggleSaved}
        />
      ) : (
        <ThreadIndex
          reflections={reflections}
          entries={data.entries}
          filter={filter}
          setFilter={setFilter}
          onExplore={handleExplore}
          onToggleSaved={handleToggleSaved}
          onHide={handleHide}
        />
      )}

      {/* User reflections archive */}
      {!activeThread && responseEntries.length > 0 && (
        <div className="reflections-archive">
          <span className="archive-section-label">MY REFLECTIONS</span>
          <div className="reflection-archive-list">
            {[...responseEntries]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(entry => {
                const threadLabel = (entry.tags ?? [])
                  .filter(t => t !== "reflection")
                  .map(id => clusters.find(c => c.id === id)?.label ?? id)
                  .join(" ↔ ");

                return (
                  <div key={entry.id} className="reflection-archive-item">
                    <span className="archive-item-date">
                      {new Date(entry.date + "T00:00:00").toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric"
                      }).toUpperCase()}
                    </span>
                    {threadLabel && (
                      <span className="archive-item-thread">{threadLabel}</span>
                    )}
                    <p className="archive-item-text">"{entry.text}"</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Privacy note */}
      <p className="reflections-privacy">
        LOCAL ARCHIVE · Your field notes are stored locally on this device in this prototype.
      </p>
    </div>
  );
}
