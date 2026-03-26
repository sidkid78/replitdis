import { useState, useEffect, useRef } from "react";
import {
  Activity, BarChart2, Wrench, ShoppingCart, ShieldAlert, ShieldCheck,
  Play, Mic, Video, CheckCircle2, AlertTriangle, ChevronRight,
  Settings, HelpCircle, Plus, Clock, MapPin, ExternalLink, Zap,
  Star, ArrowRight, ArrowLeft, Bell, User, TrendingUp, Calendar,
  Radio, Database, ChevronDown, Pause, Loader2,
} from "lucide-react";

// ─── Tokens ──────────────────────────────────────────────────────────────────
const C = {
  bg:     "#131313",
  s0:     "#0e0e0e",
  s1:     "#1c1b1b",
  s2:     "#2a2a2a",
  s3:     "#353534",
  txt:    "#e5e2e1",
  sub:    "#9b9896",
  orange: "#ff5f00",
  light:  "#ffb599",
  font:   "'Space Grotesk', sans-serif",
  mono:   "'Space Mono', monospace",
  r:      "0.125rem",
};

const grad = `linear-gradient(135deg, ${C.orange}, ${C.light})`;

const LABEL: React.CSSProperties = {
  fontFamily: C.font, fontSize: "0.6rem", letterSpacing: "0.08em",
  textTransform: "uppercase", color: C.sub, fontWeight: 600,
};
const H: React.CSSProperties = { fontFamily: C.font, color: C.txt, fontWeight: 800, letterSpacing: "-0.02em" };

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen = "home" | "capture" | "analyzing" | "report" | "guide" | "parts";

// ─── Log lines ───────────────────────────────────────────────────────────────
const LOGS = [
  "[09:22:41] SESSION_START",
  "> INIT_AUDIO_BUFFER... [OK]",
  "> APPLYING_FFT_FILTER_SET_4... [OK]",
  "> VECTOR_MATCHING_PARTS_DB_V2.0... [SEARCHING]",
  "> MATCH_FOUND: VALVE_ASSEMBLY_B",
  "> CONFIDENCE_SCORE: 0.9423",
  "> ACCESSING_REPAIR_GUIDE_INDEX_A12... [OK]",
  "> SCRAPING_SYMPTOM_MAP_THREADS... [91%]",
  "> SAFETY_CHECKSUM: SHA256 a3f7c2e1 [VERIFIED]",
  "> PAYLOAD_UNLOCKED — DIY ELIGIBLE",
];

const CHECKLIST = [
  { label: "Analyzing audio patterns",   desc: "Done" },
  { label: "Crawling manuals",            desc: "Done" },
  { label: "Matching symptoms",           desc: "Active..." },
  { label: "Generating fix report",       desc: "Queued" },
];

const STEPS = [
  { title: "Housing Disassembly",   sub: "Primary Access",      n: "01" },
  { title: "Seal Extraction",       sub: "Component Removal",   n: "02" },
  { title: "Surface Preparation",   sub: "Cleaning Protocol",   n: "03" },
  { title: "Installation & Testing",sub: "Completion Check",    n: "04" },
];

