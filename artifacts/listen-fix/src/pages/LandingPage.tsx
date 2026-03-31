import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Activity, ShieldCheck, Wrench, Upload, CheckCircle2, Cpu,
  Database, Search, Star, ChevronRight, FileCheck, Zap,
  AlertTriangle, Menu, X, Moon, Sun,
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
  tertiary: "#5f2200",
  error: "#ba1a1a", error_c: "#ffdad6",
  outline_v: "rgba(208,201,201,0.15)",
  inter: "'Inter', sans-serif", sans: "'Public Sans', sans-serif",
  radius: "0.375rem",
  shadow: "0 8px 32px rgba(27,28,28,0.04)",
  dark: false,
};
const DARK: typeof LIGHT = {
  surface: "#001a35", surface_bright: "#002d5c",
  surface_cl: "#00234a", surface_c: "#00234a",
  surface_ch: "#002d5c", surface_chh: "#003566",
  on_surface: "#fcf9f8", on_surface_v: "#b8ccd8",
  primary: "#d1e4ff", primary_c: "#004a99",
  primary_fixed: "#d1e4ff", on_primary: "#00346f",
  secondary: "#b2cad3", secondary_c: "#1d3640",
  tertiary: "#ffb59a",
  error: "#ffb4ab", error_c: "#93000a",
  outline_v: "rgba(180,200,220,0.12)",
  inter: "'Inter', sans-serif", sans: "'Public Sans', sans-serif",
  radius: "0.375rem",
  shadow: "0 8px 32px rgba(0,0,0,0.24)",
  dark: true,
};

const grad = (t: typeof LIGHT) =>
  `linear-gradient(135deg, ${t.dark ? t.primary_c : t.primary}, ${t.dark ? "#0059b8" : t.primary_c})`;
const warnGrad = (t: typeof LIGHT) =>
  `linear-gradient(135deg, ${t.tertiary}, ${t.dark ? "#c2440a" : "#7a2d00"})`;

