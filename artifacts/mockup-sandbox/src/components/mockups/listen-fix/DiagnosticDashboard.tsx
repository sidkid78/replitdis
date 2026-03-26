import { useState, useEffect, useRef } from "react";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Wrench,
  ShoppingCart,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Mic,
  Video,
  Upload,
  Play,
  SkipForward,
  Clock,
  ChevronRight,
  Star,
  Zap,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  Radio,
} from "lucide-react";

// ─── Design Tokens ──────────────────────────────────────────────────────────
const T = {
  bg:      "#131313",
  s0:      "#0e0e0e",
  s1:      "#1c1b1b",
  s2:      "#2a2a2a",
  s3:      "#343332",
  txt:     "#e5e2e1",
  sub:     "#9b9896",
  orange:  "#ff5f00",
  orangeL: "#ffb599",
  orangeGrad: "linear-gradient(135deg, #ff5f00, #ffb599)",
  radius:  "0.25rem",
  font:    "'Space Grotesk', sans-serif",
};

// ─── Shared Styles ───────────────────────────────────────────────────────────
const LABEL_STYLE: React.CSSProperties = {
  fontFamily: T.font,
  fontSize: "0.65rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: T.sub,
  fontWeight: 600,
};

const HEADING_STYLE: React.CSSProperties = {
  fontFamily: T.font,
  color: T.txt,
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

// ─── Data ────────────────────────────────────────────────────────────────────
const OBSERVATIONS = [
  "INIT — Multimodal pipeline online. Routing audio to frequency engine.",
  "FFT scan active. Sampling at 44.1kHz stereo.",
  "ANOMALY — Metallic grinding at 400Hz ± 12Hz. Bearing signature confirmed.",
  "RAG query dispatched → Knowledge Moat (iFixit / OEM corpus).",
  "MATCH — Samsung DV42H Drum Bearing Assembly. Authority: 0.94.",
  "Hazard registry check... No lethal components detected.",
  "Severity: MEDIUM. DIY protocol unlocked. Generating payload.",
  "CHECKSUM — SHA-256: a3f7c2e1d9b4f8a2 ✓ VERIFIED",
];

const STEPS = [
  { n: 1, txt: "Disconnect power. Move unit from wall to expose rear panel.", warn: "Confirm mains are dead before contact." },
  { n: 2, txt: "Remove 6× Phillips screws from rear panel. Set aside.", warn: null },
  { n: 3, txt: "Locate drum bearing at rear shaft. Inspect felt seal — fraying confirms failure.", warn: null },
  { n: 4, txt: "Slide replacement bearing kit #DC97-16782A onto shaft until seated.", warn: "Confirm full engagement before reassembly." },
  { n: 5, txt: "Reverse assembly. Run 10-min test cycle to validate fix.", warn: null },
];

const PARTS = [
  { name: "Drum Bearing Kit", pn: "DC97-16782A", from: 28.99,
    stores: [
      { v: "Repair Clinic", price: 28.99, stock: true, eta: "Ships in 1 day" },
      { v: "AppliancePartsPros", price: 31.45, stock: true, eta: "Ships in 2 days" },
      { v: "Amazon", price: 34.00, stock: true, eta: "Prime — Tomorrow" },
    ]},
  { name: "Drum Felt Seal Strip", pn: "DC61-01215A", from: 14.50,
    stores: [
      { v: "Repair Clinic", price: 14.50, stock: true, eta: "Ships in 1 day" },
      { v: "AppliancePartsPros", price: 13.99, stock: false, eta: "Backordered" },
    ]},
];

type Phase = "upload" | "analyzing" | "lethal";

// ─── Stream Hook ─────────────────────────────────────────────────────────────
function useStream(phase: Phase) {
  const [lines, setLines]       = useState<string[]>([]);
  const [alert, setAlert]       = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [pct, setPct]           = useState(0);
  const [status, setStatus]     = useState<"analyzing"|"verifying"|"done">("analyzing");
  const idx = useRef(0);

  useEffect(() => {
    if (phase !== "analyzing") return;
    setLines([]); setAlert(null); setVerified(false); setPct(0);
    setStatus("analyzing"); idx.current = 0;
    const iv = setInterval(() => {
      if (idx.current >= OBSERVATIONS.length) { clearInterval(iv); return; }
      const obs = OBSERVATIONS[idx.current];
      setLines(p => [...p, obs]);
      setPct(Math.round(((idx.current + 1) / OBSERVATIONS.length) * 100));
      if (idx.current === 5) { setStatus("verifying"); setAlert("Cross-referencing hazard registry..."); }
      if (idx.current === OBSERVATIONS.length - 1) {
        setTimeout(() => { setStatus("done"); setVerified(true); setAlert(null); }, 900);
      }
      idx.current++;
    }, 680);
    return () => clearInterval(iv);
  }, [phase]);

  return { lines, alert, verified, pct, status };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusDot({ active, color = T.orange }: { active: boolean; color?: string }) {
  return (
    <span style={{
      display: "inline-block", width: 6, height: 6, borderRadius: "50%",
      background: active ? color : T.s3, flexShrink: 0,
      boxShadow: active ? `0 0 6px ${color}` : "none",
      transition: "all 0.3s",
    }} />
  );
}

function StreamPanel({ lines, alert, status, phase }: { lines: string[]; alert: string | null; status: string; phase: Phase }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [lines, alert]);

  const lethalLines = [
    "INIT — Microwave audio routed to spectral engine.",
    "120Hz hum detected. Internal magnetron signature active.",
    "HAZARD — High-voltage capacitor identified in frame.",
  ];

  const allLines = phase === "lethal" ? lethalLines : lines;

  return (
    <div ref={ref} style={{ flex: 1, overflowY: "auto", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: 2, scrollbarWidth: "none" }}>
      {allLines.map((l, i) => (
        <div key={i} style={{ display: "flex", gap: 8, color: T.sub }}>
          <span style={{ color: T.orange, flexShrink: 0 }}>{"›"}</span>
          <span style={{ color: l.startsWith("ANOMALY") || l.startsWith("MATCH") || l.startsWith("CHECKSUM") ? T.orangeL : T.sub }}>{l}</span>
        </div>
      ))}
      {alert && phase !== "lethal" && (
        <div style={{ marginTop: 8, padding: "6px 10px", background: "#2a1a00", border: `1px solid ${T.orange}30`, borderRadius: T.radius, color: T.orangeL, fontSize: "0.6rem" }}>
          ⚠ {alert}
        </div>
      )}
      {phase === "lethal" && (
        <div style={{ marginTop: 8, padding: "8px 10px", background: "#1f0a0a", borderLeft: `2px solid #ef4444`, borderRadius: T.radius, color: "#fca5a5", fontSize: "0.6rem" }}>
          ■ KILL-SWITCH — Lethal component detected. Stream terminated. Routing to Professional Pivot.
        </div>
      )}
      {(status === "analyzing" || status === "verifying") && phase !== "lethal" && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, color: T.orange }}>
          <span>›</span>
          <span style={{ display: "inline-block", width: 7, height: 12, background: T.orange, animation: "blink 1s step-end infinite" }} />
        </div>
      )}
      {status === "done" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "#4ade80", fontSize: "0.62rem" }}>
          <CheckCircle2 size={11} /> PROTOCOL COMPLETE — PAYLOAD UNLOCKED
        </div>
      )}
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