const PARTS_DATA = [
  { sku: "882-PB-01", name: "Precision Roller Bearing", conf: 98, from: 42, to: 58.5, desc: "High-tensile steel construction. Internal lubrication port with double-lip seal protection.", local: [{ store: "Industrial Depot X", dist: "1.2 km", stock: true }, { store: "Precision Tooling Co.", dist: "4.8 km", stock: true }], online: [{ v: "RockAuto", price: 42.00, stock: true }, { v: "Amazon Business", price: 45.00, stock: true }] },
  { sku: "410-VD-99", name: "V-Groove Drive Belt",     conf: 92, from: 18.9, to: 24, desc: "Heat-resistant fiber core with EPDM rubber coating. Engineered for high-torque industrial fans.", local: [{ store: "Grainger Industrial", dist: "0.9 km", stock: true }, { store: "AutoZone Pro", dist: "3.8 km", stock: false }], online: [{ v: "Industrial Direct", price: 18.99, stock: true }] },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const items: { key: Screen; icon: React.ReactNode; label: string }[] = [
    { key: "home",      icon: <BarChart2 size={16} />,    label: "Diagnostics" },
    { key: "guide",     icon: <Wrench size={16} />,       label: "Repair Guides" },
    { key: "parts",     icon: <ShoppingCart size={16} />, label: "Parts Hub" },
    { key: "report",    icon: <ShieldCheck size={16} />,  label: "Safety Logs" },
  ];
  return (
    <aside style={{ width: 220, flexShrink: 0, background: C.s1, display: "flex", flexDirection: "column", height: "100%", position: "relative", zIndex: 2 }}>
      <div style={{ padding: "20px 16px 14px" }}>
        <p style={{ fontFamily: C.font, fontWeight: 900, fontSize: "0.85rem", color: C.orange, letterSpacing: "0.04em" }}>FOREMAN MODE</p>
        <p style={{ ...LABEL, marginTop: 2 }}>System Status: Active</p>
      </div>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 0 8px" }}>
        {items.map(({ key, icon, label }) => {
          const active = screen === key;
          return (
            <button key={key} onClick={() => setScreen(key)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
              background: active ? C.s2 : "transparent", border: "none", cursor: "pointer",
              borderLeft: active ? `3px solid ${C.orange}` : "3px solid transparent",
              color: active ? C.orange : C.sub, fontFamily: C.font, fontWeight: active ? 700 : 500,
              fontSize: "0.8rem", textAlign: "left", transition: "all 0.15s",
            }}>
              {icon} {label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "0 12px 12px" }}>
        <button onClick={() => setScreen("capture")} style={{
          width: "100%", padding: "12px 8px", background: grad,
          border: "none", borderRadius: C.r, cursor: "pointer",
          fontFamily: C.font, fontWeight: 800, fontSize: "0.65rem",
          color: "#131313", letterSpacing: "0.1em", marginBottom: 12,
        }}>NEW DIAGNOSTIC</button>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[{ icon: <Settings size={12} />, label: "Settings" }, { icon: <HelpCircle size={12} />, label: "Support" }].map(({ icon, label }) => (
            <button key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "none", border: "none", cursor: "pointer", color: C.sub, fontFamily: C.font, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {icon} {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────
function TopBar() {
  return (
    <header style={{ height: 52, background: C.bg, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0, borderBottom: `1px solid ${C.s2}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 26, height: 26, background: grad, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: C.r }}>
          <Activity size={13} color="#131313" />
        </div>
        <span style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.9rem", color: C.txt, letterSpacing: "0.05em" }}>LISTEN & FIX</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{ padding: 6, background: "none", border: "none", cursor: "pointer", color: C.sub }}><Bell size={15} /></button>
        <button style={{ padding: 6, background: "none", border: "none", cursor: "pointer", color: C.sub }}><User size={15} /></button>
      </div>
    </header>
  );
}

// ─── Dot-grid background ──────────────────────────────────────────────────────
const dotBg: React.CSSProperties = {
  backgroundImage: `radial-gradient(${C.s2} 1px, transparent 1px)`,
  backgroundSize: "24px 24px",
};

// ─── Screen: Home ─────────────────────────────────────────────────────────────
function HomeScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  return (
    <div style={{ ...dotBg, flex: 1, overflowY: "auto", padding: "32px 28px" }}>
      {/* Hero */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 12, marginBottom: 24 }}>
        <div style={{ background: C.s1, padding: "28px 28px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -8, bottom: -8, opacity: 0.04 }}>
            <Activity size={180} color={C.txt} />
          </div>
          <h1 style={{ ...H, fontSize: "2.2rem", lineHeight: 1.05, textTransform: "uppercase", marginBottom: 10 }}>ENGINEERING<br/>DIAGNOSTICS</h1>
          <p style={{ fontFamily: C.font, fontSize: "0.78rem", color: C.sub, lineHeight: 1.6, maxWidth: 360, marginBottom: 20 }}>Deploy ultra-precision acoustic analysis to identify mechanical failure points in under 60 seconds.</p>
          <button onClick={() => setScreen("capture")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: grad, border: "none", borderRadius: C.r, cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.75rem", color: "#131313", letterSpacing: "0.06em" }}>
            <Play size={14} /> START NEW DIAGNOSIS
          </button>
        </div>
        <div style={{ background: C.s3, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p style={{ ...LABEL, color: C.orange, marginBottom: 4 }}>Repair Savings</p>
            <p style={{ ...H, fontSize: "1.8rem" }}>$4,280.00</p>
          </div>
          <div style={{ borderTop: `1px solid ${C.s2}`, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ ...LABEL, marginBottom: 4 }}>Success Rate</p>
              <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "1.1rem", color: C.txt }}>94.2%</p>
            </div>
            <TrendingUp size={18} color={C.orange} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Ongoing Diagnostics */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: `3px solid ${C.orange}`, paddingLeft: 10, marginBottom: 12 }}>
            <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.85rem", color: C.txt, textTransform: "uppercase", letterSpacing: "0.04em" }}>Ongoing Diagnostics</p>
            <button style={{ ...LABEL, background: "none", border: "none", cursor: "pointer", color: C.sub }}>VIEW QUEUE</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { name: "Acoustic Valve Clearance", tech: "AI-CORE-07", pct: 85, sev: "Critical", sevColor: "#ef4444" },
              { name: "Thermal Signature Mapping", tech: "Manual Override", pct: 40, sev: "Stable", sevColor: "#4ade80" },
            ].map((d, i) => (
              <div key={i} onClick={() => setScreen("analyzing")} style={{ background: C.s1, padding: "14px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, background: C.s2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BarChart2 size={16} color={C.orange} />
                  </div>
                  <div>
                    <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.75rem", color: C.txt, textTransform: "uppercase" }}>{d.name}</p>
                    <p style={{ fontFamily: C.font, fontSize: "0.65rem", color: C.sub, marginTop: 2 }}>Technician: {d.tech}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: C.mono, fontSize: "0.55rem", padding: "2px 6px", background: d.sevColor + "22", color: d.sevColor, letterSpacing: "0.06em" }}>SEVERITY: {d.sev.toUpperCase()}</span>
                  <div style={{ marginTop: 6, width: 96, height: 3, background: C.s3 }}>
                    <div style={{ height: "100%", width: `${d.pct}%`, background: grad }} />
                  </div>
                  <p style={{ ...LABEL, marginTop: 3 }}>{d.pct}% Processed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Maintenance */}
        <div>
          <div style={{ borderLeft: `3px solid ${C.s3}`, paddingLeft: 10, marginBottom: 12 }}>
            <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.85rem", color: C.txt, textTransform: "uppercase", letterSpacing: "0.04em" }}>Upcoming Maintenance</p>
          </div>
          <div style={{ background: C.s1, padding: "18px 18px", marginBottom: 4 }}>
            <p style={{ fontFamily: C.font, fontSize: "0.75rem", color: C.sub, lineHeight: 1.6, marginBottom: 14 }}>Automated scheduling based on your equipment runtime telemetry. Prepare tools for next cycle.</p>
            <div style={{ display: "flex", gap: 4 }}>
              {[{ date: "OCT 24", name: "OIL FILTER SYNC", time: "08:00 AM" }, { date: "OCT 28", name: "GASKET INSPECTION", time: "14:30 PM" }].map((e, i) => (
                <div key={i} style={{ flex: 1, background: C.s2, padding: "10px 12px", borderLeft: i === 0 ? `2px solid ${C.orange}` : `2px solid ${C.s3}` }}>
                  <p style={{ ...LABEL, color: i === 0 ? C.orange : C.sub, marginBottom: 4 }}>{e.date}</p>
                  <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.72rem", color: C.txt }}>{e.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                    <Clock size={9} color={C.sub} />
                    <p style={{ ...LABEL }}>{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Capture Signature ────────────────────────────────────────────────
function CaptureScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [bars] = useState(() => Array.from({ length: 22 }, (_, i) => ({ delay: i * 0.08, h: 20 + Math.random() * 60 })));

  useEffect(() => {
    if (!recording) return;
    const iv = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [recording]);

  const fmt = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ ...dotBg, flex: 1, overflowY: "auto", padding: "28px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ height: 2, width: 28, background: C.light }} />
          <p style={{ ...LABEL, color: C.light }}>Live Session</p>
        </div>
        <h1 style={{ ...H, fontSize: "2rem", textTransform: "uppercase" }}>Capture Signature</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Waveform HUD */}
          <div style={{ background: C.s2, padding: "20px", minHeight: 220, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", top: 12, left: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: recording ? C.orange : C.s3, boxShadow: recording ? `0 0 8px ${C.orange}` : "none" }} />
              <p style={{ ...LABEL, color: recording ? C.light : C.sub }}>ACOUSTIC INPUT {recording ? "ACTIVE" : "STANDBY"}</p>
            </div>
            <p style={{ position: "absolute", top: 12, right: 14, fontFamily: C.mono, fontSize: "1.4rem", color: C.light, letterSpacing: "0.04em" }}>{fmt(time)}</p>

            {/* Waveform */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80, width: "100%", justifyContent: "center" }}>
              {bars.map((b, i) => (
                <div key={i} style={{ width: 7, background: C.light, opacity: 0.4 + (i % 3) * 0.2, borderRadius: "1px 1px 0 0", animation: recording ? `waveBar 1.4s ease-in-out ${b.delay}s infinite alternate` : "none", height: recording ? undefined : `${b.h * 0.3}%` }} />
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => { setRecording(r => !r); if (!recording) setTimeout(() => setScreen("analyzing"), 3000); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: recording ? C.s3 : grad, border: "none", borderRadius: C.r, cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.7rem", color: recording ? C.txt : "#131313", letterSpacing: "0.08em" }}>
                {recording ? <><Pause size={13} /> PAUSE</> : <><Mic size={13} /> RECORD</>}
              </button>
              <button onClick={() => setScreen("analyzing")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: C.s3, border: "none", borderRadius: C.r, cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.7rem", color: C.sub, letterSpacing: "0.08em" }}>
                <Play size={13} /> ANALYZE
              </button>
            </div>
            <style>{`@keyframes waveBar { from { height: 15%; } to { height: 90%; } }`}</style>
          </div>

          {/* Upload slots */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[{ icon: <Video size={20} color={C.sub} />, label: "Thermal Video Feed", hint: "Drop .MOV or .MP4" }, { icon: <Mic size={20} color={C.sub} />, label: "Equipment Photos", hint: "Capture Multi-Angle" }].map(({ icon, label, hint }) => (
              <div key={label} style={{ background: C.s1, padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <p style={{ ...LABEL, color: C.light }}>{label.toUpperCase()}</p>
                  {icon}
                </div>
                <div style={{ aspectRatio: "16/9", background: C.s0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `1px dashed ${C.s3}` }}>
                  <Plus size={18} color={C.s3} style={{ marginBottom: 6 }} />
                  <p style={{ ...LABEL }}>{hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Spec */}
        <div style={{ background: C.s1, padding: "16px" }}>
          <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.78rem", color: C.txt, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Asset Spec</p>
          {[
            { label: "Manufacturer", val: "HEAVY-DYNAMICS CORP" },
            { label: "Model", val: "V12-TURBO_COMPRESSOR" },
            { label: "Production Year", val: "2022 [REV B]" },
            { label: "Serial Number", val: "#DX-8849-AF-001" },
          ].map(({ label, val }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <p style={{ ...LABEL, marginBottom: 4 }}>{label}</p>
              <div style={{ background: C.s0, padding: "8px 10px", fontFamily: C.mono, fontSize: "0.7rem", color: C.txt, borderLeft: `2px solid ${C.s3}` }}>{val}</div>
            </div>
          ))}
          <div style={{ marginTop: 8, background: C.s0, padding: "10px 12px", borderLeft: `2px solid ${C.orange}` }}>
            <p style={{ ...LABEL, color: C.orange, marginBottom: 4 }}>Foreman Tip</p>
            <p style={{ fontFamily: C.font, fontSize: "0.68rem", color: C.sub, lineHeight: 1.6 }}>Ensure the sensor is placed within 20cm of the primary bearing housing for optimal acoustic signature capture. Avoid ambient fan noise.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Analyzing ────────────────────────────────────────────────────────
function AnalyzingScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [pct, setPct]         = useState(0);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [step, setStep]       = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iv = setInterval(() => {
      setPct(p => { if (p >= 100) { clearInterval(iv); return 100; } return Math.min(p + 1.1, 100); });
    }, 70);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setLogLines(l => {
        if (l.length >= LOGS.length) { clearInterval(iv); return l; }
        return [...l, LOGS[l.length]];
      });
      setStep(s => Math.min(s + 1, CHECKLIST.length));
    }, 900);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [logLines]);

  const done = pct >= 100;

  return (
    <div style={{ ...dotBg, flex: 1, overflowY: "auto", padding: "28px 28px" }}>
      {/* Heading */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 8 }}>
          <h1 style={{ ...H, fontSize: "1.9rem", textTransform: "uppercase", fontStyle: "italic", lineHeight: 1 }}>
            Performing <span style={{ color: C.light }}>Auto-Dex</span> Analysis
          </h1>
          <div style={{ textAlign: "right" }}>
            <p style={{ ...LABEL, color: C.light, marginBottom: 2 }}>Status Code</p>
            <p style={{ fontFamily: C.mono, fontSize: "1.1rem", color: C.txt }}>0x7F4B-92</p>
          </div>
        </div>
        {/* Progress */}
        <div style={{ height: 3, background: C.s3, width: "100%", overflow: "hidden" }}>
          <div style={{ height: "100%", background: grad, width: `${pct}%`, transition: "width 0.3s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <p style={{ ...LABEL }}>Operation in Progress</p>
          <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "1.4rem", color: C.light }}>{Math.round(pct)}%</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 8, marginTop: 8 }}>
        {/* Visualization */}
        <div style={{ background: C.s0, aspectRatio: "16/10", position: "relative", overflow: "hidden" }}>
          {/* Engine placeholder illustration */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.15 }}>
            <div style={{ width: 260, height: 260, borderRadius: "50%", border: `2px solid ${C.light}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 180, height: 180, borderRadius: "50%", border: `2px dashed ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: C.s3 }} />
              </div>
            </div>
          </div>

          {/* Scan line */}
          <div style={{ position: "absolute", top: "30%", left: 0, right: 0, height: 1, background: `${C.light}40`, boxShadow: `0 0 12px ${C.light}60` }} />

          {/* Callout: VIBRATION_PEAK */}
          <div style={{ position: "absolute", top: "18%", left: "28%", width: 100, height: 90, border: `1px solid ${C.light}60` }}>
            <div style={{ position: "absolute", top: -18, left: 0, background: C.light, padding: "2px 6px" }}>
              <p style={{ fontFamily: C.mono, fontSize: "0.5rem", color: C.s0 }}>VIBRATION_PEAK</p>
            </div>
          </div>

          {/* Callout: ACOUSTIC_ANOMALY */}
          <div style={{ position: "absolute", bottom: "22%", right: "18%", width: 130, height: 70, border: `1px solid ${C.orange}60` }}>
            <div style={{ position: "absolute", bottom: -18, right: 0, background: C.orange, padding: "2px 6px" }}>
              <p style={{ fontFamily: C.mono, fontSize: "0.5rem", color: "#131313" }}>ACOUSTIC_ANOMALY</p>
            </div>
          </div>

          {/* Live Metrics HUD */}
          <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(53,53,52,0.8)", backdropFilter: "blur(12px)", padding: "12px 14px", border: `1px solid ${C.s3}` }}>
            <p style={{ ...LABEL, color: C.light, marginBottom: 8 }}>Live Metrics</p>
            {[{ k: "Temp", v: "184.2°C" }, { k: "RPM", v: "32,440" }, { k: "Load", v: "82.1%" }].map(({ k, v }) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 4 }}>
                <p style={{ ...LABEL }}>{k}</p>
                <p style={{ fontFamily: C.mono, fontSize: "0.65rem", color: C.txt }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Checklist */}
          <div style={{ background: C.s1, padding: "16px", borderLeft: `3px solid ${C.orange}`, flex: 1 }}>
            <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.72rem", color: C.txt, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Process Checklist</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {CHECKLIST.map((c, i) => {
                const done   = i < step - 1;
                const active = i === step - 1;
                const queued = i >= step;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, opacity: queued ? 0.3 : 1 }}>
                    <div style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", background: done ? C.light : "transparent", border: done ? "none" : active ? `1px solid ${C.orange}` : `1px solid ${C.s3}`, transition: "all 0.3s" }}>
                      {done && <CheckCircle2 size={11} color="#131313" />}
                      {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.orange, animation: "pulse 1s ease-in-out infinite" }} />}
                    </div>
                    <div>
                      <p style={{ fontFamily: C.font, fontWeight: 600, fontSize: "0.75rem", color: C.txt }}>{c.label}</p>
                      <p style={{ ...LABEL, color: done ? C.light : active ? C.orange : C.sub, marginTop: 2 }}>{c.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terminal Log */}
          <div ref={logRef} style={{ background: C.s0, padding: "10px 10px", fontFamily: C.mono, fontSize: "0.58rem", lineHeight: 1.8, color: C.sub, maxHeight: 150, overflowY: "auto", scrollbarWidth: "none" }}>
            {logLines.map((l, i) => (
              <div key={i} style={{ color: l.startsWith(">") ? C.sub : C.light }}>{l}</div>
            ))}
            {!done && <div style={{ display: "inline-block", width: 6, height: 10, background: C.orange, animation: "blink 1s step-end infinite" }} />}
            {done && <div style={{ color: "#4ade80", marginTop: 4 }}>&gt; ANALYSIS COMPLETE ✓</div>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => setScreen("home")} style={{ flex: 1, padding: "12px", background: C.s2, border: "none", borderRadius: C.r, cursor: "pointer", fontFamily: C.font, fontWeight: 700, fontSize: "0.72rem", color: C.sub, letterSpacing: "0.06em" }}>CANCEL ANALYSIS</button>
        <button onClick={() => setScreen("report")} style={{ flex: 1, padding: "12px", background: done ? grad : C.s3, border: "none", borderRadius: C.r, cursor: done ? "pointer" : "default", fontFamily: C.font, fontWeight: 700, fontSize: "0.72rem", color: done ? "#131313" : C.sub, letterSpacing: "0.06em", transition: "all 0.5s" }}>
          {done ? "VIEW RESULTS →" : "PROCESSING..."}
        </button>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}

// ─── Screen: Diagnostic Report ────────────────────────────────────────────────
function ReportScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  return (
    <div style={{ ...dotBg, flex: 1, overflowY: "auto", padding: "28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, gap: 16 }}>
        <div>
          <p style={{ ...LABEL, color: C.orange, marginBottom: 6 }}>Report ID: #DIAG-99283-X</p>
          <h1 style={{ ...H, fontSize: "1.8rem", textTransform: "uppercase", lineHeight: 1.1 }}>HVAC COMPRESSOR<br/>AUDITORY ANOMALY</h1>
        </div>
        <div style={{ background: C.s2, padding: "14px 18px", textAlign: "center", minWidth: 130, flexShrink: 0 }}>
          <p style={{ ...LABEL, marginBottom: 4 }}>Confidence Score</p>
          <p style={{ fontFamily: C.font, fontWeight: 900, fontSize: "2.4rem", color: C.orange, letterSpacing: "-0.02em" }}>0.89</p>
          <div style={{ height: 2, background: C.s3, marginTop: 8, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, width: "89%", background: grad }} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 220px", gap: 8 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Severity */}
          <div style={{ background: C.s1, padding: "14px 12px", borderLeft: `3px solid ${C.orange}` }}>
            <p style={{ ...LABEL, marginBottom: 10 }}>Severity Rating</p>
            <span style={{ background: C.orange, color: "#131313", fontFamily: C.mono, fontSize: "0.58rem", padding: "3px 8px", fontWeight: 700 }}>Medium — High</span>
            <div style={{ display: "flex", gap: 2, marginTop: 10, height: 6, marginBottom: 10 }}>
              {[1,2,3,4,5].map(i => (<div key={i} style={{ flex: 1, background: i <= 3 ? C.orange : C.s3 }} />))}
            </div>
            <p style={{ fontFamily: C.font, fontSize: "0.65rem", color: C.sub, lineHeight: 1.6 }}>Rhythmic grinding at 64Hz. Thermal spikes in lower bearing housing.</p>
          </div>
          {/* Symptoms */}
          <div style={{ background: C.s0, padding: "14px 12px", flex: 1 }}>
            <p style={{ ...LABEL, marginBottom: 10 }}>Identified Symptoms</p>
            {[
              { icon: <AlertTriangle size={12} color={C.orange} />, label: "Metallic Friction", sub: "Via audio (3.4s–5.1s)" },
              { icon: <Activity size={12} color={C.orange} />, label: "Thermal +12.4°C", sub: "Deviation from nominal" },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ marginTop: 2, flexShrink: 0 }}>{icon}</div>
                <div>
                  <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.72rem", color: C.txt }}>{label}</p>
                  <p style={{ fontFamily: C.font, fontSize: "0.62rem", color: C.sub, marginTop: 2 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Root causes */}
          <div style={{ background: C.s1, padding: "14px 16px" }}>
            <p style={{ ...LABEL, color: C.orange, marginBottom: 12 }}>Potential Root Causes</p>
            {[
              { name: "Primary Bearing Wear", pct: 72, desc: "Mechanical fatigue from lack of lubrication or high particulate ingress." },
              { name: "Impeller Imbalance",   pct: 15, desc: "Accumulated debris on blades causing rotational eccentricity." },
            ].map(({ name, pct, desc }) => (
              <div key={name} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.75rem", color: C.txt }}>{name}</p>
                  <p style={{ fontFamily: C.mono, fontSize: "0.62rem", color: pct > 50 ? C.orange : C.sub, fontWeight: 700 }}>{pct}% LIKELY</p>
                </div>
                <p style={{ fontFamily: C.font, fontSize: "0.65rem", color: C.sub, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* RAG snippets */}
          <div style={{ background: C.s0, padding: "14px 16px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <Database size={11} color={C.orange} />
              <p style={{ ...LABEL, color: C.sub }}>Technical Manual Snippets (RAG Retrieved)</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { ref: "Section 4.2: Bearing Maintenance", text: '"When grinding noises exceed 60dB at a 1-meter range, immediate shutdown is required. Continued operation may lead to shaft misalignment."' },
                { ref: "Technical Bulletin TB-2023-A",     text: '"Models manufactured between 2021-2022 show increased sensitivity to vibration-induced heat. Ensure sensor recalibration."' },
              ].map(({ ref, text }) => (
                <div key={ref} style={{ background: C.s1, padding: "10px 12px" }}>
                  <p style={{ fontFamily: C.mono, fontSize: "0.58rem", color: C.orange, marginBottom: 6, letterSpacing: "0.02em" }}>{ref.toUpperCase()}</p>
                  <p style={{ fontFamily: C.font, fontSize: "0.65rem", color: C.sub, lineHeight: 1.7, fontStyle: "italic" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setScreen("guide")} style={{ flex: 1, padding: "13px 16px", background: grad, border: "none", borderRadius: C.r, cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.72rem", color: "#131313", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.06em" }}>
              VIEW REPAIR GUIDE <ArrowRight size={13} />
            </button>
            <button style={{ flex: 1, padding: "13px 16px", background: C.s2, border: "none", borderRadius: C.r, cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.72rem", color: C.sub, letterSpacing: "0.06em" }}>
              ASK EXPERT
            </button>
          </div>
        </div>

        {/* Right: Visual placeholder */}
        <div style={{ background: C.s2, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: 280 }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.1 }}>
            <div style={{ width: 160, height: 160, borderRadius: "50%", border: `4px solid ${C.light}` }}>
              <div style={{ margin: 20, height: "calc(100% - 40px)", borderRadius: "50%", border: `2px dashed ${C.orange}` }} />
            </div>
          </div>
          <div style={{ position: "relative", padding: "14px 12px", background: "rgba(19,19,19,0.7)" }}>
            <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.8rem", color: C.txt }}>Vibrational Analysis Overlay</p>
            <p style={{ ...LABEL, color: C.orange, marginTop: 4 }}>Visual Diagnostic Reference 04</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Repair Guide ─────────────────────────────────────────────────────
function GuideScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState<boolean[]>([true, false, false, false, false]);

  const tools = ["12mm Socket Wrench", "Torque Wrench (25Nm)", "Internal Circlip Pliers", "Seal Pick Tool", "Lint-free Shop Cloths"];
  const stepContent = [
    { n: "01", title: "Housing Disassembly", sub: "Primary Access", body: "Locate the four M12 retaining bolts on the outer circumference of the pump housing. Using a cross-pattern sequence, loosen each bolt by a quarter turn to ensure even pressure release across the housing gasket.", subs: ["Remove the protective dust cap from the drive shaft interface using the seal pick tool.", "Mark the housing and manifold body with a paint pen to ensure correct alignment during reassembly.", "Fully extract the bolts and set them aside in a clean magnetic parts tray."] },
    { n: "02", title: "Seal Extraction",     sub: "Component Removal", body: "Insert the seal pick tool at the 12 o'clock position between the old seal and the housing bore. Work around the circumference carefully, applying even outward pressure. Do not scratch the bore surface.", subs: ["Apply penetrating oil at the seal contact ring and wait 3 minutes.", "Work the pick around the full circumference before extracting.", "Inspect bore surface for scoring before proceeding."] },
    { n: "03", title: "Surface Preparation", sub: "Cleaning Protocol",  body: "Clean the housing bore with a lint-free cloth dampened with degreasing agent. Inspect for scratches or corrosion. The bore surface must be smooth and clean before installing the new seal.", subs: ["Use circular motions with the cloth — never radial strokes.", "Verify bore diameter with calipers: target 62.00mm ±0.05mm.", "Allow 2 minutes drying time before installing the replacement seal."] },
    { n: "04", title: "Installation & Testing", sub: "Completion Check", body: "Press the new nitrile seal squarely into the bore using a seal driver or appropriate socket. Apply light grease to the seal lip. Reassemble in reverse order and torque bolts to 25Nm in cross-pattern.", subs: ["Ensure seal is flush with housing face — no proud edges.", "Torque to spec: 25Nm in three passes.", "Run at idle for 5 minutes. Inspect for leaks around the new seal."] },
  ];
  const s = stepContent[activeStep];

  return (
    <div style={{ ...dotBg, flex: 1, overflowY: "auto", padding: "28px" }}>
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ background: C.s2, padding: "3px 10px", fontFamily: C.mono, fontSize: "0.58rem", color: C.sub, borderLeft: `2px solid ${C.orange}` }}>INDUSTRIAL-X SERIES</span>
          <span style={{ fontFamily: C.font, fontSize: "0.68rem", color: C.sub }}>REF: HYD-772-B</span>
        </div>
        <h1 style={{ ...H, fontSize: "1.7rem", textTransform: "uppercase", lineHeight: 1.1 }}>
          HYDRAULIC PUMP <span style={{ color: C.light }}>SEAL REPLACEMENT</span>
        </h1>
      </div>

      {/* Meta grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, background: C.s1, padding: 2, marginBottom: 12 }}>
        {[{ k: "Skill Level", v: "Intermediate" }, { k: "Est. Duration", v: "45 MIN" }, { k: "Component", v: "PUMP UNIT A1" }, { k: "Status", v: "In Progress" }].map(({ k, v }) => (
          <div key={k} style={{ background: C.bg, padding: "10px 14px" }}>
            <p style={{ ...LABEL, marginBottom: 4 }}>{k}</p>
            <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.8rem", color: C.txt, textTransform: "uppercase" }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Safety Banner */}
      <div style={{ background: `${C.orange}18`, borderLeft: `4px solid ${C.orange}`, padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
        <AlertTriangle size={16} color={C.orange} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.7rem", color: C.light, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Mandatory Safety Protocol</p>
          <p style={{ fontFamily: C.font, fontSize: "0.72rem", color: C.sub, lineHeight: 1.6 }}>HIGH PRESSURE SYSTEM. Ensure hydraulic lines are fully depressurized and the system is locked out / tagged out (LOTO) before beginning disassembly. Residual pressure may cause serious injury.</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 8 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Tools */}
          <div style={{ background: C.s1, padding: "14px 12px", borderBottom: `2px solid ${C.orange}` }}>
            <p style={{ ...LABEL, color: C.light, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Wrench size={10} /> Tools Required</p>
            {tools.map((t, i) => (
              <label key={t} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }} onClick={() => setChecked(c => c.map((v, j) => j === i ? !v : v))}>
                <div style={{ width: 16, height: 16, border: `2px solid ${checked[i] ? C.orange : C.s3}`, background: checked[i] ? C.orange : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                  {checked[i] && <CheckCircle2 size={10} color="#131313" />}
                </div>
                <span style={{ fontFamily: C.font, fontSize: "0.7rem", color: checked[i] ? C.txt : C.sub, textDecoration: checked[i] ? "line-through" : "none", transition: "all 0.2s" }}>{t}</span>
              </label>
            ))}
          </div>

          {/* Step nav */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {stepContent.map((st, i) => (
              <button key={i} onClick={() => setActiveStep(i)} style={{ textAlign: "left", padding: "10px 12px", background: i === activeStep ? C.s3 : C.s1, border: "none", cursor: "pointer", borderLeft: i === activeStep ? `3px solid ${C.orange}` : `3px solid transparent`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ ...LABEL, color: i === activeStep ? C.orange : C.sub, marginBottom: 2 }}>Step {st.n}</p>
                  <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.72rem", color: i === activeStep ? C.txt : C.sub, textTransform: "uppercase" }}>{st.title}</p>
                </div>
                {i === activeStep && <Play size={12} color={C.orange} />}
              </button>
            ))}
          </div>
        </div>

        {/* Right: active step */}
        <div style={{ background: C.s1, padding: "20px 20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 8, fontFamily: C.font, fontWeight: 900, fontSize: "7rem", color: `${C.txt}06`, lineHeight: 1, userSelect: "none" }}>{s.n}</div>
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: C.font, fontWeight: 800, fontSize: "1.3rem", color: C.txt, textTransform: "uppercase", marginBottom: 2 }}>{s.title}</h2>
            <p style={{ ...LABEL, color: C.sub, marginBottom: 14 }}>Step {activeStep + 1} of {stepContent.length}: {s.sub}</p>
            <p style={{ fontFamily: C.font, fontSize: "0.8rem", color: C.txt, lineHeight: 1.7, marginBottom: 14 }}>{s.body}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {s.subs.map((sub, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ background: C.orange, color: "#131313", fontFamily: C.mono, fontSize: "0.55rem", padding: "2px 5px", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}.{activeStep + 1}</span>
                  <p style={{ fontFamily: C.font, fontSize: "0.72rem", color: C.sub, lineHeight: 1.6 }}>{sub}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "10px 12px", background: C.s0, borderLeft: `2px solid ${C.light}` }}>
              <p style={{ fontFamily: C.font, fontStyle: "italic", fontSize: "0.68rem", color: C.sub, lineHeight: 1.6 }}>
                <span style={{ color: C.light }}>Foreman Tip: </span>
                Work methodically around the entire component. Do not force any step — resistance indicates incomplete disassembly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step nav buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <button onClick={() => setActiveStep(s => Math.max(0, s - 1))} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 18px", background: C.s2, border: "none", borderRadius: C.r, cursor: "pointer", fontFamily: C.font, fontWeight: 700, fontSize: "0.7rem", color: C.sub, letterSpacing: "0.06em" }}>
          <ArrowLeft size={12} /> PREVIOUS STEP
        </button>
        <div style={{ display: "flex", gap: 4 }}>
          {stepContent.map((_, i) => (
            <div key={i} style={{ width: i === activeStep ? 24 : 8, height: 3, background: i === activeStep ? C.orange : C.s3, transition: "all 0.3s", cursor: "pointer" }} onClick={() => setActiveStep(i)} />
          ))}
        </div>
        <button onClick={() => { if (activeStep < stepContent.length - 1) setActiveStep(s => s + 1); else setScreen("parts"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 18px", background: grad, border: "none", borderRadius: C.r, cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.7rem", color: "#131313", letterSpacing: "0.06em" }}>
          {activeStep < stepContent.length - 1 ? "NEXT STEP" : "PARTS HUB"} <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Screen: Parts Hub ────────────────────────────────────────────────────────
function PartsScreen() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ ...dotBg, flex: 1, overflowY: "auto", padding: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
            <p style={{ fontFamily: C.font, fontSize: "0.68rem", color: C.sub }}>Diagnostics</p>
            <ChevronRight size={10} color={C.sub} />
            <p style={{ fontFamily: C.font, fontSize: "0.68rem", color: C.orange, fontWeight: 700 }}>Parts & Sourcing</p>
          </div>
          <h1 style={{ ...H, fontSize: "1.9rem", textTransform: "uppercase", lineHeight: 1 }}>REQUIRED<br/>COMPONENTS</h1>
        </div>
        <div style={{ background: C.s1, padding: "12px 14px" }}>
          <p style={{ ...LABEL, marginBottom: 6 }}>Sourcing Location</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={12} color={C.orange} />
            <div>
              <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.75rem", color: C.txt }}>Detroit Industrial District</p>
              <p style={{ ...LABEL, marginTop: 2 }}>Search Radius: 25 km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats HUD */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, background: C.s0, padding: 2, marginBottom: 12, borderLeft: `3px solid ${C.orange}` }}>
        {[{ k: "Global Availability", v: "HIGH" }, { k: "Supply Chain Latency", v: "2.4 DAYS" }, { k: "Alternative Specs Found", v: "04" }].map(({ k, v }) => (
          <div key={k} style={{ background: C.s1, padding: "14px 16px" }}>
            <p style={{ ...LABEL, marginBottom: 4 }}>{k}</p>
            <p style={{ fontFamily: C.font, fontWeight: 900, fontSize: "1.5rem", color: C.txt, letterSpacing: "-0.02em" }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Parts list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {PARTS_DATA.map((p, i) => (
          <div key={i} style={{ background: C.s1 }}>
            {/* Part header */}
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr auto auto", gap: 16, padding: "16px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                  <span style={{ background: "#1f0a0a", color: C.light, fontFamily: C.mono, fontSize: "0.55rem", padding: "2px 8px" }}>REQUIRED</span>
                  <span style={{ fontFamily: C.mono, fontSize: "0.55rem", color: C.sub }}>SKU: {p.sku}</span>
                </div>
                <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.9rem", color: C.txt }}>{p.name}</p>
                <p style={{ fontFamily: C.font, fontSize: "0.68rem", color: C.sub, marginTop: 4, lineHeight: 1.5 }}>{p.desc}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ ...LABEL, marginBottom: 4 }}>Confidence Score</p>
                <p style={{ fontFamily: C.font, fontWeight: 900, fontSize: "1.5rem", color: C.txt }}>{p.conf}%</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ ...LABEL, marginBottom: 4 }}>Est. Price Range</p>
                <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "1rem", color: C.light }}>${p.from.toFixed(2)} — ${p.to.toFixed(2)}</p>
                <div style={{ marginTop: 6, color: C.sub, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "flex", justifyContent: "flex-end" }}>
                  <ChevronDown size={14} />
                </div>
              </div>
            </button>

            {/* Expanded sourcing */}
            {open === i && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: C.s0, margin: "0 2px 2px", padding: 2 }}>
                {/* Local */}
                <div style={{ background: C.s1, padding: "14px 14px" }}>
                  <p style={{ ...LABEL, color: C.light, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><MapPin size={10} /> Local Availability</p>
                  {p.local.map((l, j) => (
                    <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.75rem", color: C.txt }}>{l.store}</p>
                        <p style={{ fontFamily: C.font, fontSize: "0.62rem", color: C.sub, marginTop: 2 }}>{l.dist} away</p>
                        <span style={{ fontFamily: C.mono, fontSize: "0.55rem", padding: "2px 6px", background: l.stock ? "#052e16" : "#1f0a0a", color: l.stock ? "#4ade80" : "#f87171", display: "inline-block", marginTop: 4 }}>
                          {l.stock ? "READY FOR PICKUP" : "BACKORDERED"}
                        </span>
                      </div>
                      <button style={{ padding: "7px 12px", background: C.orange, border: "none", borderRadius: C.r, cursor: "pointer", fontFamily: C.font, fontWeight: 700, fontSize: "0.6rem", color: "#131313", letterSpacing: "0.06em" }}>GET DIRECTIONS</button>
                    </div>
                  ))}
                </div>
                {/* Online */}
                <div style={{ background: C.s1, padding: "14px 14px" }}>
                  <p style={{ ...LABEL, color: C.light, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><ShoppingCart size={10} /> Online Retailers</p>
                  {p.online.map((l, j) => (
                    <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.75rem", color: C.txt }}>{l.v}</p>
                        <p style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.85rem", color: C.light, marginTop: 4 }}>${l.price.toFixed(2)}</p>
                        <span style={{ fontFamily: C.mono, fontSize: "0.55rem", padding: "2px 6px", background: l.stock ? "#052e16" : "#1f0a0a", color: l.stock ? "#4ade80" : "#f87171", display: "inline-block", marginTop: 4 }}>
                          {l.stock ? "IN STOCK" : "BACKORDER"}
                        </span>
                      </div>
                      <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", background: grad, border: "none", borderRadius: C.r, cursor: "pointer", fontFamily: C.font, fontWeight: 700, fontSize: "0.6rem", color: "#131313", letterSpacing: "0.06em" }}>
                        BUY NOW <ExternalLink size={9} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer help */}
      <div style={{ marginTop: 16, padding: "20px 20px", background: C.s1 }}>
        <p style={{ ...LABEL, color: C.sub, marginBottom: 8 }}>Technical Assistance</p>
        <h3 style={{ fontFamily: C.font, fontWeight: 800, fontSize: "1.1rem", color: C.txt, textTransform: "uppercase", marginBottom: 8 }}>Not Sure About the Fit?</h3>
        <p style={{ fontFamily: C.font, fontSize: "0.72rem", color: C.sub, lineHeight: 1.6, marginBottom: 14 }}>Download the official replacement guides or connect with a certified technician to verify the parts before purchase.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "10px 18px", background: C.s2, border: "none", borderRadius: C.r, cursor: "pointer", fontFamily: C.font, fontWeight: 700, fontSize: "0.68rem", color: C.sub, letterSpacing: "0.06em" }}>VIEW MANUALS</button>
          <button style={{ padding: "10px 18px", background: grad, border: "none", borderRadius: C.r, cursor: "pointer", fontFamily: C.font, fontWeight: 700, fontSize: "0.68rem", color: "#131313", letterSpacing: "0.06em" }}>CONSULT EXPERT</button>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export function DiagnosticDashboard() {
  const [screen, setScreen] = useState<Screen>("home");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: C.bg, fontFamily: C.font, overflow: "hidden" }}>
      <TopBar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar screen={screen} setScreen={setScreen} />
        {screen === "home"      && <HomeScreen     setScreen={setScreen} />}
        {screen === "capture"   && <CaptureScreen  setScreen={setScreen} />}
        {screen === "analyzing" && <AnalyzingScreen setScreen={setScreen} />}
        {screen === "report"    && <ReportScreen   setScreen={setScreen} />}
        {screen === "guide"     && <GuideScreen    setScreen={setScreen} />}
        {screen === "parts"     && <PartsScreen />}
      </div>
    </div>
  );
}
