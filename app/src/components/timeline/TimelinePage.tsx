import React, { useState, useEffect, useMemo, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useCartography } from "../../lib/store";
import { AtlasEntry } from "../../lib/atlasData";
import { computeTimelineStates, TimelineState } from "../../lib/timelineUtils";
import { LandscapeViewport } from "./LandscapeViewport";
import { TimelineScrubber } from "./TimelineScrubber";
import "../../timeline.css";

type Mode = "home" | "map" | "journal" | "reflections" | "timeline";

interface TimelinePageProps {
  setMode: (mode: Mode) => void;
  onOpenEntry: (entry: AtlasEntry) => void;
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return <div className="section-kicker"><span className="kicker-rule" />{children}</div>;
}

export function TimelinePage({ setMode, onOpenEntry }: TimelinePageProps) {
  const { data } = useCartography();
  
  // Compute states once
  const states = useMemo(() => {
    return computeTimelineStates(data.entries);
  }, [data.entries]);

  const [currentIndex, setCurrentIndex] = useState(states.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const playRef = useRef<number | null>(null);

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      playRef.current = window.setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= states.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800 / speed); // 800ms between dates at 1x speed
    } else if (playRef.current) {
      clearInterval(playRef.current);
    }
    return () => {
      if (playRef.current) clearInterval(playRef.current);
    };
  }, [isPlaying, speed, states.length]);

  const handleTogglePlay = () => {
    if (currentIndex >= states.length - 1) {
      setCurrentIndex(0); // Restart if at end
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleSpeed = () => {
    setSpeed(s => s === 1 ? 2 : (s === 2 ? 0.5 : 1));
  };

  const currentState = states[currentIndex];
  const finalState = states[states.length - 1];

  if (!currentState) return null;

  return (
    <div className="timeline-wrapper">
      <header className="timeline-hero">
        <SectionKicker>CHRONOLOGY</SectionKicker>
        <h1>Time moves. The map <em>remembers.</em></h1>
      </header>

      <LandscapeViewport 
        currentState={currentState} 
        finalState={finalState} 
      />

      <TimelineScrubber
        states={states}
        currentIndex={currentIndex}
        onChange={(idx) => {
          setIsPlaying(false);
          setCurrentIndex(idx);
        }}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        speed={speed}
        onToggleSpeed={handleToggleSpeed}
      />
      
      {/* Field Note Previews (Floating Left) */}
      <div className="tl-field-notes-preview left-side">
        {Object.keys(currentState.activeClusters).slice(0, Math.ceil(Object.keys(currentState.activeClusters).length / 2)).map(clusterId => {
          const latestEntry = [...currentState.entriesUntilDate]
            .reverse()
            .find(e => e.clusterId === clusterId);
          if (!latestEntry) return null;
          return (
            <div key={`${clusterId}-${latestEntry.id}`} className="tl-note-card" onClick={() => onOpenEntry(latestEntry)}>
              <span className="tl-note-date">
                {new Date(latestEntry.date + "T00:00:00").toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}<br/>
                <span style={{color:'var(--forest)', letterSpacing:'0.15em'}}>{latestEntry.clusterId.toUpperCase()}</span>
              </span>
              <p className="tl-note-text">"{latestEntry.text.substring(0, 80)}{latestEntry.text.length > 80 ? '...' : ''}"</p>
              <span className="tl-note-action">OPEN FIELD NOTE <ArrowUpRight size={10} style={{display:'inline', marginBottom:'-2px'}}/></span>
            </div>
          );
        })}
      </div>

      {/* Field Note Previews (Floating Right) */}
      <div className="tl-field-notes-preview right-side">
        {Object.keys(currentState.activeClusters).slice(Math.ceil(Object.keys(currentState.activeClusters).length / 2)).map(clusterId => {
          const latestEntry = [...currentState.entriesUntilDate]
            .reverse()
            .find(e => e.clusterId === clusterId);
          if (!latestEntry) return null;
          return (
            <div key={`${clusterId}-${latestEntry.id}`} className="tl-note-card" onClick={() => onOpenEntry(latestEntry)}>
              <span className="tl-note-date">
                {new Date(latestEntry.date + "T00:00:00").toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}<br/>
                <span style={{color:'var(--forest)', letterSpacing:'0.15em'}}>{latestEntry.clusterId.toUpperCase()}</span>
              </span>
              <p className="tl-note-text">"{latestEntry.text.substring(0, 80)}{latestEntry.text.length > 80 ? '...' : ''}"</p>
              <span className="tl-note-action">OPEN FIELD NOTE <ArrowUpRight size={10} style={{display:'inline', marginBottom:'-2px'}}/></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
