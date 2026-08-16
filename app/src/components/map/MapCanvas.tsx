import React, { ReactNode } from "react";
import { Compass, Crosshair, Minus, Plus } from "lucide-react";
import { useCartography } from "../../lib/store";

interface MapCanvasProps {
  children: ReactNode;
  zoom: number;
  setZoom: (zoom: number) => void;
}

export function MapCanvas({ children, zoom, setZoom }: MapCanvasProps) {
  const { data } = useCartography();

  return (
    <div className="map-hero-canvas-container">
      {/* Map Controls */}
      <div className="map-hero-controls">
        <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} aria-label="Zoom out">
          <Minus size={15} />
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} aria-label="Zoom in">
          <Plus size={15} />
        </button>
        <button onClick={() => setZoom(1)} aria-label="Reset view">
          <Crosshair size={15} />
        </button>
      </div>

      {/* The actual canvas with transformations */}
      <div 
        className="map-hero-canvas" 
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Ambient atmospheric texture overlay */}
        <div className="map-hero-atmosphere" />
        
        {/* Subtle contour lines (archival cartography style) */}
        <svg className="map-hero-contours" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
          {[100, 200, 300, 400, 500, 600].map((y) => (
            <path key={y} d={`M-50 ${y} C 150 ${y - 120}, 250 ${y + 110}, 450 ${y} S 750 ${y - 130}, 1050 ${y + 30}`} />
          ))}
        </svg>

        {/* Dynamic child elements (regions, points, connections) */}
        <div className="map-hero-elements">
          {children}
        </div>
      </div>

      {/* Cartographic compass and metadata */}
      <div className="map-hero-compass">
        <Compass size={32} />
        <span>N</span>
      </div>
      <div className="map-hero-scale">
        0 &nbsp;&nbsp;&nbsp;&nbsp; 20 &nbsp;&nbsp;&nbsp;&nbsp; 40 km
      </div>
    </div>
  );
}
