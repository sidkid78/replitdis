import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Activity, BarChart2, Wrench, ShoppingCart, ShieldCheck,
  Play, Mic, CheckCircle2, AlertTriangle, ChevronRight,
  Settings, HelpCircle, Plus, Clock, MapPin, ExternalLink,
  Star, ArrowRight, ArrowLeft, Home, X, Upload, Square,
  Cpu, Database, Search, Zap, Moon, Sun,
} from "lucide-react";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const LIGHT = {
  surface: "#fcf9f8", surface_bright: "#ffffff",
  surface_cl: "#f5f2f1", surface_c: "#f0eded",
  surface_ch: "#eae7e6", surface_chh: "#e4e1e0",
  on_surface: "#1b1c1c", on_surface_v: "#4c4546",
  primary: "#00346f", primary_c: "#004a99",
  primary_fixed: "#d1e4ff", on_primary: "#ffffff",
  secondary: "#4c616c", secondary_c: "#cfe6f2",
  tertiary: "#5f2200", on_tertiary: "#ffffff",
  error: "#ba1a1a", error_c: "#ffdad6",
  outline_v: "rgba(208,201,201,0.2)",
  inter: "'Inter', sans-serif", sans: "'Public Sans', sans-serif",
  radius: "0.375rem", dark: false,
};
const DARK: typeof LIGHT = {
  surface: "#001a35", surface_bright: "#002d5c",
  surface_cl: "#00234a", surface_c: "#00234a",
  surface_ch: "#002d5c", surface_chh: "#003566",
  on_surface: "#fcf9f8", on_surface_v: "#b2cad3",
  primary: "#d1e4ff", primary_c: "#004a99",
  primary_fixed: "#d1e4ff", on_primary: "#00346f",
  secondary: "#b2cad3", secondary_c: "#1d3640",
  tertiary: "#ffb59a", on_tertiary: "#5f2200",
  error: "#ffb4ab", error_c: "#93000a",
  outline_v: "rgba(180,210,240,0.1)",
  inter: "'Inter', sans-serif", sans: "'Public Sans', sans-serif",
  radius: "0.375rem", dark: true,
};

const grad = (T: typeof LIGHT) =>
  T.dark
    ? `linear-gradient(135deg, #004a99, #0059b8)`
    : `linear-gradient(135deg, #00346f, #004a99)`;
const primaryText = (T: typeof LIGHT) => (T.dark ? T.primary : "#fff");

// ── Types ─────────────────────────────────────────────────────────────────────
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

// ── Severity helpers ──────────────────────────────────────────────────────────
const sevColor = (s: string, T: typeof LIGHT) => {
  if (s === "critical") return T.dark ? "#ffb4ab" : "#ba1a1a";
  if (s === "high") return T.tertiary;
  if (s === "medium") return "#b45309";
  return T.dark ? "#4ade80" : "#166534";
};
const sevNum = (s: string) =>
  s === "critical" ? 4 : s === "high" ? 3 : s === "medium" ? 2 : 1;
const priorityColor = (p: string, T: typeof LIGHT) =>
  p === "required" ? (T.dark ? "#ffb4ab" : "#ba1a1a") :
  p === "recommended" ? T.tertiary : (T.dark ? "#4ade80" : "#166534");

function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Global CSS ────────────────────────────────────────────────────────────────
const makeCSS = (T: typeof LIGHT) => `
  .db-root{display:flex;flex-direction:column;height:100dvh;background:${T.surface};font-family:${T.sans};overflow:hidden;transition:background .35s,color .35s;}
  .db-body{display:flex;flex:1;overflow:hidden;}
  .db-sidebar{width:232px;flex-shrink:0;background:${T.surface_cl};display:flex;flex-direction:column;height:100%;position:relative;z-index:2;}
  .db-content{flex:1;overflow-y:auto;background:${T.surface};}
  .db-topbar{height:56px;background:${T.surface_bright};display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;flex-shrink:0;box-shadow:0 1px 0 ${T.outline_v};}
  .db-screen{padding:2rem 1.75rem;}
  .db-bottom-nav{display:none;}

  .db-nav-item{display:flex;align-items:center;gap:.625rem;padding:.6875rem 1rem;background:transparent;border:none;cursor:pointer;border-radius:${T.radius};color:${T.on_surface_v};font-family:${T.inter};font-weight:500;font-size:.8125rem;text-align:left;transition:all .15s;width:100%;}
  .db-nav-item:hover{background:${T.surface_c};color:${T.on_surface};}
  .db-nav-item.active{background:${T.dark ? T.primary_c + "22" : T.primary + "0f"};color:${T.dark ? T.primary : T.primary};}
  .db-nav-item.locked{opacity:.35;cursor:default;}

  .db-card{background:${T.surface_bright};border-radius:${T.radius};box-shadow:0 2px 8px rgba(27,28,28,0.04);}
  .db-card-alt{background:${T.surface_cl};border-radius:${T.radius};}

  .db-input{width:100%;background:${T.surface_chh};border:none;border-bottom:2px solid transparent;outline:none;padding:.6875rem .875rem;font-family:${T.sans};font-size:.8375rem;color:${T.on_surface};border-radius:${T.radius} ${T.radius} 0 0;transition:border-color .2s;}
  .db-input:focus{border-bottom-color:${T.dark ? T.primary : "#00346f"};}
  .db-input::placeholder{color:${T.on_surface_v};opacity:.6;}

  @keyframes pulse-ring{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes waveBar{from{height:15%}to{height:90%}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes progress-shine{0%{background-position:-200% 0}100%{background-position:200% 0}}

  @media(max-width:768px){
    .db-sidebar{position:fixed;left:0;top:0;bottom:0;z-index:300;transform:translateX(-100%);box-shadow:none;}
    .db-sidebar.open{transform:translateX(0);box-shadow:8px 0 48px rgba(0,0,0,.18);}
    .db-sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,26,53,.6);z-index:299;backdrop-filter:blur(4px);}
    .db-sidebar-overlay.open{display:block;}
    .db-topbar{padding:0 1rem;}
    .db-content{padding-bottom:68px;}
    .db-bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;height:64px;background:${T.surface_bright};z-index:200;align-items:center;justify-content:space-around;box-shadow:0 -1px 0 ${T.outline_v};}
    .db-bottom-nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:.5rem .75rem;background:none;border:none;cursor:pointer;flex:1;}
    .db-screen{padding:1.5rem 1rem;}
    .db-home-hero{grid-template-columns:1fr!important;}
    .db-home-lower{grid-template-columns:1fr!important;}
    .db-capture-grid{grid-template-columns:1fr!important;}
    .db-report-grid{grid-template-columns:1fr!important;}
    .db-guide-meta{grid-template-columns:1fr 1fr!important;}
    .db-guide-grid{grid-template-columns:1fr!important;}
    .db-parts-stats{grid-template-columns:1fr!important;}
    .db-analyze-grid{grid-template-columns:1fr!important;}
  }
`;

