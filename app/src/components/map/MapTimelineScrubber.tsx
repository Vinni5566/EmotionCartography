import React from "react";
import { months } from "../../lib/atlasData";

interface MapTimelineScrubberProps {
  currentMonth: string;
  onChangeMonth: (month: string) => void;
}

export function MapTimelineScrubber({ currentMonth, onChangeMonth }: MapTimelineScrubberProps) {
  return (
    <div className="map-hero-timeline">
      <div className="timeline-track">
        {months.map((month, index) => {
          const isActive = month === currentMonth;
          return (
            <button 
              key={month} 
              className={`timeline-stop ${isActive ? "active" : ""}`}
              onClick={() => onChangeMonth(month)}
              aria-label={`View map for ${month}`}
            >
              <span className="stop-marker" />
              <span className="stop-label">{month}</span>
            </button>
          );
        })}
      </div>
      <div className="timeline-note">
        Filter the landscape by time. Watch regions expand and connections shift.
      </div>
    </div>
  );
}
