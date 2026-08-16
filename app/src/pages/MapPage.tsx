import React, { useState, useMemo } from "react";
import { Plus, Search, Layers3 } from "lucide-react";
import { useCartography } from "../lib/store";
import { AtlasEntry } from "../lib/atlasData";
import { MapCanvas } from "../components/map/MapCanvas";
import { MapRegion } from "../components/map/MapRegion";
import { MapConnectionPath } from "../components/map/MapConnectionPath";
import { MapEntryPoint } from "../components/map/MapEntryPoint";
import { MapTimelineScrubber } from "../components/map/MapTimelineScrubber";
import { RegionPanel } from "../components/map/RegionPanel";
import { FieldNoteModal } from "../components/map/FieldNoteModal";
import { MapListView } from "../components/map/MapListView";
import { analyzeEntry } from "../lib/semanticEngine";

interface MapPageProps {
  focusedEntryId?: string | null;
  focusedClusterId?: string | null;
}

export function MapPage({ focusedEntryId, focusedClusterId }: MapPageProps) {
  const { data, addEntry, deleteEntry, updateTheme, addConnection, resetCartography, isCustomized } = useCartography();
  const [zoom, setZoom] = useState(1);
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null);
  const [hoverRegionId, setHoverRegionId] = useState<string | null>(null);
  const [hoverConnectionId, setHoverConnectionId] = useState<string | null>(null);
  const [hoverEntryId, setHoverEntryId] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<AtlasEntry | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isListView, setIsListView] = useState(false);
  
  // Timeline
  const [currentMonth, setCurrentMonth] = useState("JAN");

  // Handle focused entry routing (from Journal)
  React.useEffect(() => {
    if (focusedEntryId && data) {
      const entry = data.entries.find(e => e.id === focusedEntryId);
      if (entry) {
        setActiveRegionId(entry.clusterId);
      }
    }
  }, [focusedEntryId, data]);

  // Handle focused cluster routing (from Reflections)
  React.useEffect(() => {
    if (focusedClusterId) {
      setActiveRegionId(focusedClusterId);
    }
  }, [focusedClusterId]);

  // Add field note
  const handleAddNote = async (text: string) => {
    const analysis = await analyzeEntry(text);
    const newEntry: AtlasEntry = {
      id: `journal-${Date.now()}`,
      text,
      date: new Date().toISOString().slice(0, 10),
      clusterId: analysis.clusterId,
      language: analysis.language,
      embedding: analysis.embedding
    };
    
    addEntry(newEntry);
    setActiveRegionId(analysis.clusterId); // Focus the region
  };

  const visibleEntries = useMemo(() => {
    // Basic timeline filter implementation (stub, currently shows all or filters based on month)
    // For now, we will show all but we could filter `data.entries` by month string if we parsed it.
    return data.entries;
  }, [data.entries, currentMonth]);

  const activeFocusId = hoverRegionId || activeRegionId;

  return (
    <div className="map-hero-wrapper">
      <div className="map-hero-header">
        <div className="map-hero-header-spacer" />
        <div className="map-hero-title">
          <span className="section-kicker">THE LIVING MAP</span>
          <h2>What keeps<br /><em>returning.</em></h2>
        </div>
        <div className="map-hero-actions">
          {isCustomized && (
            <button 
              className="list-toggle text-button" 
              onClick={() => {
                if (window.confirm("Are you sure you want to reset the map to the default state?")) {
                  resetCartography();
                }
              }}
              style={{ color: "#8c978e" }}
            >
              Reset Map
            </button>
          )}
          <button className="list-toggle text-button" onClick={() => setIsListView(!isListView)}>
            {isListView ? "View Map" : "List View"}
          </button>
          <button className="engraved-button primary" onClick={() => setIsAddingNote(true)}>
            <Plus size={15} /> ADD FIELD NOTE
          </button>
        </div>
      </div>

      {isListView ? (
        <MapListView 
          themes={data.themes} 
          entries={visibleEntries} 
          onEntrySelect={setSelectedEntry} 
          onEntryDelete={deleteEntry}
        />
      ) : (
        <div className="map-hero-main">
          <MapCanvas zoom={zoom} setZoom={setZoom}>
            {/* Connections */}
            <svg className="map-hero-routes" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", width: "100%", height: "100%", overflow: "visible" }}>
              {data.connections.map(conn => {
                const connId = `${conn.sourceClusterId}-${conn.targetClusterId}`;
                return (
                  <MapConnectionPath
                    key={connId}
                    connection={conn}
                    isActive={hoverConnectionId === connId}
                    isHovered={hoverConnectionId === connId}
                    onHoverStart={() => setHoverConnectionId(connId)}
                    onHoverEnd={() => setHoverConnectionId(null)}
                  />
                );
              })}
            </svg>

            {/* Regions */}
            {data.themes.map(theme => (
              <MapRegion
                key={theme.id}
                cluster={theme}
                isActive={activeFocusId === theme.id}
                isDimmed={activeFocusId !== null && activeFocusId !== theme.id}
                entryCount={visibleEntries.filter(e => e.clusterId === theme.id).length}
                onClick={() => setActiveRegionId(theme.id)}
                onHoverStart={() => setHoverRegionId(theme.id)}
                onHoverEnd={() => setHoverRegionId(null)}
              />
            ))}

            {/* Entries */}
            {visibleEntries.map(entry => {
              const cluster = data.themes.find(t => t.id === entry.clusterId);
              if (!cluster) return null;
              
              const isRegionFocused = activeFocusId === entry.clusterId;
              const isDimmed = activeFocusId !== null && !isRegionFocused;

              return (
                <MapEntryPoint
                  key={entry.id}
                  entry={entry}
                  cluster={cluster}
                  isActive={isRegionFocused}
                  isHovered={hoverEntryId === entry.id}
                  isDimmed={isDimmed}
                  onHoverStart={() => setHoverEntryId(entry.id)}
                  onHoverEnd={() => setHoverEntryId(null)}
                  onClick={() => setSelectedEntry(entry)}
                />
              );
            })}
          </MapCanvas>
          
          {/* Region Panel */}
          {activeRegionId && (
            <RegionPanel 
              region={data.themes.find(t => t.id === activeRegionId)!}
              entries={data.entries.filter(e => e.clusterId === activeRegionId)}
              onClose={() => setActiveRegionId(null)}
              onEntrySelect={setSelectedEntry}
              onEntryDelete={deleteEntry}
            />
          )}

          <MapTimelineScrubber currentMonth={currentMonth} onChangeMonth={setCurrentMonth} />
        </div>
      )}

      {/* Field Note Modal */}
      {isAddingNote && (
        <FieldNoteModal 
          onClose={() => setIsAddingNote(false)} 
          onSubmit={handleAddNote} 
        />
      )}

      {/* Individual Entry Drawer / Popup (Stub from original Home.tsx) */}
      {selectedEntry && (
        <div className="map-hero-entry-tooltip">
          <div className="tooltip-date">{new Date(selectedEntry.date).toLocaleDateString()}</div>
          <p>"{selectedEntry.text}"</p>
          <button onClick={() => setSelectedEntry(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
