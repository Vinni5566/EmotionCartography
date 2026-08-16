import React, { useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { TimelineState } from "../../lib/timelineUtils";

interface TimelineScrubberProps {
  states: TimelineState[];
  currentIndex: number;
  onChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onToggleSpeed: () => void;
}

export function TimelineScrubber({
  states,
  currentIndex,
  onChange,
  isPlaying,
  onTogglePlay,
  speed,
  onToggleSpeed
}: TimelineScrubberProps) {
  
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).toUpperCase();
  };

  const currentState = states[currentIndex];
  
  // Create ticks for each month change
  const ticks: { index: number, label?: string, isMajor: boolean, percent: number }[] = [];
  let lastMonth = "";
  
  states.forEach((state, i) => {
    const d = new Date(state.date + "T00:00:00");
    const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    if (month !== lastMonth) {
      ticks.push({
        index: i,
        label: month,
        isMajor: true,
        percent: (i / (states.length - 1)) * 100
      });
      lastMonth = month;
    }
  });

  return (
    <div className="timeline-scrubber-area">
      <div className="scrubber-info">
        <div>
          <span className="scrubber-date">
            {currentState ? formatDate(currentState.date) : ""}
          </span>
        </div>
        <div className="scrubber-meta">
          <span>{currentState?.entriesUntilDate.length || 0} FIELD NOTES</span>
          <span>{Object.keys(currentState?.activeClusters || {}).length} THEMES DISCOVERED</span>
        </div>
      </div>

      <div className="scrubber-track-container">
        <div className="scrubber-track" />
        
        {/* Render Month Ticks */}
        {ticks.map(tick => (
          <div 
            key={`tick-${tick.index}`}
            className={`scrubber-tick ${tick.isMajor ? "major" : ""}`}
            style={{ left: `${tick.percent}%`, position: 'absolute' }}
          >
            {tick.label && <span className="scrubber-tick-label">{tick.label}</span>}
          </div>
        ))}

        {/* Render Milestones on track */}
        {states.flatMap((state, i) => 
          state.milestones.map(m => {
            const percent = (i / (states.length - 1)) * 100;
            return (
              <div 
                key={m.id} 
                className="tl-milestone-marker"
                style={{ left: `${percent}%` }}
              >
                <div className="tl-milestone-tooltip">
                  <span className="milestone-label">{m.label}</span>
                  <p className="milestone-desc">{m.description}</p>
                </div>
              </div>
            );
          })
        )}

        <input
          type="range"
          className="scrubber-input"
          min={0}
          max={states.length - 1}
          value={currentIndex}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Timeline Scrubber"
        />
      </div>

      <div className="playback-controls">
        <button 
          className="speed-btn" 
          onClick={onToggleSpeed}
          aria-label={`Playback speed ${speed}x`}
        >
          {speed}× SPEED
        </button>
        <button 
          className="play-btn" 
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause timeline" : "Play timeline"}
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" style={{ marginLeft: "2px" }}/>}
        </button>
        <button 
          className="speed-btn" 
          onClick={() => onChange(states.length - 1)}
          aria-label="Jump to current landscape"
        >
          JUMP TO PRESENT
        </button>
      </div>
    </div>
  );
}
