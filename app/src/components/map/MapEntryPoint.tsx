import React from "react";
import { AtlasEntry, AtlasCluster } from "../../lib/atlasData";

interface MapEntryPointProps {
  entry: AtlasEntry;
  cluster: AtlasCluster;
  isActive: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

export function MapEntryPoint({
  entry,
  cluster,
  isActive,
  isHovered,
  isDimmed,
  onHoverStart,
  onHoverEnd,
  onClick
}: MapEntryPointProps) {
  const [x, y] = entry.embedding;

  // Use a hash of the ID to determine a slight random rotation and scale for organic feel
  const hash = entry.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rot = (hash % 60) - 30; // -30 to 30 deg
  const scale = 0.8 + ((hash % 40) / 100); // 0.8 to 1.2

  // Extract timestamp to determine if this was just added
  const timestampMatch = entry.id.match(/\d+/);
  const timestamp = timestampMatch ? parseInt(timestampMatch[0], 10) : 0;
  const isNew = timestamp > 0 && (Date.now() - timestamp < 15000); // 15 seconds

  return (
    <div 
      className={`map-hero-entry-point ${isActive ? "active" : ""} ${isHovered ? "hovered" : ""} ${isDimmed ? "dimmed" : ""} ${isNew ? "is-new" : ""}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
        ["--cluster-color" as string]: cluster.color
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
    >
      <div className="point-mark" />
    </div>
  );
}
