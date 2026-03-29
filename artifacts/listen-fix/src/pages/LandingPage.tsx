import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Activity, ShieldCheck, Wrench, Upload, CheckCircle2, Cpu,
  Database, Search, Star, ChevronRight, FileCheck, Zap,
  AlertTriangle, Menu, X,
} from "lucide-react";

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

const C = {
  bg: "#131313", s1: "#1c1b1b", s2: "#2a2a2a", s3: "#353534",
  txt: "#e5e2e1", sub: "#9b9896", orange: "#ff5f00", light: "#ffb599",
  font: "'Space Grotesk', sans-serif", mono: "'Space Mono', monospace",
};
const grad = `linear-gradient(135deg, ${C.orange}, ${C.light})`;

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [lines, setLines] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < STREAM_LINES.length) { setLines(l => [...l, STREAM_LINES[i]]); i++; }
      else clearInterval(iv);
    }, 750);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="lf-root">
      <style>{`
        .lf-root { background: ${C.bg}; min-height: 100vh; font-family: ${C.font}; color: ${C.txt}; overflow-x: hidden; }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Nav */
        .lf-nav { height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; background: ${C.s1}; border-bottom: 1px solid ${C.s2}; position: sticky; top: 0; z-index: 100; }
        .lf-nav-links { display: flex; align-items: center; gap: 20px; }
        .lf-nav-link { font-family: ${C.font}; font-size: 0.78rem; color: ${C.sub}; text-decoration: none; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
        .lf-nav-cta { padding: 9px 20px; background: ${grad}; border: none; cursor: pointer; font-family: ${C.font}; font-weight: 800; font-size: 0.72rem; color: #131313; letter-spacing: 0.08em; }
        .lf-hamburger { display: none; background: none; border: none; cursor: pointer; color: ${C.txt}; padding: 4px; }
        .lf-mobile-menu { display: none; position: fixed; inset: 0; background: ${C.s1}; z-index: 200; flex-direction: column; align-items: center; justify-content: center; gap: 32px; }
        .lf-mobile-menu.open { display: flex; }

        /* Hero */
        .lf-hero { padding: 80px 40px 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; max-width: 1200px; margin: 0 auto; }
        .lf-hero-badge { display: inline-flex; align-items: center; gap: 6px; background: ${C.orange}18; padding: 4px 12px; margin-bottom: 24px; }
        .lf-hero-h1 { font-weight: 900; font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1.0; text-transform: uppercase; letter-spacing: -0.03em; margin-bottom: 24px; }
        .lf-hero-sub { font-size: 1rem; color: ${C.sub}; line-height: 1.8; max-width: 440px; margin-bottom: 36px; }
        .lf-hero-btns { display: flex; gap: 10px; margin-bottom: 32px; flex-wrap: wrap; }
        .lf-btn-primary { display: flex; align-items: center; gap: 10px; padding: 16px 28px; background: ${grad}; border: none; cursor: pointer; font-family: ${C.font}; font-weight: 800; font-size: 0.8rem; color: #131313; letter-spacing: 0.08em; white-space: nowrap; }
        .lf-btn-secondary { padding: 16px 24px; background: none; border: 1px solid ${C.s3}; cursor: pointer; font-family: ${C.font}; font-weight: 700; font-size: 0.78rem; color: ${C.sub}; letter-spacing: 0.06em; white-space: nowrap; }
        .lf-terminal { background: ${C.s1}; border: 1px solid ${C.s2}; }
        .lf-terminal-bar { background: ${C.s2}; padding: 10px 14px; border-bottom: 1px solid ${C.s2}; display: flex; align-items: center; gap: 8px; }
        .lf-terminal-body { padding: 20px; min-height: 280px; font-family: ${C.mono}; font-size: 0.75rem; line-height: 2; }

        /* Trust */
        .lf-trust { background: ${C.s1}; border-top: 1px solid ${C.s2}; border-bottom: 1px solid ${C.s2}; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }

        /* Sections */
        .lf-section { padding: 80px 40px; max-width: 1200px; margin: 0 auto; }
        .lf-section-dark { background: ${C.s1}; padding: 80px 40px; }
        .lf-section-dark-inner { max-width: 1200px; margin: 0 auto; }
        .lf-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .lf-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .lf-grid-3-pricing { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }

        /* Cards */
        .lf-how-card { background: ${C.bg}; padding: 32px 28px; position: relative; overflow: hidden; }
        .lf-feature-card { background: ${C.bg}; padding: 24px 24px; }
        .lf-testimonial-card { background: ${C.s2}; padding: 28px 24px; border-left: 3px solid ${C.s3}; }
        .lf-pricing-card { background: ${C.bg}; padding: 32px 28px; border: 1px solid ${C.s2}; position: relative; }
        .lf-pricing-card.featured { border: 2px solid ${C.orange}; }

        /* CTA */
        .lf-cta { padding: 100px 40px; text-align: center; position: relative; overflow: hidden; }
        .lf-cta-h { font-weight: 900; font-size: clamp(2rem, 5vw, 3.5rem); text-transform: uppercase; letter-spacing: -0.03em; line-height: 1.0; margin-bottom: 24px; }
        .lf-cta-sub { color: ${C.sub}; font-size: 0.95rem; max-width: 500px; margin: 0 auto 40px; line-height: 1.8; }

        /* Footer */
        .lf-footer { background: ${C.s1}; border-top: 1px solid ${C.s2}; padding: 24px 40px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }

        /* Label */
        .lf-label { font-family: ${C.font}; font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; color: ${C.sub}; font-weight: 600; }

        /* Animations */
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        /* ── MOBILE ─────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .lf-nav { padding: 0 20px; }
          .lf-nav-links { display: none; }
          .lf-hamburger { display: flex; }

          .lf-hero { grid-template-columns: 1fr; gap: 32px; padding: 48px 20px 40px; }
          .lf-hero-h1 { font-size: clamp(2rem, 10vw, 3rem); }
          .lf-hero-sub { font-size: 0.9rem; }
          .lf-hero-btns { flex-direction: column; }
          .lf-btn-primary, .lf-btn-secondary { width: 100%; justify-content: center; }
          .lf-terminal-body { min-height: 200px; font-size: 0.68rem; }

          .lf-trust { padding: 16px 20px; flex-direction: column; text-align: center; }

          .lf-section { padding: 48px 20px; }
          .lf-section-dark { padding: 48px 20px; }
          .lf-grid-3 { grid-template-columns: 1fr; gap: 2px; }
          .lf-grid-2 { grid-template-columns: 1fr; }
          .lf-grid-3-pricing { grid-template-columns: 1fr; }

          .lf-cta { padding: 60px 20px; }
          .lf-footer { flex-direction: column; text-align: center; padding: 24px 20px; }
        }

        @media (max-width: 480px) {
          .lf-hero-h1 { font-size: 2rem; }
          .lf-terminal-body { min-height: 160px; }
        }
      `}</style>

      {/* Mobile menu */}
      <div className={`lf-mobile-menu ${menuOpen ? "open" : ""}`}>
        <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: C.txt }}>
          <X size={28} />
        </button>
        {["HOW IT WORKS", "SAFETY", "PRICING"].map(l => (
          <a key={l} href="#" onClick={() => setMenuOpen(false)} style={{ fontFamily: C.font, fontWeight: 800, fontSize: "1.4rem", color: C.txt, textDecoration: "none", letterSpacing: "0.08em" }}>{l}</a>
        ))}
        <button onClick={() => { setMenuOpen(false); setLocation("/dashboard"); }} style={{ padding: "16px 36px", background: grad, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 900, fontSize: "0.85rem", color: "#131313", letterSpacing: "0.1em" }}>
          LAUNCH APP →
        </button>
      </div>

      {/* Nav */}
      <nav className="lf-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Activity size={14} color="#131313" />
          </div>
          <span style={{ fontFamily: C.font, fontWeight: 900, fontSize: "0.95rem", letterSpacing: "0.06em", color: C.txt }}>LISTEN & FIX</span>
        </div>
        <div className="lf-nav-links">
          {["How It Works", "Safety", "Pricing"].map(l => (
            <a key={l} href="#" className="lf-nav-link">{l}</a>
          ))}
          <button onClick={() => setLocation("/dashboard")} className="lf-nav-cta">LAUNCH APP →</button>
        </div>
        <button className="lf-hamburger" onClick={() => setMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </nav>

      {/* Hero */}
      <section className="lf-hero">
        <div>
          <div className="lf-hero-badge">
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.orange, boxShadow: `0 0 8px ${C.orange}`, animation: "pulse 2s ease-in-out infinite" }} />
            <span className="lf-label" style={{ color: C.light }}>v2.0 Early Access Live</span>
          </div>
          <h1 className="lf-hero-h1">
            YOUR APPLIANCE<br />
            <span style={{ color: C.orange }}>SPEAKS.</span><br />
            WE TRANSLATE.
          </h1>
          <p className="lf-hero-sub">
            Upload a video or audio clip. Get a safety-verified repair guide in under 120 seconds. AI-powered diagnostics built for zero liability.
          </p>
          <div className="lf-hero-btns">
            <button onClick={() => setLocation("/dashboard")} className="lf-btn-primary">
              START FREE DIAGNOSIS <ChevronRight size={16} />
            </button>
            <button className="lf-btn-secondary">SEE HOW IT WORKS</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Cpu size={14} color={C.orange} />
            <span className="lf-label">Powered by Gemini 2.0 Flash</span>
          </div>
        </div>

        {/* Terminal */}
        <div className="lf-terminal">
          <div className="lf-terminal-bar">
            <div style={{ display: "flex", gap: 5 }}>
              {["#ef4444", "#f59e0b", "#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
            </div>
            <span style={{ fontFamily: C.mono, fontSize: "0.65rem", color: C.sub, marginLeft: 8 }}>observation-stream.sh</span>
          </div>
          <div className="lf-terminal-body">
            {lines.filter(Boolean).map((line, i) => (
              <div key={i} style={{ color: line.includes("⚠") ? "#f59e0b" : line.includes("PASSED") ? "#4ade80" : C.light, animation: "fadeIn 0.3s ease-out forwards" }}>
                {line}
              </div>
            ))}
            {lines.length < STREAM_LINES.length && (
              <span style={{ display: "inline-block", width: 6, height: 14, background: C.orange, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
            )}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="lf-trust">
        <span className="lf-label">Trusted by 12,000+ engineers & homeowners</span>
        <div style={{ display: "flex", gap: 24, opacity: 0.35, flexWrap: "wrap", justifyContent: "center" }}>
          {["iFixit", "NHTSA", "RepairClinic", "OEM Manuals"].map(b => (
            <span key={b} style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.9rem", color: C.txt, letterSpacing: "0.04em" }}>{b}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontFamily: C.font, fontWeight: 800, color: C.txt }}>4.9</span>
            <span className="lf-label">Rating</span>
          </div>
          <div style={{ width: 1, height: 20, background: C.s3 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <ShieldCheck size={14} color="#4ade80" />
            <span style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.72rem", color: "#4ade80" }}>Zero Lethal Incidents</span>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="lf-section">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: C.font, fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 2rem)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 12 }}>Diagnosis in Three Steps</h2>
          <p style={{ color: C.sub, fontSize: "0.9rem" }}>No manuals to dig through. No guesswork. Just point, shoot, and fix.</p>
        </div>
        <div className="lf-grid-3">
          {[
            { icon: <Upload size={26} color={C.orange} />, step: "01", title: "Upload Media", body: "Drag and drop a short video or audio clip of the sound or symptom. We handle any format." },
            { icon: <Cpu size={26} color={C.orange} />, step: "02", title: "AI Analyzes", body: "Our multimodal engine cross-references the signature against 50,000+ indexed repair manuals." },
            { icon: <CheckCircle2 size={26} color={C.orange} />, step: "03", title: "Fix It Safely", body: "Receive a step-by-step repair guide with parts sourcing, safety checks, and expert callouts." },
          ].map(({ icon, step, title, body }, idx) => (
            <div key={step} className="lf-how-card">
              <div style={{ position: "absolute", top: 12, right: 16, fontFamily: C.font, fontWeight: 900, fontSize: "5rem", color: `${C.txt}05`, lineHeight: 1, userSelect: "none" }}>{step}</div>
              {idx > 0 && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2, height: 40, background: C.s3 }} />}
              <div style={{ width: 48, height: 48, background: C.s2, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>{icon}</div>
              <h3 style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontFamily: C.font, fontSize: "0.8rem", color: C.sub, lineHeight: 1.8 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <div className="lf-section-dark">
        <div className="lf-section-dark-inner">
          <div style={{ borderLeft: `4px solid ${C.orange}`, paddingLeft: 20, marginBottom: 48 }}>
            <h2 style={{ fontFamily: C.font, fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 2rem)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 8 }}>Enterprise-Grade Capabilities</h2>
            <p style={{ color: C.sub, fontSize: "0.85rem" }}>Built for demanding industrial environments and safety-first compliance.</p>
          </div>
          <div className="lf-grid-3">
            {[
              { icon: <ShieldCheck size={20} color={C.orange} />, title: "Safety Checksum", body: "SHA-256 verified safety scan on every diagnosis. High-voltage hazards auto-flagged before any guide is unlocked." },
              { icon: <Database size={20} color={C.orange} />, title: "RAG Knowledge Base", body: "50,000+ indexed OEM manuals and service bulletins cross-referenced in real-time for accuracy." },
              { icon: <Search size={20} color={C.orange} />, title: "Parts Sourcing", body: "Instant local and online parts availability with confidence-scored SKU matching. Buy with one click." },
              { icon: <Wrench size={20} color={C.orange} />, title: "Step-by-Step Guides", body: "Foreman-vetted repair instructions with tool checklists, torque specs, and sub-step callouts." },
              { icon: <Zap size={20} color={C.orange} />, title: "60-Second Analysis", body: "Multimodal FFT acoustic engine delivers actionable results in under a minute." },
              { icon: <FileCheck size={20} color={C.orange} />, title: "Audit Trail", body: "Every session is logged, timestamped, and exportable for compliance and warranty records." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="lf-feature-card">
                <div style={{ marginBottom: 14 }}>{icon}</div>
                <h4 style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>{title}</h4>
                <p style={{ fontFamily: C.font, fontSize: "0.75rem", color: C.sub, lineHeight: 1.8 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <section className="lf-section">
        <h2 style={{ fontFamily: C.font, fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 2rem)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 40, textAlign: "center" }}>In The Field</h2>
        <div className="lf-grid-3">
          {[
            { quote: "Saved me $1,200 on an HVAC compressor. The AI diagnosed a failing bearing from a 20-second recording. Ordered the part and fixed it myself.", name: "Marcus T.", role: "Facilities Manager, Detroit" },
            { quote: "The safety checkpoint is what made me trust it. It flagged a capacitor risk before I even touched the unit. That's the kind of AI I need.", name: "Sarah K.", role: "Industrial Technician, Chicago" },
            { quote: "The parts hub is insane. Found the exact V-belt SKU locally, 0.9km away, with a 98% confidence match.", name: "James R.", role: "Plant Maintenance Supervisor" },
          ].map(({ quote, name, role }) => (
            <div key={name} className="lf-testimonial-card">
              <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontFamily: C.font, fontSize: "0.82rem", color: C.txt, lineHeight: 1.8, fontStyle: "italic", marginBottom: 20 }}>"{quote}"</p>
              <div>
                <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.78rem", color: C.txt }}>{name}</p>
                <p className="lf-label" style={{ marginTop: 4 }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <div className="lf-section-dark">
        <div className="lf-section-dark-inner">
          <h2 style={{ fontFamily: C.font, fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 2rem)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 48, textAlign: "center" }}>Simple Pricing</h2>
          <div className="lf-grid-3-pricing">
            {[
              { name: "Starter", price: "FREE", period: "No credit card", features: ["5 diagnoses/month", "Basic safety scan", "Parts availability"], highlight: false },
              { name: "Foreman", price: "$29", period: "per month", features: ["Unlimited diagnoses", "Full RAG knowledge base", "Parts sourcing hub", "Priority AI processing", "Audit trail export"], highlight: true },
              { name: "Enterprise", price: "Custom", period: "contact us", features: ["Unlimited seats", "API access", "Custom knowledge base", "LOTO compliance module", "Dedicated support"], highlight: false },
            ].map(({ name, price, period, features, highlight }) => (
              <div key={name} className={`lf-pricing-card ${highlight ? "featured" : ""}`}>
                {highlight && (
                  <div style={{ position: "absolute", top: -1, left: 20, background: C.orange, padding: "3px 12px" }}>
                    <span style={{ fontFamily: C.mono, fontSize: "0.55rem", color: "#131313", fontWeight: 700 }}>MOST POPULAR</span>
                  </div>
                )}
                <p className="lf-label" style={{ color: C.light, marginBottom: 8 }}>{name.toUpperCase()}</p>
                <p style={{ fontFamily: C.font, fontWeight: 900, fontSize: "2.4rem", color: C.txt, letterSpacing: "-0.03em" }}>{price}</p>
                <p className="lf-label" style={{ marginBottom: 24 }}>{period}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <CheckCircle2 size={13} color={C.orange} />
                      <span style={{ fontFamily: C.font, fontSize: "0.78rem", color: C.txt }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", padding: "13px", background: highlight ? grad : C.s3, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.72rem", color: highlight ? "#131313" : C.sub, letterSpacing: "0.08em" }}>
                  {name === "Enterprise" ? "CONTACT SALES" : "GET STARTED"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="lf-cta">
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${C.orange}14, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <h2 className="lf-cta-h">
            STOP PAYING<br /><span style={{ color: C.orange }}>FOR WHAT</span><br />YOU CAN FIX.
          </h2>
          <p className="lf-cta-sub">
            Join 12,000+ engineers and homeowners diagnosing and fixing their appliances with precision. Start for free.
          </p>
          <button onClick={() => setLocation("/dashboard")} className="lf-btn-primary" style={{ margin: "0 auto", display: "inline-flex" }}>
            LAUNCH FOREMAN MODE <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Safety note */}
      <div style={{ background: `${C.orange}10`, borderTop: `1px solid ${C.orange}30`, padding: "16px 40px", display: "flex", alignItems: "center", gap: 12 }}>
        <AlertTriangle size={14} color={C.orange} />
        <p style={{ fontFamily: C.font, fontSize: "0.72rem", color: C.sub, lineHeight: 1.6 }}>
          <strong style={{ color: C.light }}>Safety Notice:</strong> Always verify AI-generated repair guides against official OEM documentation. Never work on live electrical systems without proper lockout/tagout procedures.
        </p>
      </div>

      {/* Footer */}
      <footer className="lf-footer">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, background: grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={11} color="#131313" />
          </div>
          <span style={{ fontFamily: C.font, fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.06em", color: C.sub }}>LISTEN & FIX</span>
        </div>
        <p className="lf-label">© 2025 Listen & Fix. All rights reserved.</p>
        <div style={{ display: "flex", gap: 16 }}>
          {["Privacy", "Terms", "Support"].map(l => (
            <a key={l} href="#" className="lf-label" style={{ color: C.sub, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
