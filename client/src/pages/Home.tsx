/*
  EmotionCartography / Cartographer's Field Journal
  This page treats the interface as an illustrated atlas: parchment, contour lines,
  asymmetric editorial composition, restrained motion, and a working SVG map.
*/
import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Compass, Crosshair, Layers3, Minus, Plus, Route, Search, Sparkles, X } from "lucide-react";

type Region = {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  color: string;
  size: number;
  entries: string[];
  note: string;
};

const regions: Region[] = [
  { id: "career", label: "CAREER", sublabel: "the climb", x: 25, y: 31, color: "#b97857", size: 23, entries: ["The work I want to be proud of", "A different pace", "What success costs"], note: "A highland of momentum, ambition, and the questions that follow you uphill." },
  { id: "family", label: "FAMILY", sublabel: "old roads", x: 68, y: 25, color: "#78916f", size: 27, entries: ["The rituals we inherited", "A room I return to", "Learning to stay"], note: "A green country of old paths and the stories we carry forward." },
  { id: "identity", label: "IDENTITY", sublabel: "the mirror lake", x: 78, y: 69, color: "#8981a4", size: 25, entries: ["Who I am becoming", "The version no one sees", "A name for this feeling"], note: "A reflective region where the outline of the self keeps changing with the light." },
  { id: "rest", label: "REST", sublabel: "quiet water", x: 32, y: 74, color: "#6f9e9c", size: 21, entries: ["A slower morning", "The permission to pause", "Nothing to prove"], note: "A low valley of stillness—the place your map keeps asking you to visit." },
  { id: "expectations", label: "EXPECTATIONS", sublabel: "the pass between", x: 51, y: 49, color: "#c4a05c", size: 14, entries: ["Should I?", "Their idea of me", "The route I didn't choose"], note: "A narrow pass between familiar territories, where outside voices become visible." },
];

const fragments = ["career", "family", "what if?", "home", "comparison", "tomorrow", "should I?", "enough"];

function SectionKicker({ children }: { children: React.ReactNode }) {
  return <div className="section-kicker"><span className="kicker-rule" />{children}</div>;
}

function ContourField({ dark = false }: { dark?: boolean }) {
  return <svg className={`contour-field ${dark ? "contour-field-dark" : ""}`} viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
    <path d="M-20 150C160 40 230 250 410 150S720 30 1020 170" />
    <path d="M-30 205C155 90 255 300 430 205S730 90 1030 220" />
    <path d="M-20 270C150 145 270 360 450 260S760 155 1020 285" />
    <path d="M-15 340C160 220 260 430 460 325S780 230 1020 350" />
    <path d="M-10 420C170 300 300 500 500 392S800 320 1010 420" />
    <path d="M-10 500C160 390 330 580 540 470S820 420 1010 500" />
    <path d="M-10 585C180 465 350 650 580 545S820 500 1010 580" />
  </svg>;
}

