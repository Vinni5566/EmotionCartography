import React from "react";
import { AtlasCluster } from "../../lib/atlasData";

interface SemanticPreviewProps {
  isVisible: boolean;
  themes: AtlasCluster[];
}

export function SemanticPreview({ isVisible, themes }: SemanticPreviewProps) {
  return (
    <div className={`semantic-preview ${isVisible ? "visible" : ""}`}>
      <span className="semantic-preview-label">CURRENT THREADS</span>
      {themes.length > 0 ? (
        themes.map(t => (
          <div key={t.id} className="semantic-preview-theme" style={{ color: t.color }}>
            {t.label}
          </div>
        ))
      ) : (
        <span className="semantic-preview-theme" style={{ color: "#c5bb9e", fontStyle: "italic", fontSize: "14px" }}>
          Keep writing...
        </span>
      )}
    </div>
  );
}
