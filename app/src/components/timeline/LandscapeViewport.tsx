import React from "react";
import { clusters, AtlasConnection } from "../../lib/atlasData";
import { TimelineState } from "../../lib/timelineUtils";

interface LandscapeViewportProps {
  currentState: TimelineState;
  finalState: TimelineState;
}

export function LandscapeViewport({ currentState, finalState }: LandscapeViewportProps) {
  return (
    <div className="timeline-viewport">
      <div className="viewport-canvas">
        {/* Render Ghost Nodes (Final State) for spatial context */}
        {clusters.map((cluster) => {
          if (!finalState.activeClusters[cluster.id]) return null;
          
          const [x, y] = cluster.centroid;
          const finalSize = Math.min(60 + finalState.activeClusters[cluster.id].weight * 25, 180);
          
          return (
            <div 
              key={`ghost-${cluster.id}`} 
              className="tl-ghost-node"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${finalSize}px`,
                height: `${finalSize}px`,
              }}
            >
              <span className="tl-ghost-label">{cluster.label}</span>
            </div>
          );
        })}

        {/* Render Connections */}
        <svg className="tl-connection" viewBox="0 0 1000 700" preserveAspectRatio="none">
          {Object.entries(currentState.connections).map(([pairStr, connData]) => {
            const [c1Id, c2Id] = pairStr.split("|");
            const c1 = clusters.find(c => c.id === c1Id);
            const c2 = clusters.find(c => c.id === c2Id);
            if (!c1 || !c2) return null;

            // Base SVG coordinates are 1000x700
            const x1 = (c1.centroid[0] / 100) * 1000;
            const y1 = (c1.centroid[1] / 100) * 700;
            const x2 = (c2.centroid[0] / 100) * 1000;
            const y2 = (c2.centroid[1] / 100) * 700;

            // Simple bezier curve for aesthetics
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2 - 50; 

            return (
              <path
                key={pairStr}
                className="tl-connection-line"
                d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                fill="none"
                strokeWidth={1 + connData.strength * 4}
                opacity={0.3 + connData.strength * 0.7}
              />
            );
          })}
        </svg>

        {/* Render Active Nodes */}
        {clusters.map((cluster) => {
          const activeData = currentState.activeClusters[cluster.id];
          const [x, y] = cluster.centroid;
          
          // If a node isn't active yet, we scale it to 0 and make it transparent
          const scale = activeData ? 1 : 0;
          const opacity = activeData ? 1 : 0;
          const size = activeData ? Math.min(60 + activeData.weight * 25, 180) : 60;

          return (
            <div
              key={cluster.id}
              className="tl-node"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                opacity,
                transform: `translate(-50%, -50%) scale(${scale})`,
                width: `${size}px`,
                height: `${size}px`,
                ['--region-color' as string]: cluster.color,
              }}
            >
              <div className="map-hero-region-elevation" style={{ pointerEvents: 'none' }}>
                <div className="elevation-core" />
                <div className="elevation-ring-1" />
                <div className="elevation-ring-2" style={{ opacity: 0.3 }} />
              </div>
              <span className="tl-node-label">{cluster.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