export default function Home() {
  const [selectedId, setSelectedId] = useState("expectations");
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState("");
  const [showJournal, setShowJournal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const selected = regions.find((region) => region.id === selectedId) ?? regions[4];

  const filteredRegions = useMemo(() => regions.filter((region) => {
    const value = `${region.label} ${region.sublabel} ${region.entries.join(" ")}`.toLowerCase();
    return value.includes(query.toLowerCase());
  }), [query]);

  const moveHero = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroRef.current.style.setProperty("--mouse-x", `${x * 18}px`);
    heroRef.current.style.setProperty("--mouse-y", `${y * 12}px`);
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return <main className="atlas-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="EmotionCartography home"><img src="/manus-storage/emotioncartography-mark_56df972e.png" alt="" /><span>EMOTION<br /><i>CARTOGRAPHY</i></span></a>
      <div className="topbar-meta"><span>FIELD JOURNAL / 01</span><span className="live-dot" /> <span>LIVE MAP</span></div>
      <button className="topbar-link" onClick={() => scrollTo("map")}><Compass size={15} /> Explore map <ArrowUpRight size={15} /></button>
    </header>

    <section id="top" className="hero" ref={heroRef} onMouseMove={moveHero}>
      <div className="hero-sky" /><div className="hero-mountains" /><div className="hero-landscape" /><div className="hero-foreground" />
      <div className="hero-glow" /><ContourField />
      <div className="hero-coordinates">44° 18' N &nbsp; / &nbsp; 73° 12' W<br /><span>UNMAPPED TERRITORY</span></div>
      <div className="hero-copy">
        <SectionKicker>AN ATLAS OF THE INNER WORLD</SectionKicker>
        <h1>Emotion<br /><em>Cartography</em></h1>
        <p className="hero-deck">Map the themes<br />shaping your life.</p>
        <p className="hero-body">Your journal is more than an archive.<br />It contains a landscape.</p>
        <div className="hero-actions"><button className="engraved-button primary" onClick={() => scrollTo("map")}>Explore your map <ArrowUpRight size={16} /></button><button className="text-button" onClick={() => scrollTo("how-it-works")}>How it works <ArrowDown size={15} /></button></div>
      </div>
      <div className="hero-stamp"><span>EC</span><small>OBSERVATION<br />NO. 001</small></div>
      <div className="scroll-cue"><span>SCROLL TO BEGIN</span><ArrowDown size={16} /></div>
    </section>

    <section id="how-it-works" className="fragment-section paper-section">
      <div className="section-index">01 / 04</div>
      <div className="fragment-copy"><SectionKicker>THE FIRST MARK</SectionKicker><h2>Most lives are<br /><em>felt</em> before<br />they are seen.</h2><p>We leave traces everywhere: a question repeated in three different months, a word that arrives whenever the future does. Alone, they seem scattered. Together, they begin to describe a place.</p><button className="line-button" onClick={() => setShowJournal(true)}>Open a journal page <ArrowUpRight size={15} /></button></div>
      <div className="fragment-map" aria-label="Scattered journal fragments connecting into a map">
        <ContourField />
        {fragments.map((fragment, index) => <span key={fragment} className={`fragment fragment-${index + 1}`}>{fragment}</span>)}
        <svg className="fragment-lines" viewBox="0 0 500 420" aria-hidden="true"><path d="M80 70 C170 160 180 210 250 210 S320 300 410 335" /><path d="M420 80 C325 135 290 190 250 210 S180 270 95 320" /><path d="M105 320 C210 270 280 265 410 335" /></svg>
        <div className="fragment-caption">A pattern is not a conclusion.<br /><em>It is an invitation to look closer.</em></div>
      </div>
    </section>

    <section className="transform-section ink-section">
      <div className="section-index light-index">02 / 04</div><div className="transform-copy"><SectionKicker>FROM WORDS TO TERRAIN</SectionKicker><h2>Every entry<br />leaves a <em>point.</em></h2><p>As your writing accumulates, recurring themes gather into regions. The map does not tell you what to feel. It gives the feeling somewhere to be seen.</p></div>
      <div className="process-rail"><div className="process-line" /><div className="process-step active"><span>01</span><b>ENTRIES</b><small>the raw record</small></div><div className="process-step active"><span>02</span><b>THREADS</b><small>what returns</small></div><div className="process-step active"><span>03</span><b>REGIONS</b><small>where it gathers</small></div><div className="process-step"><span>04</span><b>LANDSCAPE</b><small>what becomes visible</small></div></div>
      <div className="point-cloud" aria-hidden="true">{Array.from({ length: 36 }).map((_, i) => <i key={i} style={{ left: `${8 + ((i * 37) % 82)}%`, top: `${13 + ((i * 53) % 70)}%`, animationDelay: `${(i % 7) * 0.18}s` }} />)}</div>
      <div className="ink-note"><Sparkles size={15} /> <span>NOISE BECOMES<br /><strong>TOPOGRAPHY</strong></span></div>
    </section>

    <section id="map" className="map-section paper-section">
      <div className="map-header"><div><SectionKicker>THE LIVING MAP</SectionKicker><h2>What keeps<br /><em>returning.</em></h2></div><div className="map-intro"><p>Each region is a cluster of meaning from your journal. Select one to follow its paths and see the entries that shaped it.</p><div className="map-status"><span className="signal" /> 5 regions detected <span className="divider" /> last mapped just now</div></div></div>
      <div className="map-toolbar"><div className="search-field"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the atlas" aria-label="Search the atlas" /></div><div className="map-tools"><button title="Zoom out" onClick={() => setZoom(Math.max(0.8, zoom - 0.1))}><Minus size={15} /></button><span>{Math.round(zoom * 100)}%</span><button title="Zoom in" onClick={() => setZoom(Math.min(1.35, zoom + 0.1))}><Plus size={15} /></button><button title="Reset view" onClick={() => setZoom(1)}><Crosshair size={15} /></button></div></div>
      <div className="map-layout">
        <div className="map-canvas" style={{ ["--map-zoom" as string]: zoom }}>
          <ContourField />
          <div className="map-water water-one" /><div className="map-water water-two" />
          <div className="mountain-icon mountain-one">⌃⌃⌃</div><div className="mountain-icon mountain-two">⌃⌃⌃⌃</div><div className="forest-icon forest-one">♣ ♣ ♣</div><div className="forest-icon forest-two">♣ ♣</div>
          <svg className="map-routes" viewBox="0 0 900 560" preserveAspectRatio="none" aria-hidden="true"><path d="M90 420 C230 280 280 360 430 280 S600 110 820 140" /><path d="M220 90 C350 180 450 100 610 240 S760 390 820 460" /><path d="M430 280 C510 340 560 330 640 400" /></svg>
          {filteredRegions.map((region) => <button key={region.id} className={`region region-${region.id} ${selectedId === region.id ? "selected" : ""}`} style={{ ["--region-x" as string]: `${region.x}%`, ["--region-y" as string]: `${region.y}%`, ["--region-color" as string]: region.color, ["--region-size" as string]: `${region.size}px` }} onClick={() => setSelectedId(region.id)}><span className="region-orbit" /><span className="region-core" /><span className="region-label">{region.label}<small>{region.sublabel}</small></span></button>)}
          <div className="map-compass"><Compass size={30} /><span>N</span></div><div className="map-scale">0 &nbsp;&nbsp;&nbsp;&nbsp; 20 &nbsp;&nbsp;&nbsp;&nbsp; 40 km</div>
        </div>
        <aside className="map-detail"><div className="detail-top"><span className="detail-index">REGION / {String(regions.findIndex((r) => r.id === selected.id) + 1).padStart(2, "0")}</span><button onClick={() => setSelectedId("expectations")} aria-label="Reset selected region"><X size={16} /></button></div><div className="detail-marker" style={{ background: selected.color }} /><h3>{selected.label}</h3><p className="detail-sublabel">{selected.sublabel}</p><p className="detail-note">{selected.note}</p><div className="detail-rule" /><div className="detail-heading"><Route size={15} /> Traced entries <span>{selected.entries.length}</span></div><ul>{selected.entries.map((entry) => <li key={entry}><span />{entry}<ArrowUpRight size={13} /></li>)}</ul><button className="detail-cta" onClick={() => setShowJournal(true)}>View all entries <ArrowUpRight size={15} /></button></aside>
      </div>
    </section>

    <section className="closing-section ink-section"><ContourField dark /><div className="closing-copy"><SectionKicker>THE WORK OF NOTICING</SectionKicker><h2>Follow the thread<br />that keeps <em>returning.</em></h2><p>Start with a sentence. Leave with a landscape.</p><button className="engraved-button light" onClick={() => scrollTo("map")}>Begin mapping <ArrowUpRight size={16} /></button></div><div className="closing-coordinates">FIELD NOTE / 44.318° N<br />OBSERVED IN THE QUIET HOURS</div></section>

    <footer className="footer"><div className="brand footer-brand"><img src="/manus-storage/emotioncartography-mark_56df972e.png" alt="" /><span>EMOTION<br /><i>CARTOGRAPHY</i></span></div><p>A living atlas for the patterns inside your writing.</p><span className="footer-note">MADE FOR REFLECTION / NOT DIAGNOSIS</span></footer>

    {showJournal && <div className="journal-modal" role="dialog" aria-modal="true" aria-label="Journal entry"><button className="modal-close" onClick={() => setShowJournal(false)}><X size={18} /></button><div className="journal-sheet"><span className="journal-date">FIELD NOTE / OCT 14</span><h3>“I keep finding myself<br /><em>at the same crossroads.</em>”</h3><p>There is the familiar path, worn smooth by other people's footsteps. Then there is the one that disappears behind the hill. I am not sure I need an answer yet. I would like to know what the question is made of.</p><div className="journal-signature">— from the quiet hours</div><div className="journal-stamp">OBSERVATION<br />RECORDED</div></div></div>}
  </main>;
}
