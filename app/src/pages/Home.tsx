/* EmotionCartography / Cartographer's Field Journal
   The approved homepage remains the visual foundation. Product modes unfold as atlas pages,
   not dashboard panels: MAP, JOURNAL, REFLECTIONS, and TIMELINE share spatial continuity.
*/
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Compass, Crosshair, Layers3, Minus, Plus, Route, Search, Sparkles, X } from "lucide-react";
import { LogoIcon } from "@/components/LogoIcon";
import { FieldJournalBook } from "@/components/FieldJournalBook";
import { MapPage } from "./MapPage";
import { JournalPage } from "../components/journal/JournalPage";
import { ReflectionsPage } from "../components/reflections/ReflectionsPage";
import { TimelinePage } from "../components/timeline/TimelinePage";
import { useCartography } from "../lib/store";
import { AtlasEntry, clusters, monthGrowth, months, getCluster } from "../lib/atlasData";

type Mode = "home" | "map" | "journal" | "reflections" | "timeline";

function SectionKicker({ children }: { children: React.ReactNode }) { return <div className="section-kicker"><span className="kicker-rule" />{children}</div>; }
function ContourField({ dark = false }: { dark?: boolean }) { return <svg className={`contour-field ${dark ? "contour-field-dark" : ""}`} viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">{[150, 205, 270, 340, 420, 500, 585].map((y) => <path key={y} d={`M-20 ${y}C160 ${y - 110} 230 ${y + 100} 410 ${y}S720 ${y - 120} 1020 ${y + 20}`} />)}</svg>; }
function Header({ mode, setMode }: { mode: Mode; setMode: (mode: Mode) => void }) {
  return <header className={`topbar ${mode !== "home" ? "product-topbar" : ""}`}>
    <button className="brand" onClick={() => setMode("home")} aria-label="EmotionCartography home"><LogoIcon /><span>EMOTION<br /><i>CARTOGRAPHY</i></span></button>
    <nav className="atlas-nav" aria-label="Primary navigation">{(["map", "journal", "reflections", "timeline"] as Mode[]).map((item) => <button key={item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item.toUpperCase()}</button>)}</nav>
    <div className="topbar-meta"><span>FIELD JOURNAL / 01</span><span className="live-dot" /> <span>LIVE ATLAS</span></div>
  </header>;
}

function HomePage({ setMode }: { setMode: (mode: Mode) => void }) {
  const [showJournal, setShowJournal] = useState(false);
  const [demoStage, setDemoStage] = useState(0);
  const [spreadProgress, setSpreadProgress] = useState(0);
  useEffect(() => {
    const updateSpread = () => {
      const section = document.getElementById("how-it-works");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      // Book opens as the section enters the viewport:
      // Book opens as the section enters the viewport:
      // Start opening when section is 65% up the screen (more visible)
      // Finish opening when it reaches 15% from top
      const entryStart = window.innerHeight * 0.65;
      const entryEnd = window.innerHeight * 0.15;
      const progress = 1 - Math.max(0, Math.min(1, (rect.top - entryEnd) / (entryStart - entryEnd)));
      setSpreadProgress(progress);
    };
    updateSpread();
    window.addEventListener("scroll", updateSpread, { passive: true });
    return () => window.removeEventListener("scroll", updateSpread);
  }, []);
  const [heroStyle, setHeroStyle] = useState({ x: "0px", y: "0px" });
  const fragments = ["career", "family", "what if?", "home", "comparison", "tomorrow", "should I?", "enough"];
  const moveHero = (event: React.MouseEvent<HTMLDivElement>) => { const r = event.currentTarget.getBoundingClientRect(); setHeroStyle({ x: `${((event.clientX - r.left) / r.width - .5) * 18}px`, y: `${((event.clientY - r.top) / r.height - .5) * 12}px` }); };
  return <>
    <section id="top" className="hero" style={{ ["--mouse-x" as string]: heroStyle.x, ["--mouse-y" as string]: heroStyle.y }} onMouseMove={moveHero}>
      <div className="hero-sky" /><div className="hero-mountains" /><div className="hero-landscape" /><div className="hero-foreground" /><div className="hero-glow" /><ContourField />
      <div className="hero-coordinates">44° 18' N &nbsp; / &nbsp; 73° 12' W<br /><span>UNMAPPED TERRITORY</span></div>
      <div className="hero-copy"><SectionKicker>AN ATLAS OF THE INNER WORLD</SectionKicker><h1>Emotion<br /><em>Cartography</em></h1><p className="hero-deck">Map the themes<br />shaping your life.</p><p className="hero-body">Your journal is more than an archive.<br />It contains a landscape.</p><div className="hero-actions"><button className="engraved-button primary" onClick={() => setMode("map")}>Explore your map <ArrowUpRight size={16} /></button><button className="text-button" onClick={() => setMode("journal")}>Write a journal entry <ArrowDown size={15} /></button></div></div>
      <div className="hero-stamp"><span>EC</span><small>OBSERVATION<br />NO. 001</small></div><div className="scroll-cue"><span>SCROLL TO BEGIN</span><ArrowDown size={16} /></div>
    </section>
    <section id="how-it-works" className="fragment-section paper-section journal-scroll-section" style={{ ["--spread-progress" as string]: spreadProgress }}><div className="section-index">01 / 04</div><div className="fragment-copy"><SectionKicker>THE FIRST MARK</SectionKicker><h2>Most lives are<br /><em>felt</em> before<br />they are seen.</h2><p>We leave traces everywhere: a question repeated in three different months, a word that arrives whenever the future does. Alone, they seem scattered. Together, they begin to describe a place.</p><button className="line-button" onClick={() => setShowJournal(true)}>Open a journal page <ArrowUpRight size={15} /></button><span className="field-annotation annotation-one">FIELD NOTE 07<br /><em>appears repeatedly since March</em></span></div><div className="journal-spread-scene"><FieldJournalBook progress={spreadProgress} /></div></section>
    <section className="transform-section ink-section"><div className="section-index light-index">02 / 04</div><div className="transform-copy"><SectionKicker>FROM WORDS TO TERRAIN</SectionKicker><h2>Every entry<br />leaves a <em>point.</em></h2><p>As your writing accumulates, recurring themes gather into regions. The map does not tell you what to feel. It gives the feeling somewhere to be seen.</p><div className="demo-transform"><div className={`demo-word stage-${demoStage}`}>“the route I chose”</div><ArrowDown size={16} /><div className="demo-point-row">{[0, 1, 2, 3, 4].map((i) => <i key={i} className={demoStage >= 2 ? "lit" : ""} />)}</div><button className="text-button" onClick={() => setDemoStage((stage) => (stage + 1) % 4)}>{["Separate the words", "Gather the points", "Form a region", "Reset the journey"][demoStage]} <ArrowUpRight size={14} /></button></div></div><div className="process-rail"><div className="process-line" />{[["01", "ENTRIES", "the raw record"], ["02", "THREADS", "what returns"], ["03", "REGIONS", "where it gathers"], ["04", "LANDSCAPE", "what becomes visible"]].map(([n, b, s], i) => <div className={`process-step ${demoStage >= i ? "active" : ""}`} key={n}><span>{n}</span><b>{b}</b><small>{s}</small></div>)}</div><div className="point-cloud" aria-hidden="true">{Array.from({ length: 36 }).map((_, i) => <i key={i} style={{ left: `${8 + ((i * 37) % 82)}%`, top: `${13 + ((i * 53) % 70)}%`, animationDelay: `${(i % 7) * .18}s` }} />)}</div><div className="ink-note"><Sparkles size={15} /><span>NOISE BECOMES<br /><strong>TOPOGRAPHY</strong></span></div></section>
    <section id="map" className="map-section paper-section"><div className="map-header"><div><SectionKicker>THE LIVING MAP</SectionKicker><h2>What keeps<br /><em>returning.</em></h2></div><div className="map-intro"><p>Each region is a cluster of meaning from your journal. Open the atlas to follow its paths.</p><button className="line-button" onClick={() => setMode("map")}>Enter the full map <ArrowUpRight size={15} /></button></div></div><MiniMap setMode={setMode} /></section>
    <section className="closing-section ink-section"><ContourField dark /><div className="closing-copy"><SectionKicker>THE WORK OF NOTICING</SectionKicker><h2>Follow the thread<br />that keeps <em>returning.</em></h2><p>Start with a sentence. Leave with a landscape.</p><button className="engraved-button light" onClick={() => setMode("map")}>Begin mapping <ArrowUpRight size={16} /></button></div><button className="connection-demo" onClick={() => setMode("reflections")}><Route size={15} /> CAREER <span>↔</span> FAMILY <small>7 SHARED ENTRIES / FOLLOW THIS THREAD</small></button><div className="closing-coordinates">FIELD NOTE / 44.318° N<br />OBSERVED IN THE QUIET HOURS</div></section>
    <footer className="footer"><div className="brand footer-brand"><LogoIcon /><span>EMOTION<br /><i>CARTOGRAPHY</i></span></div><p>A living atlas for the patterns inside your writing.</p><span className="footer-note">MADE FOR REFLECTION / NOT DIAGNOSIS</span></footer>
    {showJournal && <JournalModal onClose={() => setShowJournal(false)} />}
  </>;
}

function MiniMap({ setMode }: { setMode: (mode: Mode) => void }) {
  const [selected, setSelected] = useState("expectations");
  return <div className="mini-map"><ContourField /><svg className="map-routes" viewBox="0 0 900 560" preserveAspectRatio="none"><path d="M 225 174 C 300 160 390 148 612 140" /><path d="M 225 174 C 310 220 380 250 459 274" /><path d="M 459 274 C 530 250 570 200 612 140" /><path d="M 459 274 C 570 320 630 355 702 386" /><path d="M 162 325 C 220 370 255 400 288 414" /></svg>{clusters.map((cluster) => { const [x, y] = cluster.centroid; return <button key={cluster.id} className={`region region-${cluster.id} ${selected === cluster.id ? "selected" : ""}`} style={{ ["--region-x" as string]: `${x}%`, ["--region-y" as string]: `${y}%`, ["--region-color" as string]: cluster.color, ["--region-size" as string]: `${cluster.id === "expectations" ? 22 : 26}px` }} onClick={() => setSelected(cluster.id)}><span className="region-orbit" /><span className="region-core" /><span className="region-label">{cluster.label}</span></button>; })}<div className="mini-map-note"><span className="signal" /> Selected region: <strong>{getCluster(selected).label}</strong><button onClick={() => setMode("map")}>Open atlas <ArrowUpRight size={14} /></button></div></div>;
}


export default function Home() { const [mode, setMode] = useState<Mode>("home"); const [focusedEntryId, setFocusedEntryId] = useState<string | null>(null); const [focusedClusterId, setFocusedClusterId] = useState<string | null>(null); const { addEntry, deleteEntry } = useCartography(); const [selectedEntry, setSelectedEntry] = useState<AtlasEntry | null>(null); const handleOpenEntry = (entry: AtlasEntry) => { setSelectedEntry(entry); }; return <main className="atlas-shell"><Header mode={mode} setMode={setMode} />{mode === "home" && <HomePage setMode={setMode} />}{mode === "map" && <MapPage focusedEntryId={focusedEntryId} focusedClusterId={focusedClusterId} />}{mode === "journal" && <JournalPage setMode={setMode} setFocusedEntryId={setFocusedEntryId} />}{mode === "reflections" && <ReflectionsPage setMode={setMode} setFocusedEntryId={setFocusedEntryId} setFocusedClusterId={setFocusedClusterId} onOpenEntry={handleOpenEntry} />}{mode === "timeline" && <TimelinePage setMode={setMode} onOpenEntry={handleOpenEntry} />}{selectedEntry && <div className="entry-drawer" role="dialog"><div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}><button onClick={() => setSelectedEntry(null)}><X size={16} /></button><button onClick={() => { deleteEntry(selectedEntry.id); setSelectedEntry(null); }} style={{ color: "#8c978e", background: "none", border: "none", cursor: "pointer" }} aria-label="Delete entry"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg></button></div><span>ENTRY / {selectedEntry.date} / {selectedEntry.language}</span><p>{selectedEntry.text}</p><small>Mapped to {getCluster(selectedEntry.clusterId).label}. The original writing is preserved.</small></div>}</main>; }
