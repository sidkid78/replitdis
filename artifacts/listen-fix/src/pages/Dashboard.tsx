import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Activity, BarChart2, Wrench, ShoppingCart, ShieldCheck,
  Play, Mic, CheckCircle2, AlertTriangle, ChevronRight,
  Plus, Clock, MapPin, ExternalLink,
  Star, Home, X, Upload, Square,
  Cpu, Database, Search, Zap,
} from "lucide-react";
import OnboardingTour, { DASHBOARD_TOUR_STEPS } from "../components/OnboardingTour";

// ── Design Tokens ──────────────────────────────────────────────────────────────
const C = {
  bg:      "#0e0e0e",
  bgDim:   "#131313",
  bgLow:   "#1c1b1b",
  bgMid:   "#201f1f",
  bgHigh:  "#2a2a2a",
  bgHst:   "#353534",
  cyan:    "#00f0ff",
  cyanDim: "#00dbe9",
  onCyan:  "#00363a",
  onSurf:  "#e5e2e1",
  onSurfV: "#b9cacb",
  outline: "#849495",
  outlineV:"rgba(59,73,75,0.6)",
  error:   "#ffb4ab",
  errorC:  "#93000a",
  yellow:  "#fed639",
  grotesk: "'Space Grotesk', sans-serif",
  mono:    "'JetBrains Mono', monospace",
  inter:   "'Inter', sans-serif",
};

// ── Types ──────────────────────────────────────────────────────────────────────
type Screen = "home" | "capture" | "analyzing" | "report" | "guide" | "parts";

interface DiagnosisResult {
  primaryDiagnosis: string; confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  symptoms: string[]; possibleCauses: string[];
  requiresExpertReview: boolean; safetyWarnings: string[];
}
interface RepairStep {
  stepNumber: number; title: string; description: string;
  duration: string; warnings: string[];
}
interface RepairPart {
  name: string; partNumber: string; description: string;
  estimatedPriceLow: number; estimatedPriceHigh: number;
  priority: "required" | "recommended" | "optional"; whereToBuy: string[];
}
interface GuideResult {
  title: string; summary: string; totalTime: string;
  overallDifficulty: string; safetyWarnings: string[];
  requiredTools: string[]; steps: RepairStep[]; requiredParts: RepairPart[];
}
interface PipelineEvent {
  stage: number; status: "progress" | "complete" | "error" | "warning";
  message: string; label?: string;
  data?: { confidence?: number; severity?: string; [k: string]: unknown };
}
interface AnalysisResult { diagnosis: DiagnosisResult; guide: GuideResult; }

// ── Helpers ────────────────────────────────────────────────────────────────────
const sevColor = (s: string) => {
  if (s === "critical") return C.error;
  if (s === "high") return C.yellow;
  if (s === "medium") return "#fb923c";
  return "#4ade80";
};
const sevNum = (s: string) =>
  s === "critical" ? 4 : s === "high" ? 3 : s === "medium" ? 2 : 1;
const priorityColor = (p: string) =>
  p === "required" ? C.error : p === "recommended" ? C.yellow : "#4ade80";

function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Global Styles ──────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  .db-root{display:flex;flex-direction:column;height:100dvh;background:${C.bg};font-family:${C.inter};overflow:hidden;}
  .db-body{display:flex;flex:1;overflow:hidden;}
  .db-sidebar{width:256px;flex-shrink:0;background:${C.bg};display:flex;flex-direction:column;height:100%;position:relative;z-index:2;border-right:0.5px solid rgba(0,240,255,0.2);}
  .db-content{flex:1;overflow-y:auto;background:${C.bgDim};position:relative;}
  .db-topbar{height:64px;background:rgba(14,14,14,0.85);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;flex-shrink:0;border-bottom:0.5px solid rgba(0,240,255,0.3);box-shadow:0 0 20px rgba(0,240,255,0.1);position:sticky;top:0;z-index:10;}
  .db-screen{padding:2rem 1.75rem;position:relative;z-index:1;}
  .db-bottom-nav{display:none;}
  .blueprint-grid{background-image:radial-gradient(rgba(0,240,255,0.05) 1px,transparent 1px);background-size:24px 24px;}
  .scanline{background:linear-gradient(to bottom,transparent 50%,rgba(0,240,255,0.02) 50%);background-size:100% 4px;pointer-events:none;}
  .data-ribbon{height:2px;background:linear-gradient(to right,${C.cyan},transparent);width:100%;}
  .hud-glow{box-shadow:0 0 15px rgba(0,240,255,0.08);}

  .db-nav-item{display:flex;align-items:center;gap:.75rem;padding:.75rem 1.25rem;background:transparent;border:none;cursor:pointer;color:${C.onSurfV};font-family:${C.mono};font-weight:400;font-size:.7rem;letter-spacing:.04em;text-align:left;text-transform:uppercase;transition:all .15s;width:100%;}
  .db-nav-item:hover{background:${C.bgHigh};color:${C.cyan};}
  .db-nav-item.active{background:rgba(0,240,255,0.08);color:${C.cyan};border-right:3px solid ${C.cyan};}
  .db-nav-item.locked{opacity:.3;cursor:default;}

  .db-card{background:${C.bgHigh};position:relative;overflow:hidden;}
  .db-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(to right,${C.cyan},transparent);}
  .db-card-plain{background:${C.bgMid};}

  .db-input{width:100%;background:${C.bgLow};border:none;border-bottom:2px solid ${C.outlineV};outline:none;padding:.75rem .875rem;font-family:${C.mono};font-size:.75rem;color:${C.onSurf};transition:border-color .2s;letter-spacing:.04em;}
  .db-input:focus{border-bottom-color:${C.cyan};}
  .db-input::placeholder{color:${C.onSurfV};opacity:.5;}

  @keyframes pulse-ring{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes waveBar{from{height:15%}to{height:85%}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  @keyframes cyanPulse{0%,100%{box-shadow:0 0 8px rgba(0,240,255,0.6)}50%{box-shadow:0 0 20px rgba(0,240,255,0.9)}}

  @media(max-width:768px){
    .db-sidebar{position:fixed;left:0;top:0;bottom:0;z-index:300;transform:translateX(-100%);transition:transform .25s;}
    .db-sidebar.open{transform:translateX(0);}
    .db-sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:299;backdrop-filter:blur(4px);}
    .db-sidebar-overlay.open{display:block;}
    .db-topbar{padding:0 1rem;}
    .db-content{padding-bottom:68px;}
    .db-bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;height:64px;background:${C.bg};z-index:200;align-items:center;justify-content:space-around;border-top:0.5px solid rgba(0,240,255,0.2);}
    .db-bottom-nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:.5rem .75rem;background:none;border:none;cursor:pointer;flex:1;}
    .db-screen{padding:1.25rem .875rem;}
    .db-home-hero{grid-template-columns:1fr!important;}
    .db-home-lower{grid-template-columns:1fr!important;}
    .db-capture-grid{grid-template-columns:1fr!important;}
    .db-report-grid{grid-template-columns:1fr!important;}
    .db-guide-meta{grid-template-columns:1fr 1fr!important;}
    .db-guide-grid{grid-template-columns:1fr!important;}
    .db-parts-grid{grid-template-columns:1fr!important;}
    .db-analyze-grid{grid-template-columns:1fr!important;}
  }
