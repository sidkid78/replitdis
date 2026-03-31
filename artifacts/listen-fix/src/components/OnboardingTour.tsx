import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Mic, Cpu, Wrench, ShoppingCart, ShieldCheck, Play, BarChart2 } from "lucide-react";

const C = {
  bg:      "#0e0e0e",
  bgLow:   "#1c1b1b",
  bgMid:   "#201f1f",
  bgHigh:  "#2a2a2a",
  cyan:    "#00f0ff",
  onCyan:  "#00363a",
  onSurf:  "#e5e2e1",
  onSurfV: "#b9cacb",
  outlineV:"rgba(59,73,75,0.6)",
  error:   "#ffb4ab",
  errorC:  "#93000a",
  grotesk: "'Space Grotesk', sans-serif",
  mono:    "'JetBrains Mono', monospace",
  inter:   "'Inter', sans-serif",
};

export interface TourStep {
  icon: React.ReactNode;
  tag: string;
  title: string;
  body: string;
  highlight?: string;
}

interface OnboardingTourProps {
  storageKey: string;
  steps: TourStep[];
  onDone?: () => void;
}

const HudCorners = ({ size = 14, color = "rgba(0,240,255,0.5)", thickness = 2 }) => (
  <>
    <div style={{ position: "absolute", top: 8, left: 8, width: size, height: size, borderTop: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}`, pointerEvents: "none" }} />
    <div style={{ position: "absolute", top: 8, right: 8, width: size, height: size, borderTop: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}`, pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: 8, left: 8, width: size, height: size, borderBottom: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}`, pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: 8, right: 8, width: size, height: size, borderBottom: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}`, pointerEvents: "none" }} />
  </>
);