const STREAM_LINES = [
  "> INITIALIZING MULTIMODAL PIPELINE...",
  "> PROCESSING AUDIO SIGNATURE: 44.1kHz...",
  "> ⚠ ANOMALY DETECTED: 400Hz METALLIC GRINDING",
  "> CROSS-REFERENCING OEM KNOWLEDGE BASE...",
  "> MATCH: BEARING ASSEMBLY (0.94 CONFIDENCE)",
  "> DETERMINISTIC SAFETY CHECKSUM...",
  "> SAFETY SCAN: PASSED ✓",
  "> DECRYPTING REPAIR GUIDE...",
];

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [lines, setLines] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const T = dark ? DARK : LIGHT;

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < STREAM_LINES.length) { setLines(l => [...l, STREAM_LINES[i]]); i++; }
      else clearInterval(iv);
    }, 750);
    return () => clearInterval(iv);
  }, []);

  const G = grad(T);

  return (
    <div style={{ background: T.surface, minHeight: "100vh", fontFamily: T.sans, color: T.on_surface, overflowX: "hidden", transition: "background 0.35s, color 0.35s" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .lf-fade { animation: fadeInUp .4s ease-out forwards; }
        .lf-nav-link:hover { color: ${T.primary} !important; }
        .lf-how-card:hover { background: ${T.surface_cl} !important; transform: translateY(-2px); }
        .lf-feat-card:hover { background: ${T.surface_bright} !important; box-shadow: ${T.shadow}; }
        .lf-test-card:hover { background: ${T.surface_ch} !important; }
        .lf-pricing-card:hover { box-shadow: ${T.shadow}; }
        .lf-nav-link, .lf-how-card, .lf-feat-card, .lf-test-card, .lf-pricing-card { transition: all 0.2s; }
        @media(max-width:768px){
          .lf-nav-links{display:none!important;}
          .lf-hamburger{display:flex!important;}
          .lf-hero{grid-template-columns:1fr!important;gap:2rem!important;padding:3rem 1.25rem 2.5rem!important;}
          .lf-hero-h1{font-size:clamp(2rem,10vw,2.8rem)!important;}
          .lf-trust-inner{flex-direction:column!important;text-align:center!important;gap:1rem!important;}
          .lf-grid-3,.lf-grid-3-pricing{grid-template-columns:1fr!important;}
          .lf-grid-2{grid-template-columns:1fr!important;}
          .lf-section{padding:3rem 1.25rem!important;}
          .lf-section-alt{padding:3rem 1.25rem!important;}
          .lf-cta-section{padding:4rem 1.25rem!important;}
          .lf-hero-btns{flex-direction:column!important;}
          .lf-hero-btns button{width:100%!important;justify-content:center!important;}
          .lf-footer-inner{flex-direction:column!important;text-align:center!important;gap:1rem!important;}
        }
      `}</style>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, background: T.dark ? "rgba(0,26,53,0.96)" : "rgba(252,249,248,0.96)", backdropFilter: "blur(20px)", zIndex: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2.5rem" }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: T.on_surface_v }}>
            <X size={28} />
          </button>
          {["How It Works", "Safety", "Pricing"].map(l => (
            <button key={l} onClick={() => setMenuOpen(false)} style={{ fontFamily: T.inter, fontWeight: 700, fontSize: "1.5rem", color: T.on_surface, background: "none", border: "none", cursor: "pointer", letterSpacing: "-0.01em" }}>{l}</button>
          ))}
          <button onClick={() => { setMenuOpen(false); setLocation("/dashboard"); }} style={{ padding: "1rem 2.5rem", background: G, border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 700, fontSize: "0.8rem", color: T.dark ? T.on_primary : "#fff", letterSpacing: "0.08em", borderRadius: T.radius }}>
            LAUNCH APP →
          </button>
        </div>
      )}

      {/* Nav */}
      <nav style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2.5rem", background: T.surface_bright, position: "sticky", top: 0, zIndex: 100, boxShadow: `0 1px 0 ${T.outline_v}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ width: 30, height: 30, background: G, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: T.radius }}>
            <Activity size={15} color="#fff" />
          </div>
          <span style={{ fontFamily: T.inter, fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.04em", color: T.on_surface }}>Listen & Fix</span>
        </div>
        <div className="lf-nav-links" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {["How It Works", "Safety", "Pricing"].map(l => (
            <a key={l} href="#" className="lf-nav-link" style={{ fontFamily: T.inter, fontSize: "0.8rem", color: T.on_surface_v, textDecoration: "none", fontWeight: 500 }}>{l}</a>
          ))}
          <button onClick={() => setDark(d => !d)} style={{ padding: "0.4rem", background: T.surface_c, border: "none", cursor: "pointer", borderRadius: T.radius, display: "flex", color: T.on_surface_v }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button onClick={() => setLocation("/dashboard")} style={{ padding: "0.6rem 1.25rem", background: G, border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 700, fontSize: "0.75rem", color: "#fff", letterSpacing: "0.06em", borderRadius: T.radius }}>
            LAUNCH APP →
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button onClick={() => setDark(d => !d)} style={{ padding: "0.4rem", background: T.surface_c, border: "none", cursor: "pointer", borderRadius: T.radius, display: "flex", color: T.on_surface_v }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button className="lf-hamburger" onClick={() => setMenuOpen(true)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: T.on_surface, padding: "0.25rem" }}>
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="lf-hero" style={{ padding: "5rem 2.5rem 4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: T.primary_fixed.concat(T.dark ? "" : ""), padding: "0.3rem 0.875rem", borderRadius: T.radius, marginBottom: "1.75rem", background: T.dark ? `${T.primary}22` : `${T.primary}12` }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.dark ? T.primary : T.primary, animation: "pulse-dot 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: T.inter, fontSize: "0.6875rem", fontWeight: 600, color: T.dark ? T.primary : T.primary, letterSpacing: "0.05em", textTransform: "uppercase" }}>v2.0 Early Access · Live</span>
          </div>
          <h1 className="lf-hero-h1" style={{ fontFamily: T.inter, fontWeight: 900, fontSize: "clamp(2.4rem,5vw,3.8rem)", lineHeight: 1.02, letterSpacing: "-0.03em", color: T.on_surface, marginBottom: "1.5rem" }}>
            Your Appliance<br />
            <span style={{ color: T.primary }}>Speaks.</span><br />
            We Translate.
          </h1>
          <p style={{ fontFamily: T.sans, fontWeight: 400, fontSize: "1rem", color: T.on_surface_v, lineHeight: 1.8, maxWidth: 440, marginBottom: "2.5rem" }}>
            Upload a video or audio clip of any fault sound. Get a safety-verified, step-by-step repair guide in under 90 seconds — powered by Gemini 3 Flash multimodal AI.
          </p>
          <div className="lf-hero-btns" style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <button onClick={() => setLocation("/dashboard")} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.9rem 1.75rem", background: G, border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 700, fontSize: "0.8rem", color: "#fff", letterSpacing: "0.06em", borderRadius: T.radius, boxShadow: `0 4px 16px ${T.primary}30` }}>
              Start Free Diagnosis <ChevronRight size={16} />
            </button>
            <button style={{ padding: "0.9rem 1.5rem", background: "transparent", border: `1.5px solid ${T.outline_v}`, cursor: "pointer", fontFamily: T.inter, fontWeight: 600, fontSize: "0.78rem", color: T.on_surface_v, borderRadius: T.radius, backdropFilter: T.dark ? "blur(8px)" : "none" }}>
              See How It Works
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Cpu size={14} color={T.on_surface_v} />
            <span style={{ fontFamily: T.inter, fontSize: "0.6875rem", color: T.on_surface_v, fontWeight: 500 }}>Powered by Gemini 3 Flash · 6-Stage AI Pipeline</span>
          </div>
        </div>

        {/* Live Stream Panel */}
        <div style={{ background: T.dark ? T.surface_c : T.on_surface, borderRadius: T.radius, overflow: "hidden", boxShadow: T.dark ? "none" : `0 24px 48px rgba(27,28,28,0.12)` }}>
          <div style={{ padding: "0.75rem 1rem", background: T.dark ? T.surface_ch : "#2a2b2b", display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ display: "flex", gap: "0.3rem" }}>
              {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
            </div>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.65rem", color: "#6b7280", marginLeft: "0.375rem" }}>observation-stream.sh</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse-dot 2s ease-in-out infinite" }} />
              <span style={{ fontFamily: T.inter, fontSize: "0.55rem", color: "#22c55e", fontWeight: 600, letterSpacing: "0.06em" }}>LIVE</span>
            </div>
          </div>
          <div style={{ padding: "1.25rem", minHeight: 280, fontFamily: "'Courier New', monospace", fontSize: "0.73rem", lineHeight: 2, background: T.dark ? T.surface_c : "#1a1b1b" }}>
            {lines.filter(Boolean).map((line, i) => (
              <div key={i} className="lf-fade" style={{ color: line.includes("⚠") ? "#fbbf24" : line.includes("PASSED") ? "#4ade80" : line.includes("MATCH") ? "#93c5fd" : "#d4d4d4" }}>
                {line}
              </div>
            ))}
            {lines.length < STREAM_LINES.length && (
              <span style={{ display: "inline-block", width: 7, height: 13, background: "#93c5fd", verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
            )}
          </div>
        </div>
      </section>

      {/* Trust ticker */}
      <div style={{ background: T.surface_c, padding: "1rem 0", overflow: "hidden" }}>
        <div className="lf-trust-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: T.inter, fontSize: "0.6875rem", fontWeight: 600, color: T.on_surface_v, letterSpacing: "0.04em", textTransform: "uppercase" }}>Trusted by 12,000+ engineers & homeowners</span>
          <div style={{ display: "flex", gap: "2rem", opacity: 0.4, flexWrap: "wrap", justifyContent: "center" }}>
            {["iFixit","NHTSA","RepairClinic","OEM Manuals"].map(b => (
              <span key={b} style={{ fontFamily: T.inter, fontWeight: 700, fontSize: "0.875rem", color: T.on_surface }}>{b}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
              <span style={{ fontFamily: T.inter, fontWeight: 800, fontSize: "0.8rem", color: T.on_surface, marginLeft: 4 }}>4.9</span>
            </div>
            <div style={{ width: 1, height: 16, background: T.surface_ch }} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <ShieldCheck size={13} color={T.dark ? "#4ade80" : "#166534"} />
              <span style={{ fontFamily: T.inter, fontSize: "0.72rem", fontWeight: 600, color: T.dark ? "#4ade80" : "#166534" }}>Zero Lethal Incidents</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="lf-section" style={{ padding: "5rem 2.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{ fontFamily: T.inter, fontSize: "0.6875rem", fontWeight: 700, color: T.primary, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>The Process</p>
          <h2 style={{ fontFamily: T.inter, fontWeight: 800, fontSize: "clamp(1.75rem,4vw,2.25rem)", letterSpacing: "-0.02em", color: T.on_surface, lineHeight: 1.2, maxWidth: 520 }}>Diagnosis in three steps. Safety in every one.</h2>
        </div>
        <div className="lf-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
          {[
            { icon: <Upload size={22} />, step: "01", title: "Upload Media", body: "Drag and drop a short video or audio clip of the fault sound or symptom. We handle any format." },
            { icon: <Cpu size={22} />, step: "02", title: "AI Analyzes", body: "Our multimodal engine cross-references the signature against 50,000+ indexed repair manuals in real-time." },
            { icon: <CheckCircle2 size={22} />, step: "03", title: "Fix It Safely", body: "Receive a step-by-step repair guide with parts sourcing, safety callouts, and OEM specs." },
          ].map(({ icon, step, title, body }, idx) => (
            <div key={step} className="lf-how-card" style={{ background: T.surface_cl, padding: "2rem 1.75rem", borderRadius: T.radius, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 16, right: 20, fontFamily: T.inter, fontWeight: 900, fontSize: "4.5rem", color: T.primary, opacity: T.dark ? 0.06 : 0.04, lineHeight: 1, userSelect: "none" }}>{step}</div>
              {idx > 0 && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 32, background: T.primary, opacity: 0.15, borderRadius: 2 }} />}
              <div style={{ width: 48, height: 48, background: T.dark ? `${T.primary}22` : `${T.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: T.radius, marginBottom: "1.375rem", color: T.primary }}>{icon}</div>
              <h3 style={{ fontFamily: T.inter, fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "-0.01em", color: T.on_surface, marginBottom: "0.625rem" }}>{title}</h3>
              <p style={{ fontFamily: T.sans, fontSize: "0.825rem", color: T.on_surface_v, lineHeight: 1.75 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <div className="lf-section-alt" style={{ background: T.surface_c, padding: "5rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "flex-start", gap: "1.5rem", marginBottom: "3rem" }}>
            <div>
              <p style={{ fontFamily: T.inter, fontSize: "0.6875rem", fontWeight: 700, color: T.primary, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Capabilities</p>
              <h2 style={{ fontFamily: T.inter, fontWeight: 800, fontSize: "clamp(1.75rem,4vw,2.25rem)", letterSpacing: "-0.02em", color: T.on_surface, lineHeight: 1.2 }}>Enterprise-grade.<br />Workshop-ready.</h2>
            </div>
          </div>
          <div className="lf-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem" }}>
            {[
              { icon: <ShieldCheck size={20} />, title: "Safety Checksum", body: "SHA-256 verified scan on every diagnosis. High-voltage hazards auto-flagged before any guide is unlocked." },
              { icon: <Database size={20} />, title: "RAG Knowledge Base", body: "50,000+ indexed OEM manuals and service bulletins cross-referenced in real-time for accuracy." },
              { icon: <Search size={20} />, title: "Parts Sourcing", body: "Instant local and online parts availability with confidence-scored SKU matching. Buy with one click." },
              { icon: <Wrench size={20} />, title: "Step-by-Step Guides", body: "Foreman-vetted repair instructions with tool checklists, torque specs, and safety callouts." },
              { icon: <Zap size={20} />, title: "60-Second Analysis", body: "Multimodal acoustic engine delivers actionable results in under a minute. No waiting, no guessing." },
              { icon: <FileCheck size={20} />, title: "Audit Trail", body: "Every session is logged, timestamped, and exportable for compliance and warranty records." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="lf-feat-card" style={{ background: T.surface_bright, padding: "1.75rem 1.5rem", borderRadius: T.radius }}>
                <div style={{ width: 40, height: 40, background: T.dark ? `${T.primary}22` : `${T.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: T.radius, marginBottom: "1.125rem", color: T.primary }}>{icon}</div>
                <h4 style={{ fontFamily: T.inter, fontWeight: 700, fontSize: "0.875rem", letterSpacing: "-0.01em", color: T.on_surface, marginBottom: "0.5rem" }}>{title}</h4>
                <p style={{ fontFamily: T.sans, fontSize: "0.8rem", color: T.on_surface_v, lineHeight: 1.75 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <section className="lf-section" style={{ padding: "5rem 2.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontFamily: T.inter, fontSize: "0.6875rem", fontWeight: 700, color: T.primary, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>In The Field</p>
        <h2 style={{ fontFamily: T.inter, fontWeight: 800, fontSize: "clamp(1.75rem,4vw,2.25rem)", letterSpacing: "-0.02em", color: T.on_surface, lineHeight: 1.2, marginBottom: "3rem" }}>What engineers are saying</h2>
        <div className="lf-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
          {[
            { quote: "Saved me $1,200 on an HVAC compressor. The AI diagnosed a failing bearing from a 20-second recording. Ordered the part and fixed it myself.", name: "Marcus T.", role: "Facilities Manager, Detroit" },
            { quote: "The safety checkpoint is what made me trust it. It flagged a capacitor risk before I even touched the unit. That's the kind of AI I need.", name: "Sarah K.", role: "Industrial Technician, Chicago" },
            { quote: "The parts hub is incredible. Found the exact V-belt SKU locally, 0.9km away, with a 98% confidence match. Unreal accuracy.", name: "James R.", role: "Plant Maintenance Supervisor" },
          ].map(({ quote, name, role }) => (
            <div key={name} className="lf-test-card" style={{ background: T.surface_cl, padding: "1.75rem", borderRadius: T.radius }}>
              <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1.125rem" }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontFamily: T.sans, fontSize: "0.85rem", color: T.on_surface, lineHeight: 1.8, fontStyle: "italic", marginBottom: "1.5rem" }}>"{quote}"</p>
              <div>
                <p style={{ fontFamily: T.inter, fontWeight: 700, fontSize: "0.8125rem", color: T.on_surface }}>{name}</p>
                <p style={{ fontFamily: T.inter, fontSize: "0.6875rem", color: T.on_surface_v, marginTop: "0.25rem", fontWeight: 500 }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <div style={{ background: T.surface_c, padding: "5rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: T.inter, fontSize: "0.6875rem", fontWeight: 700, color: T.primary, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Pricing</p>
            <h2 style={{ fontFamily: T.inter, fontWeight: 800, fontSize: "clamp(1.75rem,4vw,2.25rem)", letterSpacing: "-0.02em", color: T.on_surface }}>Simple, transparent pricing</h2>
          </div>
          <div className="lf-grid-3-pricing" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {[
              { name: "Starter", price: "Free", period: "No credit card needed", features: ["5 diagnoses/month","Basic safety scan","Parts availability lookup"], featured: false },
              { name: "Foreman", price: "$29", period: "per month", features: ["Unlimited diagnoses","Full RAG knowledge base","Parts sourcing hub","Priority AI processing","Audit trail export"], featured: true },
              { name: "Enterprise", price: "Custom", period: "contact our team", features: ["Unlimited seats","Full API access","Custom knowledge base","LOTO compliance module","Dedicated support"], featured: false },
            ].map(({ name, price, period, features, featured }) => (
              <div key={name} className="lf-pricing-card" style={{ background: T.surface_bright, padding: "2rem 1.75rem", borderRadius: T.radius, position: "relative", boxShadow: featured ? `0 0 0 2px ${T.primary}, ${T.shadow}` : T.shadow }}>
                {featured && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: G, padding: "0.2rem 0.875rem", borderRadius: "2rem", whiteSpace: "nowrap" }}>
                    <span style={{ fontFamily: T.inter, fontSize: "0.6rem", color: "#fff", fontWeight: 700, letterSpacing: "0.08em" }}>MOST POPULAR</span>
                  </div>
                )}
                <p style={{ fontFamily: T.inter, fontSize: "0.6875rem", fontWeight: 700, color: T.on_surface_v, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{name}</p>
                <p style={{ fontFamily: T.inter, fontWeight: 900, fontSize: "2.5rem", color: T.on_surface, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{price}</p>
                <p style={{ fontFamily: T.sans, fontSize: "0.8rem", color: T.on_surface_v, marginBottom: "1.75rem", marginTop: "0.25rem" }}>{period}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                  {features.map(f => (
                    <div key={f} style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                      <CheckCircle2 size={13} color={T.primary} />
                      <span style={{ fontFamily: T.sans, fontSize: "0.825rem", color: T.on_surface }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", padding: "0.8rem", background: featured ? G : "transparent", border: featured ? "none" : `1.5px solid ${T.outline_v}`, cursor: "pointer", fontFamily: T.inter, fontWeight: 700, fontSize: "0.75rem", color: featured ? "#fff" : T.on_surface_v, letterSpacing: "0.06em", borderRadius: T.radius }}>
                  {name === "Enterprise" ? "CONTACT SALES" : "GET STARTED"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="lf-cta-section" style={{ padding: "6rem 2.5rem", textAlign: "center", background: T.dark ? T.surface_ch : `linear-gradient(160deg, ${T.primary} 0%, ${T.primary_c} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.06), transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: T.inter, fontWeight: 900, fontSize: "clamp(2rem,5vw,3rem)", letterSpacing: "-0.03em", lineHeight: 1.05, color: "#fff", marginBottom: "1.5rem" }}>
            Stop paying for what<br />you can fix yourself.
          </h2>
          <p style={{ fontFamily: T.sans, fontSize: "1rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            Join 12,000+ engineers and homeowners diagnosing and fixing their appliances with precision AI. Start for free.
          </p>
          <button onClick={() => setLocation("/dashboard")} style={{ display: "inline-flex", alignItems: "center", gap: "0.625rem", padding: "1rem 2rem", background: "#fff", border: "none", cursor: "pointer", fontFamily: T.inter, fontWeight: 700, fontSize: "0.85rem", color: T.primary, letterSpacing: "0.06em", borderRadius: T.radius, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
            Launch Foreman Mode <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Safety notice */}
      <div style={{ background: T.dark ? `${T.tertiary}18` : `${T.tertiary}08`, padding: "1rem 2.5rem", display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
        <AlertTriangle size={14} color={T.tertiary} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontFamily: T.sans, fontSize: "0.78rem", color: T.on_surface_v, lineHeight: 1.7 }}>
          <strong style={{ fontWeight: 700, color: T.tertiary }}>Safety Notice:</strong> Always verify AI-generated repair guides against official OEM documentation. Never work on live electrical systems without proper lockout/tagout procedures.
        </p>
      </div>

      {/* Footer */}
      <footer style={{ background: T.surface_c, padding: "1.5rem 2.5rem" }}>
        <div className="lf-footer-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 24, height: 24, background: G, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.25rem" }}>
              <Activity size={12} color="#fff" />
            </div>
            <span style={{ fontFamily: T.inter, fontWeight: 700, fontSize: "0.825rem", color: T.on_surface_v }}>Listen & Fix</span>
          </div>
          <p style={{ fontFamily: T.inter, fontSize: "0.6875rem", color: T.on_surface_v }}>© 2025 Listen & Fix. All rights reserved.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy","Terms","Support"].map(l => (
              <a key={l} href="#" style={{ fontFamily: T.inter, fontSize: "0.6875rem", color: T.on_surface_v, textDecoration: "none", fontWeight: 500 }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
