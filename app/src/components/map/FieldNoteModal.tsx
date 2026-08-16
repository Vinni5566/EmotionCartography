import React, { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";

interface FieldNoteModalProps {
  onClose: () => void;
  onSubmit: (text: string) => Promise<void>;
}

export function FieldNoteModal({ onClose, onSubmit }: FieldNoteModalProps) {
  const [text, setText] = useState("");
  const [stage, setStage] = useState<"idle" | "tracing" | "mapped">("idle");
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setStage("tracing");
    await onSubmit(text);
    setStage("mapped");
    // Close automatically after a brief moment to show "mapped" state
    setTimeout(onClose, 1200);
  };

  return (
    <div className="field-note-modal-overlay">
      <div className="field-note-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <span className="modal-kicker">FIELD NOTE</span>
          <button onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-meta">
            <span>{date}</span>
            <span>UNMAPPED TERRITORY</span>
          </div>
          
          <textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Begin with a sentence..."
            disabled={stage !== "idle"}
            autoFocus
          />
        </div>

        <div className="modal-footer">
          {stage === "idle" && (
            <button className="engraved-button primary" onClick={handleSubmit} disabled={!text.trim()}>
              MAP THIS ENTRY <ArrowUpRight size={16} />
            </button>
          )}
          {stage === "tracing" && (
            <div className="tracing-state">
              <span className="tracing-spinner" />
              tracing the thread...
            </div>
          )}
          {stage === "mapped" && (
            <div className="mapped-state">
              The landscape shifted.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