export default function OnboardingTour({ storageKey, steps, onDone }: OnboardingTourProps) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(storageKey);
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [storageKey]);

  const dismiss = () => {
    localStorage.setItem(storageKey, "1");
    setVisible(false);
    onDone?.();
  };

  const goTo = (next: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 180);
  };

  const next = () => {
    if (step < steps.length - 1) goTo(step + 1);
    else dismiss();
  };

  const prev = () => {
    if (step > 0) goTo(step - 1);
  };

  if (!visible) return null;

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;
  const isLast = step === steps.length - 1;

  return (
    <>
      <style>{`
        @keyframes tour-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes tour-slide-up {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes tour-content-fade {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .tour-overlay {
          animation: tour-fade-in 0.25s ease-out forwards;
        }
        .tour-card {
          animation: tour-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .tour-content {
          animation: tour-content-fade 0.2s ease-out forwards;
        }
        .tour-btn-primary {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .75rem 1.75rem; background: ${C.cyan}; border: none;
          cursor: pointer; font-family: ${C.grotesk}; font-weight: 700;
          font-size: .7rem; color: ${C.onCyan}; letter-spacing: .14em;
          text-transform: uppercase; transition: box-shadow .2s;
        }
        .tour-btn-primary:hover { box-shadow: 0 0 24px rgba(0,240,255,0.45); }
        .tour-btn-ghost {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .75rem 1.25rem; background: transparent;
          border: 1px solid rgba(0,240,255,0.25); cursor: pointer;
          font-family: ${C.grotesk}; font-weight: 700; font-size: .7rem;
          color: rgba(0,240,255,0.7); letter-spacing: .14em;
          text-transform: uppercase; transition: all .2s;
        }
        .tour-btn-ghost:hover {
          background: rgba(0,240,255,0.06);
          border-color: rgba(0,240,255,0.5);
          color: ${C.cyan};
        }
        .tour-btn-skip {
          background: none; border: none; cursor: pointer;
          font-family: ${C.mono}; font-size: .6rem;
          color: ${C.onSurfV}; letter-spacing: .1em;
          text-transform: uppercase; transition: color .15s;
          padding: .5rem .75rem;
        }
        .tour-btn-skip:hover { color: ${C.error}; }
        .tour-step-dot {
          width: 8px; height: 8px; background: ${C.outlineV};
          transition: all .3s;
        }
        .tour-step-dot.active {
          background: ${C.cyan};
          box-shadow: 0 0 8px rgba(0,240,255,0.6);
        }
        .tour-step-dot.done {
          background: rgba(0,240,255,0.35);
        }
      `}</style>

      {/* Overlay */}
      <div
        className="tour-overlay"
        onClick={dismiss}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(4px)",
          zIndex: 9000,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: "0 1rem 2.5rem",
        }}
        aria-modal="true"
        role="dialog"
      >
        {/* Card */}
        <div
          className="tour-card"
          onClick={e => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 560,
            background: C.bgLow,
            border: "1px solid rgba(0,240,255,0.22)",
            boxShadow: "0 0 60px rgba(0,240,255,0.1), 0 32px 64px rgba(0,0,0,0.8)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Progress bar */}
          <div style={{ height: 2, background: C.outlineV, position: "relative" }}>
            <div style={{
              position: "absolute", top: 0, left: 0, height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(to right, ${C.cyan}, rgba(0,240,255,0.6))`,
              transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: `0 0 8px ${C.cyan}`,
            }} />
          </div>

          <HudCorners />

          {/* Header */}
          <div style={{
            padding: "1.125rem 1.5rem .875rem",
            borderBottom: `0.5px solid ${C.outlineV}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {steps.map((_, i) => (
                  <div key={i} className={`tour-step-dot${i === step ? " active" : i < step ? " done" : ""}`} />
                ))}
              </div>
              <span style={{ fontFamily: C.mono, fontSize: ".58rem", color: C.onSurfV, letterSpacing: ".12em", textTransform: "uppercase" }}>
                STEP {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </span>
            </div>
            <button className="tour-btn-skip" onClick={dismiss} aria-label="Close tour">
              <X size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />SKIP
            </button>
          </div>

          {/* Body */}
          <div key={step} className="tour-content" style={{ padding: "1.75rem 1.5rem" }}>
            <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
              {/* Icon */}
              <div style={{
                width: 52, height: 52, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(0,240,255,0.07)",
                border: "1px solid rgba(0,240,255,0.22)",
                color: C.cyan,
              }}>
                {current.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  fontFamily: C.mono, fontSize: ".58rem", color: C.cyan,
                  letterSpacing: ".14em", textTransform: "uppercase",
                  display: "block", marginBottom: ".5rem",
                }}>{current.tag}</span>
                <h2 style={{
                  fontFamily: C.grotesk, fontWeight: 900, fontSize: "1.25rem",
                  color: C.onSurf, textTransform: "uppercase", letterSpacing: "-.02em",
                  lineHeight: 1.1, marginBottom: ".875rem",
                }}>{current.title}</h2>
                <p style={{
                  fontFamily: C.inter, fontSize: ".875rem",
                  color: C.onSurfV, lineHeight: 1.8,
                }}>{current.body}</p>

                {current.highlight && (
                  <div style={{
                    marginTop: "1rem",
                    padding: ".625rem 1rem",
                    background: "rgba(0,240,255,0.05)",
                    borderLeft: `2px solid ${C.cyan}`,
                    fontFamily: C.mono, fontSize: ".67rem",
                    color: C.cyan, letterSpacing: ".06em",
                    lineHeight: 1.7,
                  }}>
                    {current.highlight}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: ".875rem 1.5rem 1.25rem",
            borderTop: `0.5px solid ${C.outlineV}`,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
          }}>
            <button
              className="tour-btn-ghost"
              onClick={prev}
              disabled={step === 0}
              style={{ opacity: step === 0 ? 0.3 : 1, pointerEvents: step === 0 ? "none" : "auto" }}
            >
              <ChevronLeft size={13} /> BACK
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              {!isLast && (
                <button className="tour-btn-skip" onClick={dismiss}>
                  SKIP TOUR
                </button>
              )}
              <button className="tour-btn-primary" onClick={next}>
                {isLast ? "GET STARTED" : (
                  <><span>NEXT</span><ChevronRight size={13} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Pre-built step sets ─────────────────────────────────────────────────────────

export const LANDING_TOUR_STEPS: TourStep[] = [
  {
    icon: <BarChart2 size={24} />,
    tag: "01 // WELCOME",
    title: "LISTEN & FIX",
    body: "Welcome to the AI-powered appliance diagnostics platform. Upload or record a fault sound from any mechanical equipment and get a full repair blueprint in under 60 seconds.",
    highlight: "SYSTEM_STATUS: OPERATIONAL // v4.0.2 — No prior expertise required.",
  },
  {
    icon: <Cpu size={24} />,
    tag: "02 // THE AI ENGINE",
    title: "MULTIMODAL AI PIPELINE",
    body: "The Diagnostic Stream panel on this page shows a live simulation of the 6-stage AI pipeline. In real mode it processes your audio, video, or image, then cross-references 50,000+ OEM manuals to identify the exact fault.",
    highlight: "STAGES: Signal Input → Acoustic Scan → Diagnosis → Knowledge Retrieval → Guide Synthesis → Parts Sourcing",
  },
  {
    icon: <Wrench size={24} />,
    tag: "03 // HOW IT WORKS",
    title: "THREE STEPS. ZERO GUESSWORK.",
    body: "CAPTURE your equipment's fault sound or image. The AI will ANALYZE the acoustic signature and pinpoint the root cause. Then REPAIR with a step-by-step guide tailored to your exact hardware configuration.",
  },
  {
    icon: <Play size={24} />,
    tag: "04 // GET STARTED",
    title: "LAUNCH THE DASHBOARD",
    body: "Click LAUNCH APP in the top-right corner — or START FREE DIAGNOSIS in the hero section — to enter the Foreman Mode dashboard and run your first diagnosis. The dashboard guides you through every step.",
    highlight: "TIP: You can upload audio, video, or image files up to 8 MB. No hardware required.",
  },
];

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    icon: <BarChart2 size={24} />,
    tag: "01 // WELCOME",
    title: "FOREMAN MODE ACTIVATED",
    body: "You are now inside the diagnostic command center. This dashboard runs a 6-stage Gemini AI pipeline that analyzes your equipment faults and produces a full repair blueprint.",
    highlight: "AI_STATUS: ONLINE // All pipeline stages nominal.",
  },
  {
    icon: <Play size={24} />,
    tag: "02 // START A DIAGNOSIS",
    title: "INITIATE YOUR FIRST SCAN",
    body: "Click the START NEW DIAGNOSIS button on the home screen or INITIATE SCAN in the sidebar. This takes you to the Capture Screen where you fill in equipment details and upload your media.",
    highlight: "SUPPORTED INPUTS: Audio (.mp3, .wav, .m4a) · Video (.mp4, .mov) · Image (.jpg, .png, .webp)",
  },
  {
    icon: <Mic size={24} />,
    tag: "03 // CAPTURE SCREEN",
    title: "FILL IN & UPLOAD",
    body: "On the Capture Screen, enter the equipment make, model, and a short fault description. Then record a live audio clip using your microphone, or upload an existing audio, video, or image file. Hit ANALYZE to begin.",
    highlight: "TIP: The more detail you provide in the description, the more accurate the diagnosis.",
  },
  {
    icon: <Cpu size={24} />,
    tag: "04 // AI PIPELINE",
    title: "6-STAGE ANALYSIS",
    body: "After uploading, the 6-stage pipeline runs automatically. Watch real-time progress updates as the AI processes your media, identifies the fault, retrieves OEM documentation, and synthesizes a repair guide.",
    highlight: "PIPELINE: Media Processing → Acoustic Scan → Diagnosis → Knowledge Retrieval → Guide Synthesis → Parts Sourcing",
  },
  {
    icon: <Wrench size={24} />,
    tag: "05 // REPAIR GUIDE",
    title: "STEP-BY-STEP BLUEPRINT",
    body: "Once analysis is complete, the Repair Guide unlocks. Each step includes a description, estimated duration, and safety warnings. Click GENERATE IMAGE on any step to create a technical illustration.",
  },
  {
    icon: <ShoppingCart size={24} />,
    tag: "06 // PARTS & REPORTS",
    title: "PARTS HUB & SAFETY LOGS",
    body: "The Parts Hub lists every required, recommended, and optional part with pricing and sourcing links. The Safety Logs screen gives you a full diagnostic report including hazard flags — all accessible from the sidebar.",
    highlight: "All three result screens (Repair Guide, Parts Hub, Safety Logs) unlock after your first diagnosis.",
  },
];
