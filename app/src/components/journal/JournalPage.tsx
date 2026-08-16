import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useCartography } from "../../lib/store";
import { AtlasEntry } from "../../lib/atlasData";
import { WritingDesk } from "./WritingDesk";
import { JournalArchive } from "./JournalArchive";

interface JournalPageProps {
  setMode: (mode: "home" | "map" | "journal" | "reflections" | "timeline") => void;
  setFocusedEntryId: (id: string | null) => void;
}

export function JournalPage({ setMode, setFocusedEntryId }: JournalPageProps) {
  const { 
    data, addEntry, updateEntry, deleteEntry,
    draft, saveDraft, clearDraft 
  } = useCartography();
  
  const [selectedEntry, setSelectedEntry] = useState<AtlasEntry | null>(null);

  const handleNavigateToMap = (entryId: string) => {
    // If it's a real ID, focus it on the map. If it's "journal-new", focus the newest entry.
    // For now we just go to map. The focused entry logic can be picked up by MapPage.
    if (entryId !== "journal-new") {
      setFocusedEntryId(entryId);
    }
    setMode("map");
  };

  const handleCreateNew = () => {
    setSelectedEntry(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="journal-hero-wrapper">
      <div className="journal-hero-header">
        <span className="section-kicker">JOURNAL</span>
        <h2>Some thoughts become clearer<br /><em>when they have a place to live.</em></h2>
      </div>

      <WritingDesk 
        existingEntry={selectedEntry}
        entryCount={data.entries.length}
        draft={draft}
        saveDraft={saveDraft}
        clearDraft={clearDraft}
        onSaveEntry={addEntry}
        onUpdateEntry={updateEntry}
        onDeleteEntry={(id) => {
          deleteEntry(id);
          setSelectedEntry(null);
        }}
        themes={data.themes}
        onNavigateToMap={handleNavigateToMap}
      />

      <div style={{ maxWidth: "800px", width: "100%", marginTop: "120px" }}>
        {selectedEntry && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
            <button className="text-button" onClick={handleCreateNew}>
              BEGIN A NEW FIELD NOTE <ArrowUpRight size={14} />
            </button>
          </div>
        )}
        <JournalArchive 
          entries={data.entries}
          themes={data.themes}
          onSelectEntry={(entry) => {
            setSelectedEntry(entry);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}
