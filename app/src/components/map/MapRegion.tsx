import React from "react";
import { AtlasCluster } from "../../lib/atlasData";

interface MapRegionProps {
  cluster: AtlasCluster;
  isActive: boolean;
  isDimmed: boolean;
  entryCount: number;
  onClick: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export function MapRegion({
  cluster,
  isActive,
  isDimmed,
  entryCount,
  onClick,
  onHoverStart,
  onHoverEnd
}: MapRegionProps) {
  const [x, y] = cluster.centroid;
  
  // Base sizing logic on importance (e.g. expectations might be a larger region)
  const baseSize = cluster.id === "expectations" ? 140 : 100;
  
  return (
    <button
      className={`map-hero-region ${isActive ? "active" : ""} ${isDimmed ? "dimmed" : ""}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${baseSize}px`,
        height: `${baseSize}px`,
        // We use CSS variables to pass the theme color down to the abstract SVGs
        ["--region-color" as string]: cluster.color,
      }}
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      aria-label={`Region: ${cluster.label}`}
    >
      {/* Abstract cartographic representation instead of simple bubbles */}
      <div className="map-hero-region-elevation">
        {/* We can use CSS radial gradients + SVG filters to create an elevation map look */}
        <div className="elevation-core" />
        <div className="elevation-ring-1" />
        <div className="elevation-ring-2" />
      </div>

      <div className="map-hero-region-label">
        {cluster.label}
        <small>{entryCount} {entryCount === 1 ? 'entry' : 'entries'}</small>
      </div>
    </button>
  );
}
