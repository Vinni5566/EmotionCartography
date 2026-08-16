import React from "react";
import { AtlasConnection } from "../../lib/atlasData";

interface MapConnectionPathProps {
  connection: AtlasConnection;
  isActive: boolean;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export function MapConnectionPath({
  connection,
  isActive,
  isHovered,
  onHoverStart,
  onHoverEnd
}: MapConnectionPathProps) {
  return (
    <g 
      className={`map-hero-connection ${isActive ? "active" : ""} ${isHovered ? "hovered" : ""}`}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {/* Invisible thicker path for easier hovering */}
      <path 
        d={connection.route} 
        className="connection-hitbox"
      />
      {/* Visible cartographic path */}
      <path 
        d={connection.route} 
        className="connection-line"
        style={{
          strokeWidth: 0.5 + connection.strength * 2, // Thicker if stronger
          opacity: 0.3 + connection.strength * 0.4
        }}
      />
    </g>
  );
}