function SafetyGate() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 10,
      background: "rgba(14,14,14,0.82)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: T.radius,
    }}>
      <div style={{ textAlign: "center", padding: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", margin: "0 auto 16px",
          background: T.s2, display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${T.orange}40`,
        }}>
          <Loader2 size={24} color={T.orange} style={{ animation: "spin 1s linear infinite" }} />
        </div>
        <p style={{ ...HEADING_STYLE, fontSize: "0.9rem", marginBottom: 6 }}>SAFETY VERIFICATION</p>
        <p style={{ ...LABEL_STYLE, color: T.sub }}>Hazard registry check in progress</p>
        <p style={{ ...LABEL_STYLE, color: T.sub }}>Repair protocol locked pending clearance</p>
        <div style={{ marginTop: 16, height: 2, background: T.s3, borderRadius: 1, overflow: "hidden" }}>
          <div style={{ height: "100%", background: T.orangeGrad, width: "60%", animation: "sweep 2s ease-in-out infinite alternate" }} />
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes sweep { from { width: 20%; } to { width: 85%; } }
        `}</style>
      </div>
    </div>
  );
}

function LethalPivot() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ padding: "12px 16px", background: "#1f0a0a", borderLeft: `3px solid #ef4444`, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <ShieldAlert size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ ...LABEL_STYLE, color: "#ef4444" }}>LETHAL HAZARD CONFIRMED</p>
          <p style={{ fontFamily: T.font, fontSize: "0.8rem", color: T.txt, marginTop: 4, lineHeight: 1.5 }}>
            High-voltage capacitor identified. Stored charge: up to <strong style={{ color: "#fca5a5" }}>2,100V</strong> after power disconnect. DIY protocol blocked.
          </p>
        </div>
      </div>

      <div style={{ background: T.s1, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, background: T.orangeGrad, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.125rem", flexShrink: 0 }}>
            <Star size={18} color="#131313" />
          </div>
          <div>
            <p style={{ ...HEADING_STYLE, fontSize: "1rem" }}>PROFESSIONAL INTERVENTION</p>
            <p style={{ ...LABEL_STYLE }}>12 verified technicians nearby · avg 4.8★</p>
          </div>
        </div>
        <p style={{ fontFamily: T.font, fontSize: "0.8rem", color: T.sub, lineHeight: 1.6, marginBottom: 20 }}>
          Microwave magnetrons and capacitors require discharge tools and arc-flash PPE. This repair is restricted to licensed appliance technicians under NFPA 70E protocol.
        </p>
        <button style={{
          width: "100%", padding: "14px 20px", background: T.orangeGrad,
          border: "none", borderRadius: "0.125rem", cursor: "pointer",
          fontFamily: T.font, fontWeight: 700, fontSize: "0.85rem", color: "#131313",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          letterSpacing: "0.02em",
        }}>
          <Zap size={15} /> BOOK A CERTIFIED TECHNICIAN — EST. $50 REFERRAL
          <ExternalLink size={13} style={{ opacity: 0.6 }} />
        </button>
        <p style={{ ...LABEL_STYLE, textAlign: "center", marginTop: 10 }}>Available today · Free cancellation</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
        {[
          { label: "Nearby Techs", value: "12" },
          { label: "Avg Rating", value: "4.8★" },
          { label: "Est. Repair", value: "$85–120" },
        ].map(s => (
          <div key={s.label} style={{ background: T.s1, padding: "16px 12px", textAlign: "center" }}>
            <p style={{ fontFamily: T.font, fontSize: "1.4rem", fontWeight: 700, color: T.orangeL }}>{s.value}</p>
            <p style={{ ...LABEL_STYLE, marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagnosisResult() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Severity bar */}
      <div style={{ background: T.s1, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle2 size={16} color="#4ade80" />
          <div>
            <p style={{ fontFamily: T.font, fontSize: "0.8rem", fontWeight: 700, color: T.txt }}>SEVERITY: MEDIUM — DIY ELIGIBLE</p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: T.sub, marginTop: 2 }}>
              SHA-256: a3f7c2e1d9b4f8a2 ✓
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ ...LABEL_STYLE }}>Confidence</p>
          <p style={{ fontFamily: T.font, fontSize: "2rem", fontWeight: 700, color: T.orangeL, letterSpacing: "-0.02em" }}>94%</p>
        </div>
      </div>

      {/* ID card */}
      <div style={{ background: T.s0, padding: "16px 16px" }}>
        <p style={{ ...LABEL_STYLE, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <ShieldCheck size={10} color={T.orange} /> Identification
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { k: "Make / Model", v: "Samsung DV42H5000EW" },
            { k: "Component", v: "Drum Bearing Assembly" },
          ].map(r => (
            <div key={r.k}>
              <p style={{ ...LABEL_STYLE, marginBottom: 3 }}>{r.k}</p>
              <p style={{ fontFamily: T.font, fontWeight: 600, fontSize: "0.8rem", color: T.txt }}>{r.v}</p>
            </div>
          ))}
          <div style={{ gridColumn: "1/-1" }}>
            <p style={{ ...LABEL_STYLE, marginBottom: 3 }}>Root Cause</p>
            <p style={{ fontFamily: T.font, fontSize: "0.78rem", color: T.sub, lineHeight: 1.6 }}>
              Worn drum support bearing producing metallic grinding at 400Hz. Matches OEM failure mode #DB-4.
            </p>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: "8px 10px", background: "#1a1200", borderLeft: `2px solid ${T.orange}`, fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: T.sub }}>
          <span style={{ color: T.orangeL }}>RAG/</span> iFixit #120847 · Authority 0.95 (L1) · HNSW score 0.94
        </div>
      </div>

      {/* Repair steps */}
      <div style={{ background: T.s1, padding: "16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ ...LABEL_STYLE, display: "flex", alignItems: "center", gap: 6 }}>
            <Wrench size={10} color={T.orange} /> Repair Protocol
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ ...LABEL_STYLE, background: T.s3, padding: "3px 8px" }}>Beginner</span>
            <span style={{ ...LABEL_STYLE, background: T.s3, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={8} /> 45–60 min
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {STEPS.map(s => (
            <div key={s.n} style={{ background: T.s0, padding: "12px 14px", display: "flex", gap: 12 }}>
              <span style={{
                flexShrink: 0, width: 22, height: 22,
                background: T.orangeGrad, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontFamily: T.font, fontWeight: 700, fontSize: "0.65rem",
                color: "#131313", borderRadius: "0.125rem",
              }}>{s.n}</span>
              <div>
                <p style={{ fontFamily: T.font, fontSize: "0.78rem", color: T.txt, lineHeight: 1.55 }}>{s.txt}</p>
                {s.warn && (
                  <div style={{ marginTop: 6, display: "flex", alignItems: "flex-start", gap: 6, background: "#1f1200", padding: "6px 10px", borderLeft: `2px solid ${T.orange}` }}>
                    <AlertTriangle size={10} color={T.orange} style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontFamily: T.font, fontSize: "0.68rem", color: T.orangeL, lineHeight: 1.5 }}>{s.warn}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, padding: "10px 12px", background: T.s0 }}>
          <p style={{ ...LABEL_STYLE, marginBottom: 6 }}>Required Tools</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Phillips #2", "Putty Knife", "Work Gloves"].map(t => (
              <span key={t} style={{ fontFamily: T.font, fontSize: "0.7rem", color: T.sub, background: T.s2, padding: "4px 10px", borderRadius: "0.125rem" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Parts */}
      <div style={{ background: T.s0, padding: "16px 16px" }}>
        <p style={{ ...LABEL_STYLE, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <ShoppingCart size={10} color={T.orange} /> Parts Sourcing
        </p>
        {PARTS.map((p, i) => (
          <div key={i} style={{ marginBottom: 2 }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", background: T.s2, border: "none", padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <div style={{ textAlign: "left" }}>
                <p style={{ fontFamily: T.font, fontWeight: 600, fontSize: "0.78rem", color: T.txt }}>{p.name}</p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: T.sub, marginTop: 2 }}>#{p.pn}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <p style={{ fontFamily: T.font, fontWeight: 700, fontSize: "0.85rem", color: T.orangeL }}>From ${p.from.toFixed(2)}</p>
                <ChevronDown size={13} color={T.sub} style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
            </button>
            {open === i && (
              <div style={{ background: T.s1 }}>
                {p.stores.map((st, si) => (
                  <div key={si} style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${T.s2}` }}>
                    <div>
                      <p style={{ fontFamily: T.font, fontSize: "0.75rem", fontWeight: 600, color: T.txt }}>{st.v}</p>
                      <p style={{ fontFamily: T.font, fontSize: "0.65rem", color: T.sub, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <MapPin size={9} /> {st.eta}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", padding: "2px 7px", background: st.stock ? "#052e16" : "#1f0a0a", color: st.stock ? "#4ade80" : "#f87171" }}>
                        {st.stock ? "IN STOCK" : "BACKORDER"}
                      </span>
                      <p style={{ fontFamily: T.font, fontWeight: 700, fontSize: "0.82rem", color: T.txt }}>${st.price.toFixed(2)}</p>
                      <button style={{ padding: "6px 8px", background: T.orangeGrad, border: "none", borderRadius: "0.125rem", cursor: "pointer" }}>
                        <ShoppingCart size={12} color="#131313" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Upload Screen ────────────────────────────────────────────────────────────
function UploadScreen({ onStart }: { onStart: (p: Phase) => void }) {
  const [desc, setDesc] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", gap: 28 }}>
      {/* Brand */}
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: T.orangeGrad, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.125rem" }}>
            <Activity size={18} color="#131313" />
          </div>
          <span style={{ fontFamily: T.font, fontWeight: 700, fontSize: "1.2rem", color: T.txt, letterSpacing: "-0.01em" }}>LISTEN & FIX</span>
        </div>
        <p style={{ ...LABEL_STYLE, color: T.sub }}>Precision AI Diagnostics · Safety-Verified Repair Protocol</p>
      </div>

      {/* Drop zone */}
      <div style={{
        width: "100%", maxWidth: 480,
        border: `1px dashed ${T.s3}`,
        background: T.s1, padding: "32px 24px", textAlign: "center", cursor: "pointer",
        transition: "all 0.2s",
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = T.orange)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = T.s3)}
      >
        <div style={{ width: 44, height: 44, background: T.s2, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", borderRadius: "0.125rem" }}>
          <Upload size={20} color={T.sub} />
        </div>
        <p style={{ fontFamily: T.font, fontWeight: 600, fontSize: "0.85rem", color: T.txt }}>Drop audio or video file here</p>
        <p style={{ ...LABEL_STYLE, marginTop: 4, color: T.sub }}>MP4, MOV, WAV, MP3 · Up to 2GB</p>
        <button style={{ marginTop: 16, padding: "9px 20px", background: T.orangeGrad, border: "none", borderRadius: "0.125rem", fontFamily: T.font, fontWeight: 700, fontSize: "0.75rem", color: "#131313", cursor: "pointer", letterSpacing: "0.04em" }}>
          BROWSE FILES
        </button>
      </div>

      {/* Text description */}
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ ...LABEL_STYLE, display: "flex", alignItems: "center", gap: 6 }}>
            <MessageSquare size={10} color={T.orange} /> Describe the issue
          </label>
          <span style={{ ...LABEL_STYLE, background: T.s2, padding: "2px 8px", color: T.sub }}>Optional</span>
        </div>
        <div style={{
          position: "relative",
          background: T.s1,
          borderLeft: focused ? `2px solid ${T.orange}` : `2px solid ${T.s3}`,
          transition: "border-color 0.2s",
        }}>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value.slice(0, 500))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. Dryer makes a loud grinding noise at the start of every cycle, especially in the first 2 minutes..."
            rows={3}
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              padding: "12px 14px 28px 14px",
              fontFamily: T.font, fontSize: "0.78rem", color: T.txt, resize: "none",
              lineHeight: 1.6, boxSizing: "border-box",
            }}
          />
          <div style={{ position: "absolute", bottom: 8, left: 14, right: 10, display: "flex", justifyContent: "space-between", alignItems: "center", pointerEvents: "none" }}>
            {desc.length > 0
              ? <span style={{ fontFamily: T.font, fontSize: "0.6rem", color: T.orange, display: "flex", alignItems: "center", gap: 4 }}>
                  <Sparkles size={9} /> Context refines diagnostic accuracy
                </span>
              : <span style={{ fontFamily: T.font, fontSize: "0.6rem", color: T.sub }}>Adding context improves accuracy</span>
            }
            <span style={{ ...LABEL_STYLE, color: desc.length > 425 ? T.orangeL : T.sub }}>{desc.length}/500</span>
          </div>
        </div>
        {desc.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {["When does it happen?", "How long?", "Error codes?"].map(h => (
              <button key={h} onClick={() => setDesc(p => p + ` ${h}`)}
                style={{ fontFamily: T.font, fontSize: "0.65rem", padding: "3px 10px", background: T.s2, border: `1px solid ${T.s3}`, color: T.sub, cursor: "pointer", borderRadius: "0.125rem", letterSpacing: "0.02em" }}>
                + {h}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Demo CTAs */}
      <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 480 }}>
        <button onClick={() => onStart("analyzing")} style={{ flex: 1, padding: "13px 16px", background: T.orangeGrad, border: "none", borderRadius: "0.125rem", fontFamily: T.font, fontWeight: 700, fontSize: "0.75rem", color: "#131313", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.04em" }}>
          <Play size={14} /> DEMO: NORMAL DIAGNOSIS
        </button>
        <button onClick={() => onStart("lethal")} style={{ flex: 1, padding: "13px 16px", background: T.s2, border: `1px solid #ef444440`, borderRadius: "0.125rem", fontFamily: T.font, fontWeight: 700, fontSize: "0.75rem", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.04em" }}>
          <ShieldAlert size={14} /> DEMO: LETHAL HAZARD
        </button>
      </div>

      {/* Feature strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, width: "100%", maxWidth: 480 }}>
        {[
          { icon: Mic, label: "Acoustic Analysis", sub: "44.1kHz spectral scan" },
          { icon: Video, label: "Video Processing", sub: "Gemini native multimodal" },
          { icon: ShieldCheck, label: "Safety Verified", sub: "RAG knowledge moat" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} style={{ background: T.s1, padding: "14px 10px", textAlign: "center" }}>
            <Icon size={16} color={T.orange} style={{ marginBottom: 8 }} />
            <p style={{ fontFamily: T.font, fontWeight: 600, fontSize: "0.7rem", color: T.txt }}>{label}</p>
            <p style={{ ...LABEL_STYLE, marginTop: 3 }}>{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function DiagnosticDashboard() {
  const [phase, setPhase] = useState<Phase>("upload");
  const { lines, alert, verified, pct, status } = useStream(phase);

  if (phase === "upload") {
    return <UploadScreen onStart={setPhase} />;
  }

  const isLethal = phase === "lethal";
  const locked   = !isLethal && !verified;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      {/* Header */}
      <header style={{ background: T.s0, padding: "0 32px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, background: T.orangeGrad, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.125rem", flexShrink: 0 }}>
            <Activity size={14} color="#131313" />
          </div>
          <span style={{ fontFamily: T.font, fontWeight: 700, fontSize: "0.85rem", color: T.txt, letterSpacing: "0.04em" }}>LISTEN & FIX</span>
          <span style={{ width: 1, height: 16, background: T.s3, margin: "0 4px" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: T.sub }}>CASE #b4e2f7a1</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {!isLethal && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 96, height: 2, background: T.s3, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: T.orangeGrad, transition: "width 0.5s" }} />
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.sub }}>{pct}%</span>
            </div>
          )}
          <button onClick={() => setPhase("upload")} style={{ padding: "6px 12px", background: T.s2, border: "none", borderRadius: "0.125rem", fontFamily: T.font, fontWeight: 600, fontSize: "0.65rem", color: T.sub, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, letterSpacing: "0.04em" }}>
            <SkipForward size={11} /> NEW CASE
          </button>
        </div>
      </header>

      {/* System status bar */}
      <div style={{ background: T.s1, padding: "8px 32px", display: "flex", alignItems: "center", gap: 20 }}>
        <StatusDot active={true} color={isLethal ? "#ef4444" : "#4ade80"} />
        <span style={{ ...LABEL_STYLE, color: isLethal ? "#f87171" : "#4ade80" }}>
          {isLethal ? "SYSTEM STATUS: BLOCKED // LETHAL HAZARD" : `SYSTEM STATUS: ACTIVE // ${status.toUpperCase()}`}
        </span>
        <span style={{ ...LABEL_STYLE, marginLeft: "auto" }}>
          {isLethal ? "PROFESSIONAL PIVOT PROTOCOL" : "DUAL-TRACK ANALYSIS ENGINE"}
        </span>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 2, padding: 2, maxWidth: 1200, margin: "0 auto" }}>
        {/* Left — Stream panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Terminal */}
          <div style={{ background: T.s0 }}>
            <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: T.s1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Radio size={11} color={isLethal ? "#ef4444" : T.orange} style={isLethal ? {} : { animation: "blink 1.2s ease-in-out infinite" }} />
                <span style={{ ...LABEL_STYLE }}>Observation Stream</span>
              </div>
              <StatusDot active={true} color={isLethal ? "#ef4444" : status === "done" ? "#4ade80" : T.orange} />
            </div>
            <div style={{ padding: "12px 14px", height: 220, display: "flex", flexDirection: "column" }}>
              <StreamPanel lines={lines} alert={alert} status={isLethal ? "done" : status} phase={phase} />
            </div>
          </div>

          {/* Safety checklist */}
          {!isLethal && (
            <div style={{ background: T.s1, padding: "14px 14px" }}>
              <p style={{ ...LABEL_STYLE, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <ShieldCheck size={10} color={T.orange} /> Safety Protocol
              </p>
              {[
                { label: "Acoustic Analysis", done: pct > 25 },
                { label: "Knowledge Moat RAG", done: pct > 55 },
                { label: "Hazard Registry", done: pct > 75 },
                { label: "SHA-256 Checksum", done: verified },
              ].map(({ label, done }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 18, height: 18, background: done ? "#052e16" : T.s2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.3s" }}>
                    {done
                      ? <CheckCircle2 size={11} color="#4ade80" />
                      : <div style={{ width: 5, height: 5, background: T.s3, borderRadius: "50%" }} />
                    }
                  </div>
                  <span style={{ fontFamily: T.font, fontSize: "0.72rem", color: done ? T.txt : T.sub, fontWeight: done ? 600 : 400, transition: "all 0.3s" }}>{label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Lethal HUD */}
          {isLethal && (
            <div style={{ background: "#1f0a0a", padding: "14px 14px", borderLeft: `2px solid #ef4444` }}>
              <p style={{ ...LABEL_STYLE, color: "#f87171", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <ShieldAlert size={10} /> Lethal Hazard Active
              </p>
              <p style={{ fontFamily: T.font, fontSize: "0.72rem", color: "#fca5a5", lineHeight: 1.5 }}>
                Capacitor stored charge: <strong>2,100V</strong> post-disconnect. Kill-switch active.
              </p>
            </div>
          )}
        </div>

        {/* Right — Report */}
        <div>
          <div style={{ padding: "18px 20px 14px", background: T.s1 }}>
            <p style={{ ...LABEL_STYLE, color: T.sub }}>Diagnostic Report</p>
            <h1 style={{ ...HEADING_STYLE, fontSize: "1.5rem", marginTop: 4 }}>
              {isLethal ? "Microwave — Lethal Hazard" : "Samsung Dryer DV42H"}
            </h1>
          </div>
          <div style={{ position: "relative", marginTop: 2 }}>
            {locked && <SafetyGate />}
            <div style={{ filter: locked ? "blur(6px)" : "none", pointerEvents: locked ? "none" : "auto", userSelect: locked ? "none" : "auto" }}>
              {isLethal ? <LethalPivot /> : <DiagnosisResult />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
