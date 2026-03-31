import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Activity, BarChart2, Wrench, ShoppingCart, ShieldCheck,
  Play, Mic, CheckCircle2, AlertTriangle, ChevronRight,
  Settings, HelpCircle, Plus, Clock, MapPin, ExternalLink,
  Star, ArrowRight, ArrowLeft, Home, X, Upload, Square,
  Cpu, Database, Search, Zap,
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#131313", s0: "#0e0e0e", s1: "#1c1b1b", s2: "#2a2a2a", s3: "#353534",
  txt: "#e5e2e1", sub: "#9b9896", orange: "#ff5f00", light: "#ffb599",
  font: "'Space Grotesk', sans-serif", mono: "'Space Mono', monospace",
};
const grad = `linear-gradient(135deg, ${C.orange}, ${C.light})`;
const LABEL: React.CSSProperties = {
  fontFamily: C.font, fontSize: "0.6rem", letterSpacing: "0.08em",
  textTransform: "uppercase", color: C.sub, fontWeight: 600,
};
const H: React.CSSProperties = { fontFamily: C.font, color: C.txt, fontWeight: 800, letterSpacing: "-0.02em" };
const dotBg: React.CSSProperties = {
  backgroundImage: `radial-gradient(${C.s2} 1px, transparent 1px)`,
  backgroundSize: "24px 24px",
};

// ─── Types ─────────────────────────────────────────────────────────────────────
type Screen = "home" | "capture" | "analyzing" | "report" | "guide" | "parts";

interface DiagnosisResult {
  primaryDiagnosis: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  symptoms: string[];
  possibleCauses: string[];
  requiresExpertReview: boolean;
  safetyWarnings: string[];
}

interface RepairStep {
  stepNumber: number;
  title: string;
  description: string;
  duration: string;
  warnings: string[];
}

interface RepairPart {
  name: string;
  partNumber: string;
  description: string;
  estimatedPriceLow: number;
  estimatedPriceHigh: number;
  priority: "required" | "recommended" | "optional";
  whereToBuy: string[];
}

interface GuideResult {
  title: string;
  summary: string;
  totalTime: string;
  overallDifficulty: string;
  safetyWarnings: string[];
  requiredTools: string[];
  steps: RepairStep[];
  requiredParts: RepairPart[];
}

interface PipelineEvent {
  stage: number;
  status: "progress" | "complete" | "error" | "warning";
  message: string;
  label?: string;
  data?: { confidence?: number; severity?: string; [key: string]: unknown };
}

interface AnalysisResult {
  diagnosis: DiagnosisResult;
  guide: GuideResult;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  .db-root{display:flex;flex-direction:column;height:100dvh;background:${C.bg};font-family:${C.font};overflow:hidden;}
  .db-body{display:flex;flex:1;overflow:hidden;}
  .db-sidebar{width:220px;flex-shrink:0;background:${C.s1};display:flex;flex-direction:column;height:100%;position:relative;z-index:2;transition:transform 0.3s;}
  .db-content{flex:1;overflow-y:auto;}
  .db-topbar{height:52px;background:${C.bg};display:flex;align-items:center;justify-content:space-between;padding:0 24px;flex-shrink:0;border-bottom:1px solid ${C.s2};}
  .db-bottom-nav{display:none;}
  .db-screen{padding:24px 20px;}

  .db-home-hero{display:grid;grid-template-columns:1fr 240px;gap:12px;margin-bottom:24px;}
  .db-home-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
  .db-capture-grid{display:grid;grid-template-columns:1fr 220px;gap:12px;}
  .db-report-grid{display:grid;grid-template-columns:180px 1fr;gap:8px;}
  .db-guide-grid{display:grid;grid-template-columns:200px 1fr;gap:8px;}
  .db-guide-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;background:${C.s1};padding:2px;margin-bottom:12px;}
  .db-parts-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:${C.s0};padding:2px;margin-bottom:12px;border-left:3px solid ${C.orange};}

  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes waveBar{from{height:15%}to{height:90%}}
  @keyframes fadeInUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

  @media(max-width:768px){
    .db-sidebar{position:fixed;left:0;top:0;bottom:0;z-index:300;transform:translateX(-100%);}
    .db-sidebar.open{transform:translateX(0);box-shadow:4px 0 40px rgba(0,0,0,0.8);}
    .db-sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:299;}
    .db-sidebar-overlay.open{display:block;}
    .db-topbar{padding:0 16px;}
    .db-content{padding-bottom:64px;}
    .db-bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;height:64px;background:${C.s1};border-top:1px solid ${C.s2};z-index:200;align-items:center;justify-content:space-around;}
    .db-bottom-nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 12px;background:none;border:none;cursor:pointer;flex:1;}
    .db-screen{padding:20px 16px;}
    .db-home-hero{grid-template-columns:1fr;}
    .db-home-grid{grid-template-columns:1fr;gap:16px;}
    .db-capture-grid{grid-template-columns:1fr;}
    .db-report-grid{grid-template-columns:1fr;}
    .db-guide-grid{grid-template-columns:1fr;}
    .db-guide-meta{grid-template-columns:repeat(2,1fr);}
    .db-parts-stats{grid-template-columns:1fr;}
  }
