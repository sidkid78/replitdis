import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Activity, ShieldCheck, Wrench, Upload, CheckCircle2, Cpu,
  Database, AlertOctagon, Search, BookOpen, Star, ChevronRight,
  FileCheck, Zap,
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
const LABEL: React.CSSProperties = { fontFamily: C.font, fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.sub, fontWeight: 600 };

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < STREAM_LINES.length) { setLines(l => [...l, STREAM_LINES[i]]); i++; }
      else clearInterval(iv);
    }, 750);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: C.font, color: C.txt, overflowX: "hidden" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", background: C.s1, borderBottom: `1px solid ${C.s2}`, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={14} color="#131313" />
          </div>
          <span style={{ fontWeight: 900, fontSize: "0.95rem", letterSpacing: "0.06em", color: C.txt }}>LISTEN & FIX</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {["How It Works", "Safety", "Pricing"].map(l => (
            <a key={l} href="#" style={{ fontFamily: C.font, fontSize: "0.78rem", color: C.sub, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{l}</a>
          ))}
          <button onClick={() => setLocation("/dashboard")} style={{ padding: "9px 20px", background: grad, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.72rem", color: "#131313", letterSpacing: "0.08em" }}>
            LAUNCH APP →
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ padding: "100px 40px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${C.orange}18`, padding: "4px 12px", marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.orange, boxShadow: `0 0 8px ${C.orange}` }} />
            <span style={{ ...LABEL, color: C.light }}>v2.0 Early Access Live</span>
          </div>
          <h1 style={{ fontFamily: C.font, fontWeight: 900, fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.0, textTransform: "uppercase", letterSpacing: "-0.03em", marginBottom: 24 }}>
            YOUR APPLIANCE<br />
            <span style={{ color: C.orange }}>SPEAKS.</span><br />
            WE TRANSLATE.
          </h1>
          <p style={{ fontFamily: C.font, fontSize: "1rem", color: C.sub, lineHeight: 1.8, maxWidth: 440, marginBottom: 36 }}>
            Upload a video or audio clip. Get a safety-verified repair guide in under 120 seconds. AI-powered diagnostics built for zero liability.
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
            <button onClick={() => setLocation("/dashboard")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 28px", background: grad, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 800, fontSize: "0.8rem", color: "#131313", letterSpacing: "0.08em" }}>
              START FREE DIAGNOSIS <ChevronRight size={16} />
            </button>
            <button style={{ padding: "16px 24px", background: "none", border: `1px solid ${C.s3}`, cursor: "pointer", fontFamily: C.font, fontWeight: 700, fontSize: "0.78rem", color: C.sub, letterSpacing: "0.06em" }}>
              SEE HOW IT WORKS
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Cpu size={14} color={C.orange} />
            <span style={{ ...LABEL, color: C.sub }}>Powered by Gemini 2.0 Flash</span>
          </div>
        </div>

        {/* Terminal */}
        <div style={{ background: C.s0, border: `1px solid ${C.s2}`, position: "relative" } as React.CSSProperties}>
          <div style={{ background: `${C.s1}`, padding: "10px 14px", borderBottom: `1px solid ${C.s2}`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 5 }}>
              {["#ef4444", "#f59e0b", "#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
            </div>
            <span style={{ fontFamily: C.mono, fontSize: "0.65rem", color: C.sub, marginLeft: 8 }}>observation-stream.sh</span>
          </div>
          <div style={{ padding: "20px", minHeight: 320, fontFamily: C.mono, fontSize: "0.75rem", lineHeight: 2 }}>
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

      {/* ── TRUST BAR ─────────────────────────────────────────── */}
      <div style={{ background: C.s1, borderTop: `1px solid ${C.s2}`, borderBottom: `1px solid ${C.s2}`, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "100%" }}>
        <span style={{ ...LABEL }}>Trusted by 12,000+ engineers & homeowners</span>
        <div style={{ display: "flex", gap: 32, opacity: 0.4 }}>
          {["iFixit", "NHTSA", "RepairClinic", "OEM Manuals"].map(b => (
            <span key={b} style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.9rem", color: C.txt, letterSpacing: "0.04em" }}>{b}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontFamily: C.font, fontWeight: 800, color: C.txt }}>4.9</span>
            <span style={{ ...LABEL }}>Rating</span>
          </div>
          <div style={{ width: 1, height: 20, background: C.s3 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <ShieldCheck size={14} color="#4ade80" />
            <span style={{ fontFamily: C.font, fontWeight: 700, fontSize: "0.72rem", color: "#4ade80" }}>Zero Lethal Incidents</span>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontFamily: C.font, fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 12 }}>Diagnosis in Three Steps</h2>
          <p style={{ color: C.sub, fontSize: "0.9rem" }}>No manuals to dig through. No guesswork. Just point, shoot, and fix.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {[
            { icon: <Upload size={28} color={C.orange} />, step: "01", title: "Upload Media", body: "Drag and drop a short video or audio clip of the sound or symptom. We handle any format." },
            { icon: <Cpu size={28} color={C.orange} />, step: "02", title: "AI Analyzes", body: "Our multimodal engine cross-references the signature against 50,000+ indexed repair manuals." },
            { icon: <CheckCircle2 size={28} color={C.orange} />, step: "03", title: "Fix It Safely", body: "Receive a step-by-step repair guide with parts sourcing, safety checks, and expert callouts." },
          ].map(({ icon, step, title, body }) => (
            <div key={step} style={{ background: C.s1, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 12, right: 16, fontFamily: C.font, fontWeight: 900, fontSize: "5rem", color: `${C.txt}05`, lineHeight: 1, userSelect: "none" }}>{step}</div>
              <div style={{ width: 48, height: 48, background: C.s2, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>{icon}</div>
              <h3 style={{ fontFamily: C.font, fontWeight: 800, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontFamily: C.font, fontSize: "0.8rem", color: C.sub, lineHeight: 1.8 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section style={{ background: C.s1, padding: "80px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ borderLeft: `4px solid ${C.orange}`, paddingLeft: 20, marginBottom: 60 }}>
            <h2 style={{ fontFamily: C.font, fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 8 }}>Enterprise-Grade Capabilities</h2>
            <p style={{ color: C.sub, fontSize: "0.85rem" }}>Built for demanding industrial environments and safety-first compliance.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { icon: <ShieldCheck size={20} color={C.orange} />, title: "Safety Checksum", body: "SHA-256 verified safety scan on every diagnosis. High-voltage hazards auto-flagged before any guide is unlocked." },
              { icon: <Database size={20} color={C.orange} />, title: "RAG Knowledge Base", body: "50,000+ indexed OEM manuals and service bulletins cross-referenced in real-time for accuracy." },
              { icon: <Search size={20} color={C.orange} />, title: "Parts Sourcing", body: "Instant local and online parts availability with confidence-scored SKU matching. Buy with one click." },
              { icon: <Wrench size={20} color={C.orange} />, title: "Step-by-Step Guides", body: "Foreman-vetted repair instructions with tool checklists, torque specs, and sub-step callouts." },
              { icon: <Zap size={20} color={C.orange} />, title: "60-Second Analysis", body: "Multimodal FFT acoustic engine delivers actionable results in under a minute." },
              { icon: <FileCheck size={20} color={C.orange} />, title: "Audit Trail", body: "Every diagnosis session is logged, timestamped, and exportable for compliance and warranty records." },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{ background: C.bg, padding: "24px 24px" }}>
                <div style={{ marginBottom: 14 }}>{icon}</div>
                <h4 style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>{title}</h4>
                <p style={{ fontFamily: C.font, fontSize: "0.75rem", color: C.sub, lineHeight: 1.8 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontFamily: C.font, fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 48, textAlign: "center" }}>In The Field</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            { quote: "Saved me $1,200 on an HVAC compressor. The AI diagnosed a failing bearing from a 20-second recording. Ordered the part and fixed it myself.", name: "Marcus T.", role: "Facilities Manager, Detroit" },
            { quote: "The safety checkpoint is what made me trust it. It flagged a capacitor risk before I even touched the unit. That's the kind of AI I need.", name: "Sarah K.", role: "Industrial Technician, Chicago" },
            { quote: "The parts hub is insane. It found the exact V-belt SKU locally, 0.9km away, with a 98% confidence match. That's engineering.", name: "James R.", role: "Plant Maintenance Supervisor" },
          ].map(({ quote, name, role }) => (
            <div key={name} style={{ background: C.s1, padding: "28px 24px", borderLeft: `3px solid ${C.s3}` }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontFamily: C.font, fontSize: "0.82rem", color: C.txt, lineHeight: 1.8, fontStyle: "italic", marginBottom: 20 }}>"{quote}"</p>
              <div>
                <p style={{ fontFamily: C.font, fontWeight: 800, fontSize: "0.78rem", color: C.txt }}>{name}</p>
                <p style={{ ...LABEL, marginTop: 4 }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section style={{ background: C.s1, padding: "80px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: C.font, fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 48, textAlign: "center" }}>Simple Pricing</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { name: "Starter", price: "FREE", period: "No credit card", features: ["5 diagnoses/month", "Basic safety scan", "Parts availability"], highlight: false },
              { name: "Foreman", price: "$29", period: "per month", features: ["Unlimited diagnoses", "Full RAG knowledge base", "Parts sourcing hub", "Priority AI processing", "Audit trail export"], highlight: true },
              { name: "Enterprise", price: "Custom", period: "contact us", features: ["Unlimited seats", "API access", "Custom knowledge base", "LOTO compliance module", "Dedicated support"], highlight: false },
            ].map(({ name, price, period, features, highlight }) => (
              <div key={name} style={{ background: highlight ? C.s2 : C.bg, padding: "32px 28px", border: highlight ? `2px solid ${C.orange}` : `1px solid ${C.s2}`, position: "relative" }}>
                {highlight && <div style={{ position: "absolute", top: -1, left: 20, background: C.orange, padding: "3px 12px" }}>
                  <span style={{ fontFamily: C.mono, fontSize: "0.55rem", color: "#131313", fontWeight: 700 }}>MOST POPULAR</span>
                </div>}
                <p style={{ ...LABEL, color: C.light, marginBottom: 8 }}>{name.toUpperCase()}</p>
                <p style={{ fontFamily: C.font, fontWeight: 900, fontSize: "2.4rem", color: C.txt, letterSpacing: "-0.03em" }}>{price}</p>
                <p style={{ ...LABEL, marginBottom: 24 }}>{period}</p>
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
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding: "100px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${C.orange}14, transparent 70%)` }} />
        <div style={{ position: "relative" }}>
          <h2 style={{ fontFamily: C.font, fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.5rem)", textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.0, marginBottom: 24 }}>
            STOP PAYING<br /><span style={{ color: C.orange }}>FOR WHAT</span><br />YOU CAN FIX.
          </h2>
          <p style={{ fontFamily: C.font, color: C.sub, fontSize: "0.95rem", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.8 }}>
            Join 12,000+ engineers and homeowners who are diagnosing and fixing their appliances with precision. Start for free.
          </p>
          <button onClick={() => setLocation("/dashboard")} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "18px 36px", background: grad, border: "none", cursor: "pointer", fontFamily: C.font, fontWeight: 900, fontSize: "0.85rem", color: "#131313", letterSpacing: "0.1em" }}>
            LAUNCH FOREMAN MODE <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ background: C.s1, borderTop: `1px solid ${C.s2}`, padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, background: grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={11} color="#131313" />
          </div>
          <span style={{ fontFamily: C.font, fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.06em", color: C.sub }}>LISTEN & FIX</span>
        </div>
        <p style={{ ...LABEL }}>© 2025 Listen & Fix. All rights reserved.</p>
        <div style={{ display: "flex", gap: 16 }}>
          {["Privacy", "Terms", "Support"].map(l => (
            <a key={l} href="#" style={{ ...LABEL, color: C.sub, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