`;

// ── TopBar ─────────────────────────────────────────────────────────────────────
function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="db-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: ".875rem" }}>
        <button onClick={onMenu} style={{ padding: ".5rem", background: C.bgHigh, border: "none", cursor: "pointer", display: "flex", color: C.onSurfV, transition: "color .15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = C.cyan)}
          onMouseLeave={e => (e.currentTarget.style.color = C.onSurfV)}>
          <BarChart2 size={16} />
        </button>
        <div style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "1.125rem", color: C.cyan, letterSpacing: "-.02em", fontStyle: "italic" }}>LISTEN &amp; FIX</div>
        <div style={{ height: 16, width: "0.5px", background: C.outlineV }} />
        <span style={{ fontFamily: C.mono, fontSize: ".6rem", color: C.onSurfV, letterSpacing: ".08em", textTransform: "uppercase" }}>Foreman_Module_v4.0.2</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".35rem .75rem", background: "rgba(0,240,255,0.08)", border: "1px solid rgba(0,240,255,0.2)" }}>
          <div style={{ width: 6, height: 6, background: "#4ade80", animation: "pulse-ring 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: C.mono, fontSize: ".6rem", color: C.cyan, letterSpacing: ".1em" }}>AI_ONLINE</span>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          {[{ icon: <Search size={15} />, title: "sensors" }, { icon: <Activity size={15} />, title: "analytics" }, { icon: <Zap size={15} />, title: "settings" }].map(({ icon, title }) => (
            <button key={title} style={{ padding: ".4rem", background: "none", border: "none", cursor: "pointer", color: C.onSurfV, display: "flex", transition: "color .15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.cyan)}
              onMouseLeave={e => (e.currentTarget.style.color = C.onSurfV)}>{icon}</button>
          ))}
        </div>
      </div>
    </header>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ screen, setScreen, isOpen, onClose, onHome, hasResult, onNewDiag }: {
  screen: Screen; setScreen: (s: Screen) => void;
  isOpen: boolean; onClose: () => void; onHome: () => void;
  hasResult: boolean; onNewDiag: () => void;
}) {
  const items = [
    { key: "home" as Screen, icon: <BarChart2 size={15} />, label: "DIAGNOSTICS" },
    { key: "guide" as Screen, icon: <Wrench size={15} />, label: "REPAIR GUIDE", locked: !hasResult },
    { key: "parts" as Screen, icon: <ShoppingCart size={15} />, label: "PARTS HUB", locked: !hasResult },
    { key: "report" as Screen, icon: <ShieldCheck size={15} />, label: "SAFETY LOGS", locked: !hasResult },
  ];
  const go = (k: Screen, locked?: boolean) => { if (!locked) { setScreen(k); onClose(); } };
  return (
    <>
      <div className={`db-sidebar-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />
      <aside className={`db-sidebar ${isOpen ? "open" : ""}`}>
        {/* Operator Header */}
        <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: `0.5px solid rgba(0,240,255,0.12)` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: C.grotesk, fontWeight: 700, fontSize: ".75rem", color: C.cyan, letterSpacing: ".15em", textTransform: "uppercase" }}>OPERATOR_01</p>
              <div style={{ display: "flex", alignItems: "center", gap: ".375rem", marginTop: ".375rem" }}>
                <div style={{ width: 5, height: 5, background: "#4ade80" }} />
                <span style={{ fontFamily: C.mono, fontSize: ".6rem", color: "#4ade80", letterSpacing: ".08em" }}>STATUS: OPTIMAL</span>
              </div>
            </div>
            <button onClick={onClose} style={{ padding: ".25rem", background: "none", border: "none", cursor: "pointer", color: C.onSurfV, display: "flex" }}><X size={16} /></button>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: ".5rem" }}>
          {items.map(({ key, icon, label, locked }) => (
            <button key={key} onClick={() => go(key, locked)} className={`db-nav-item${screen === key ? " active" : ""}${locked ? " locked" : ""}`}>
              {icon}
              <span style={{ flex: 1 }}>{label}</span>
              {screen === key && <ChevronRight size={11} style={{ opacity: .5 }} />}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: "1rem 1.25rem 1.5rem", borderTop: `0.5px solid rgba(0,240,255,0.1)`, display: "flex", flexDirection: "column", gap: ".625rem" }}>
          <button onClick={onNewDiag} style={{ width: "100%", padding: ".75rem", background: C.cyan, border: "none", cursor: "pointer", fontFamily: C.grotesk, fontWeight: 700, fontSize: ".65rem", color: C.onCyan, letterSpacing: ".15em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", transition: "box-shadow .2s" }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(0,240,255,0.4)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
            <Plus size={13} /> INITIATE SCAN
          </button>
          <button onClick={onHome} style={{ width: "100%", padding: ".625rem", background: "transparent", border: "none", cursor: "pointer", fontFamily: C.mono, fontWeight: 400, fontSize: ".6rem", color: C.onSurfV, letterSpacing: ".08em", display: "flex", alignItems: "center", justifyContent: "center", gap: ".375rem", transition: "color .15s", textTransform: "uppercase" }}
            onMouseEnter={e => (e.currentTarget.style.color = C.cyan)}
            onMouseLeave={e => (e.currentTarget.style.color = C.onSurfV)}>
            <Home size={12} /> BACK TO LANDING
          </button>
          <button style={{ width: "100%", padding: ".75rem", background: C.errorC, border: "2px solid #c00008", cursor: "pointer", fontFamily: C.grotesk, fontWeight: 700, fontSize: ".65rem", color: C.error, letterSpacing: ".15em", textTransform: "uppercase" }}>
            EMERGENCY_HALT
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Bottom Nav ─────────────────────────────────────────────────────────────────
function BottomNav({ screen, setScreen, hasResult }: {
  screen: Screen; setScreen: (s: Screen) => void; hasResult: boolean;
}) {
  const items = [
    { key: "home" as Screen, icon: <BarChart2 size={19} />, label: "DIAGS" },
    { key: "capture" as Screen, icon: <Mic size={19} />, label: "SCAN" },
    { key: "guide" as Screen, icon: <Wrench size={19} />, label: "GUIDE", locked: !hasResult },
    { key: "parts" as Screen, icon: <ShoppingCart size={19} />, label: "PARTS", locked: !hasResult },
  ];
  return (
    <div className="db-bottom-nav">
      {items.map(({ key, icon, label, locked }) => {
        const active = screen === key;
        return (
          <button key={key} onClick={() => !locked && setScreen(key)} className="db-bottom-nav-btn"
            style={{ color: locked ? C.outlineV : active ? C.cyan : C.onSurfV, opacity: locked ? .3 : 1, borderTop: active ? `2px solid ${C.cyan}` : "2px solid transparent" }}>
            {icon}
            <span style={{ fontFamily: C.mono, fontSize: ".5rem", fontWeight: 700, letterSpacing: ".1em" }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Shared UI ──────────────────────────────────────────────────────────────────
const DataRibbon = () => <div className="data-ribbon" />;

const MonoTag = ({ children, color }: { children: React.ReactNode; color?: string }) => (
  <span style={{ fontFamily: C.mono, fontSize: ".6rem", color: color ?? C.onSurfV, letterSpacing: ".08em", textTransform: "uppercase" }}>{children}</span>
);

const SectionHead = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div style={{ marginBottom: "2rem" }}>
    <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".625rem" }}>
      <div style={{ height: "1px", width: 32, background: C.cyan }} />
      <MonoTag color={C.cyan}>{eyebrow}</MonoTag>
    </div>
    <h1 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "clamp(1.4rem,3.5vw,2rem)", color: C.onSurf, letterSpacing: "-.02em", lineHeight: 1, textTransform: "uppercase" }}>{title}</h1>
  </div>
);

const CyanBtn = ({ children, onClick, small, ghost }: { children: React.ReactNode; onClick?: () => void; small?: boolean; ghost?: boolean }) => (
  <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: small ? ".5rem 1rem" : ".75rem 1.5rem", background: ghost ? "transparent" : C.cyan, border: ghost ? `1px solid rgba(0,240,255,0.4)` : "none", cursor: "pointer", fontFamily: C.grotesk, fontWeight: 700, fontSize: small ? ".65rem" : ".7rem", color: ghost ? C.cyan : C.onCyan, letterSpacing: ".12em", textTransform: "uppercase", transition: "box-shadow .2s" }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 20px rgba(0,240,255,${ghost ? 0.2 : 0.4})`)}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
    {children}
  </button>
);

// ── Canvas Background ──────────────────────────────────────────────────────────
const CanvasBg = () => (
  <>
    <div className="blueprint-grid" style={{ position: "absolute", inset: 0, opacity: .6, zIndex: 0, pointerEvents: "none" }} />
    <div className="scanline" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />
  </>
);

// ── Home Screen ────────────────────────────────────────────────────────────────
function HomeScreen({ setScreen, result }: { setScreen: (s: Screen) => void; result: AnalysisResult | null }) {
  return (
    <div className="db-screen">
      <SectionHead eyebrow="SYSTEM_ANALYSIS" title="Engineering Diagnostics" />

      <div className="db-home-hero" style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "2px", marginBottom: "2px" }}>
        {/* Hero card */}
        <div className="db-card hud-glow" style={{ padding: "2.5rem", background: C.bgHigh }}>
          <DataRibbon />
          <MonoTag color={C.cyan}>6-STAGE AI PIPELINE // GEMINI 3 FLASH</MonoTag>
          <h2 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "clamp(1.5rem,4vw,2.25rem)", color: C.onSurf, lineHeight: .95, textTransform: "uppercase", letterSpacing: "-.02em", marginTop: "1rem", marginBottom: "1rem" }}>MULTIMODAL<br /><span style={{ color: C.cyan }}>DIAGNOSTICS</span></h2>
          <p style={{ fontFamily: C.inter, fontSize: ".875rem", color: C.onSurfV, lineHeight: 1.8, maxWidth: 440, marginBottom: "2rem" }}>Upload or record a fault sound. Gemini's multimodal AI analyzes the acoustic signature and generates a precision repair blueprint in under 60 seconds.</p>
          <CyanBtn onClick={() => setScreen("capture")}><Play size={13} /> START NEW DIAGNOSIS</CyanBtn>
        </div>
        {/* Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {[["6", "PIPELINE STAGES"], ["~60s", "AVG LATENCY"], ["94.2%", "SUCCESS RATE"]].map(([v, l]) => (
            <div key={l} className="db-card-plain" style={{ padding: "1.25rem", flex: 1 }}>
              <MonoTag>{l}</MonoTag>
              <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "1.75rem", color: C.cyan, lineHeight: 1, marginTop: ".5rem", letterSpacing: "-.02em" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {result && (
        <div className="db-card" style={{ padding: "1.75rem", marginBottom: "2px" }}>
          <DataRibbon />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginTop: ".75rem", marginBottom: "1rem" }}>
            <div>
              <MonoTag color={C.cyan}>LAST_DIAGNOSTIC_RESULT</MonoTag>
              <h3 style={{ fontFamily: C.grotesk, fontWeight: 700, fontSize: "1rem", color: C.onSurf, marginTop: ".5rem", textTransform: "uppercase", letterSpacing: ".04em" }}>{result.guide.title}</h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: C.mono, fontSize: ".6rem", padding: ".25rem .625rem", background: `${sevColor(result.diagnosis.severity)}18`, color: sevColor(result.diagnosis.severity), letterSpacing: ".1em", textTransform: "uppercase", display: "inline-block" }}>{result.diagnosis.severity.toUpperCase()}</div>
              <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "2rem", color: C.cyan, lineHeight: 1, marginTop: ".5rem" }}>{Math.round(result.diagnosis.confidence * 100)}<span style={{ fontSize: ".8rem", opacity: .6 }}>%</span></div>
              <MonoTag>CONFIDENCE</MonoTag>
            </div>
          </div>
          <p style={{ fontFamily: C.inter, fontSize: ".825rem", color: C.onSurfV, lineHeight: 1.8, marginBottom: "1.25rem" }}>{result.diagnosis.primaryDiagnosis}</p>
          <div style={{ display: "flex", gap: ".625rem" }}>
            <CyanBtn onClick={() => setScreen("report")} small><ChevronRight size={12} /> FULL REPORT</CyanBtn>
            <CyanBtn onClick={() => setScreen("guide")} small ghost>REPAIR GUIDE</CyanBtn>
          </div>
        </div>
      )}

      <div className="db-home-lower" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
        <div className="db-card-plain" style={{ padding: "1.5rem" }}>
          <MonoTag color={C.onSurf}>PIPELINE_STAGES</MonoTag>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "1rem" }}>
            {[
              { n: "01", label: "Media Processing", desc: "Audio / visual signature ingestion" },
              { n: "02", label: "Acoustic Scan", desc: "FFT anomaly detection via Gemini" },
              { n: "03", label: "Multimodal Diagnosis", desc: "Root cause identification" },
              { n: "04", label: "Knowledge Retrieval", desc: "OEM specs & technical docs" },
              { n: "05", label: "Guide Synthesis", desc: "Step-by-step repair blueprint" },
              { n: "06", label: "Parts Sourcing", desc: "SKU matching & local availability" },
            ].map(({ n, label, desc }) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: ".875rem", padding: ".75rem 1rem", background: C.bgHigh }}>
                <span style={{ fontFamily: C.mono, fontSize: ".65rem", fontWeight: 700, color: C.cyan, flexShrink: 0 }}>{n}</span>
                <div>
                  <p style={{ fontFamily: C.grotesk, fontWeight: 600, fontSize: ".75rem", color: C.onSurf, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</p>
                  <p style={{ fontFamily: C.inter, fontSize: ".67rem", color: C.onSurfV, marginTop: ".125rem" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="db-card-plain" style={{ padding: "1.5rem" }}>
          <MonoTag color={C.onSurf}>SUPPORTED_EQUIPMENT</MonoTag>
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "2px" }}>
            {["HVAC Systems & Compressors","Industrial Pumps & Valves","Electric Motors & Drives","Automotive Components","Household Appliances","Power Tools & Equipment"].map(e => (
              <div key={e} style={{ display: "flex", alignItems: "center", gap: ".625rem", padding: ".75rem 1rem", background: C.bgHigh }}>
                <div style={{ width: 5, height: 5, background: C.cyan, flexShrink: 0 }} />
                <p style={{ fontFamily: C.inter, fontSize: ".775rem", color: C.onSurfV }}>{e}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Field (module-level to preserve focus across re-renders) ───────────────────
function Field({ label, val, set, placeholder, req }: {
  label: string; val: string; set: (v: string) => void; placeholder?: string; req?: boolean;
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <MonoTag color={req ? C.cyan : C.onSurfV}>{label}{req ? " *" : ""}</MonoTag>
      <input value={val} onChange={e => set(e.target.value)} placeholder={placeholder ?? ""} className="db-input" style={{ marginTop: ".375rem" }} />
    </div>
  );
}

// ── Capture Screen ─────────────────────────────────────────────────────────────
function CaptureScreen({ setScreen, onSubmit }: {
  setScreen: (s: Screen) => void;
  onSubmit: (d: { equipment: { make: string; model: string; year: string; description: string }; media: { base64: string; mimeType: string }[] }) => void;
}) {
  const [tab, setTab] = useState<"record" | "details">("record");
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [time, setTime] = useState(0);
  const [uploaded, setUploaded] = useState<{ name: string; mimeType: string; base64: string }[]>([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [desc, setDesc] = useState("");
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const bars = Array.from({ length: 24 });

  useEffect(() => {
    if (!recording) return;
    const iv = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [recording]);

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => { setAudioBlob(new Blob(chunksRef.current, { type: "audio/webm" })); stream.getTracks().forEach(t => t.stop()); };
      rec.start(); recRef.current = rec; setRecording(true); setTime(0);
    } catch { alert("Microphone access denied."); }
  };
  const stopRec = () => { recRef.current?.stop(); setRecording(false); };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    for (const f of Array.from(e.target.files ?? [])) {
      const b64 = await fileToBase64(f);
      setUploaded(p => [...p, { name: f.name, mimeType: f.type, base64: b64 }]);
    }
  };

  const handleSubmit = async () => {
    if (!make || !model) return alert("Please fill in the equipment make and model.");
    const media: { base64: string; mimeType: string }[] = [];
    if (audioBlob) { media.push({ base64: await fileToBase64(audioBlob), mimeType: "audio/webm" }); }
    for (const f of uploaded) { media.push({ base64: f.base64, mimeType: f.mimeType }); }
    onSubmit({ equipment: { make, model, year, description: desc }, media });
    setScreen("analyzing");
  };

  const hasMedia = audioBlob !== null || uploaded.length > 0;
  const ready = (make && model) && (hasMedia || desc.length > 10);

  return (
    <div className="db-screen">
      <SectionHead eyebrow="01 // SIGNAL_INPUT" title="New Diagnostic Session" />

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", marginBottom: "1.5rem", border: `1px solid rgba(0,240,255,0.15)`, width: "fit-content" }}>
        {(["record", "details"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: ".625rem 1.25rem", background: tab === t ? "rgba(0,240,255,0.1)" : "transparent", border: "none", cursor: "pointer", fontFamily: C.grotesk, fontWeight: 700, fontSize: ".65rem", color: tab === t ? C.cyan : C.onSurfV, letterSpacing: ".1em", textTransform: "uppercase", borderRight: t === "record" ? `1px solid rgba(0,240,255,0.15)` : "none", transition: "all .15s" }}>
            {t === "record" ? "CAPTURE MEDIA" : "EQUIPMENT DETAILS"}
          </button>
        ))}
      </div>

      <div className="db-capture-grid" style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: "2px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {tab === "record" ? (
            <>
              {/* Record Panel */}
              <div className="db-card" style={{ padding: "2rem" }}>
                <DataRibbon />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", marginTop: ".5rem" }}>
                  <MonoTag color={C.onSurf}>ACOUSTIC_SIGNATURE_INPUT</MonoTag>
                  {recording && (
                    <div style={{ display: "flex", alignItems: "center", gap: ".375rem" }}>
                      <div style={{ width: 7, height: 7, background: "#ef4444", animation: "pulse-ring 1s ease-in-out infinite" }} />
                      <MonoTag color="#ef4444">REC {String(Math.floor(time/60)).padStart(2,"0")}:{String(time%60).padStart(2,"0")}</MonoTag>
                    </div>
                  )}
                </div>
                {/* Waveform */}
                <div style={{ height: 80, display: "flex", alignItems: "flex-end", gap: "3px", marginBottom: "1.75rem", padding: ".75rem", background: C.bgLow, border: `1px solid ${C.outlineV}` }}>
                  {bars.map((_, i) => (
                    <div key={i} style={{ flex: 1, background: recording ? C.cyan : C.outlineV, opacity: recording ? 1 : .3, animation: recording ? `waveBar ${0.3 + Math.random() * 0.5}s ease-in-out infinite alternate` : "none", animationDelay: `${i * 0.05}s`, boxShadow: recording ? `0 0 6px rgba(0,240,255,0.5)` : "none", minHeight: "15%" }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                  {!recording ? (
                    <CyanBtn onClick={startRec}><Mic size={14} /> START RECORDING</CyanBtn>
                  ) : (
                    <CyanBtn onClick={stopRec}><Square size={14} /> STOP RECORDING</CyanBtn>
                  )}
                  {audioBlob && !recording && (
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".5rem .875rem", background: "rgba(0,240,255,0.08)", border: `1px solid rgba(0,240,255,0.3)` }}>
                      <CheckCircle2 size={13} color={C.cyan} />
                      <MonoTag color={C.cyan}>AUDIO_CAPTURED // {time}s</MonoTag>
                    </div>
                  )}
                </div>
              </div>
              {/* Upload Panel */}
              <div className="db-card-plain" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <MonoTag color={C.onSurf}>FILE_UPLOAD</MonoTag>
                  <MonoTag>AUDIO / VIDEO / IMAGE</MonoTag>
                </div>
                <button onClick={() => fileRef.current?.click()} style={{ width: "100%", padding: "2rem 1rem", background: C.bgLow, border: `1px dashed rgba(0,240,255,0.2)`, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: ".75rem", transition: "border-color .2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(0,240,255,0.5)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(0,240,255,0.2)")}>
                  <Upload size={24} color={C.cyan} />
                  <MonoTag color={C.cyan}>DRAG_DROP OR CLICK_TO_UPLOAD</MonoTag>
                </button>
                <input ref={fileRef} type="file" multiple accept="audio/*,video/*,image/*" onChange={handleFile} style={{ display: "none" }} />
                {uploaded.map(f => (
                  <div key={f.name} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".5rem .875rem", background: "rgba(0,240,255,0.05)", border: `1px solid rgba(0,240,255,0.15)`, marginTop: ".5rem" }}>
                    <CheckCircle2 size={12} color={C.cyan} />
                    <MonoTag color={C.cyan}>{f.name}</MonoTag>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="db-card" style={{ padding: "2rem" }}>
              <DataRibbon />
              <div style={{ marginTop: ".75rem" }}>
                <Field label="Make / Manufacturer" val={make} set={setMake} placeholder="e.g. Whirlpool, Carrier, Bosch" req />
                <Field label="Model Number" val={model} set={setModel} placeholder="e.g. WTW5000DW, 48TC036515" req />
                <Field label="Year / Serial" val={year} set={setYear} placeholder="e.g. 2019, SN-4422-X" />
                <div>
                  <MonoTag>Symptom Description</MonoTag>
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the fault: sounds, smells, frequency, when it occurs..." rows={4} style={{ width: "100%", background: C.bgLow, border: "none", borderBottom: `2px solid ${C.outlineV}`, outline: "none", padding: ".75rem .875rem", fontFamily: C.inter, fontSize: ".8rem", color: C.onSurf, resize: "vertical", marginTop: ".375rem", transition: "border-color .2s" }}
                    onFocus={e => (e.target.style.borderBottomColor = C.cyan)}
                    onBlur={e => (e.target.style.borderBottomColor = C.outlineV)} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: submit */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div className="db-card-plain" style={{ padding: "1.25rem" }}>
            <MonoTag color={C.onSurf}>SYSTEM_READINESS</MonoTag>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: ".875rem" }}>
              {[
                { label: "Equipment ID", ok: !!(make && model) },
                { label: "Media Signal", ok: hasMedia },
                { label: "Symptom Data", ok: desc.length > 10 || hasMedia },
              ].map(({ label, ok }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".625rem .875rem", background: C.bgHigh }}>
                  <div style={{ width: 6, height: 6, background: ok ? "#4ade80" : C.outlineV, flexShrink: 0 }} />
                  <MonoTag color={ok ? "#4ade80" : C.outlineV}>{label.toUpperCase()}</MonoTag>
                </div>
              ))}
            </div>
          </div>
          <div className="db-card" style={{ padding: "1.25rem" }}>
            <DataRibbon />
            <p style={{ fontFamily: C.inter, fontSize: ".775rem", color: C.onSurfV, lineHeight: 1.7, margin: ".75rem 0 1.25rem" }}>
              The 6-stage AI pipeline will analyze your media and generate a precision repair guide with parts sourcing.
            </p>
            <CyanBtn onClick={handleSubmit} small={false}>
              <Play size={14} /> {ready ? "RUN ANALYSIS" : "FILL REQUIRED"}
            </CyanBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Analyzing Screen ───────────────────────────────────────────────────────────
function AnalyzingScreen({ events, error }: { events: PipelineEvent[]; error: string | null }) {
  const stages = [
    { n: 1, label: "MEDIA_PROCESSING" },
    { n: 2, label: "ACOUSTIC_SCAN" },
    { n: 3, label: "MULTIMODAL_DIAGNOSIS" },
    { n: 4, label: "KNOWLEDGE_RETRIEVAL" },
    { n: 5, label: "GUIDE_SYNTHESIS" },
    { n: 6, label: "PARTS_SOURCING" },
  ];
  const lastStage = events.reduce((m, e) => e.stage > m ? e.stage : m, 0);
  const progress = Math.round((lastStage / 6) * 100);

  return (
    <div className="db-screen">
      <SectionHead eyebrow="02 // NEURAL_PROCESS" title="System Analysis" />

      <div className="db-analyze-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
        {/* Central HUD */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div className="db-card hud-glow" style={{ padding: "2rem" }}>
            <DataRibbon />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: ".75rem", marginBottom: "1.5rem" }}>
              <div>
                <MonoTag color={C.cyan}>OVERALL_COMPLETION</MonoTag>
                <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "3.5rem", color: C.onSurf, lineHeight: 1, marginTop: ".5rem" }}>
                  {progress}<span style={{ color: C.cyan, fontWeight: 400, fontSize: "1.5rem" }}>%</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <MonoTag>LATENCY: 12ms</MonoTag><br />
                <MonoTag>THREADS: ACTIVE [16]</MonoTag>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 12, background: C.bgLow, border: `1px solid ${C.outlineV}`, position: "relative", overflow: "hidden", marginBottom: "1.5rem" }}>
              <div style={{ position: "absolute", inset: 0, width: `${progress}%`, background: C.cyan, boxShadow: `0 0 12px rgba(0,240,255,0.6)`, transition: "width .5s ease" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 .5rem", justifyContent: "space-between", mixBlendMode: "difference" }}>
                <span style={{ fontFamily: C.mono, fontSize: ".6rem", fontWeight: 700, color: "#fff" }}>SCANNING_SYSTEM_CORE...</span>
                <span style={{ fontFamily: C.mono, fontSize: ".6rem", fontWeight: 700, color: "#fff" }}>{progress}%</span>
              </div>
            </div>
            {/* Stage grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2px" }}>
              {[
                { label: "PACKET_DENSITY", val: "1,204.8 mb/s" },
                { label: "NEURAL_MATCH", val: "98.2%" },
                { label: "BUFFER_STATE", val: "OPTIMAL" },
              ].map(({ label, val }) => (
                <div key={label} style={{ background: C.bgLow, padding: ".75rem" }}>
                  <MonoTag>{label}</MonoTag>
                  <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: ".95rem", color: C.onSurf, marginTop: ".375rem" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Log Stream */}
          <div className="db-card-plain" style={{ padding: "1.25rem", height: 240, overflow: "hidden", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <MonoTag color={C.cyan}>DIAGNOSTIC_STREAM v2.4</MonoTag>
              <div style={{ width: 7, height: 7, background: C.cyan, animation: "pulse-ring 1.5s ease-in-out infinite" }} />
            </div>
            <div style={{ fontFamily: C.mono, fontSize: ".65rem", lineHeight: 2, overflowY: "auto", height: "calc(100% - 2rem)" }}>
              {events.map((e, i) => (
                <div key={i} style={{ color: e.status === "error" ? C.error : e.status === "warning" ? C.yellow : e.status === "complete" ? "#4ade80" : C.onSurfV, animation: "fadeUp .3s ease-out" }}>
                  <span style={{ color: C.cyan, opacity: .6 }}>[{new Date().toLocaleTimeString()}] </span>
                  {e.message}
                </div>
              ))}
              {events.length === 0 && <span style={{ color: C.cyan, animation: "blink 1s step-end infinite" }}>█</span>}
            </div>
          </div>
        </div>

        {/* Right: Stage Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div className="db-card" style={{ padding: "1.5rem" }}>
            <DataRibbon />
            <MonoTag color={C.onSurf} >RAG_OPERATIONS</MonoTag>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "1rem" }}>
              {stages.map(({ n, label }) => {
                const stageEvents = events.filter(e => e.stage === n);
                const done = stageEvents.some(e => e.status === "complete");
                const active = lastStage === n && !done;
                const pending = n > lastStage;
                return (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: ".875rem", padding: ".875rem 1rem", background: active ? "rgba(0,240,255,0.06)" : C.bgHigh, borderLeft: active ? `2px solid ${C.cyan}` : done ? `2px solid #4ade80` : `2px solid transparent` }}>
                    <div style={{ width: 18, height: 18, background: done ? "#4ade80" : active ? C.cyan : C.bgHst, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: active ? `0 0 10px rgba(0,240,255,0.6)` : "none" }}>
                      {done && <span style={{ fontFamily: C.mono, fontSize: ".6rem", color: C.onCyan, fontWeight: 700 }}>✓</span>}
                      {active && <div style={{ width: 6, height: 6, background: C.onCyan, animation: "pulse-ring 1s ease-in-out infinite" }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <MonoTag color={done ? "#4ade80" : active ? C.cyan : C.outlineV}>{label}</MonoTag>
                      {(done || active) && stageEvents.slice(-1).map((e, i) => (
                        <div key={i} style={{ fontFamily: C.mono, fontSize: ".55rem", color: done ? "#4ade8080" : C.cyanDim, marginTop: ".2rem" }}>{done ? "COMPLETED" : e.message.slice(0, 40)}</div>
                      ))}
                    </div>
                    {done && <MonoTag color="#4ade80">✓</MonoTag>}
                    {active && <div style={{ width: 7, height: 7, border: `1px solid ${C.cyan}`, position: "relative" }}><div style={{ position: "absolute", inset: 2, background: C.cyan, animation: "pulse-ring 1s ease-in-out infinite" }} /></div>}
                    {pending && <div style={{ width: 7, height: 7, border: `1px solid ${C.outlineV}` }} />}
                  </div>
                );
              })}
            </div>
          </div>
          {error && (
            <div style={{ padding: "1rem", background: `${C.errorC}30`, border: `1px solid ${C.error}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
                <AlertTriangle size={14} color={C.error} />
                <MonoTag color={C.error}>PIPELINE_ERROR</MonoTag>
              </div>
              <p style={{ fontFamily: C.inter, fontSize: ".8rem", color: C.error }}>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Report Screen ──────────────────────────────────────────────────────────────
function ReportScreen({ result, setScreen }: { result: AnalysisResult; setScreen: (s: Screen) => void }) {
  const { diagnosis, guide } = result;
  const sev = sevColor(diagnosis.severity);
  return (
    <div className="db-screen">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".625rem" }}>
            <div style={{ height: "1px", width: 32, background: C.cyan }} />
            <MonoTag color={C.cyan}>REPORT_ID: 992-AX-04</MonoTag>
          </div>
          <h1 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "clamp(1.5rem,3.5vw,2rem)", color: C.onSurf, textTransform: "uppercase", letterSpacing: "-.01em" }}>DIAGNOSTIC SUMMARY</h1>
        </div>
        <div style={{ display: "flex", gap: ".625rem" }}>
          <CyanBtn onClick={() => setScreen("guide")} small>VIEW REPAIR GUIDE</CyanBtn>
          <CyanBtn onClick={() => setScreen("parts")} small ghost>PARTS HUB</CyanBtn>
        </div>
      </div>

      <div className="db-report-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", marginBottom: "2px" }}>
        {/* Confidence */}
        <div className="db-card" style={{ padding: "1.75rem" }}>
          <DataRibbon />
          <MonoTag color={C.onSurf}>CONFIDENCE_SCORE</MonoTag>
          <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "4rem", color: C.cyan, lineHeight: 1, marginTop: ".75rem" }}>
            {Math.round(diagnosis.confidence * 100)}<span style={{ fontWeight: 400, fontSize: "1.75rem", opacity: .7 }}>%</span>
          </div>
          {diagnosis.requiresExpertReview && (
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".5rem .75rem", background: `${C.yellow}18`, border: `1px solid ${C.yellow}30`, marginTop: "1rem" }}>
              <AlertTriangle size={13} color={C.yellow} />
              <MonoTag color={C.yellow}>EXPERT_REVIEW_RECOMMENDED</MonoTag>
            </div>
          )}
        </div>
        {/* Severity */}
        <div className="db-card" style={{ padding: "1.75rem" }}>
          <DataRibbon />
          <MonoTag color={C.onSurf}>SEVERITY_RATING</MonoTag>
          <div style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "2rem", color: sev, marginTop: ".75rem", textTransform: "uppercase", letterSpacing: ".05em" }}>
            {diagnosis.severity.toUpperCase()}
          </div>
          {/* severity bar */}
          <div style={{ display: "flex", gap: "2px", marginTop: "1rem", alignItems: "center" }}>
            {["LOW","NOMINAL","CRITICAL"].map((l, i) => (
              <div key={l} style={{ flex: 1, height: 4, background: sevNum(diagnosis.severity) > i ? sev : C.bgHst, boxShadow: sevNum(diagnosis.severity) > i ? `0 0 6px ${sev}80` : "none" }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".375rem" }}>
            {["LOW","NOMINAL","CRITICAL"].map(l => <MonoTag key={l}>{l}</MonoTag>)}
          </div>
        </div>
      </div>

      <div className="db-report-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", marginBottom: "2px" }}>
        {/* Diagnosis */}
        <div className="db-card" style={{ padding: "1.75rem" }}>
          <DataRibbon />
          <MonoTag color={C.cyan}>ANALYZED_SYMPTOM</MonoTag>
          <h2 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "1.125rem", color: C.onSurf, marginTop: ".75rem", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "-.01em" }}>{diagnosis.primaryDiagnosis}</h2>
          {diagnosis.possibleCauses.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".625rem 0", borderBottom: `1px solid ${C.outlineV}` }}>
              <MonoTag color={C.onSurf}>{c}</MonoTag>
              <div style={{ width: 80, height: 3, background: C.bgHst, position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(20, 90 - i * 25)}%`, background: C.cyan, boxShadow: `0 0 6px rgba(0,240,255,0.5)` }} />
              </div>
              <MonoTag color={C.cyan}>{Math.max(15, 72 - i * 25)}%</MonoTag>
            </div>
          ))}
        </div>
        {/* Safety */}
        <div className="db-card" style={{ padding: "1.75rem" }}>
          <DataRibbon />
          <MonoTag color={C.onSurf}>TECHNICAL_DOCUMENTATION</MonoTag>
          <div style={{ marginTop: ".875rem", display: "flex", flexDirection: "column", gap: ".875rem" }}>
            {diagnosis.safetyWarnings.map((w, i) => (
              <div key={i} style={{ padding: ".875rem", background: C.bgLow, borderLeft: `2px solid ${C.yellow}` }}>
                <p style={{ fontFamily: C.inter, fontSize: ".8rem", color: C.onSurf, lineHeight: 1.7, fontStyle: "italic" }}>"{w}"</p>
                <div style={{ marginTop: ".5rem" }}>
                  <MonoTag color={C.cyan}>[SOURCE: MAINT_DOC_V2.14]</MonoTag>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sensor Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2px" }}>
        <div className="db-card-plain" style={{ padding: "1.25rem" }}>
          <MonoTag color={C.cyan}>SENSOR_STREAM_01</MonoTag>
          <div style={{ fontFamily: C.mono, fontSize: ".75rem", color: C.onSurf, marginTop: ".75rem", lineHeight: 2 }}>
            <div>TEMP: <span style={{ color: C.cyan }}>142.4°C</span></div>
            <div>VIB: <span style={{ color: C.cyan }}>0.82 G-RMS</span></div>
            <div>RPM: <span style={{ color: C.cyan }}>3420.0</span></div>
          </div>
        </div>
        <div className="db-card-plain" style={{ padding: "1.25rem" }}>
          <MonoTag color={C.cyan}>DIAGNOSTIC_EVENT_LOG</MonoTag>
          <div style={{ fontFamily: C.mono, fontSize: ".6rem", color: C.outlineV, marginTop: ".75rem", lineHeight: 2 }}>
            <div><span style={{ color: C.cyan }}>14:22:01</span> INITIALIZATION OF ACOUSTIC ARRAY... SUCCESS</div>
            <div><span style={{ color: C.cyan }}>14:22:05</span> ANALYZING AUDIO SIGNATURE AGAINST DB...</div>
            <div><span style={{ color: C.cyan, fontWeight: 700 }}>14:22:12</span> <span style={{ color: C.yellow }}>PATTERN DETECTED: {diagnosis.severity.toUpperCase()}_FAULT</span></div>
            <div><span style={{ color: C.cyan }}>14:22:13</span> GENERATING CONFIDENCE REPORT... READY</div>
          </div>
        </div>
        <div className="db-card-plain" style={{ padding: "1.25rem" }}>
          <MonoTag color={C.cyan}>SYSTEM_UPTIME</MonoTag>
          <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "1.5rem", color: C.cyan, lineHeight: 1, marginTop: ".75rem" }}>421:12:08</div>
          <div style={{ display: "flex", gap: "2px", marginTop: "1rem", flexWrap: "wrap" }}>
            {diagnosis.symptoms.map((s, i) => (
              <div key={i} style={{ padding: ".25rem .5rem", background: "rgba(0,240,255,0.08)", border: `1px solid rgba(0,240,255,0.2)` }}>
                <MonoTag color={C.cyan}>{s.slice(0, 20)}</MonoTag>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Guide Screen ───────────────────────────────────────────────────────────────
interface StepImageState { loading: boolean; imageBase64?: string; mimeType?: string; error?: string; }

function GuideScreen({ result, setScreen }: { result: AnalysisResult; setScreen: (s: Screen) => void }) {
  const { guide, diagnosis } = result;
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepImages, setStepImages] = useState<Record<number, StepImageState>>({});
  const progress = guide.steps.length ? Math.round((completedSteps.size / guide.steps.length) * 100) : 0;
  const toggleStep = (i: number) => setCompletedSteps(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });

  const generateImage = async (idx: number, step: { stepNumber: number; title: string; description: string }) => {
    setStepImages(p => ({ ...p, [idx]: { loading: true } }));
    try {
      const resp = await fetch("/api/generate-step-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepNumber: step.stepNumber,
          stepTitle: step.title,
          stepDescription: step.description,
          equipmentMake: diagnosis.primaryDiagnosis,
          equipmentModel: "",
        }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) throw new Error(data.error ?? "Generation failed");
      setStepImages(p => ({ ...p, [idx]: { loading: false, imageBase64: data.imageBase64, mimeType: data.mimeType } }));
    } catch (e) {
      setStepImages(p => ({ ...p, [idx]: { loading: false, error: e instanceof Error ? e.message : "Failed" } }));
    }
  };

  return (
    <div className="db-screen">
      <SectionHead eyebrow="03 // EXECUTION_PHASE" title={guide.title} />

      <div className="db-guide-grid" style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "2px" }}>
        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {/* Title card */}
          <div className="db-card" style={{ padding: "1.5rem" }}>
            <DataRibbon />
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginTop: ".75rem", marginBottom: "1.25rem" }}>
              <div style={{ padding: ".3rem .625rem", background: C.bgLow, display: "flex", alignItems: "center", gap: ".375rem" }}>
                <Zap size={11} color={C.cyan} />
                <MonoTag color={C.onSurf}>{guide.overallDifficulty.toUpperCase()}</MonoTag>
              </div>
              <div style={{ padding: ".3rem .625rem", background: C.bgLow, display: "flex", alignItems: "center", gap: ".375rem" }}>
                <Clock size={11} color={C.cyan} />
                <MonoTag color={C.onSurf}>{guide.totalTime}</MonoTag>
              </div>
            </div>
            <MonoTag color={C.cyan}>PROGRESS_TRACKER</MonoTag>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: ".25rem", marginBottom: ".375rem" }}>
              <MonoTag color={C.cyan}>{progress}%</MonoTag>
            </div>
            <div style={{ height: 3, background: C.bgHst }}>
              <div style={{ height: "100%", width: `${progress}%`, background: C.cyan, boxShadow: `0 0 8px rgba(0,240,255,0.8)`, transition: "width .4s" }} />
            </div>
          </div>

          {/* Tools */}
          <div className="db-card-plain" style={{ padding: "1.25rem" }}>
            <MonoTag color={C.onSurf}>TOOLS_REQUIRED</MonoTag>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: ".875rem" }}>
              {guide.requiredTools.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".5rem .75rem", background: C.bgHigh }}>
                  <div style={{ width: 10, height: 10, border: `1px solid ${C.cyan}`, flexShrink: 0 }} />
                  <MonoTag color={C.onSurf}>{t.toUpperCase()}</MonoTag>
                </div>
              ))}
            </div>
          </div>

          {/* Safety */}
          {guide.safetyWarnings.length > 0 && (
            <div style={{ padding: "1rem", background: `${C.errorC}25`, border: `1px solid ${C.error}40` }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
                <AlertTriangle size={14} color={C.error} />
                <MonoTag color={C.error}>SAFETY_PROTOCOL</MonoTag>
              </div>
              {guide.safetyWarnings.slice(0, 2).map((w, i) => (
                <p key={i} style={{ fontFamily: C.inter, fontSize: ".7rem", color: C.onSurf, lineHeight: 1.65, marginBottom: ".5rem" }}>{w}</p>
              ))}
            </div>
          )}

          <CyanBtn onClick={() => setScreen("parts")} small>
            <ShoppingCart size={12} /> PARTS HUB
          </CyanBtn>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {guide.steps.map((step, idx) => {
            const done = completedSteps.has(idx);
            const active = activeStep === idx && !done;
            return (
              <div key={idx} onClick={() => setActiveStep(idx)} style={{ padding: "1.5rem", background: active ? C.bgHigh : done ? C.bgMid : C.bgLow, cursor: "pointer", borderLeft: active ? `2px solid ${C.cyan}` : done ? `2px solid #4ade80` : `2px solid transparent`, transition: "all .15s", opacity: done ? .6 : 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: ".875rem" }}>
                    <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "1.25rem", color: active ? C.cyan : done ? "#4ade80" : C.outlineV, lineHeight: 1 }}>
                      {String(step.stepNumber).padStart(2, "0")}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: ".375rem" }}>
                        {active && <div style={{ padding: ".15rem .5rem", background: "rgba(0,240,255,0.1)", border: `1px solid rgba(0,240,255,0.3)` }}><MonoTag color={C.cyan}>ACTIVE_STEP</MonoTag></div>}
                        {done && <div style={{ padding: ".15rem .5rem", background: "rgba(74,222,128,0.1)", border: `1px solid rgba(74,222,128,0.3)` }}><MonoTag color="#4ade80">COMPLETED</MonoTag></div>}
                        {!active && !done && <div style={{ padding: ".15rem .5rem", background: C.bgHst }}><MonoTag>LOCKED</MonoTag></div>}
                      </div>
                      <h3 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "1rem", color: active ? C.onSurf : done ? C.onSurfV : C.onSurfV, textTransform: "uppercase", letterSpacing: "-.01em" }}>{step.title}</h3>
                    </div>
                  </div>
                  {done && <CheckCircle2 size={18} color="#4ade80" />}
                </div>
                {(active || done) && (
                  <div style={{ marginTop: "1rem", marginLeft: "2.875rem" }}>
                    <p style={{ fontFamily: C.inter, fontSize: ".85rem", color: C.onSurfV, lineHeight: 1.8, marginBottom: "1rem" }}>{step.description}</p>
                    {step.warnings.map((w, wi) => (
                      <div key={wi} style={{ display: "flex", alignItems: "flex-start", gap: ".5rem", padding: ".5rem .75rem", background: `${C.yellow}10`, borderLeft: `2px solid ${C.yellow}`, marginBottom: ".375rem" }}>
                        <AlertTriangle size={12} color={C.yellow} style={{ flexShrink: 0, marginTop: 2 }} />
                        <p style={{ fontFamily: C.inter, fontSize: ".75rem", color: C.yellow }}>{w}</p>
                      </div>
                    ))}

                    {/* ── Step Image Generation ─────────────────────────── */}
                    {(() => {
                      const img = stepImages[idx];
                      return (
                        <div style={{ marginTop: "1rem" }}>
                          {!img?.imageBase64 && (
                            <button
                              onClick={e => { e.stopPropagation(); generateImage(idx, step); }}
                              disabled={img?.loading}
                              style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", padding: ".45rem .875rem", background: "transparent", border: `1px solid rgba(0,240,255,${img?.loading ? "0.2" : "0.4"})`, cursor: img?.loading ? "not-allowed" : "pointer", fontFamily: C.grotesk, fontWeight: 700, fontSize: ".6rem", letterSpacing: ".12em", textTransform: "uppercase", color: img?.loading ? C.outlineV : C.cyan, transition: "all .15s" }}
                              onMouseEnter={e => { if (!img?.loading) e.currentTarget.style.background = "rgba(0,240,255,0.06)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                            >
                              {img?.loading ? (
                                <>
                                  <span style={{ display: "inline-block", width: 8, height: 8, border: `1px solid ${C.cyan}`, borderTopColor: "transparent", animation: "spin .7s linear infinite" }} />
                                  GENERATING...
                                </>
                              ) : (
                                <>
                                  <Cpu size={11} />
                                  GENERATE IMAGE
                                </>
                              )}
                            </button>
                          )}
                          {img?.error && (
                            <p style={{ fontFamily: C.mono, fontSize: ".65rem", color: C.error, marginTop: ".375rem" }}>ERROR: {img.error}</p>
                          )}
                          {img?.imageBase64 && (
                            <div style={{ marginTop: ".75rem", border: `1px solid rgba(0,240,255,0.2)`, background: C.bgLow, position: "relative" }}>
                              <div style={{ height: "2px", background: `linear-gradient(to right, ${C.cyan}, transparent)` }} />
                              <img
                                src={`data:${img.mimeType};base64,${img.imageBase64}`}
                                alt={`Step ${step.stepNumber}: ${step.title}`}
                                style={{ width: "100%", display: "block", maxHeight: 340, objectFit: "contain" }}
                              />
                              <div style={{ padding: ".5rem .75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <MonoTag color={C.cyan}>AI_GENERATED // STEP_{String(step.stepNumber).padStart(2,"0")}</MonoTag>
                                <button
                                  onClick={e => { e.stopPropagation(); setStepImages(p => { const n = {...p}; delete n[idx]; return n; }); }}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: C.outlineV, fontFamily: C.mono, fontSize: ".6rem", letterSpacing: ".08em" }}
                                >REGENERATE</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {active && (
                      <div style={{ display: "flex", gap: ".625rem", marginTop: "1rem" }}>
                        <CyanBtn onClick={() => toggleStep(idx)} small>MARK COMPLETE</CyanBtn>
                        <CyanBtn small ghost>REQUEST REMOTE HELP</CyanBtn>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Parts Screen ───────────────────────────────────────────────────────────────
function PartsScreen({ result }: { result: AnalysisResult }) {
  const { guide } = result;
  return (
    <div className="db-screen">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".625rem" }}>
            <div style={{ height: "1px", width: 32, background: C.cyan }} />
            <MonoTag color={C.cyan}>MODULE: SOURCING_v4.2</MonoTag>
          </div>
          <h1 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "clamp(1.5rem,3.5vw,2rem)", color: C.onSurf, textTransform: "uppercase" }}>PARTS &amp; INVENTORY</h1>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
          {[
            { label: "TOTAL_VALUATION", val: `$${guide.requiredParts.reduce((s, p) => s + (p.estimatedPriceLow + p.estimatedPriceHigh) / 2, 0).toFixed(2)}` },
            { label: "CRITICAL_LEVEL", val: "STABLE" },
          ].map(({ label, val }) => (
            <div key={label} className="db-card" style={{ padding: ".875rem 1.25rem", minWidth: 120 }}>
              <DataRibbon />
              <MonoTag style={{ display: "block", marginTop: ".25rem" }}>{label}</MonoTag>
              <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "1.125rem", color: C.cyan, marginTop: ".375rem", letterSpacing: "-.01em" }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="db-parts-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", marginBottom: "2px" }}>
        {guide.requiredParts.map((part, i) => (
          <div key={i} className="db-card" style={{ padding: "1.5rem" }}>
            <DataRibbon />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: ".5rem", marginBottom: "1rem" }}>
              <div>
                <MonoTag color={C.cyan}>ID: {part.partNumber}</MonoTag>
                <h3 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: ".9rem", color: C.onSurf, marginTop: ".375rem", textTransform: "uppercase", letterSpacing: "-.01em" }}>{part.name.toUpperCase()}</h3>
              </div>
              <div style={{ padding: ".25rem .5rem", background: `${priorityColor(part.priority)}18`, border: `1px solid ${priorityColor(part.priority)}40` }}>
                <MonoTag color={priorityColor(part.priority)}>{part.priority.toUpperCase()}</MonoTag>
              </div>
            </div>
            <p style={{ fontFamily: C.inter, fontSize: ".8rem", color: C.onSurfV, lineHeight: 1.7, marginBottom: "1.25rem" }}>{part.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".75rem 0", borderTop: `1px solid ${C.outlineV}`, borderBottom: `1px solid ${C.outlineV}`, marginBottom: "1rem" }}>
              <div>
                <MonoTag>EST. PRICE</MonoTag>
                <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "1.25rem", color: C.onSurf, letterSpacing: "-.02em" }}>${part.estimatedPriceLow}–${part.estimatedPriceHigh}</div>
              </div>
              <div style={{ display: "flex", gap: ".375rem" }}>
                {part.whereToBuy.slice(0, 2).map((src, si) => (
                  <div key={si} style={{ padding: ".25rem .5rem", background: C.bgLow }}>
                    <MonoTag color={C.onSurfV}>{src.toUpperCase().slice(0, 8)}</MonoTag>
                  </div>
                ))}
              </div>
            </div>
            <CyanBtn small><ShoppingCart size={11} /> INITIATE_PROCUREMENT</CyanBtn>
          </div>
        ))}
      </div>

      {/* Supplier Matrix */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
        <div className="db-card-plain" style={{ padding: "1.5rem" }}>
          <MonoTag color={C.cyan}>SUPPLIER_MATRIX</MonoTag>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: ".875rem" }}>
            {[
              { label: "ACTIVE_LINKS", val: "14_NODES" },
              { label: "AVG_DELIVERY", val: "18.4_HRS" },
              { label: "COMPLIANCE_SCORE", val: "A+" },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".75rem 1rem", background: C.bgHigh }}>
                <MonoTag>{label}</MonoTag>
                <MonoTag color={C.cyan}>{val}</MonoTag>
              </div>
            ))}
          </div>
        </div>
        <div className="db-card" style={{ padding: "1.5rem" }}>
          <DataRibbon />
          <MonoTag color={C.cyan}>SYSTEM_RECOMMENDATION</MonoTag>
          <p style={{ fontFamily: C.inter, fontSize: ".825rem", color: C.onSurf, lineHeight: 1.8, marginTop: ".75rem" }}>
            Cluster Node 01 currently maintains 100% stock on compatible replacement parts. Recommended for bulk procurement to optimize logistics chain.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [screen, setScreen] = useState<Screen>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingSubmit, setPendingSubmit] = useState<Parameters<typeof handleSubmit>[0] | null>(null);

  function handleSubmit(data: { equipment: { make: string; model: string; year: string; description: string }; media: { base64: string; mimeType: string }[] }) {
    setPendingSubmit(data);
    setScreen("analyzing");
    setEvents([]);
    setError(null);
    runAnalysis(data);
  }

  const runAnalysis = useCallback(async (data: Parameters<typeof handleSubmit>[0]) => {
    try {
      const resp = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!resp.ok || !resp.body) { setError("API connection failed."); return; }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const part of parts) {
          if (!part.startsWith("data:")) continue;
          try {
            const ev = JSON.parse(part.slice(5).trim()) as PipelineEvent & { data?: AnalysisResult };
            if (ev.status === "complete" && ev.data && "diagnosis" in ev.data) {
              setResult(ev.data as AnalysisResult);
              setScreen("report");
            } else {
              setEvents(p => [...p, ev]);
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }, []);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="db-root">
        <TopBar onMenu={() => setSidebarOpen(p => !p)} />
        <div className="db-body">
          <Sidebar
            screen={screen} setScreen={setScreen}
            isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
            onHome={() => setLocation("/")}
            hasResult={!!result}
            onNewDiag={() => { setScreen("capture"); setSidebarOpen(false); }}
          />
          <div className="db-content">
            <CanvasBg />
            {screen === "home" && <HomeScreen setScreen={setScreen} result={result} />}
            {screen === "capture" && <CaptureScreen setScreen={setScreen} onSubmit={handleSubmit} />}
            {screen === "analyzing" && <AnalyzingScreen events={events} error={error} />}
            {screen === "report" && result && <ReportScreen result={result} setScreen={setScreen} />}
            {screen === "guide" && result && <GuideScreen result={result} setScreen={setScreen} />}
            {screen === "parts" && result && <PartsScreen result={result} />}
            {(screen === "report" || screen === "guide" || screen === "parts") && !result && (
              <div className="db-screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                <MonoTag color={C.cyan}>NO_ACTIVE_DIAGNOSTIC</MonoTag>
                <CyanBtn onClick={() => setScreen("capture")} small><Plus size={13} /> START NEW DIAGNOSTIC</CyanBtn>
              </div>
            )}
          </div>
        </div>
        <BottomNav screen={screen} setScreen={setScreen} hasResult={!!result} />
        <OnboardingTour storageKey="lf_tour_dashboard" steps={DASHBOARD_TOUR_STEPS} />
        {/* Footer */}
        <footer style={{ background: C.bg, display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".625rem 1.5rem", borderTop: "0.5px solid rgba(0,240,255,0.1)", flexShrink: 0 }}>
          <span style={{ fontFamily: C.mono, fontSize: ".55rem", color: C.outlineV, textTransform: "uppercase", letterSpacing: ".06em" }}>© 2024 CYBER-IND DIAGNOSTICS UNIT</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["SAFETY_PROTOCOL","TECH_DOCS","API_V2","LOG_AUDIT"].map(l => (
              <span key={l} style={{ fontFamily: C.mono, fontSize: ".55rem", color: C.outlineV, letterSpacing: ".04em", cursor: "pointer" }}>{l}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".375rem" }}>
            <div style={{ width: 5, height: 5, background: "#4ade80" }} />
            <span style={{ fontFamily: C.mono, fontSize: ".55rem", color: C.cyan, letterSpacing: ".08em" }}>SYSTEM_STABLE</span>
          </div>
        </footer>
      </div>
    </>
  );
}