`;

// ─── TopBar ───────────────────────────────────────────────────────────────────
function TopBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="db-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={onMenuToggle} style={{ padding: 6, background: "none", border: "none", cursor: "pointer", color: C.sub, display: "flex" }}>
          <BarChart2 size={16} />
        </button>
        <div style={{ width: 26, height: 26, background: grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Activity size={13} color="#131313" />
        </div>
        <span style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.9rem", color: C.txt, letterSpacing: "0.05em" }}>LISTEN & FIX</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: C.s1 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s ease-in-out infinite" }} />
          <span style={{ ...LABEL, color: "#4ade80" }}>AI ONLINE</span>
        </div>
      </div>
    </header>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ screen, setScreen, isOpen, onClose, onHome, hasResult }: {
  screen: Screen; setScreen: (s: Screen) => void; isOpen: boolean; onClose: () => void; onHome: () => void; hasResult: boolean;
}) {
  const items = [
    { key: "home" as Screen, icon: <BarChart2 size={16} />, label: "Diagnostics" },
    { key: "guide" as Screen, icon: <Wrench size={16} />, label: "Repair Guides", locked: !hasResult },
    { key: "parts" as Screen, icon: <ShoppingCart size={16} />, label: "Parts Hub", locked: !hasResult },
    { key: "report" as Screen, icon: <ShieldCheck size={16} />, label: "Safety Logs", locked: !hasResult },
  ];
  const go = (k: Screen, locked?: boolean) => { if (!locked) { setScreen(k); onClose(); } };
  return (
    <>
      <div className={`db-sidebar-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />
      <aside className={`db-sidebar ${isOpen ? "open" : ""}`}>
        <div style={{ padding: "16px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontFamily: C.font, fontWeight: 900, fontSize: "0.85rem", color: C.orange, letterSpacing: "0.04em" }}>FOREMAN MODE</p>
            <p style={{ ...LABEL, marginTop: 2 }}>Gemini 3 Flash · Active</p>
          </div>
          <button onClick={onClose} style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: C.sub, display: "flex" }}><X size={16} /></button>
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 0 8px" }}>
          {items.map(({ key, icon, label, locked }) => {
            const active = screen === key;
            return (
              <button key={key} onClick={() => go(key, locked)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: active ? C.s2 : "transparent", border: "none", cursor: locked ? "default" : "pointer", borderLeft: active ? `3px solid ${C.orange}` : "3px solid transparent", color: locked ? C.s3 : active ? C.orange : C.sub, fontFamily: C.font, fontWeight: active ? 700 : 500, fontSize: "0.8rem", textAlign: "left", transition: "all 0.15s", opacity: locked ? 0.4 : 1 }}>
                {icon} {label}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "0 12px 16px" }}>
          <button onClick={() => { go("capture"); }} style={{ width: "100%", padding: "12px 8px", background: grad, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.65rem", color: "#131313", letterSpacing: "0.1em", marginBottom: 8 }}>
            NEW DIAGNOSTIC
          </button>
          <button onClick={onHome} style={{ width: "100%", padding: "9px 8px", background: "none", border: `1px solid ${C.s3}`, cursor: "pointer", fontFamily: C.font, fontWeight: 700, fontSize: "0.62rem", color: C.sub, letterSpacing: "0.06em", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 }}>
            <Home size={11} /> BACK TO HOME
          </button>
          <div style={{ display: "flex", gap: 4 }}>
            {[{ icon: <Settings size={12} />, label: "Settings" }, { icon: <HelpCircle size={12} />, label: "Support" }].map(({ icon, label }) => (
              <button key={label} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "7px 4px", background: C.s2, border: "none", cursor: "pointer", color: C.sub, fontFamily: C.font, fontSize: "0.6rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ screen, setScreen, hasResult }: { screen: Screen; setScreen: (s: Screen) => void; hasResult: boolean }) {
  const items = [
    { key: "home" as Screen, icon: <BarChart2 size={20} />, label: "Dashboard" },
    { key: "capture" as Screen, icon: <Mic size={20} />, label: "Diagnose" },
    { key: "guide" as Screen, icon: <Wrench size={20} />, label: "Guide", locked: !hasResult },
    { key: "parts" as Screen, icon: <ShoppingCart size={20} />, label: "Parts", locked: !hasResult },
  ];
  return (
    <div className="db-bottom-nav">
      {items.map(({ key, icon, label, locked }) => {
        const active = screen === key;
        return (
          <button key={key} onClick={() => !locked && setScreen(key)} className="db-bottom-nav-btn" style={{ color: locked ? C.s3 : active ? C.orange : C.sub, borderTop: active ? `2px solid ${C.orange}` : "2px solid transparent", opacity: locked ? 0.4 : 1 }}>
            {icon}
            <span style={{ fontFamily: C.font, fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
function HomeScreen({ setScreen, result }: { setScreen: (s: Screen) => void; result: AnalysisResult | null }) {
  return (
    <div className="db-screen" style={dotBg}>
      <div className="db-home-hero">
        <div style={{ background: C.s1, padding: "24px 24px 20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -8, bottom: -8, opacity: 0.04 }}><Activity size={160} color={C.txt} /></div>
          <p style={{ ...LABEL, color: C.light, marginBottom: 10 }}>AI-POWERED · MULTIMODAL</p>
          <h1 style={{ ...H, fontSize: "clamp(1.6rem, 4vw, 2rem)", lineHeight: 1.05, textTransform: "uppercase", marginBottom: 10 }}>FOREMAN<br />DIAGNOSTICS</h1>
          <p style={{ fontFamily: C.font, fontSize: "0.78rem", color: C.sub, lineHeight: 1.6, maxWidth: 360, marginBottom: 20 }}>Upload or record a fault sound. Gemini's multimodal AI analyzes the signature and generates a precision repair blueprint in seconds.</p>
          <button onClick={() => setScreen("capture")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: grad, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.75rem", color: "#131313", letterSpacing: "0.06em" }}>
            <Play size={14} /> START NEW DIAGNOSIS
          </button>
        </div>
        <div style={{ background: C.s3, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p style={{ ...LABEL, color: C.orange, marginBottom: 4 }}>Pipeline Status</p>
            <p style={{ ...H, fontSize: "1.8rem" }}>6-Stage</p>
          </div>
          <div style={{ borderTop: `1px solid ${C.s2}`, paddingTop: 14 }}>
            {[
              { icon: <Cpu size={11} />, label: "Gemini 3 Flash" },
              { icon: <Database size={11} />, label: "RAG Knowledge Base" },
              { icon: <Search size={11} />, label: "Parts Sourcing" },
              { icon: <Zap size={11} />, label: "~60s Analysis" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ color: C.orange }}>{icon}</span>
                <p style={{ ...LABEL, color: C.sub }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: `3px solid ${C.orange}`, paddingLeft: 10, marginBottom: 12 }}>
            <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.85rem", color: C.txt, textTransform: "uppercase", letterSpacing: "0.04em" }}>Last Diagnosis</p>
            <button onClick={() => setScreen("report")} style={{ ...LABEL, background: "none", border: "none", cursor: "pointer", color: C.orange }}>VIEW FULL REPORT →</button>
          </div>
          <div style={{ background: C.s1, padding: "16px 20px", borderLeft: `3px solid ${severityColor(result.diagnosis.severity)}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.85rem", color: C.txt, marginBottom: 6 }}>{result.guide.title}</p>
                <p style={{ fontFamily: C.font, fontSize: "0.72rem", color: C.sub, lineHeight: 1.6, maxWidth: 480 }}>{result.diagnosis.primaryDiagnosis}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: C.mono, fontSize: "0.52rem", padding: "3px 8px", background: severityColor(result.diagnosis.severity) + "22", color: severityColor(result.diagnosis.severity) }}>{result.diagnosis.severity.toUpperCase()}</span>
                <p style={{ fontFamily: C.font, fontWeight: 900, fontSize: "1.4rem", color: C.orange, marginTop: 8 }}>{Math.round(result.diagnosis.confidence * 100)}%</p>
                <p style={{ ...LABEL, color: C.sub }}>confidence</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="db-home-grid">
        <div>
          <div style={{ borderLeft: `3px solid ${C.s3}`, paddingLeft: 10, marginBottom: 12 }}>
            <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.85rem", color: C.txt, textTransform: "uppercase", letterSpacing: "0.04em" }}>6-Stage Pipeline</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { n: "01", label: "Media Processing", desc: "Audio/visual signature ingestion" },
              { n: "02", label: "Acoustic Scan", desc: "FFT anomaly detection via Gemini" },
              { n: "03", label: "Multimodal Diagnosis", desc: "Root cause identification" },
              { n: "04", label: "Knowledge Retrieval", desc: "OEM specs & technical docs" },
              { n: "05", label: "Guide Synthesis", desc: "Step-by-step repair blueprint" },
              { n: "06", label: "Parts Sourcing", desc: "SKU matching & local availability" },
            ].map(({ n, label, desc }) => (
              <div key={n} style={{ background: C.s1, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: C.mono, fontSize: "0.55rem", color: C.orange, opacity: 0.7, flexShrink: 0 }}>{n}</span>
                <div>
                  <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.72rem", color: C.txt }}>{label}</p>
                  <p style={{ fontFamily: C.font, fontSize: "0.62rem", color: C.sub, marginTop: 2 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ borderLeft: `3px solid ${C.s3}`, paddingLeft: 10, marginBottom: 12 }}>
            <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.85rem", color: C.txt, textTransform: "uppercase", letterSpacing: "0.04em" }}>Supported Equipment</p>
          </div>
          <div style={{ background: C.s1, padding: "18px" }}>
            {["HVAC Systems & Compressors", "Industrial Pumps & Valves", "Electric Motors & Drives", "Automotive Components", "Household Appliances", "Power Tools & Equipment"].map((e, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <CheckCircle2 size={12} color={C.orange} />
                <p style={{ fontFamily: C.font, fontSize: "0.72rem", color: C.sub }}>{e}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Capture Screen ───────────────────────────────────────────────────────────
function CaptureScreen({ setScreen, onSubmit }: {
  setScreen: (s: Screen) => void;
  onSubmit: (data: { equipment: { make: string; model: string; year: string; description: string }; media: { base64: string; mimeType: string }[] }) => void;
}) {
  const [tab, setTab] = useState<"record" | "details">("record");
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [time, setTime] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; mimeType: string; base64: string }[]>([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bars = Array.from({ length: 18 });

  useEffect(() => {
    if (!recording) return;
    const iv = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [recording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      setTime(0);
    } catch { alert("Microphone access denied. Please grant permission."); }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      const base64 = await fileToBase64(file);
      setUploadedFiles(prev => [...prev, { name: file.name, mimeType: file.type, base64 }]);
    }
  };

  const handleSubmit = async () => {
    if (!make || !model) return alert("Please fill in the equipment make and model.");
    const mediaItems: { base64: string; mimeType: string }[] = [];
    if (audioBlob) {
      const base64 = await fileToBase64(audioBlob);
      mediaItems.push({ base64, mimeType: "audio/webm" });
    }
    for (const f of uploadedFiles) {
      mediaItems.push({ base64: f.base64, mimeType: f.mimeType });
    }
    onSubmit({ equipment: { make, model, year, description }, media: mediaItems });
    setScreen("analyzing");
  };

  const hasMedia = audioBlob !== null || uploadedFiles.length > 0;
  const readyToSubmit = (make && model) && (hasMedia || description.length > 10);

  const inp = (label: string, val: string, setter: (v: string) => void, placeholder?: string, required?: boolean) => (
    <div style={{ marginBottom: 12 }}>
      <p style={{ ...LABEL, marginBottom: 6, color: required ? C.light : C.sub }}>{label}{required ? " *" : ""}</p>
      <input value={val} onChange={e => setter(e.target.value)} placeholder={placeholder ?? ""} style={{ width: "100%", background: C.s0, border: `1px solid ${val ? C.s3 : C.s2}`, outline: "none", padding: "10px 12px", fontFamily: C.font, fontSize: "0.8rem", color: C.txt, boxSizing: "border-box" }} />
    </div>
  );

  return (
    <div className="db-screen" style={dotBg}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ ...LABEL, color: C.light, marginBottom: 6 }}>Step 1 of 2</p>
        <h1 style={{ ...H, fontSize: "clamp(1.4rem, 5vw, 1.8rem)", textTransform: "uppercase", lineHeight: 1.1, marginBottom: 8 }}>New Diagnostic Session</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {(["record", "details"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "7px 16px", background: tab === t ? C.s2 : "transparent", border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 700, fontSize: "0.65rem", color: tab === t ? C.orange : C.sub, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: tab === t ? `2px solid ${C.orange}` : "2px solid transparent" }}>
              {t === "record" ? "📡 Capture Media" : "⚙️ Equipment Details"}
            </button>
          ))}
        </div>
      </div>

      <div className="db-capture-grid">
        <div>
          {tab === "record" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: C.s2, padding: "20px", position: "relative" }}>
                <div style={{ position: "absolute", top: 12, left: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: recording ? C.orange : C.s3, boxShadow: recording ? `0 0 8px ${C.orange}` : "none" }} />
                  <p style={{ ...LABEL, color: recording ? C.light : C.sub }}>ACOUSTIC {recording ? "ACTIVE" : "STANDBY"}</p>
                </div>
                {audioBlob && !recording && <div style={{ position: "absolute", top: 12, right: 14 }}><CheckCircle2 size={16} color="#4ade80" /></div>}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 70, width: "100%", justifyContent: "center", marginTop: 24 }}>
                  {bars.map((_, i) => (
                    <div key={i} style={{ width: 6, background: C.light, opacity: 0.4 + (i % 3) * 0.2, borderRadius: "1px 1px 0 0", animation: recording ? `waveBar 1.4s ease-in-out ${i * 0.08}s infinite alternate` : "none", height: recording ? undefined : audioBlob ? "60%" : "20%" }} />
                  ))}
                </div>
                {recording && <p style={{ textAlign: "center", fontFamily: C.mono, fontSize: "1.2rem", color: C.light, marginTop: 8 }}>{String(Math.floor(time / 60)).padStart(2,"0")}:{String(time % 60).padStart(2,"0")}</p>}
                {audioBlob && !recording && <p style={{ textAlign: "center", fontFamily: C.font, fontSize: "0.72rem", color: "#4ade80", marginTop: 8 }}>Audio captured — {time}s recording ready</p>}
                <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
                  {!recording ? (
                    <button onClick={startRecording} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: grad, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.7rem", color: "#131313", letterSpacing: "0.08em" }}>
                      <Mic size={13} /> {audioBlob ? "RE-RECORD" : "START RECORDING"}
                    </button>
                  ) : (
                    <button onClick={stopRecording} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "#ef4444", border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.7rem", color: "#fff", letterSpacing: "0.08em" }}>
                      <Square size={13} /> STOP RECORDING
                    </button>
                  )}
                </div>
              </div>
              <div>
                <input ref={fileInputRef} type="file" accept="audio/*,video/*,image/*" multiple onChange={handleFileUpload} style={{ display: "none" }} />
                <button onClick={() => fileInputRef.current?.click()} style={{ width: "100%", padding: "14px", background: C.s1, border: `1px dashed ${C.s3}`, cursor: "pointer", fontFamily: C.font, fontWeight: 700, fontSize: "0.68rem", color: C.sub, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.06em" }}>
                  <Upload size={14} /> UPLOAD MEDIA (AUDIO / VIDEO / IMAGE)
                </button>
                {uploadedFiles.map((f, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: C.s0, marginTop: 4 }}>
                    <span style={{ fontFamily: C.font, fontSize: "0.68rem", color: C.txt }}>{f.name}</span>
                    <button onClick={() => setUploadedFiles(p => p.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub }}><X size={12} /></button>
                  </div>
                ))}
              </div>
              {hasMedia && (
                <div style={{ padding: "10px 14px", background: `${C.orange}18`, borderLeft: `3px solid ${C.orange}` }}>
                  <p style={{ fontFamily: C.font, fontSize: "0.7rem", color: C.light }}>✓ Media ready — switch to Equipment Details to complete the form before analyzing.</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: C.s1, padding: "20px" }}>
              {inp("Manufacturer / Make", make, setMake, "e.g. Carrier, Whirlpool, Bosch", true)}
              {inp("Model Number / Series", model, setModel, "e.g. 38CKC060300, WTW5000DW", true)}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <p style={{ ...LABEL, marginBottom: 6 }}>Year (optional)</p>
                  <input value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 2022" style={{ width: "100%", background: C.s0, border: `1px solid ${C.s2}`, outline: "none", padding: "10px 12px", fontFamily: C.font, fontSize: "0.8rem", color: C.txt, boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <p style={{ ...LABEL, marginBottom: 6 }}>Describe the problem *</p>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the sounds, symptoms, when it started, what you've tried..." rows={4} style={{ width: "100%", background: C.s0, border: `1px solid ${C.s2}`, outline: "none", padding: "10px 12px", fontFamily: C.font, fontSize: "0.78rem", color: C.txt, resize: "vertical", boxSizing: "border-box" }} />
              </div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ background: C.s1, padding: "14px" }}>
            <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.78rem", color: C.txt, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Session Checklist</p>
            {[
              { label: "Equipment identified", done: !!(make && model) },
              { label: "Problem described", done: description.length > 10 },
              { label: "Media captured", done: hasMedia },
            ].map(({ label, done }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 18, height: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: done ? C.orange : "transparent", border: done ? "none" : `1px solid ${C.s3}`, transition: "all 0.3s" }}>
                  {done && <CheckCircle2 size={11} color="#131313" />}
                </div>
                <p style={{ fontFamily: C.font, fontSize: "0.72rem", color: done ? C.txt : C.sub }}>{label}</p>
              </div>
            ))}
          </div>
          <div style={{ background: C.s0, padding: "14px", borderLeft: `2px solid ${C.orange}` }}>
            <p style={{ ...LABEL, color: C.orange, marginBottom: 6 }}>AI Analysis</p>
            <p style={{ fontFamily: C.font, fontSize: "0.68rem", color: C.sub, lineHeight: 1.6 }}>Gemini 3 Flash processes your audio/visual signature using multimodal reasoning. No files are stored permanently.</p>
          </div>
          <button onClick={handleSubmit} disabled={!readyToSubmit} style={{ padding: "14px", background: readyToSubmit ? grad : C.s3, border: "none", cursor: readyToSubmit ? "pointer" : "default", fontFamily: C.font, fontWeight: 800, fontSize: "0.75rem", color: readyToSubmit ? "#131313" : C.sub, letterSpacing: "0.08em", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            RUN AI DIAGNOSTIC <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Analyzing Screen ─────────────────────────────────────────────────────────
function AnalyzingScreen({ events, error }: { events: PipelineEvent[]; error: string | null }) {
  const logRef = useRef<HTMLDivElement>(null);
  const lastEvent = events[events.length - 1];
  const pct = lastEvent ? Math.min((lastEvent.stage / 6) * 100, 100) : 0;
  const done = lastEvent?.status === "complete";

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [events]);

  const stages = [
    { n: 1, label: "Media Processing" },
    { n: 2, label: "Acoustic Scan" },
    { n: 3, label: "AI Diagnosis" },
    { n: 4, label: "Knowledge Base" },
    { n: 5, label: "Guide Synthesis" },
    { n: 6, label: "Parts Sourcing" },
  ];

  return (
    <div className="db-screen" style={dotBg}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ ...H, fontSize: "clamp(1.4rem, 5vw, 1.8rem)", textTransform: "uppercase", fontStyle: "italic", lineHeight: 1 }}>
          {error ? "Pipeline Failed" : done ? "Analysis Complete" : <><span style={{ color: C.light }}>Auto-Dex</span> Analysis Running</>}
        </h1>
        <div style={{ height: 3, background: C.s3, overflow: "hidden", marginTop: 12 }}>
          <div style={{ height: "100%", background: error ? "#ef4444" : grad, width: `${error ? 100 : pct}%`, transition: "width 0.8s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <p style={{ ...LABEL }}>{error ? "Error encountered" : done ? "All 6 stages complete" : "Processing..."}</p>
          <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "1.2rem", color: error ? "#ef4444" : C.light }}>{error ? "ERR" : `${Math.round(pct)}%`}</p>
        </div>
      </div>

      {error && (
        <div style={{ background: "#1f0a0a", borderLeft: `4px solid #ef4444`, padding: "16px 20px", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
            <AlertTriangle size={16} color="#ef4444" />
            <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.78rem", color: "#ef4444", textTransform: "uppercase" }}>Pipeline Error</p>
          </div>
          <p style={{ fontFamily: C.font, fontSize: "0.72rem", color: C.sub, lineHeight: 1.6 }}>{error}</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {stages.map(({ n, label }) => {
              const eventForStage = events.find(e => e.stage === n);
              const isPast = eventForStage !== undefined;
              const isActive = lastEvent?.stage === n && lastEvent?.status === "progress";
              return (
                <div key={n} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", background: isPast ? C.s1 : "transparent", borderLeft: isActive ? `3px solid ${C.orange}` : isPast ? `3px solid #4ade80` : `3px solid ${C.s3}`, opacity: isPast ? 1 : 0.3, transition: "all 0.5s" }}>
                  <div style={{ width: 18, height: 18, background: isPast && !isActive ? "#4ade80" : isActive ? C.orange : C.s3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
                    {isPast && !isActive ? <CheckCircle2 size={11} color="#131313" /> : isActive ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#131313", animation: "pulse 0.8s ease-in-out infinite" }} /> : null}
                  </div>
                  <div>
                    <p style={{ ...LABEL, color: isActive ? C.orange : isPast ? "#4ade80" : C.sub, marginBottom: 2 }}>Stage {String(n).padStart(2, "0")}</p>
                    <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.72rem", color: C.txt, textTransform: "uppercase" }}>{label}</p>
                    {eventForStage && <p style={{ fontFamily: C.font, fontSize: "0.6rem", color: C.sub, marginTop: 2 }}>{eventForStage.message}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div ref={logRef} style={{ background: C.s0, padding: "12px", fontFamily: C.mono, fontSize: "0.58rem", lineHeight: 1.8, color: C.sub, flex: 1, overflowY: "auto", scrollbarWidth: "none", maxHeight: 260 }}>
            <div style={{ color: C.light, marginBottom: 4 }}>[LISTEN_FIX_ENGINE v3.0] PIPELINE INITIATED</div>
            {events.map((e, i) => (
              <div key={i}>
                <div style={{ color: e.status === "error" ? "#ef4444" : e.status === "complete" ? "#4ade80" : C.orange }}>
                  &gt; STAGE_{String(e.stage).padStart(2,"0")}::{e.label?.replace(/ /g, "_").toUpperCase() ?? "EVENT"}
                </div>
                <div style={{ color: C.sub, marginLeft: 4 }}>{e.message}</div>
                {e.data?.confidence && <div style={{ color: "#4ade80", marginLeft: 4 }}>CONFIDENCE: {Math.round((e.data.confidence as number) * 100)}%</div>}
              </div>
            ))}
            {!done && !error && <span style={{ display: "inline-block", width: 6, height: 10, background: C.orange, animation: "blink 1s step-end infinite" }} />}
            {done && <div style={{ color: "#4ade80", marginTop: 4 }}>&gt; PIPELINE COMPLETE ✓</div>}
          </div>
          <div style={{ background: C.s1, padding: "12px 14px" }}>
            <p style={{ ...LABEL, marginBottom: 6 }}>Powered by</p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Cpu size={11} color={C.orange} /><span style={{ ...LABEL, color: C.light }}>Gemini 3 Flash</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Database size={11} color={C.orange} /><span style={{ ...LABEL, color: C.light }}>RAG Pipeline</span></div>
            </div>
          </div>
        </div>
      </div>

      {!done && !error && (
        <div style={{ padding: "10px 14px", background: C.s1, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 14, height: 14, border: `2px solid ${C.orange}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
          <p style={{ fontFamily: C.font, fontSize: "0.72rem", color: C.sub }}>{lastEvent?.message ?? "Initializing pipeline..."}</p>
        </div>
      )}
    </div>
  );
}

// ─── Report Screen ────────────────────────────────────────────────────────────
function ReportScreen({ setScreen, result }: { setScreen: (s: Screen) => void; result: AnalysisResult }) {
  const { diagnosis, guide } = result;
  const sev = severityColor(diagnosis.severity);
  return (
    <div className="db-screen" style={dotBg}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div>
          <p style={{ ...LABEL, color: C.orange, marginBottom: 6 }}>AI Diagnostic Report</p>
          <h1 style={{ ...H, fontSize: "clamp(1.3rem, 4vw, 1.7rem)", textTransform: "uppercase", lineHeight: 1.1 }}>{guide.title}</h1>
        </div>
        <div style={{ background: C.s2, padding: "12px 16px", textAlign: "center" }}>
          <p style={{ ...LABEL, marginBottom: 4 }}>Confidence</p>
          <p style={{ fontFamily: C.font, fontWeight: 900, fontSize: "2rem", color: C.orange }}>{Math.round(diagnosis.confidence * 100)}%</p>
          <div style={{ height: 2, background: C.s3, marginTop: 6 }}>
            <div style={{ height: "100%", width: `${diagnosis.confidence * 100}%`, background: grad }} />
          </div>
        </div>
      </div>

      <div className="db-report-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ background: C.s1, padding: "14px 12px", borderLeft: `3px solid ${sev}` }}>
            <p style={{ ...LABEL, marginBottom: 10 }}>Severity</p>
            <span style={{ background: sev, color: "#131313", fontFamily: C.mono, fontSize: "0.56rem", padding: "3px 8px", fontWeight: 700 }}>{diagnosis.severity.toUpperCase()}</span>
            <div style={{ display: "flex", gap: 2, marginTop: 10, height: 6, marginBottom: 10 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, background: i <= severityNum(diagnosis.severity) ? sev : C.s3 }} />)}
            </div>
          </div>
          {diagnosis.requiresExpertReview && (
            <div style={{ background: `${C.orange}15`, borderLeft: `3px solid ${C.orange}`, padding: "12px" }}>
              <p style={{ ...LABEL, color: C.orange, marginBottom: 4 }}>Expert Review</p>
              <p style={{ fontFamily: C.font, fontSize: "0.65rem", color: C.sub, lineHeight: 1.6 }}>AI recommends professional technician review for this issue.</p>
            </div>
          )}
          <div style={{ background: C.s0, padding: "14px 12px", flex: 1 }}>
            <p style={{ ...LABEL, marginBottom: 10 }}>Symptoms Identified</p>
            {diagnosis.symptoms.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <AlertTriangle size={11} color={sev} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontFamily: C.font, fontSize: "0.68rem", color: C.txt, lineHeight: 1.5 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ background: C.s1, padding: "16px" }}>
            <p style={{ ...LABEL, color: C.orange, marginBottom: 10 }}>Primary Diagnosis</p>
            <p style={{ fontFamily: C.font, fontSize: "0.82rem", color: C.txt, lineHeight: 1.7, marginBottom: 14 }}>{diagnosis.primaryDiagnosis}</p>
            <p style={{ ...LABEL, marginBottom: 8 }}>Possible Root Causes</p>
            {diagnosis.possibleCauses.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: C.mono, fontSize: "0.56rem", color: C.orange, opacity: 0.6, flexShrink: 0 }}>{String(i+1).padStart(2,"0")}</span>
                <p style={{ fontFamily: C.font, fontSize: "0.72rem", color: C.sub, lineHeight: 1.6 }}>{c}</p>
              </div>
            ))}
          </div>
          {diagnosis.safetyWarnings.length > 0 && (
            <div style={{ background: `${C.orange}18`, borderLeft: `4px solid ${C.orange}`, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <AlertTriangle size={14} color={C.orange} />
                <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.7rem", color: C.light, textTransform: "uppercase", letterSpacing: "0.06em" }}>Safety Warnings</p>
              </div>
              {diagnosis.safetyWarnings.map((w, i) => (
                <p key={i} style={{ fontFamily: C.font, fontSize: "0.68rem", color: C.sub, lineHeight: 1.6, marginBottom: 4 }}>• {w}</p>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setScreen("guide")} style={{ flex: 1, padding: "13px 12px", background: grad, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.7rem", color: "#131313", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              VIEW REPAIR GUIDE <ArrowRight size={13} />
            </button>
            <button onClick={() => setScreen("parts")} style={{ flex: 1, padding: "13px 12px", background: C.s2, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.7rem", color: C.sub }}>PARTS HUB</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Guide Screen ─────────────────────────────────────────────────────────────
function GuideScreen({ setScreen, result }: { setScreen: (s: Screen) => void; result: AnalysisResult }) {
  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState<boolean[]>([]);
  const { guide } = result;
  const s = guide.steps[activeStep];

  useEffect(() => {
    setChecked(new Array(guide.requiredTools.length).fill(false));
  }, [guide.requiredTools.length]);

  if (!s) return null;

  return (
    <div className="db-screen" style={dotBg}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ ...H, fontSize: "clamp(1.2rem, 4vw, 1.6rem)", textTransform: "uppercase", lineHeight: 1.1 }}>{guide.title}</h1>
        <p style={{ fontFamily: C.font, fontSize: "0.72rem", color: C.sub, lineHeight: 1.6, marginTop: 6, maxWidth: 600 }}>{guide.summary}</p>
      </div>

      <div className="db-guide-meta">
        {[
          { k: "Difficulty", v: guide.overallDifficulty.toUpperCase() },
          { k: "Duration", v: guide.totalTime },
          { k: "Steps", v: String(guide.steps.length) },
          { k: "AI Source", v: "Gemini 3" },
        ].map(({ k, v }) => (
          <div key={k} style={{ background: C.bg, padding: "10px 12px" }}>
            <p style={{ ...LABEL, marginBottom: 4 }}>{k}</p>
            <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.75rem", color: C.txt, textTransform: "uppercase" }}>{v}</p>
          </div>
        ))}
      </div>

      {guide.safetyWarnings.length > 0 && (
        <div style={{ background: `${C.orange}18`, borderLeft: `4px solid ${C.orange}`, padding: "12px 16px", display: "flex", gap: 12, marginBottom: 12 }}>
          <AlertTriangle size={16} color={C.orange} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.68rem", color: C.light, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Safety First</p>
            {guide.safetyWarnings.slice(0, 2).map((w, i) => (
              <p key={i} style={{ fontFamily: C.font, fontSize: "0.68rem", color: C.sub, lineHeight: 1.6 }}>• {w}</p>
            ))}
          </div>
        </div>
      )}

      <div className="db-guide-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {guide.requiredTools.length > 0 && (
            <div style={{ background: C.s1, padding: "14px 12px", borderBottom: `2px solid ${C.orange}` }}>
              <p style={{ ...LABEL, color: C.light, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Wrench size={10} /> Tools Required</p>
              {guide.requiredTools.map((t, i) => (
                <label key={t} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }} onClick={() => setChecked(c => c.map((v, j) => j === i ? !v : v))}>
                  <div style={{ width: 16, height: 16, border: `2px solid ${checked[i] ? C.orange : C.s3}`, background: checked[i] ? C.orange : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                    {checked[i] && <CheckCircle2 size={10} color="#131313" />}
                  </div>
                  <span style={{ fontFamily: C.font, fontSize: "0.68rem", color: checked[i] ? C.txt : C.sub, textDecoration: checked[i] ? "line-through" : "none" }}>{t}</span>
                </label>
              ))}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {guide.steps.map((st, i) => (
              <button key={i} onClick={() => setActiveStep(i)} style={{ textAlign: "left", padding: "10px 12px", background: i === activeStep ? C.s3 : C.s1, border: "none", cursor: "pointer", borderLeft: i === activeStep ? `3px solid ${C.orange}` : "3px solid transparent", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ ...LABEL, color: i === activeStep ? C.orange : C.sub, marginBottom: 2 }}>Step {String(st.stepNumber).padStart(2,"0")}</p>
                  <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.7rem", color: i === activeStep ? C.txt : C.sub, textTransform: "uppercase" }}>{st.title}</p>
                </div>
                {i === activeStep && <Play size={12} color={C.orange} />}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: C.s1, padding: "20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 8, fontFamily: C.font, fontWeight: 900, fontSize: "6rem", color: `${C.txt}06`, lineHeight: 1, userSelect: "none" }}>{String(s.stepNumber).padStart(2,"0")}</div>
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: C.font, fontWeight: 800, fontSize: "1.1rem", color: C.txt, textTransform: "uppercase", marginBottom: 2 }}>{s.title}</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <p style={{ ...LABEL, color: C.sub }}>Step {activeStep + 1} of {guide.steps.length}</p>
              {s.duration && <><span style={{ color: C.s3 }}>·</span><div style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={9} color={C.sub} /><p style={{ ...LABEL }}>{s.duration}</p></div></>}
            </div>
            <p style={{ fontFamily: C.font, fontSize: "0.78rem", color: C.txt, lineHeight: 1.7, marginBottom: 12 }}>{s.description}</p>
            {s.warnings.length > 0 && (
              <div style={{ marginTop: 8, padding: "10px 12px", background: `${C.orange}12`, borderLeft: `2px solid ${C.orange}` }}>
                {s.warnings.map((w, i) => (
                  <p key={i} style={{ fontFamily: C.font, fontStyle: "italic", fontSize: "0.68rem", color: C.light, lineHeight: 1.6 }}>⚠ {w}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, gap: 8 }}>
        <button onClick={() => setActiveStep(s => Math.max(0, s - 1))} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 16px", background: C.s2, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 700, fontSize: "0.68rem", color: C.sub }}>
          <ArrowLeft size={12} /> PREV
        </button>
        <div style={{ display: "flex", gap: 4 }}>
          {guide.steps.map((_, i) => <div key={i} style={{ width: i === activeStep ? 20 : 7, height: 3, background: i === activeStep ? C.orange : C.s3, transition: "all 0.3s", cursor: "pointer" }} onClick={() => setActiveStep(i)} />)}
        </div>
        <button onClick={() => { if (activeStep < guide.steps.length - 1) setActiveStep(s => s + 1); else setScreen("parts"); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 16px", background: grad, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.68rem", color: "#131313" }}>
          {activeStep < guide.steps.length - 1 ? "NEXT STEP" : "PARTS HUB"} <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Parts Screen ─────────────────────────────────────────────────────────────
function PartsScreen({ result }: { result: AnalysisResult }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const parts = result.guide.requiredParts;
  if (!parts.length) return (
    <div className="db-screen" style={dotBg}>
      <h1 style={{ ...H, fontSize: "1.6rem", textTransform: "uppercase", marginBottom: 16 }}>Parts Hub</h1>
      <div style={{ background: C.s1, padding: "24px", textAlign: "center" }}>
        <CheckCircle2 size={32} color="#4ade80" style={{ margin: "0 auto 12px" }} />
        <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.85rem", color: C.txt }}>No replacement parts required</p>
        <p style={{ fontFamily: C.font, fontSize: "0.72rem", color: C.sub, marginTop: 6 }}>The repair can be completed with the tools specified in the guide.</p>
      </div>
    </div>
  );

  return (
    <div className="db-screen" style={dotBg}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div>
          <p style={{ ...LABEL, color: C.orange, marginBottom: 6 }}>AI-Identified Components</p>
          <h1 style={{ ...H, fontSize: "clamp(1.4rem, 5vw, 1.8rem)", textTransform: "uppercase", lineHeight: 1 }}>REQUIRED<br />COMPONENTS</h1>
        </div>
        <div style={{ background: C.s1, padding: "12px 14px" }}>
          <p style={{ ...LABEL, marginBottom: 4 }}>Parts Identified</p>
          <p style={{ fontFamily: C.font, fontWeight: 900, fontSize: "1.6rem", color: C.txt }}>{parts.length}</p>
        </div>
      </div>

      <div className="db-parts-stats">
        {[
          { k: "Required", v: String(parts.filter(p => p.priority === "required").length) },
          { k: "Recommended", v: String(parts.filter(p => p.priority === "recommended").length) },
          { k: "Optional", v: String(parts.filter(p => p.priority === "optional").length) },
        ].map(({ k, v }) => (
          <div key={k} style={{ background: C.s1, padding: "12px 14px" }}>
            <p style={{ ...LABEL, marginBottom: 4 }}>{k}</p>
            <p style={{ fontFamily: C.font, fontWeight: 900, fontSize: "1.4rem", color: C.txt }}>{v}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {parts.map((p, i) => (
          <div key={i} style={{ background: C.s1 }}>
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ width: "100%", display: "flex", gap: 12, padding: "16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ background: priorityColor(p.priority) + "22", color: priorityColor(p.priority), fontFamily: C.mono, fontSize: "0.52rem", padding: "2px 8px" }}>{p.priority.toUpperCase()}</span>
                  {p.partNumber !== "N/A" && <span style={{ fontFamily: C.mono, fontSize: "0.52rem", color: C.sub }}>SKU: {p.partNumber}</span>}
                </div>
                <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.9rem", color: C.txt }}>{p.name}</p>
                <p style={{ fontFamily: C.font, fontSize: "0.68rem", color: C.sub, marginTop: 4, lineHeight: 1.5 }}>{p.description}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ ...LABEL, marginBottom: 4 }}>Price Range</p>
                <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.9rem", color: C.light }}>${p.estimatedPriceLow} — ${p.estimatedPriceHigh}</p>
              </div>
            </button>
            {openIdx === i && (
              <div style={{ padding: "0 16px 16px" }}>
                <p style={{ ...LABEL, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><MapPin size={10} /> Where to Buy</p>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {p.whereToBuy.map((store, j) => (
                    <button key={j} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: C.s2, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 700, fontSize: "0.65rem", color: C.sub, letterSpacing: "0.04em" }}>
                      <ShoppingCart size={10} /> {store} <ExternalLink size={9} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function severityColor(s: string) {
  if (s === "critical") return "#ef4444";
  if (s === "high") return "#f97316";
  if (s === "medium") return "#f59e0b";
  return "#4ade80";
}
function severityNum(s: string) {
  if (s === "critical") return 4;
  if (s === "high") return 3;
  if (s === "medium") return 2;
  return 1;
}
function priorityColor(p: string) {
  if (p === "required") return "#ef4444";
  if (p === "recommended") return "#f59e0b";
  return "#4ade80";
}
function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [screen, setScreen] = useState<Screen>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [pipelineEvents, setPipelineEvents] = useState<PipelineEvent[]>([]);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [pendingSubmit, setPendingSubmit] = useState<Parameters<Parameters<typeof CaptureScreen>[0]["onSubmit"]>[0] | null>(null);

  const runPipeline = useCallback(async (data: NonNullable<typeof pendingSubmit>) => {
    setPipelineEvents([]);
    setPipelineError(null);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok || !response.body) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event: PipelineEvent = JSON.parse(line.slice(6));
              setPipelineEvents(prev => [...prev, event]);
              if (event.status === "complete" && event.data) {
                setResult(event.data as unknown as AnalysisResult);
                setTimeout(() => setScreen("report"), 1200);
              }
              if (event.status === "error") {
                setPipelineError(event.message);
              }
            } catch { /* ignore parse errors */ }
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to connect to diagnostic pipeline.";
      setPipelineError(msg);
      setPipelineEvents(prev => [...prev, { stage: 0, status: "error", message: msg }]);
    }
  }, []);

  useEffect(() => {
    if (pendingSubmit && screen === "analyzing") {
      runPipeline(pendingSubmit);
      setPendingSubmit(null);
    }
  }, [pendingSubmit, screen, runPipeline]);

  const handleSubmit = (data: NonNullable<typeof pendingSubmit>) => {
    setPendingSubmit(data);
  };

  return (
    <div className="db-root">
      <style>{CSS}</style>
      <TopBar onMenuToggle={() => setSidebarOpen(o => !o)} />
      <div className="db-body">
        <Sidebar
          screen={screen}
          setScreen={setScreen}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onHome={() => setLocation("/")}
          hasResult={result !== null}
        />
        <div className="db-content">
          {screen === "home" && <HomeScreen setScreen={setScreen} result={result} />}
          {screen === "capture" && <CaptureScreen setScreen={setScreen} onSubmit={handleSubmit} />}
          {screen === "analyzing" && <AnalyzingScreen events={pipelineEvents} error={pipelineError} />}
          {screen === "report" && result && <ReportScreen setScreen={setScreen} result={result} />}
          {screen === "report" && !result && <div className="db-screen"><p style={{ ...LABEL }}>No diagnosis yet — run a diagnostic first.</p></div>}
          {screen === "guide" && result && <GuideScreen setScreen={setScreen} result={result} />}
          {screen === "guide" && !result && <div className="db-screen"><p style={{ ...LABEL }}>No guide yet — run a diagnostic first.</p></div>}
          {screen === "parts" && result && <PartsScreen result={result} />}
          {screen === "parts" && !result && <div className="db-screen"><p style={{ ...LABEL }}>No parts yet — run a diagnostic first.</p></div>}
        </div>
      </div>
      <BottomNav screen={screen} setScreen={setScreen} hasResult={result !== null} />
    </div>
  );
}