// ── TopBar ────────────────────────────────────────────────────────────────────
function TopBar({ T, onMenu, dark, onDarkToggle }: {
  T: typeof LIGHT; onMenu: () => void; dark: boolean; onDarkToggle: () => void;
}) {
  return (
    <header className="db-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
        <button onClick={onMenu} style={{ padding: ".375rem", background: T.surface_c, border: "none", cursor: "pointer", borderRadius: T.radius, display: "flex", color: T.on_surface_v }}>
          <BarChart2 size={16} />
        </button>
        <div style={{ width: 28, height: 28, background: grad(T), display: "flex", alignItems: "center", justifyContent: "center", borderRadius: T.radius }}>
          <Activity size={13} color="#fff" />
        </div>
        <span style={{ fontFamily: T.inter, fontWeight: 800, fontSize: ".875rem", color: T.on_surface, letterSpacing: ".02em" }}>Listen & Fix</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".35rem .875rem", background: T.dark ? `${T.primary}22` : `${T.primary}10`, borderRadius: T.radius }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse-ring 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: T.inter, fontSize: ".65rem", fontWeight: 700, color: T.dark ? T.primary : T.primary, letterSpacing: ".06em" }}>AI ONLINE</span>
        </div>
        <button onClick={onDarkToggle} style={{ padding: ".375rem", background: T.surface_c, border: "none", cursor: "pointer", borderRadius: T.radius, display: "flex", color: T.on_surface_v }}>
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ T, screen, setScreen, isOpen, onClose, onHome, hasResult }: {
  T: typeof LIGHT; screen: Screen; setScreen: (s: Screen) => void;
  isOpen: boolean; onClose: () => void; onHome: () => void; hasResult: boolean;
}) {
  const items = [
    { key: "home" as Screen, icon: <BarChart2 size={15} />, label: "Diagnostics" },
    { key: "guide" as Screen, icon: <Wrench size={15} />, label: "Repair Guides", locked: !hasResult },
    { key: "parts" as Screen, icon: <ShoppingCart size={15} />, label: "Parts Hub", locked: !hasResult },
    { key: "report" as Screen, icon: <ShieldCheck size={15} />, label: "Safety Logs", locked: !hasResult },
  ];
  const go = (k: Screen, locked?: boolean) => { if (!locked) { setScreen(k); onClose(); } };
  return (
    <>
      <div className={`db-sidebar-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />
      <aside className={`db-sidebar ${isOpen ? "open" : ""}`}>
        <div style={{ padding: "1.25rem 1rem .875rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontFamily: T.inter, fontWeight: 800, fontSize: ".8rem", color: T.dark ? T.primary : T.primary, letterSpacing: ".04em" }}>FOREMAN MODE</p>
            <p style={{ fontFamily: T.inter, fontSize: ".6rem", color: T.on_surface_v, marginTop: ".2rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase" }}>Gemini 3 Flash · Active</p>
          </div>
          <button onClick={onClose} style={{ padding: ".25rem", background: "none", border: "none", cursor: "pointer", color: T.on_surface_v, display: "flex" }}><X size={16} /></button>
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: ".25rem", padding: "0 .625rem" }}>
          {items.map(({ key, icon, label, locked }) => (
            <button key={key} onClick={() => go(key, locked)} className={`db-nav-item${screen === key ? " active" : ""}${locked ? " locked" : ""}`}>
              {icon} {label}
              {screen === key && <ChevronRight size={13} style={{ marginLeft: "auto", opacity: .5 }} />}
            </button>
          ))}
        </nav>
        <div style={{ padding: ".625rem .625rem 1.25rem", display: "flex", flexDirection: "column", gap: ".5rem" }}>
          <button onClick={() => { go("capture"); }} style={{ width: "100%", padding: ".75rem .5rem", background: grad(T), border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 700, fontSize: ".7rem", color: "#fff", letterSpacing: ".08em", borderRadius: T.radius, display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }}>
            <Plus size={13} /> NEW DIAGNOSTIC
          </button>
          <button onClick={onHome} style={{ width: "100%", padding: ".625rem .5rem", background: "transparent", border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 600, fontSize: ".7rem", color: T.on_surface_v, display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }}>
            <Home size={13} /> Back to Landing
          </button>
          <div style={{ display: "flex", gap: ".375rem" }}>
            {[{ icon: <Settings size={12} />, label: "Settings" }, { icon: <HelpCircle size={12} />, label: "Support" }].map(({ icon, label }) => (
              <button key={label} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: ".375rem", padding: ".5rem .25rem", background: T.surface_c, border: "none", cursor: "pointer", color: T.on_surface_v, fontFamily: T.inter, fontSize: ".6rem", fontWeight: 500, borderRadius: T.radius, textTransform: "uppercase", letterSpacing: ".04em" }}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────
function BottomNav({ T, screen, setScreen, hasResult }: {
  T: typeof LIGHT; screen: Screen; setScreen: (s: Screen) => void; hasResult: boolean;
}) {
  const items = [
    { key: "home" as Screen, icon: <BarChart2 size={19} />, label: "Dashboard" },
    { key: "capture" as Screen, icon: <Mic size={19} />, label: "Diagnose" },
    { key: "guide" as Screen, icon: <Wrench size={19} />, label: "Guide", locked: !hasResult },
    { key: "parts" as Screen, icon: <ShoppingCart size={19} />, label: "Parts", locked: !hasResult },
  ];
  return (
    <div className="db-bottom-nav">
      {items.map(({ key, icon, label, locked }) => {
        const active = screen === key;
        return (
          <button key={key} onClick={() => !locked && setScreen(key)} className="db-bottom-nav-btn"
            style={{ color: locked ? T.surface_ch : active ? (T.dark ? T.primary : T.primary) : T.on_surface_v, opacity: locked ? .35 : 1, borderTop: active ? `2px solid ${T.dark ? T.primary : T.primary}` : "2px solid transparent" }}>
            {icon}
            <span style={{ fontFamily: T.inter, fontSize: ".55rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Label component ───────────────────────────────────────────────────────────
const Lbl = ({ T, children, color }: { T: typeof LIGHT; children: React.ReactNode; color?: string }) => (
  <span style={{ fontFamily: T.inter, fontSize: ".6875rem", fontWeight: 600, color: color ?? T.on_surface_v, letterSpacing: ".06em", textTransform: "uppercase" }}>{children}</span>
);

// ── Section header ────────────────────────────────────────────────────────────
const SectionHead = ({ T, eyebrow, title }: { T: typeof LIGHT; eyebrow: string; title: string }) => (
  <div style={{ marginBottom: "2rem" }}>
    <p style={{ fontFamily: T.inter, fontSize: ".6875rem", fontWeight: 700, color: T.dark ? T.primary : T.primary, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".5rem" }}>{eyebrow}</p>
    <h1 style={{ fontFamily: T.inter, fontWeight: 800, fontSize: "clamp(1.4rem,3.5vw,1.875rem)", color: T.on_surface, letterSpacing: "-.02em", lineHeight: 1.15 }}>{title}</h1>
  </div>
);

// ── Home Screen ───────────────────────────────────────────────────────────────
function HomeScreen({ T, setScreen, result }: { T: typeof LIGHT; setScreen: (s: Screen) => void; result: AnalysisResult | null }) {
  return (
    <div className="db-screen">
      <SectionHead T={T} eyebrow="Foreman Diagnostics" title="AI-Powered Appliance Analysis" />

      <div className="db-home-hero" style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="db-card" style={{ padding: "2rem", position: "relative", overflow: "hidden", background: grad(T) }}>
          <div style={{ position: "absolute", right: -12, bottom: -12, opacity: .08 }}><Activity size={140} color="#fff" /></div>
          <p style={{ fontFamily: T.inter, fontSize: ".6875rem", fontWeight: 600, color: "rgba(255,255,255,.7)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: ".875rem" }}>6-Stage AI Pipeline</p>
          <h2 style={{ fontFamily: T.inter, fontWeight: 900, fontSize: "clamp(1.4rem,4vw,1.875rem)", color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>Multimodal<br />Diagnostics</h2>
          <p style={{ fontFamily: T.sans, fontSize: ".825rem", color: "rgba(255,255,255,.75)", lineHeight: 1.7, maxWidth: 360, marginBottom: "1.5rem" }}>Upload or record a fault sound. Gemini's multimodal AI analyzes the signature and generates a precision repair blueprint in seconds.</p>
          <button onClick={() => setScreen("capture")} style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".75rem 1.375rem", background: "rgba(255,255,255,.95)", border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 700, fontSize: ".75rem", color: T.primary, letterSpacing: ".06em", borderRadius: T.radius, boxShadow: "0 4px 12px rgba(0,0,0,.18)" }}>
            <Play size={13} /> Start New Diagnosis
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="db-card-alt" style={{ padding: "1.125rem", flex: 1 }}>
            <p style={{ fontFamily: T.inter, fontSize: ".6rem", fontWeight: 700, color: T.on_surface_v, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: ".5rem" }}>Pipeline</p>
            <p style={{ fontFamily: T.inter, fontWeight: 900, fontSize: "2rem", color: T.dark ? T.primary : T.primary, letterSpacing: "-.03em" }}>6</p>
            <p style={{ fontFamily: T.inter, fontSize: ".7rem", color: T.on_surface_v, fontWeight: 500 }}>Stages</p>
          </div>
          <div className="db-card-alt" style={{ padding: "1.125rem", flex: 1 }}>
            <p style={{ fontFamily: T.inter, fontSize: ".6rem", fontWeight: 700, color: T.on_surface_v, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: ".5rem" }}>Latency</p>
            <p style={{ fontFamily: T.inter, fontWeight: 900, fontSize: "2rem", color: T.dark ? T.primary : T.primary, letterSpacing: "-.03em" }}>~60s</p>
            <p style={{ fontFamily: T.inter, fontSize: ".7rem", color: T.on_surface_v, fontWeight: 500 }}>Avg analysis</p>
          </div>
        </div>
      </div>

      {result && (
        <div className="db-card" style={{ padding: "1.5rem", marginBottom: "1.5rem", borderLeft: `3px solid ${sevColor(result.diagnosis.severity, T)}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <div>
              <Lbl T={T}>Last Diagnosis</Lbl>
              <h3 style={{ fontFamily: T.inter, fontWeight: 700, fontSize: ".9375rem", color: T.on_surface, marginTop: ".375rem" }}>{result.guide.title}</h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontFamily: T.inter, fontSize: ".6rem", fontWeight: 700, padding: ".25rem .75rem", background: `${sevColor(result.diagnosis.severity, T)}18`, color: sevColor(result.diagnosis.severity, T), borderRadius: T.radius, textTransform: "uppercase", letterSpacing: ".06em" }}>{result.diagnosis.severity}</span>
              <p style={{ fontFamily: T.inter, fontWeight: 900, fontSize: "1.5rem", color: T.dark ? T.primary : T.primary, marginTop: ".5rem" }}>{Math.round(result.diagnosis.confidence * 100)}%</p>
              <Lbl T={T}>confidence</Lbl>
            </div>
          </div>
          <p style={{ fontFamily: T.sans, fontSize: ".8125rem", color: T.on_surface_v, lineHeight: 1.7, marginBottom: ".875rem" }}>{result.diagnosis.primaryDiagnosis}</p>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <button onClick={() => setScreen("report")} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".6rem 1rem", background: grad(T), border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 700, fontSize: ".72rem", color: "#fff", letterSpacing: ".04em", borderRadius: T.radius }}>
              Full Report <ChevronRight size={12} />
            </button>
            <button onClick={() => setScreen("guide")} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".6rem 1rem", background: T.surface_c, border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 600, fontSize: ".72rem", color: T.on_surface_v, borderRadius: T.radius }}>
              Repair Guide
            </button>
          </div>
        </div>
      )}

      <div className="db-home-lower" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="db-card-alt" style={{ padding: "1.375rem" }}>
          <Lbl T={T} color={T.on_surface}>Pipeline Stages</Lbl>
          <div style={{ display: "flex", flexDirection: "column", gap: ".375rem", marginTop: ".875rem" }}>
            {[
              { n: "01", label: "Media Processing", desc: "Audio / visual signature ingestion" },
              { n: "02", label: "Acoustic Scan", desc: "FFT anomaly detection via Gemini" },
              { n: "03", label: "Multimodal Diagnosis", desc: "Root cause identification" },
              { n: "04", label: "Knowledge Retrieval", desc: "OEM specs & technical docs" },
              { n: "05", label: "Guide Synthesis", desc: "Step-by-step repair blueprint" },
              { n: "06", label: "Parts Sourcing", desc: "SKU matching & local availability" },
            ].map(({ n, label, desc }) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".625rem .875rem", background: T.surface_bright, borderRadius: T.radius }}>
                <span style={{ fontFamily: T.inter, fontSize: ".6rem", fontWeight: 800, color: T.dark ? T.primary : T.primary, opacity: .8, flexShrink: 0 }}>{n}</span>
                <div>
                  <p style={{ fontFamily: T.inter, fontWeight: 600, fontSize: ".75rem", color: T.on_surface }}>{label}</p>
                  <p style={{ fontFamily: T.sans, fontSize: ".67rem", color: T.on_surface_v, marginTop: ".125rem" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="db-card-alt" style={{ padding: "1.375rem" }}>
          <Lbl T={T} color={T.on_surface}>Supported Equipment</Lbl>
          <div style={{ marginTop: ".875rem", display: "flex", flexDirection: "column", gap: ".5rem" }}>
            {["HVAC Systems & Compressors","Industrial Pumps & Valves","Electric Motors & Drives","Automotive Components","Household Appliances","Power Tools & Equipment"].map(e => (
              <div key={e} style={{ display: "flex", alignItems: "center", gap: ".625rem", padding: ".625rem .875rem", background: T.surface_bright, borderRadius: T.radius }}>
                <CheckCircle2 size={12} color={T.dark ? T.primary : T.primary} />
                <p style={{ fontFamily: T.sans, fontSize: ".775rem", color: T.on_surface_v }}>{e}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Capture Screen ────────────────────────────────────────────────────────────
function CaptureScreen({ T, setScreen, onSubmit }: {
  T: typeof LIGHT; setScreen: (s: Screen) => void;
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
  const bars = Array.from({ length: 20 });

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

  const Field = ({ label, val, set, placeholder, req }: { label: string; val: string; set: (v: string) => void; placeholder?: string; req?: boolean }) => (
    <div style={{ marginBottom: ".875rem" }}>
      <p style={{ fontFamily: T.inter, fontSize: ".6875rem", fontWeight: 600, color: req ? (T.dark ? T.primary : T.primary) : T.on_surface_v, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: ".375rem" }}>{label}{req ? " *" : ""}</p>
      <input value={val} onChange={e => set(e.target.value)} placeholder={placeholder ?? ""} className="db-input" />
    </div>
  );

  return (
    <div className="db-screen">
      <SectionHead T={T} eyebrow="Step 1 of 2" title="New Diagnostic Session" />

      <div style={{ display: "flex", gap: ".25rem", marginBottom: "1.5rem", background: T.surface_c, padding: ".25rem", borderRadius: T.radius, width: "fit-content" }}>
        {(["record", "details"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: ".5rem 1.125rem", background: tab === t ? T.surface_bright : "transparent", border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 600, fontSize: ".75rem", color: tab === t ? (T.dark ? T.primary : T.primary) : T.on_surface_v, borderRadius: ".25rem", boxShadow: tab === t ? "0 1px 4px rgba(27,28,28,.08)" : "none", transition: "all .2s" }}>
            {t === "record" ? "Capture Media" : "Equipment Details"}
          </button>
        ))}
      </div>

      <div className="db-capture-grid" style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}>
          {tab === "record" ? (
            <>
              <div className="db-card" style={{ padding: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: recording ? "#22c55e" : T.surface_ch, boxShadow: recording ? "0 0 8px #22c55e" : "none", transition: "all .3s" }} />
                  <Lbl T={T} color={recording ? "#166534" : T.on_surface_v}>Acoustic {recording ? "Active" : "Standby"}</Lbl>
                  {audioBlob && !recording && <CheckCircle2 size={14} color={T.dark ? "#4ade80" : "#166534"} style={{ marginLeft: "auto" }} />}
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: ".2rem", height: 64, justifyContent: "center", marginBottom: "1.25rem" }}>
                  {bars.map((_, i) => (
                    <div key={i} style={{ width: 5, background: T.dark ? T.primary : T.primary, opacity: .15 + (i % 4) * .08, borderRadius: "2px 2px 0 0", animation: recording ? `waveBar 1.4s ease-in-out ${i * .07}s infinite alternate` : "none", height: recording ? undefined : audioBlob ? "55%" : "15%", transition: "height .3s" }} />
                  ))}
                </div>
                {recording && <p style={{ textAlign: "center", fontFamily: T.inter, fontWeight: 800, fontSize: "1.375rem", color: T.dark ? T.primary : T.primary, letterSpacing: "-.01em", marginBottom: ".875rem" }}>{String(Math.floor(time / 60)).padStart(2,"0")}:{String(time % 60).padStart(2,"0")}</p>}
                {audioBlob && !recording && <p style={{ textAlign: "center", fontFamily: T.sans, fontSize: ".775rem", color: T.dark ? "#4ade80" : "#166534", marginBottom: ".875rem" }}>Audio captured — {time}s recording ready</p>}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {!recording ? (
                    <button onClick={startRec} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".75rem 1.5rem", background: grad(T), border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 700, fontSize: ".75rem", color: "#fff", letterSpacing: ".06em", borderRadius: T.radius }}>
                      <Mic size={14} /> {audioBlob ? "Re-Record" : "Start Recording"}
                    </button>
                  ) : (
                    <button onClick={stopRec} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".75rem 1.5rem", background: T.dark ? T.error_c : "#ba1a1a", border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 700, fontSize: ".75rem", color: T.dark ? T.error : "#fff", letterSpacing: ".06em", borderRadius: T.radius }}>
                      <Square size={14} /> Stop Recording
                    </button>
                  )}
                </div>
              </div>
              <div>
                <input ref={fileRef} type="file" accept="audio/*,video/*,image/*" multiple onChange={handleFile} style={{ display: "none" }} />
                <button onClick={() => fileRef.current?.click()} style={{ width: "100%", padding: "1rem", background: T.surface_cl, border: `1.5px dashed ${T.surface_ch}`, cursor: "pointer", fontFamily: T.inter, fontWeight: 600, fontSize: ".75rem", color: T.on_surface_v, display: "flex", alignItems: "center", justifyContent: "center", gap: ".625rem", borderRadius: T.radius }}>
                  <Upload size={14} /> Upload Audio / Video / Image
                </button>
                {uploaded.map((f, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".5rem .875rem", background: T.surface_c, borderRadius: T.radius, marginTop: ".375rem" }}>
                    <span style={{ fontFamily: T.sans, fontSize: ".775rem", color: T.on_surface }}>{f.name}</span>
                    <button onClick={() => setUploaded(p => p.filter((_,j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: T.on_surface_v, display: "flex" }}><X size={13} /></button>
                  </div>
                ))}
              </div>
              {hasMedia && (
                <div style={{ padding: ".875rem 1.125rem", background: T.dark ? `${T.primary}18` : `${T.primary}08`, borderRadius: T.radius, borderLeft: `3px solid ${T.dark ? T.primary : T.primary}` }}>
                  <p style={{ fontFamily: T.sans, fontSize: ".775rem", color: T.on_surface_v }}>✓ Media ready — switch to Equipment Details to complete the form.</p>
                </div>
              )}
            </>
          ) : (
            <div className="db-card" style={{ padding: "1.75rem" }}>
              <Field label="Manufacturer / Make" val={make} set={setMake} placeholder="e.g. Carrier, Whirlpool, Bosch" req />
              <Field label="Model Number / Series" val={model} set={setModel} placeholder="e.g. 38CKC060300, WTW5000DW" req />
              <Field label="Year (optional)" val={year} set={setYear} placeholder="e.g. 2022" />
              <div style={{ marginBottom: ".875rem" }}>
                <p style={{ fontFamily: T.inter, fontSize: ".6875rem", fontWeight: 600, color: T.on_surface_v, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: ".375rem" }}>Describe the Problem *</p>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the sounds, symptoms, when it started..." rows={4} className="db-input" style={{ resize: "vertical", borderRadius: `${T.radius} ${T.radius} 0 0` }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <div className="db-card-alt" style={{ padding: "1.125rem" }}>
            <Lbl T={T} color={T.on_surface}>Checklist</Lbl>
            <div style={{ display: "flex", flexDirection: "column", gap: ".625rem", marginTop: ".875rem" }}>
              {[
                { label: "Equipment identified", done: !!(make && model) },
                { label: "Problem described", done: desc.length > 10 },
                { label: "Media captured", done: hasMedia },
              ].map(({ label, done }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
                  <div style={{ width: 18, height: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: done ? (T.dark ? T.primary : T.primary) : "transparent", border: done ? "none" : `1.5px solid ${T.surface_ch}`, borderRadius: ".25rem", transition: "all .3s" }}>
                    {done && <CheckCircle2 size={11} color={T.dark ? T.on_primary : "#fff"} />}
                  </div>
                  <p style={{ fontFamily: T.sans, fontSize: ".775rem", color: done ? T.on_surface : T.on_surface_v }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "1rem", background: T.dark ? `${T.primary}18` : `${T.primary}08`, borderRadius: T.radius }}>
            <Lbl T={T} color={T.dark ? T.primary : T.primary}>AI Analysis</Lbl>
            <p style={{ fontFamily: T.sans, fontSize: ".725rem", color: T.on_surface_v, lineHeight: 1.7, marginTop: ".5rem" }}>Gemini 3 Flash processes your media using multimodal reasoning. No files are stored permanently.</p>
          </div>
          <button onClick={handleSubmit} disabled={!ready} style={{ padding: ".875rem", background: ready ? grad(T) : T.surface_ch, border: "none", cursor: ready ? "pointer" : "default", fontFamily: T.inter, fontWeight: 700, fontSize: ".775rem", color: ready ? "#fff" : T.on_surface_v, letterSpacing: ".06em", transition: "all .3s", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", borderRadius: T.radius }}>
            Run AI Diagnostic <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Analyzing Screen ──────────────────────────────────────────────────────────
function AnalyzingScreen({ T, events, error }: { T: typeof LIGHT; events: PipelineEvent[]; error: string | null }) {
  const logRef = useRef<HTMLDivElement>(null);
  const last = events[events.length - 1];
  const pct = last ? Math.min((last.stage / 6) * 100, 100) : 0;
  const done = last?.status === "complete";

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [events]);

  const stages = [
    { n: 1, label: "Media Processing" }, { n: 2, label: "Acoustic Scan" },
    { n: 3, label: "AI Diagnosis" }, { n: 4, label: "Knowledge Base" },
    { n: 5, label: "Guide Synthesis" }, { n: 6, label: "Parts Sourcing" },
  ];

  return (
    <div className="db-screen">
      <SectionHead T={T} eyebrow={error ? "Pipeline Error" : done ? "Analysis Complete" : "Processing"} title={error ? "Diagnostic Failed" : done ? "Analysis Complete" : "Auto-Dex Running…"} />

      <div className="db-card" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".875rem" }}>
          <Lbl T={T}>{error ? "Error" : done ? "Complete" : "Processing pipeline"}</Lbl>
          <p style={{ fontFamily: T.inter, fontWeight: 900, fontSize: "1.375rem", color: error ? (T.dark ? T.error : "#ba1a1a") : T.dark ? T.primary : T.primary, letterSpacing: "-.02em" }}>
            {error ? "ERR" : `${Math.round(pct)}%`}
          </p>
        </div>
        <div style={{ height: 8, background: T.secondary_c, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 4, background: error ? (T.dark ? T.error : "#ba1a1a") : grad(T), width: `${error ? 100 : pct}%`, transition: "width .8s cubic-bezier(.4,0,.2,1)" }} />
        </div>
      </div>

      {error && (
        <div style={{ padding: "1.125rem 1.375rem", background: T.error_c, borderRadius: T.radius, marginBottom: "1.25rem", display: "flex", gap: ".75rem" }}>
          <AlertTriangle size={16} color={T.dark ? T.error : "#ba1a1a"} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontFamily: T.inter, fontWeight: 700, fontSize: ".8125rem", color: T.dark ? T.error : "#ba1a1a", marginBottom: ".375rem" }}>Pipeline Error</p>
            <p style={{ fontFamily: T.sans, fontSize: ".775rem", color: T.on_surface_v, lineHeight: 1.7 }}>{error}</p>
          </div>
        </div>
      )}

      <div className="db-analyze-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
          {stages.map(({ n, label }) => {
            const ev = events.find(e => e.stage === n);
            const active = last?.stage === n && last?.status === "progress";
            const past = !!ev;
            return (
              <div key={n} style={{ display: "flex", gap: ".75rem", alignItems: "center", padding: ".875rem 1rem", background: past ? T.surface_bright : T.surface_c, borderRadius: T.radius, borderLeft: `3px solid ${active ? (T.dark ? T.primary : T.primary) : past ? (T.dark ? "#4ade80" : "#166534") : T.surface_ch}`, opacity: past ? 1 : .4, transition: "all .4s", animation: past ? "fadeUp .3s ease-out" : "none" }}>
                <div style={{ width: 20, height: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: past && !active ? (T.dark ? "#4ade80" : "#166534") : active ? (T.dark ? T.primary : T.primary) : T.surface_ch, borderRadius: ".25rem", transition: "all .3s" }}>
                  {past && !active ? <CheckCircle2 size={11} color="#fff" /> : active ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "pulse-ring .8s ease-in-out infinite" }} /> : null}
                </div>
                <div>
                  <Lbl T={T} color={active ? (T.dark ? T.primary : T.primary) : past ? (T.dark ? "#4ade80" : "#166534") : T.on_surface_v}>Stage {String(n).padStart(2,"0")}</Lbl>
                  <p style={{ fontFamily: T.inter, fontWeight: 600, fontSize: ".775rem", color: T.on_surface, marginTop: ".2rem" }}>{label}</p>
                  {ev && <p style={{ fontFamily: T.sans, fontSize: ".67rem", color: T.on_surface_v, marginTop: ".125rem" }}>{ev.message}</p>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <div ref={logRef} style={{ background: T.dark ? T.surface_c : "#1a1b1b", borderRadius: T.radius, padding: "1rem", fontFamily: "'Courier New', monospace", fontSize: ".65rem", lineHeight: 2, color: "#d4d4d4", flex: 1, overflowY: "auto", maxHeight: 280, scrollbarWidth: "none" }}>
            <div style={{ color: "#93c5fd", marginBottom: ".375rem" }}>[LISTEN_FIX v3.0] PIPELINE START</div>
            {events.map((e, i) => (
              <div key={i}>
                <div style={{ color: e.status === "error" ? "#f87171" : e.status === "complete" ? "#4ade80" : "#93c5fd" }}>
                  &gt; STAGE_{String(e.stage).padStart(2,"0")}::{e.label?.replace(/ /g,"_").toUpperCase() ?? "EVENT"}
                </div>
                <div style={{ color: "#9ca3af", marginLeft: 8 }}>{e.message}</div>
                {e.data?.confidence && <div style={{ color: "#4ade80", marginLeft: 8 }}>CONFIDENCE: {Math.round((e.data.confidence as number) * 100)}%</div>}
              </div>
            ))}
            {!done && !error && <span style={{ display: "inline-block", width: 7, height: 13, background: "#93c5fd", animation: "blink 1s step-end infinite" }} />}
            {done && <div style={{ color: "#4ade80", marginTop: ".375rem" }}>&gt; COMPLETE ✓</div>}
          </div>
          <div className="db-card-alt" style={{ padding: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}><Cpu size={12} color={T.dark ? T.primary : T.primary} /><Lbl T={T}>Gemini 3 Flash</Lbl></div>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}><Database size={12} color={T.dark ? T.primary : T.primary} /><Lbl T={T}>RAG Pipeline</Lbl></div>
          </div>
          {!done && !error && (
            <div style={{ padding: ".875rem 1rem", background: T.surface_c, borderRadius: T.radius, display: "flex", alignItems: "center", gap: ".625rem" }}>
              <div style={{ width: 14, height: 14, border: `2px solid ${T.dark ? T.primary : T.primary}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", flexShrink: 0 }} />
              <p style={{ fontFamily: T.sans, fontSize: ".775rem", color: T.on_surface_v }}>{last?.message ?? "Initializing…"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Report Screen ─────────────────────────────────────────────────────────────
function ReportScreen({ T, setScreen, result }: { T: typeof LIGHT; setScreen: (s: Screen) => void; result: AnalysisResult }) {
  const { diagnosis, guide } = result;
  const sc = sevColor(diagnosis.severity, T);
  return (
    <div className="db-screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
        <div>
          <p style={{ fontFamily: T.inter, fontSize: ".6875rem", fontWeight: 700, color: T.dark ? T.primary : T.primary, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".5rem" }}>AI Diagnostic Report</p>
          <h1 style={{ fontFamily: T.inter, fontWeight: 800, fontSize: "clamp(1.3rem,3.5vw,1.75rem)", color: T.on_surface, letterSpacing: "-.02em", lineHeight: 1.15 }}>{guide.title}</h1>
        </div>
        <div className="db-card" style={{ padding: "1.125rem 1.375rem", textAlign: "center", minWidth: 120 }}>
          <Lbl T={T}>Confidence</Lbl>
          <p style={{ fontFamily: T.inter, fontWeight: 900, fontSize: "2.25rem", color: T.dark ? T.primary : T.primary, letterSpacing: "-.03em", marginTop: ".375rem" }}>{Math.round(diagnosis.confidence * 100)}%</p>
          <div style={{ height: 4, background: T.secondary_c, borderRadius: 2, marginTop: ".625rem" }}>
            <div style={{ height: "100%", borderRadius: 2, width: `${diagnosis.confidence * 100}%`, background: grad(T) }} />
          </div>
        </div>
      </div>

      <div className="db-report-grid" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <div className="db-card" style={{ padding: "1.125rem", borderTop: `3px solid ${sc}` }}>
            <Lbl T={T}>Severity</Lbl>
            <span style={{ display: "inline-block", marginTop: ".625rem", padding: ".25rem .75rem", background: `${sc}18`, color: sc, fontFamily: T.inter, fontWeight: 700, fontSize: ".65rem", borderRadius: T.radius, letterSpacing: ".06em", textTransform: "uppercase" }}>{diagnosis.severity}</span>
            <div style={{ display: "flex", gap: ".25rem", marginTop: ".75rem", height: 5 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, borderRadius: 2, background: i <= sevNum(diagnosis.severity) ? sc : T.surface_ch }} />)}
            </div>
          </div>
          {diagnosis.requiresExpertReview && (
            <div style={{ padding: "1rem", background: `${T.tertiary}12`, borderRadius: T.radius, borderLeft: `3px solid ${T.tertiary}` }}>
              <Lbl T={T} color={T.tertiary}>Expert Review</Lbl>
              <p style={{ fontFamily: T.sans, fontSize: ".725rem", color: T.on_surface_v, lineHeight: 1.7, marginTop: ".375rem" }}>AI recommends professional technician review.</p>
            </div>
          )}
          <div className="db-card-alt" style={{ padding: "1.125rem", flex: 1 }}>
            <Lbl T={T}>Symptoms</Lbl>
            <div style={{ marginTop: ".75rem", display: "flex", flexDirection: "column", gap: ".5rem" }}>
              {diagnosis.symptoms.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: ".5rem" }}>
                  <AlertTriangle size={11} color={sc} style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontFamily: T.sans, fontSize: ".725rem", color: T.on_surface, lineHeight: 1.6 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <div className="db-card" style={{ padding: "1.5rem" }}>
            <Lbl T={T} color={T.dark ? T.primary : T.primary}>Primary Diagnosis</Lbl>
            <p style={{ fontFamily: T.sans, fontSize: ".875rem", color: T.on_surface, lineHeight: 1.75, margin: ".875rem 0 1.25rem" }}>{diagnosis.primaryDiagnosis}</p>
            <Lbl T={T}>Possible Root Causes</Lbl>
            <div style={{ marginTop: ".75rem", display: "flex", flexDirection: "column", gap: ".625rem" }}>
              {diagnosis.possibleCauses.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: ".75rem", padding: ".625rem .875rem", background: T.surface_cl, borderRadius: T.radius }}>
                  <span style={{ fontFamily: T.inter, fontWeight: 800, fontSize: ".6rem", color: T.dark ? T.primary : T.primary, opacity: .7, flexShrink: 0, marginTop: 2 }}>{String(i+1).padStart(2,"0")}</span>
                  <p style={{ fontFamily: T.sans, fontSize: ".8rem", color: T.on_surface_v, lineHeight: 1.7 }}>{c}</p>
                </div>
              ))}
            </div>
          </div>
          {diagnosis.safetyWarnings.length > 0 && (
            <div style={{ padding: "1.125rem 1.375rem", background: `${T.tertiary}10`, borderRadius: T.radius, borderLeft: `3px solid ${T.tertiary}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
                <AlertTriangle size={14} color={T.tertiary} />
                <Lbl T={T} color={T.tertiary}>Safety Warnings</Lbl>
              </div>
              {diagnosis.safetyWarnings.map((w, i) => (
                <p key={i} style={{ fontFamily: T.sans, fontSize: ".775rem", color: T.on_surface_v, lineHeight: 1.7, marginBottom: ".375rem" }}>• {w}</p>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: ".625rem" }}>
            <button onClick={() => setScreen("guide")} style={{ flex: 1, padding: ".8rem 1rem", background: grad(T), border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 700, fontSize: ".75rem", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", borderRadius: T.radius }}>
              Repair Guide <ArrowRight size={13} />
            </button>
            <button onClick={() => setScreen("parts")} style={{ flex: 1, padding: ".8rem 1rem", background: T.surface_c, border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 600, fontSize: ".75rem", color: T.on_surface_v, borderRadius: T.radius }}>
              Parts Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Guide Screen ──────────────────────────────────────────────────────────────
function GuideScreen({ T, setScreen, result }: { T: typeof LIGHT; setScreen: (s: Screen) => void; result: AnalysisResult }) {
  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState<boolean[]>([]);
  const { guide } = result;
  const s = guide.steps[activeStep];
  useEffect(() => { setChecked(new Array(guide.requiredTools.length).fill(false)); }, [guide.requiredTools.length]);
  if (!s) return null;

  return (
    <div className="db-screen">
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontFamily: T.inter, fontSize: ".6875rem", fontWeight: 700, color: T.dark ? T.primary : T.primary, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".5rem" }}>Repair Guide</p>
        <h1 style={{ fontFamily: T.inter, fontWeight: 800, fontSize: "clamp(1.3rem,3.5vw,1.75rem)", color: T.on_surface, letterSpacing: "-.02em", lineHeight: 1.15, marginBottom: ".625rem" }}>{guide.title}</h1>
        <p style={{ fontFamily: T.sans, fontSize: ".8375rem", color: T.on_surface_v, lineHeight: 1.7, maxWidth: 580 }}>{guide.summary}</p>
      </div>

      <div className="db-guide-meta" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: ".375rem", marginBottom: "1.25rem" }}>
        {[{ k: "Difficulty", v: guide.overallDifficulty }, { k: "Duration", v: guide.totalTime }, { k: "Steps", v: String(guide.steps.length) }, { k: "AI Source", v: "Gemini 3" }].map(({ k, v }) => (
          <div key={k} className="db-card-alt" style={{ padding: ".875rem" }}>
            <Lbl T={T}>{k}</Lbl>
            <p style={{ fontFamily: T.inter, fontWeight: 700, fontSize: ".8rem", color: T.on_surface, marginTop: ".375rem" }}>{v}</p>
          </div>
        ))}
      </div>

      {guide.safetyWarnings.length > 0 && (
        <div style={{ padding: ".875rem 1.125rem", background: `${T.tertiary}10`, borderRadius: T.radius, borderLeft: `3px solid ${T.tertiary}`, display: "flex", gap: ".75rem", marginBottom: "1.25rem" }}>
          <AlertTriangle size={14} color={T.tertiary} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <Lbl T={T} color={T.tertiary}>Safety First</Lbl>
            <div style={{ marginTop: ".375rem" }}>
              {guide.safetyWarnings.slice(0,2).map((w,i) => <p key={i} style={{ fontFamily: T.sans, fontSize: ".75rem", color: T.on_surface_v, lineHeight: 1.7 }}>• {w}</p>)}
            </div>
          </div>
        </div>
      )}

      <div className="db-guide-grid" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {guide.requiredTools.length > 0 && (
            <div className="db-card-alt" style={{ padding: "1.125rem" }}>
              <Lbl T={T}>Required Tools</Lbl>
              <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginTop: ".75rem" }}>
                {guide.requiredTools.map((t, i) => (
                  <label key={t} style={{ display: "flex", alignItems: "center", gap: ".625rem", cursor: "pointer" }} onClick={() => setChecked(c => c.map((v,j) => j === i ? !v : v))}>
                    <div style={{ width: 16, height: 16, border: `2px solid ${checked[i] ? (T.dark ? T.primary : T.primary) : T.surface_ch}`, background: checked[i] ? (T.dark ? T.primary : T.primary) : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: ".2rem", transition: "all .2s" }}>
                      {checked[i] && <CheckCircle2 size={10} color={T.dark ? T.on_primary : "#fff"} />}
                    </div>
                    <span style={{ fontFamily: T.sans, fontSize: ".775rem", color: checked[i] ? T.on_surface : T.on_surface_v, textDecoration: checked[i] ? "line-through" : "none" }}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: ".25rem" }}>
            {guide.steps.map((st, i) => (
              <button key={i} onClick={() => setActiveStep(i)} style={{ textAlign: "left", padding: ".75rem .875rem", background: i === activeStep ? T.surface_bright : T.surface_c, border: "none", cursor: "pointer", borderRadius: T.radius, borderLeft: `3px solid ${i === activeStep ? (T.dark ? T.primary : T.primary) : "transparent"}`, transition: "all .15s" }}>
                <Lbl T={T} color={i === activeStep ? (T.dark ? T.primary : T.primary) : T.on_surface_v}>Step {String(st.stepNumber).padStart(2,"0")}</Lbl>
                <p style={{ fontFamily: T.inter, fontWeight: 600, fontSize: ".75rem", color: i === activeStep ? T.on_surface : T.on_surface_v, marginTop: ".25rem" }}>{st.title}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="db-card" style={{ padding: "1.75rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 12, fontFamily: T.inter, fontWeight: 900, fontSize: "5.5rem", color: T.dark ? T.primary : T.primary, opacity: T.dark ? .05 : .03, lineHeight: 1, userSelect: "none" }}>{String(s.stepNumber).padStart(2,"0")}</div>
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: T.inter, fontWeight: 800, fontSize: "1.0625rem", color: T.on_surface, letterSpacing: "-.01em", marginBottom: ".375rem" }}>{s.title}</h2>
            <div style={{ display: "flex", gap: ".875rem", marginBottom: "1rem" }}>
              <Lbl T={T}>Step {activeStep + 1} of {guide.steps.length}</Lbl>
              {s.duration && <><span style={{ color: T.surface_ch }}>·</span><div style={{ display: "flex", alignItems: "center", gap: ".25rem" }}><Clock size={10} color={T.on_surface_v} /><Lbl T={T}>{s.duration}</Lbl></div></>}
            </div>
            <p style={{ fontFamily: T.sans, fontSize: ".8375rem", color: T.on_surface, lineHeight: 1.8, marginBottom: "1rem" }}>{s.description}</p>
            {s.warnings.length > 0 && (
              <div style={{ padding: ".875rem 1rem", background: `${T.tertiary}10`, borderRadius: T.radius, borderLeft: `2px solid ${T.tertiary}` }}>
                {s.warnings.map((w, i) => <p key={i} style={{ fontFamily: T.sans, fontStyle: "italic", fontSize: ".75rem", color: T.tertiary, lineHeight: 1.7 }}>⚠ {w}</p>)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", gap: ".75rem" }}>
        <button onClick={() => setActiveStep(s => Math.max(0, s - 1))} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".7rem 1.125rem", background: T.surface_c, border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 600, fontSize: ".75rem", color: T.on_surface_v, borderRadius: T.radius }}>
          <ArrowLeft size={13} /> Prev
        </button>
        <div style={{ display: "flex", gap: ".375rem" }}>
          {guide.steps.map((_, i) => <div key={i} onClick={() => setActiveStep(i)} style={{ width: i === activeStep ? 20 : 6, height: 4, borderRadius: 2, background: i === activeStep ? (T.dark ? T.primary : T.primary) : T.surface_ch, transition: "all .3s", cursor: "pointer" }} />)}
        </div>
        <button onClick={() => { if (activeStep < guide.steps.length - 1) setActiveStep(s => s + 1); else setScreen("parts"); }} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".7rem 1.125rem", background: grad(T), border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 700, fontSize: ".75rem", color: "#fff", borderRadius: T.radius }}>
          {activeStep < guide.steps.length - 1 ? "Next Step" : "Parts Hub"} <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Parts Screen ──────────────────────────────────────────────────────────────
function PartsScreen({ T, result }: { T: typeof LIGHT; result: AnalysisResult }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const parts = result.guide.requiredParts;
  if (!parts.length) return (
    <div className="db-screen">
      <SectionHead T={T} eyebrow="Parts Hub" title="No Replacement Parts Required" />
      <div className="db-card" style={{ padding: "2.5rem", textAlign: "center" }}>
        <CheckCircle2 size={32} color={T.dark ? "#4ade80" : "#166534"} style={{ margin: "0 auto .875rem" }} />
        <p style={{ fontFamily: T.inter, fontWeight: 600, fontSize: ".875rem", color: T.on_surface }}>The repair can be completed with tools only.</p>
      </div>
    </div>
  );

  const statsData = [
    { k: "Required", v: parts.filter(p => p.priority === "required").length },
    { k: "Recommended", v: parts.filter(p => p.priority === "recommended").length },
    { k: "Optional", v: parts.filter(p => p.priority === "optional").length },
  ];

  return (
    <div className="db-screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
        <div>
          <p style={{ fontFamily: T.inter, fontSize: ".6875rem", fontWeight: 700, color: T.dark ? T.primary : T.primary, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".5rem" }}>AI-Identified Components</p>
          <h1 style={{ fontFamily: T.inter, fontWeight: 800, fontSize: "clamp(1.3rem,3.5vw,1.75rem)", color: T.on_surface, letterSpacing: "-.02em" }}>Required Components</h1>
        </div>
        <div className="db-card" style={{ padding: "1rem 1.375rem" }}>
          <Lbl T={T}>Parts identified</Lbl>
          <p style={{ fontFamily: T.inter, fontWeight: 900, fontSize: "1.75rem", color: T.dark ? T.primary : T.primary, letterSpacing: "-.03em", marginTop: ".25rem" }}>{parts.length}</p>
        </div>
      </div>

      <div className="db-parts-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".5rem", marginBottom: "1.375rem" }}>
        {statsData.map(({ k, v }) => (
          <div key={k} className="db-card-alt" style={{ padding: "1rem 1.125rem" }}>
            <Lbl T={T}>{k}</Lbl>
            <p style={{ fontFamily: T.inter, fontWeight: 900, fontSize: "1.625rem", color: T.on_surface, letterSpacing: "-.03em", marginTop: ".375rem" }}>{v}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: ".625rem" }}>
        {parts.map((p, i) => {
          const pc = priorityColor(p.priority, T);
          return (
            <div key={i} className="db-card" style={{ overflow: "hidden" }}>
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ width: "100%", display: "flex", gap: "1rem", padding: "1.25rem 1.5rem", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", gap: ".5rem", marginBottom: ".625rem", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ padding: ".25rem .7rem", background: `${pc}18`, color: pc, fontFamily: T.inter, fontWeight: 700, fontSize: ".6rem", borderRadius: T.radius, letterSpacing: ".06em", textTransform: "uppercase" }}>{p.priority}</span>
                    {p.partNumber !== "N/A" && <span style={{ fontFamily: T.inter, fontSize: ".6rem", color: T.on_surface_v, fontWeight: 500 }}>SKU: {p.partNumber}</span>}
                  </div>
                  <p style={{ fontFamily: T.inter, fontWeight: 700, fontSize: ".9375rem", color: T.on_surface }}>{p.name}</p>
                  <p style={{ fontFamily: T.sans, fontSize: ".775rem", color: T.on_surface_v, marginTop: ".375rem", lineHeight: 1.6 }}>{p.description}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <Lbl T={T}>Price Range</Lbl>
                  <p style={{ fontFamily: T.inter, fontWeight: 800, fontSize: ".9375rem", color: T.on_surface, marginTop: ".375rem" }}>${p.estimatedPriceLow} — ${p.estimatedPriceHigh}</p>
                </div>
              </button>
              {openIdx === i && (
                <div style={{ padding: "0 1.5rem 1.25rem" }}>
                  <Lbl T={T} color={T.on_surface_v}>Where to Buy</Lbl>
                  <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: ".625rem" }}>
                    {p.whereToBuy.map((store, j) => (
                      <button key={j} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".6rem 1rem", background: T.surface_c, border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 600, fontSize: ".72rem", color: T.on_surface_v, borderRadius: T.radius }}>
                        <ShoppingCart size={11} /> {store} <ExternalLink size={10} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [screen, setScreen] = useState<Screen>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [dark, setDark] = useState(false);
  const T = dark ? DARK : LIGHT;
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [pendingData, setPendingData] = useState<Parameters<Parameters<typeof CaptureScreen>[0]["onSubmit"]>[0] | null>(null);

  const runPipeline = useCallback(async (data: NonNullable<typeof pendingData>) => {
    setEvents([]); setPipelineError(null);
    try {
      const resp = await fetch("/api/diagnose", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!resp.ok || !resp.body) throw new Error(`API error: ${resp.status}`);
      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const ev: PipelineEvent = JSON.parse(line.slice(6));
              setEvents(p => [...p, ev]);
              if (ev.status === "complete" && ev.data) {
                setResult(ev.data as unknown as AnalysisResult);
                setTimeout(() => setScreen("report"), 1200);
              }
              if (ev.status === "error") setPipelineError(ev.message);
            } catch { /* ignore */ }
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Connection failed.";
      setPipelineError(msg);
      setEvents(p => [...p, { stage: 0, status: "error", message: msg }]);
    }
  }, []);

  useEffect(() => {
    if (pendingData && screen === "analyzing") {
      runPipeline(pendingData);
      setPendingData(null);
    }
  }, [pendingData, screen, runPipeline]);

  return (
    <div className="db-root" style={{ background: T.surface, color: T.on_surface }}>
      <style>{makeCSS(T)}</style>
      <TopBar T={T} onMenu={() => setSidebarOpen(o => !o)} dark={dark} onDarkToggle={() => setDark(d => !d)} />
      <div className="db-body">
        <Sidebar T={T} screen={screen} setScreen={setScreen} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onHome={() => setLocation("/")} hasResult={result !== null} />
        <div className="db-content">
          {screen === "home" && <HomeScreen T={T} setScreen={setScreen} result={result} />}
          {screen === "capture" && <CaptureScreen T={T} setScreen={setScreen} onSubmit={d => { setPendingData(d); }} />}
          {screen === "analyzing" && <AnalyzingScreen T={T} events={events} error={pipelineError} />}
          {screen === "report" && result && <ReportScreen T={T} setScreen={setScreen} result={result} />}
          {screen === "report" && !result && <div className="db-screen"><p style={{ fontFamily: T.sans, color: T.on_surface_v }}>No diagnosis yet — run a diagnostic first.</p></div>}
          {screen === "guide" && result && <GuideScreen T={T} setScreen={setScreen} result={result} />}
          {screen === "guide" && !result && <div className="db-screen"><p style={{ fontFamily: T.sans, color: T.on_surface_v }}>No guide yet — run a diagnostic first.</p></div>}
          {screen === "parts" && result && <PartsScreen T={T} result={result} />}
          {screen === "parts" && !result && <div className="db-screen"><p style={{ fontFamily: T.sans, color: T.on_surface_v }}>No parts yet — run a diagnostic first.</p></div>}
        </div>
      </div>
      <BottomNav T={T} screen={screen} setScreen={setScreen} hasResult={result !== null} />
    </div>
  );
}
