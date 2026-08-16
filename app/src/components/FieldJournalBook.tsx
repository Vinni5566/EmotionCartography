/* FieldJournalBook — physical field journal artifact, right-column only.
   Single creative atlas preview — no tabs, no editable UI.
   Walking girl character traverses the emotion map.
   Book opening: 3D cover rotation (no opacity fade — driven by scroll).
*/
import { useState, useEffect, useCallback } from "react";
import {
  AtlasEntry,
  clusters,
  connections,
  getCluster,
  demoEntries,
} from "@/lib/atlasData";

/* ── helpers ─────────────────────────────────────────────────────────────── */
const FLOAT_NOTES = [
  { text: "Mom asked again if I've applied.", cluster: "family" },
  { text: "I keep wondering whether I actually want this career.", cluster: "career" },
  { text: "Everyone seems to know where they're going except me.", cluster: "identity" },
  { text: "Spent the afternoon doing nothing and enjoyed it.", cluster: "rest" },
  { text: "I want a life that feels mine.", cluster: "expectations" },
  { text: "Something about the way my friends laughed made me feel like myself.", cluster: "friends" },
  { text: "The deadline passed and I survived it.", cluster: "career" },
  { text: "I keep returning to the same question.", cluster: "identity" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   WALKING GIRL CHARACTER
   ══════════════════════════════════════════════════════════════════════════ */
function WalkingGirl() {
  return (
    <div className="book-walker" aria-hidden="true">
      {/* Floating emotion trail */}
      <span className="book-walker-trail" />
      {/* Girl SVG — simple emoji-style silhouette */}
      <svg
        className="book-walker-svg"
        viewBox="0 0 22 36"
        width="22"
        height="36"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hair */}
        <ellipse cx="11" cy="4.5" rx="6.5" ry="4" fill="#2d1b2e" />
        <path d="M5 5 Q4 10 5 14" stroke="#2d1b2e" strokeWidth="2.5" fill="none" />
        <path d="M17 5 Q18 9 16 12" stroke="#2d1b2e" strokeWidth="2" fill="none" />
        {/* Face */}
        <circle cx="11" cy="7" r="5.5" fill="#f7d4b8" />
        {/* Eyes */}
        <circle cx="9" cy="6.5" r="0.8" fill="#2d1b2e" />
        <circle cx="13" cy="6.5" r="0.8" fill="#2d1b2e" />
        {/* Mouth — slight smile */}
        <path d="M9.5 9 Q11 10.2 12.5 9" stroke="#c87b6a" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        {/* Body / dress */}
        <path d="M7 13 Q11 11.5 15 13 L16 22 Q11 24 6 22 Z" fill="#b87fbf" />
        {/* Dress hem details */}
        <path d="M6 22 Q11 25 16 22" stroke="#9b62a8" strokeWidth="0.8" fill="none" />
        {/* Left arm */}
        <line x1="7" y1="14" x2="3" y2="18" stroke="#f7d4b8" strokeWidth="2" strokeLinecap="round" />
        {/* Right arm */}
        <line x1="15" y1="14" x2="19" y2="17" stroke="#f7d4b8" strokeWidth="2" strokeLinecap="round" />
        {/* Left leg */}
        <line x1="9" y1="22" x2="7.5" y2="31" stroke="#2d1b2e" strokeWidth="2" strokeLinecap="round" className="book-walker-leg-l" />
        {/* Right leg */}
        <line x1="13" y1="22" x2="14.5" y2="31" stroke="#2d1b2e" strokeWidth="2" strokeLinecap="round" className="book-walker-leg-r" />
        {/* Shoes */}
        <ellipse cx="7" cy="31.5" rx="2.5" ry="1.2" fill="#2d1b2e" />
        <ellipse cx="15" cy="31.5" rx="2.5" ry="1.2" fill="#2d1b2e" />
      </svg>
      {/* Floating emotion heart */}
      <span className="book-walker-heart">✦</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING PARTICLES
   ══════════════════════════════════════════════════════════════════════════ */
const PARTICLE_SEEDS = [
  { x: 18, y: 22, dur: 9.2, delay: 0,   r: 1.8 },
  { x: 72, y: 14, dur: 7.8, delay: 1.4, r: 1.2 },
  { x: 44, y: 58, dur: 11.1,delay: 0.7, r: 2.0 },
  { x: 29, y: 71, dur: 8.5, delay: 2.1, r: 1.5 },
  { x: 61, y: 38, dur: 10.3,delay: 3.3, r: 1.0 },
  { x: 83, y: 62, dur: 9.6, delay: 1.9, r: 1.8 },
  { x: 12, y: 47, dur: 12.0,delay: 0.5, r: 1.3 },
  { x: 56, y: 82, dur: 7.3, delay: 4.0, r: 1.6 },
];

function FloatingParticles() {
  return (
    <div className="book-particles" aria-hidden="true">
      {PARTICLE_SEEDS.map((p, i) => (
        <span
          key={i}
          className="book-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.r * 2}px`,
            height: `${p.r * 2}px`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${-p.delay * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ATLAS PREVIEW PAGE — single creative visualization (no tabs, no editing)
   ══════════════════════════════════════════════════════════════════════════ */
function AtlasPreviewPage() {
  const [noteIdx, setNoteIdx] = useState(0);
  const [noteVisible, setNoteVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setNoteVisible(false);
      setTimeout(() => {
        setNoteIdx((i) => (i + 1) % FLOAT_NOTES.length);
        setNoteVisible(true);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const note = FLOAT_NOTES[noteIdx];
  const noteCluster = getCluster(note.cluster);

  return (
    <div className="book-atlas-page">
      {/* Parchment contour lines — animated */}
      <svg
        className="book-contour book-contour-animated"
        viewBox="0 0 500 380"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {[60, 105, 155, 205, 255, 308, 355].map((y, i) => (
          <path
            key={y}
            d={`M-10 ${y}C80 ${y - 50} 160 ${y + 45} 250 ${y}S390 ${y - 55} 510 ${y + 10}`}
            style={{ animationDelay: `${i * -1.4}s` }}
          />
        ))}
      </svg>

      {/* Connection routes — animated dashes */}
      <svg
        className="book-routes"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {connections.map((conn, i) => {
          const src = getCluster(conn.sourceClusterId);
          const tgt = getCluster(conn.targetClusterId);
          const [sx, sy] = src.centroid;
          const [tx, ty] = tgt.centroid;
          const mid = [(sx + tx) / 2, (sy + ty) / 2 - 8];
          return (
            <path
              key={`${conn.sourceClusterId}-${conn.targetClusterId}`}
              className="book-route-idle"
              d={`M ${sx} ${sy} Q ${mid[0]} ${mid[1]} ${tx} ${ty}`}
              style={{ animationDelay: `${i * -2.1}s` }}
            />
          );
        })}
      </svg>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Cluster orbs — decorative, no interaction labels */}
      {clusters.map((cluster) => {
        const [x, y] = cluster.centroid;
        const sz = cluster.id === "expectations" ? 38 : 28;
        return (
          <div
            key={cluster.id}
            className="book-orb"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              ["--oc" as string]: cluster.color,
              ["--os" as string]: `${sz}px`,
            }}
          >
            <span className="book-orb-glow" />
            <span className="book-orb-ring" />
            <span className="book-orb-core" />
            <span className="book-orb-label">{cluster.label}</span>
          </div>
        );
      })}

      {/* Walking girl — traverses the map */}
      <WalkingGirl />

      {/* Floating field note fragment — rotates through entries */}
      <div
        className={`book-float-note ${noteVisible ? "book-float-note-in" : "book-float-note-out"}`}
        style={{ ["--nc" as string]: noteCluster.color }}
      >
        <span className="book-float-note-dot" />
        <p>{note.text}</p>
        <small>{noteCluster.label}</small>
      </div>

      {/* Atlas watermark */}
      <div className="book-atlas-watermark">
        <span>EMOTIONAL LANDSCAPE</span>
        <span>FIELD ATLAS · 2026</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BOOK COVER — rotates on scroll (3D, no opacity)
   ══════════════════════════════════════════════════════════════════════════ */
function BookCover({ progress }: { progress: number }) {
  // progress 0.05 → 0.55 maps to 0° → -178°
  const raw = (progress - 0.05) / 0.50;
  const t = Math.max(0, Math.min(1, raw));
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const angle = -178 * eased;

  return (
    <div
      className="book-cover"
      style={{ transform: `rotateY(${angle}deg)` }}
    >
      {/* Front face */}
      <div className="book-cover-front">
        <div className="book-cover-grid" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="book-cover-grid-line-h" style={{ top: `${14 + i * 13}%` }} />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="book-cover-grid-line-v" style={{ left: `${18 + i * 22}%` }} />
          ))}
        </div>
        <div className="book-cover-ornament" aria-hidden="true">
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.5" />
            <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            <line x1="40" y1="5" x2="40" y2="75" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1="5" y1="40" x2="75" y2="40" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <polygon points="40,8 43,37 40,75 37,37" fill="currentColor" opacity="0.7" />
            <polygon points="8,40 37,37 72,40 37,43" fill="currentColor" opacity="0.7" />
            <circle cx="40" cy="40" r="3" fill="currentColor" opacity="0.6" />
          </svg>
        </div>
        <div className="book-cover-title">
          <span className="book-cover-label">EMOTION</span>
          <span className="book-cover-label-sub">CARTOGRAPHY</span>
          <hr className="book-cover-rule" />
          <span className="book-cover-small">FIELD ATLAS</span>
          <span className="book-cover-vol">VOL. 01</span>
        </div>
        <div className="book-cover-coords">44° 18′ N · 73° 12′ W</div>
      </div>
      {/* Back face (inside of cover, shows when fully open) */}
      <div className="book-cover-back">
        <div className="book-cover-back-inner">
          <span>FIELD NOTES</span>
          <span>JAN — JUL 2026</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */
export function FieldJournalBook({ progress }: { progress: number }) {
  // Body reveals when cover passes ~90° (progress ≈ 0.30)
  // We snap the reveal at the exact point the cover face becomes invisible
  const raw = (progress - 0.05) / 0.50;
  const t = Math.max(0, Math.min(1, raw));
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const coverAngle = -178 * eased;

  // Body becomes fully visible instantly once cover has rotated past 89° — absolutely no fade
  const bodyOpacity = coverAngle < -89 ? 1 : 0;
  const isOpen = coverAngle < -89;

  return (
    <div className="book-area" aria-label="Field Journal — emotion atlas preview">
      <div className="book">
        {/* Paper thickness stack */}
        <div className="book-thickness">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="book-thickness-leaf" style={{ ["--li" as string]: i }} />
          ))}
        </div>

        {/* Back cover (always visible base) */}
        <div className="book-back-cover" />

        {/* Inner body — revealed as cover rotates past 90° */}
        <div
          className="book-body"
          style={{ opacity: bodyOpacity, pointerEvents: isOpen ? "auto" : "none" }}
          aria-hidden={!isOpen}
        >
          {/* Atlas label bar */}
          <div className="book-atlas-bar">
            <span className="book-atlas-bar-dot" />
            <span>YOUR EMOTIONAL LANDSCAPE</span>
            <span className="book-atlas-bar-entries">{demoEntries.length} ENTRIES MAPPED</span>
            <span className="book-coords">44° 18′ N</span>
          </div>

          {/* The single atlas preview page */}
          <div className="book-page-area">
            <AtlasPreviewPage />
          </div>

          {/* Status bar */}
          <div className="book-status-bar">
            <span className="book-signal" />
            <span>DEMO ARCHIVE · SYNTHETIC ENTRIES</span>
            <span className="book-coords">FIELD ATLAS · VOL. 01</span>
          </div>
        </div>

        {/* Front cover — rotates on scroll */}
        <BookCover progress={progress} />

        {/* Spine */}
        <div className="book-spine" aria-hidden="true">
          <span>EMOTION CARTOGRAPHY</span>
        </div>
      </div>

      {/* Scroll hint when closed */}
      {!isOpen && (
        <p className="book-scroll-hint" aria-live="polite">
          {progress < 0.05 ? "Scroll to open the atlas" : "Opening…"}
        </p>
      )}
    </div>
  );
}
