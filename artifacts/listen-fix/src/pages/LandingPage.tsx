import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Mic, Cpu, Wrench, ShieldCheck, Database, Search, Zap, FileCheck, Star, Menu, X } from "lucide-react";
import OnboardingTour, { LANDING_TOUR_STEPS } from "../components/OnboardingTour";

// ── Design Tokens ──────────────────────────────────────────────────────────────
const C = {
  bg:      "#0e0e0e",
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
  outlineV:"#3b494b",
  error:   "#ffb4ab",
  errorC:  "#93000a",
  grotesk: "'Space Grotesk', sans-serif",
  mono:    "'JetBrains Mono', monospace",
  inter:   "'Inter', sans-serif",
};

const LOG_LINES = [
  "[08:42:11] SYSTEM_BOOT: LOADING NEURAL ENGINE CORES...",
  "[08:42:12] MULTIMODAL_SYNC: VISUAL HANDSHAKE [SUCCESS]",
  "[08:42:12] AUDIO_PIPE: SAMPLING STREAM... 44.1kHz DETECTED",
  "[08:42:13] RAG_QUERY: SEARCHING VECTOR DATABASE...",
  "[08:42:14] > ANOMALY DETECTED AT 4.2kHz FREQUENCY BAND",
  "[08:42:15] CROSS_REF: MAPPING TO KNOWN SCHEMATICS...",
  "[08:42:16] INFERENCE: RANK_1: BEARING_WEAR [CONFIDENCE: 94.2%]",
  "[08:42:16] GUIDE_SYNTHESIS: GENERATING REPAIR BLUEPRINT...",
  "[08:42:17] PARTS_HUB: SKU_MATCH COMPLETE [3 VENDORS FOUND]",
  "[08:42:17] DIAGNOSTIC_COMPLETE ✓ SAFETY_SCAN: PASSED",
];

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [lines, setLines] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < LOG_LINES.length) { setLines(l => [...l, LOG_LINES[i]]); i++; }
      else clearInterval(iv);
    }, 600);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.onSurf, fontFamily: C.inter, overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .blueprint-grid {
          background-image: radial-gradient(rgba(0,240,255,0.08) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .scanline-overlay {
          background: linear-gradient(to bottom, transparent 50%, rgba(0,240,255,0.025) 50%);
          background-size: 100% 4px;
          pointer-events: none;
        }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scan-down {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        .log-line { animation: fadeInUp .3s ease-out forwards; }
        .lf-nav-link { color: ${C.onSurfV}; text-decoration: none; font-family: ${C.grotesk}; font-size: .8rem; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; transition: color .15s; }
        .lf-nav-link:hover { color: ${C.cyan}; }
        .lf-btn-primary { display: inline-flex; align-items: center; gap: .5rem; padding: .875rem 1.75rem; background: ${C.cyan}; border: none; cursor: pointer; font-family: ${C.grotesk}; font-weight: 700; font-size: .75rem; letter-spacing: .15em; text-transform: uppercase; color: ${C.onCyan}; transition: box-shadow .2s; }
        .lf-btn-primary:hover { box-shadow: 0 0 30px rgba(0,240,255,0.4); }
        .lf-btn-ghost { display: inline-flex; align-items: center; gap: .5rem; padding: .875rem 1.75rem; background: transparent; border: 1px solid rgba(0,240,255,0.4); cursor: pointer; font-family: ${C.grotesk}; font-weight: 700; font-size: .75rem; letter-spacing: .15em; text-transform: uppercase; color: ${C.cyan}; transition: background .2s; }
        .lf-btn-ghost:hover { background: rgba(0,240,255,0.08); }
        .step-card { padding: 2.5rem; background: ${C.bgLow}; border: 1px solid rgba(0,240,255,0.08); transition: background .2s; }
        .step-card:hover { background: ${C.bgMid}; }
        .step-card:not(:last-child) { border-right: none; }
        .feat-card { padding: 1.75rem; background: ${C.bgHigh}; transition: background .2s; }
        .feat-card:hover { background: ${C.bgHst}; }
        .icon-box { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.2); color: ${C.cyan}; margin-bottom: 1.25rem; }
        .data-ribbon { height: 2px; background: linear-gradient(to right, ${C.cyan}, transparent); width: 100%; }
        @media(max-width:768px){
          .lf-nav-links{display:none!important;}
          .lf-ham{display:flex!important;}
          .lf-hero-grid{grid-template-columns:1fr!important;gap:2rem!important;}
          .lf-hero-h1{font-size:clamp(2.4rem,10vw,3.5rem)!important;}
          .lf-steps{grid-template-columns:1fr!important;border:1px solid rgba(0,240,255,0.08)!important;}
          .step-card{border-right:none!important;border-bottom:1px solid rgba(0,240,255,0.08)!important;}
          .step-card:last-child{border-bottom:none!important;}
          .lf-feat-grid{grid-template-columns:1fr!important;}
          .lf-test-grid{grid-template-columns:1fr!important;}
          .lf-price-grid{grid-template-columns:1fr!important;}
          .lf-hero-btns{flex-direction:column!important;}
          .lf-hero-btns button,.lf-hero-btns a{width:100%!important;justify-content:center!important;}
          .lf-section{padding:4rem 1.25rem!important;}
          .lf-footer-inner{flex-direction:column!important;gap:1rem!important;text-align:center!important;}
        }
      `}</style>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(14,14,14,0.97)", backdropFilter: "blur(20px)", zIndex: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3rem" }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: C.onSurfV, display: "flex" }}>
            <X size={28} />
          </button>
          {["How It Works", "Capabilities", "Pricing"].map(l => (
            <button key={l} onClick={() => setMenuOpen(false)} style={{ fontFamily: C.grotesk, fontWeight: 700, fontSize: "1.25rem", color: C.onSurf, background: "none", border: "none", cursor: "pointer", letterSpacing: ".1em", textTransform: "uppercase" }}>{l}</button>
          ))}
          <button onClick={() => { setMenuOpen(false); setLocation("/dashboard"); }} className="lf-btn-primary">
            LAUNCH DIAGNOSTICS
          </button>
        </div>
      )}

      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, width: "100%", height: 64, zIndex: 100, background: "rgba(14,14,14,0.85)", backdropFilter: "blur(16px)", borderBottom: "0.5px solid rgba(0,240,255,0.3)", boxShadow: "0 0 20px rgba(0,240,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem" }}>
        <div style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "1.25rem", color: C.cyan, letterSpacing: "-.02em", fontStyle: "italic" }}>LISTEN &amp; FIX</div>
        <nav className="lf-nav-links" style={{ display: "flex", alignItems: "center", gap: "2.5rem", height: "100%" }}>
          {["How It Works", "Capabilities", "Pricing"].map(l => (
            <a key={l} href="#" className="lf-nav-link">{l}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => setLocation("/dashboard")} className="lf-btn-primary" style={{ padding: ".5rem 1.25rem", fontSize: ".7rem" }}>
            LAUNCH APP
          </button>
          <button className="lf-ham" onClick={() => setMenuOpen(true)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.onSurf }}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="blueprint-grid" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.outlineV}` }}>
        <div className="scanline-overlay" style={{ position: "absolute", inset: 0, zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(14,14,14,0.6) 0%, transparent 40%, rgba(14,14,14,0.8) 100%)", zIndex: 1, pointerEvents: "none" }} />
        <div className="lf-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center", maxWidth: 1200, margin: "0 auto", padding: "7rem 2rem 5rem", position: "relative", zIndex: 2, width: "100%" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: ".625rem", padding: ".35rem .875rem", background: "rgba(0,240,255,0.08)", border: "1px solid rgba(0,240,255,0.25)", marginBottom: "2rem" }}>
              <div style={{ width: 6, height: 6, background: C.cyan, animation: "pulse-dot 2s ease-in-out infinite" }} />
              <span style={{ fontFamily: C.mono, fontSize: ".65rem", color: C.cyan, letterSpacing: ".12em", textTransform: "uppercase" }}>SYSTEM_STATUS: OPERATIONAL // v4.0.2</span>
            </div>
            <h1 className="lf-hero-h1" style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "clamp(2.8rem,5.5vw,5rem)", lineHeight: .95, letterSpacing: "-.03em", textTransform: "uppercase", color: C.onSurf, marginBottom: "1.75rem" }}>
              MASTER YOUR<br />
              <span style={{ color: C.cyan }}>MECHANICAL</span><br />
              WORLD
            </h1>
            <p style={{ fontFamily: C.inter, fontWeight: 400, fontSize: "1rem", color: C.onSurfV, lineHeight: 1.8, maxWidth: 440, marginBottom: "2.5rem" }}>
              Deploy advanced multimodal AI to diagnose, analyze, and repair complex equipment. From HVAC harmonics to automotive telemetry — hear the fault, fix the machine.
            </p>
            <div className="lf-hero-btns" style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
              <button onClick={() => setLocation("/dashboard")} className="lf-btn-primary">
                START FREE DIAGNOSIS
              </button>
              <button className="lf-btn-ghost">
                VIEW DOCUMENTATION
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", paddingTop: "1.5rem", borderTop: `1px solid ${C.outlineV}` }}>
              {[["94.2%", "SUCCESS RATE"], ["~60s", "AVG LATENCY"], ["50K+", "OEM MANUALS"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "1.5rem", color: C.cyan, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontFamily: C.grotesk, fontSize: ".6rem", color: C.onSurfV, letterSpacing: ".12em", textTransform: "uppercase", marginTop: ".375rem" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Stream Panel */}
          <div style={{ position: "relative" }}>
            <div style={{ background: "rgba(42,42,42,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(0,240,255,0.2)", boxShadow: "0 0 40px rgba(0,240,255,0.08)", position: "relative", overflow: "hidden" }}>
              <div className="data-ribbon" />
              {/* HUD corners */}
              <div style={{ position: "absolute", top: 8, left: 8, width: 16, height: 16, borderTop: "2px solid rgba(0,240,255,0.5)", borderLeft: "2px solid rgba(0,240,255,0.5)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 8, right: 8, width: 16, height: 16, borderTop: "2px solid rgba(0,240,255,0.5)", borderRight: "2px solid rgba(0,240,255,0.5)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: 8, left: 8, width: 16, height: 16, borderBottom: "2px solid rgba(0,240,255,0.5)", borderLeft: "2px solid rgba(0,240,255,0.5)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: 8, right: 8, width: 16, height: 16, borderBottom: "2px solid rgba(0,240,255,0.5)", borderRight: "2px solid rgba(0,240,255,0.5)", pointerEvents: "none" }} />
              <div style={{ padding: "1rem 1.25rem .625rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.outlineV}` }}>
                <span style={{ fontFamily: C.grotesk, fontWeight: 700, fontSize: ".65rem", color: C.cyan, letterSpacing: ".15em", textTransform: "uppercase" }}>DIAGNOSTIC_STREAM v2.4</span>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <div style={{ width: 7, height: 7, background: C.cyan, animation: "pulse-dot 1.5s ease-in-out infinite" }} />
                  <span style={{ fontFamily: C.mono, fontSize: ".6rem", color: C.cyan }}>LIVE_FEED</span>
                </div>
              </div>
              <div style={{ padding: "1.125rem 1.25rem 1.375rem", minHeight: 320, fontFamily: C.mono, fontSize: ".7rem", lineHeight: 2.1, overflowY: "auto" }}>
                {lines.filter((l): l is string => typeof l === "string").map((line, i) => (
                  <div key={i} className="log-line" style={{ color: line.includes("ANOMALY") || line.includes("RANK_1") ? C.cyan : line.includes("✓") || line.includes("PASSED") ? "#4ade80" : line.includes("ERROR") ? "#ffb4ab" : C.outlineV }}>
                    <span style={{ color: C.cyan, opacity: .6, marginRight: ".5rem" }}>{line.match(/\[\d+:\d+:\d+\]/)?.[0]}</span>
                    {line.replace(/\[\d+:\d+:\d+\] /, "")}
                  </div>
                ))}
                {lines.length < LOG_LINES.length && (
                  <span style={{ display: "inline-block", width: 7, height: 13, background: C.cyan, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
                )}
              </div>
              <div style={{ padding: ".75rem 1.25rem", background: C.bgLow, display: "flex", justifyContent: "space-between", borderTop: `1px solid ${C.outlineV}` }}>
                <span style={{ fontFamily: C.mono, fontSize: ".6rem", color: C.outlineV }}>LATENCY: 12ms // THREADS: ACTIVE [16]</span>
                <span style={{ fontFamily: C.mono, fontSize: ".6rem", color: C.cyan }}>74% COMPLETE</span>
              </div>
            </div>
            <div style={{ position: "absolute", inset: 0, transform: "translate(12px, 12px)", border: "1px solid rgba(0,240,255,0.08)", zIndex: -1 }} />
          </div>
        </div>
      </section>

      {/* Status Bar */}
      <div style={{ background: C.bgLow, padding: "1rem 2rem", borderBottom: `1px solid ${C.outlineV}`, overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "3rem", flexWrap: "wrap", maxWidth: 1200, margin: "0 auto" }}>
          {[
            { label: "TRUSTED BY", value: "12,000+ ENGINEERS" },
            { label: "KNOWLEDGE BASE", value: "50K+ OEM MANUALS" },
            { label: "INCIDENT RATE", value: "0.0% LETHAL" },
            { label: "RESPONSE TIME", value: "<60 SECONDS" },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".25rem" }}>
              <span style={{ fontFamily: C.grotesk, fontSize: ".55rem", color: C.onSurfV, letterSpacing: ".12em", textTransform: "uppercase" }}>{label}</span>
              <span style={{ fontFamily: C.mono, fontSize: ".8rem", fontWeight: 700, color: C.onSurf }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* See It In Action */}
      <div style={{ background: C.bg, padding: "6rem 2rem", borderBottom: `1px solid ${C.outlineV}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <span style={{ fontFamily: C.mono, fontSize: ".65rem", color: C.cyan, letterSpacing: ".12em", textTransform: "uppercase", display: "block", marginBottom: ".75rem" }}>00 // LIVE_DEMO</span>
            <h2 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "clamp(1.8rem,4vw,2.75rem)", textTransform: "uppercase", letterSpacing: "-.02em", color: C.onSurf, lineHeight: 1 }}>See It<br /><span style={{ color: C.cyan }}>In Action.</span></h2>
            <div style={{ height: 2, width: 80, background: C.cyan, marginTop: "1.25rem" }} />
          </div>
          <div style={{ position: "relative", border: "1px solid rgba(0,240,255,0.2)", boxShadow: "0 0 40px rgba(0,240,255,0.06)" }}>
            <div style={{ height: 2, background: `linear-gradient(to right, ${C.cyan}, transparent)` }} />
            <div style={{ padding: ".75rem 1.25rem", background: C.bgLow, borderBottom: `1px solid ${C.outlineV}`, display: "flex", alignItems: "center", gap: ".75rem" }}>
              <div style={{ width: 7, height: 7, background: C.cyan, animation: "pulse-dot 1.5s ease-in-out infinite" }} />
              <span style={{ fontFamily: C.mono, fontSize: ".6rem", color: C.cyan, letterSpacing: ".12em", textTransform: "uppercase" }}>INTERACTIVE_DEMO // SCROLL TO ADVANCE</span>
            </div>
            <iframe
              src="https://html2-blush.vercel.app/listenandfix8.html"
              style={{ width: "100%", height: "85vh", border: "none", display: "block", background: C.bg }}
              allow="autoplay"
              title="Listen & Fix Interactive Demo"
            />
          </div>
        </div>
      </div>

      {/* Repair Protocol */}
      <section className="lf-section" style={{ padding: "6rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <span style={{ fontFamily: C.mono, fontSize: ".65rem", color: C.cyan, letterSpacing: ".12em", textTransform: "uppercase", display: "block", marginBottom: ".75rem" }}>01 // REPAIR_PROTOCOL</span>
          <h2 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "clamp(1.8rem,4vw,2.75rem)", textTransform: "uppercase", letterSpacing: "-.02em", color: C.onSurf, lineHeight: 1 }}>Three Steps.<br /><span style={{ color: C.cyan }}>Zero Guesswork.</span></h2>
          <div style={{ height: 2, width: 80, background: C.cyan, marginTop: "1.25rem" }} />
        </div>
        <div className="lf-steps" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: "1px solid rgba(0,240,255,0.12)" }}>
          {[
            { step: "01 // SIGNAL_INPUT", icon: <Mic size={36} />, title: "CAPTURE", body: "Record acoustic signatures or upload visual telemetry. Our sensors isolate mechanical noise from ambient interference with 99.8% precision." },
            { step: "02 // NEURAL_PROCESS", icon: <Cpu size={36} />, title: "ANALYZE", body: "Multimodal AI cross-references input against a 50,000-node failure database to pinpoint specific hardware anomalies in real-time." },
            { step: "03 // EXECUTION_PHASE", icon: <Wrench size={36} />, title: "REPAIR", body: "Receive interactive, step-by-step schematics and technical documentation tailored to your exact hardware configuration and fault code." },
          ].map(({ step, icon, title, body }, idx) => (
            <div key={step} className="step-card" style={{ borderRight: idx < 2 ? "1px solid rgba(0,240,255,0.08)" : "none" }}>
              <span style={{ fontFamily: C.mono, fontSize: ".65rem", color: C.cyan, display: "block", marginBottom: "1.5rem", letterSpacing: ".06em" }}>{step}</span>
              <div style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,240,255,0.06)", border: "1px solid rgba(0,240,255,0.2)", color: C.cyan, marginBottom: "1.5rem" }}>
                {icon}
              </div>
              <h3 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: "-.01em", color: C.onSurf, marginBottom: "1rem" }}>{title}</h3>
              <p style={{ fontFamily: C.inter, fontSize: ".875rem", color: C.onSurfV, lineHeight: 1.8 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <div style={{ background: C.bgLow, padding: "6rem 2rem", borderTop: `1px solid ${C.outlineV}`, borderBottom: `1px solid ${C.outlineV}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span style={{ fontFamily: C.mono, fontSize: ".65rem", color: C.cyan, letterSpacing: ".12em", textTransform: "uppercase", display: "block", marginBottom: ".75rem" }}>02 // CAPABILITIES</span>
              <h2 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "clamp(1.8rem,4vw,2.75rem)", textTransform: "uppercase", letterSpacing: "-.02em", color: C.onSurf, lineHeight: 1 }}>Enterprise-Grade.<br /><span style={{ color: C.cyan }}>Workshop-Ready.</span></h2>
              <div style={{ height: 2, width: 80, background: C.cyan, marginTop: "1.25rem" }} />
            </div>
            <span style={{ fontFamily: C.mono, fontSize: ".65rem", color: C.onSurfV, letterSpacing: ".06em", textTransform: "uppercase" }}>MULTI-DOMAIN DIAGNOSTIC COMPATIBILITY</span>
          </div>
          <div className="lf-feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2px" }}>
            {[
              { icon: <ShieldCheck size={22} />, title: "SAFETY CHECKSUM", body: "SHA-256 verified scan on every diagnosis. High-voltage hazards auto-flagged before any guide is unlocked." },
              { icon: <Database size={22} />, title: "RAG KNOWLEDGE BASE", body: "50,000+ indexed OEM manuals and service bulletins cross-referenced in real-time for maximum accuracy." },
              { icon: <Search size={22} />, title: "PARTS SOURCING HUB", body: "Instant local and online parts availability with confidence-scored SKU matching. Buy with one click." },
              { icon: <Wrench size={22} />, title: "STEP-BY-STEP GUIDES", body: "Foreman-vetted repair instructions with tool checklists, torque specs, and mandatory safety callouts." },
              { icon: <Zap size={22} />, title: "60-SECOND ANALYSIS", body: "Multimodal acoustic engine delivers actionable results in under 60 seconds. No waiting, no guessing." },
              { icon: <FileCheck size={22} />, title: "AUDIT TRAIL", body: "Every session is logged, timestamped, and exportable for compliance and warranty documentation." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="feat-card">
                <div className="icon-box">{icon}</div>
                <h4 style={{ fontFamily: C.grotesk, fontWeight: 700, fontSize: ".875rem", letterSpacing: ".08em", color: C.onSurf, marginBottom: ".625rem" }}>{title}</h4>
                <p style={{ fontFamily: C.inter, fontSize: ".825rem", color: C.onSurfV, lineHeight: 1.75 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <section className="lf-section" style={{ padding: "6rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
        <span style={{ fontFamily: C.mono, fontSize: ".65rem", color: C.cyan, letterSpacing: ".12em", textTransform: "uppercase", display: "block", marginBottom: ".75rem" }}>03 // FIELD_REPORTS</span>
        <h2 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "clamp(1.8rem,4vw,2.75rem)", textTransform: "uppercase", letterSpacing: "-.02em", color: C.onSurf, lineHeight: 1, marginBottom: ".75rem" }}>WHAT ENGINEERS<br /><span style={{ color: C.cyan }}>ARE SAYING</span></h2>
        <div style={{ height: 2, width: 80, background: C.cyan, marginBottom: "3rem" }} />
        <div className="lf-test-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2px" }}>
          {[
            { quote: "Saved me $1,200 on an HVAC compressor. The AI diagnosed a failing bearing from a 20-second recording. Ordered the part and fixed it myself.", name: "MARCUS T.", role: "FACILITIES MANAGER, DETROIT" },
            { quote: "The safety checkpoint is what made me trust it. It flagged a capacitor risk before I even touched the unit. That's the kind of AI I need on the floor.", name: "SARAH K.", role: "INDUSTRIAL TECHNICIAN, CHICAGO" },
            { quote: "The parts hub is incredible. Found the exact V-belt SKU locally, 0.9km away, with a 98% confidence match. Unreal precision.", name: "JAMES R.", role: "PLANT MAINTENANCE SUPERVISOR" },
          ].map(({ quote, name, role }) => (
            <div key={name} style={{ padding: "2rem", background: C.bgHigh, position: "relative", overflow: "hidden" }}>
              <div className="data-ribbon" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
              <div style={{ display: "flex", gap: "2px", marginBottom: "1.25rem" }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={11} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <p style={{ fontFamily: C.inter, fontSize: ".875rem", color: C.onSurf, lineHeight: 1.8, fontStyle: "italic", marginBottom: "1.5rem" }}>"{quote}"</p>
              <div>
                <p style={{ fontFamily: C.grotesk, fontWeight: 700, fontSize: ".75rem", color: C.cyan, letterSpacing: ".08em" }}>{name}</p>
                <p style={{ fontFamily: C.mono, fontSize: ".6rem", color: C.onSurfV, marginTop: ".25rem", letterSpacing: ".04em" }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <div style={{ background: C.bgLow, padding: "6rem 2rem", borderTop: `1px solid ${C.outlineV}`, borderBottom: `1px solid ${C.outlineV}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ fontFamily: C.mono, fontSize: ".65rem", color: C.cyan, letterSpacing: ".12em", textTransform: "uppercase", display: "block", marginBottom: ".75rem" }}>04 // PRICING_MODULE</span>
            <h2 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "clamp(1.8rem,4vw,2.75rem)", textTransform: "uppercase", letterSpacing: "-.02em", color: C.onSurf }}>SIMPLE.<br /><span style={{ color: C.cyan }}>TRANSPARENT.</span></h2>
            <div style={{ height: 2, width: 80, background: C.cyan, margin: "1.25rem auto 0" }} />
          </div>
          <div className="lf-price-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2px" }}>
            {[
              { name: "STARTER", price: "FREE", period: "No credit card needed", features: ["5 diagnoses/month", "Basic safety scan", "Parts availability lookup"], featured: false },
              { name: "FOREMAN", price: "$29", period: "per month", features: ["Unlimited diagnoses", "Full RAG knowledge base", "Parts sourcing hub", "Priority AI processing", "Audit trail export"], featured: true },
              { name: "ENTERPRISE", price: "CUSTOM", period: "contact our team", features: ["Unlimited seats", "Full API access", "Custom knowledge base", "LOTO compliance module", "Dedicated support"], featured: false },
            ].map(({ name, price, period, features, featured }) => (
              <div key={name} style={{ padding: "2.5rem", background: featured ? C.bgMid : C.bgHigh, border: featured ? `2px solid ${C.cyan}` : "none", position: "relative", boxShadow: featured ? "0 0 40px rgba(0,240,255,0.12)" : "none" }}>
                {featured && <div className="data-ribbon" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />}
                {featured && (
                  <div style={{ position: "absolute", top: -1, right: 24, background: C.cyan, padding: ".2rem .75rem" }}>
                    <span style={{ fontFamily: C.mono, fontSize: ".55rem", color: C.onCyan, fontWeight: 700, letterSpacing: ".12em" }}>MOST POPULAR</span>
                  </div>
                )}
                <p style={{ fontFamily: C.grotesk, fontWeight: 700, fontSize: ".7rem", color: featured ? C.cyan : C.onSurfV, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: ".75rem" }}>{name}</p>
                <p style={{ fontFamily: C.mono, fontWeight: 700, fontSize: "2.75rem", color: featured ? C.cyan : C.onSurf, lineHeight: 1, letterSpacing: "-.02em" }}>{price}</p>
                <p style={{ fontFamily: C.inter, fontSize: ".8rem", color: C.onSurfV, marginBottom: "2rem", marginTop: ".375rem" }}>{period}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: ".625rem", marginBottom: "2rem" }}>
                  {features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
                      <div style={{ width: 5, height: 5, background: featured ? C.cyan : C.outline, flexShrink: 0 }} />
                      <span style={{ fontFamily: C.inter, fontSize: ".8125rem", color: C.onSurfV }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setLocation("/dashboard")} style={{ width: "100%", padding: ".875rem", background: featured ? C.cyan : "transparent", border: featured ? "none" : `1px solid rgba(0,240,255,0.3)`, cursor: "pointer", fontFamily: C.grotesk, fontWeight: 700, fontSize: ".7rem", color: featured ? C.onCyan : C.cyan, letterSpacing: ".12em", textTransform: "uppercase" }}>
                  {name === "ENTERPRISE" ? "CONTACT US" : "GET STARTED"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section style={{ padding: "6rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }} className="blueprint-grid">
        <div className="scanline-overlay" style={{ position: "absolute", inset: 0, zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <span style={{ fontFamily: C.mono, fontSize: ".65rem", color: C.cyan, letterSpacing: ".12em", textTransform: "uppercase", display: "block", marginBottom: "1.5rem" }}>// SYSTEM_READY</span>
          <h2 style={{ fontFamily: C.grotesk, fontWeight: 900, fontSize: "clamp(2rem,5vw,3.5rem)", textTransform: "uppercase", letterSpacing: "-.02em", color: C.onSurf, lineHeight: .95, marginBottom: "2rem" }}>DEPLOY YOUR FIRST<br /><span style={{ color: C.cyan }}>DIAGNOSTIC SCAN</span></h2>
          <p style={{ fontFamily: C.inter, fontSize: "1rem", color: C.onSurfV, lineHeight: 1.8, marginBottom: "2.5rem" }}>Upload a 20-second audio clip of any fault sound and get a complete repair guide in under 60 seconds. Zero registration required.</p>
          <button onClick={() => setLocation("/dashboard")} className="lf-btn-primary" style={{ fontSize: ".8rem", padding: "1rem 2.5rem", letterSpacing: ".2em" }}>
            INITIATE SCAN
          </button>
        </div>
      </section>

      <OnboardingTour storageKey="lf_tour_landing" steps={LANDING_TOUR_STEPS} />

      {/* Footer */}
      <footer style={{ background: C.bg, borderTop: `1px solid ${C.outlineV}`, padding: "1.5rem 2rem" }}>
        <div className="lf-footer-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: C.mono, fontSize: ".6rem", color: C.outlineV, textTransform: "uppercase", letterSpacing: ".06em" }}>© 2024 CYBER-IND DIAGNOSTICS UNIT</span>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["SAFETY_PROTOCOL", "TECH_DOCS", "API_V2", "LOG_AUDIT"].map(l => (
              <a key={l} href="#" style={{ fontFamily: C.mono, fontSize: ".6rem", color: C.outlineV, textDecoration: "none", letterSpacing: ".04em", transition: "color .15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.cyan)}
                onMouseLeave={e => (e.currentTarget.style.color = C.outlineV)}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <div style={{ width: 6, height: 6, background: "#4ade80", animation: "pulse-dot 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: C.mono, fontSize: ".6rem", color: C.cyan, letterSpacing: ".08em" }}>SYSTEM_ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
