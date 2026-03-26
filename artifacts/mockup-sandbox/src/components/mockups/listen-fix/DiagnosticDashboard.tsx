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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const OBSERVATIONS = [
  "Initializing multimodal analysis pipeline...",
  "Processing audio signature — 44.1kHz stereo input detected.",
  "Acoustic pattern recognition active. Scanning for harmonic anomalies...",
  "⚡ Metallic grinding detected at ~400Hz. Consistent with worn bearing.",
  "Cross-referencing against Knowledge Moat (iFixit / OEM Manuals)...",
  "High-authority match found: Samsung Dryer DV42H — Drum Bearing Assembly.",
  "Weighted RAG score: 0.94 (Level 1 source). Grounding confirmed.",
  "Checking hazard registry for component signatures...",
  "Safety scan complete — No lethal hazards detected (non-electrical, non-gas).",
  "Severity classification: MEDIUM. DIY repair eligible.",
  "Generating structured diagnostic payload. Safety checksum computing...",
];

const REPAIR_STEPS = [
  {
    order: 1,
    instruction: "Unplug the dryer and move it away from the wall to access the rear panel.",
    safety_check: "Confirm power is disconnected before touching any components.",
  },
  {
    order: 2,
    instruction: "Remove the 6 Phillips screws securing the back panel and set aside.",
    safety_check: null,
  },
  {
    order: 3,
    instruction: "Locate the drum support bearing at the rear of the drum. The worn felt seal will be visibly frayed.",
    safety_check: null,
  },
  {
    order: 4,
    instruction: "Replace the drum bearing kit (part #DC97-16782A) by sliding the new bearing onto the support shaft.",
    safety_check: "Ensure the bearing snaps fully into place before reassembly.",
  },
  {
    order: 5,
    instruction: "Reassemble in reverse order. Run a 10-minute test cycle to confirm the grinding sound is resolved.",
    safety_check: null,
  },
];

const PARTS = [
  {
    name: "Samsung Drum Bearing Kit",
    part_number: "DC97-16782A",
    price: 28.99,
    stores: [
      { vendor: "Repair Clinic", url: "#", in_stock: true, eta: "Ships in 1 day", price: 28.99 },
      { vendor: "AppliancePartsPros", url: "#", in_stock: true, eta: "Ships in 2 days", price: 31.45 },
      { vendor: "Amazon", url: "#", in_stock: true, eta: "Prime — arrives tomorrow", price: 34.0 },
    ],
  },
  {
    name: "Drum Felt Seal Strip",
    part_number: "DC61-01215A",
    price: 14.5,
    stores: [
      { vendor: "Repair Clinic", url: "#", in_stock: true, eta: "Ships in 1 day", price: 14.5 },
      { vendor: "AppliancePartsPros", url: "#", in_stock: false, eta: "Backordered", price: 13.99 },
    ],
  },
];

type Phase = "upload" | "analyzing" | "completed" | "lethal";

function useSimulatedStream(phase: Phase) {
  const [observations, setObservations] = useState<string[]>([]);
  const [safetyAlert, setSafetyAlert] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"analyzing" | "verifying" | "completed">("analyzing");
  const idxRef = useRef(0);

  useEffect(() => {
    if (phase !== "analyzing") return;
    setObservations([]);
    setSafetyAlert(null);
    setIsVerified(false);
    setProgress(0);
    setStatus("analyzing");
    idxRef.current = 0;

    const interval = setInterval(() => {
      if (idxRef.current < OBSERVATIONS.length) {
        const obs = OBSERVATIONS[idxRef.current];
        setObservations((prev) => [...prev, obs]);
        setProgress(Math.round(((idxRef.current + 1) / OBSERVATIONS.length) * 100));
        if (idxRef.current === 7) {
          setStatus("verifying");
          setSafetyAlert("Cross-referencing against safety protocol registry...");
        }
        if (idxRef.current === OBSERVATIONS.length - 1) {
          setTimeout(() => {
            setStatus("completed");
            setIsVerified(true);
            setSafetyAlert(null);
          }, 800);
        }
        idxRef.current++;
      } else {
        clearInterval(interval);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [phase]);

  return { observations, safetyAlert, isVerified, progress, status };
}

function ObservationStream({
  observations,
  safetyAlert,
  status,
  phase,
}: {
  observations: string[];
  safetyAlert: string | null;
  status: string;
  phase: Phase;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [observations, safetyAlert]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto font-mono text-xs space-y-1.5 pr-1"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#334155 transparent" }}
    >
      {observations.map((text, i) => (
        <div key={i} className="text-slate-300 leading-relaxed flex gap-2">
          <span className="text-cyan-400 mt-0.5 flex-shrink-0">›</span>
          <span>{text}</span>
        </div>
      ))}

      {safetyAlert && (
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs mt-3 flex gap-2">
          <span>⚠</span>
          <span className="italic">{safetyAlert}</span>
        </div>
      )}

      {status === "analyzing" || status === "verifying" ? (
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-cyan-400">›</span>
          <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse rounded-sm" />
        </div>
      ) : status === "completed" ? (
        <div className="flex items-center gap-2 mt-3 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">Analysis complete. Safety verified.</span>
        </div>
      ) : null}

      {phase === "lethal" && (
        <>
          <div className="text-slate-300 leading-relaxed flex gap-2">
            <span className="text-cyan-400 mt-0.5 flex-shrink-0">›</span>
            <span>Processing audio from microwave unit — 120Hz hum detected.</span>
          </div>
          <div className="text-slate-300 leading-relaxed flex gap-2">
            <span className="text-cyan-400 mt-0.5 flex-shrink-0">›</span>
            <span>Microwave internal components identified in frame analysis.</span>
          </div>
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs mt-3 flex gap-2">
            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span className="italic">
              KILL-SWITCH TRIGGERED: Capacitor / high-voltage component identified. Pivoting to Professional Referral.
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function SafetyLock({ status }: { status: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center rounded-2xl"
      style={{ background: "rgba(239,246,255,0.75)", backdropFilter: "blur(6px)" }}>
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xs border border-blue-100">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Safety Verification in Progress</h2>
        <p className="text-slate-500 text-xs mb-4 leading-relaxed">
          Cross-referencing against technical manuals and hazard registry. Repair steps remain locked for your protection.
        </p>
        <div className="w-full bg-blue-50 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
            style={{ width: status === "verifying" ? "75%" : "40%", transition: "width 0.8s ease" }}
          />
        </div>
        <p className="text-[10px] text-blue-400 mt-3 font-mono uppercase tracking-wider">
          {status === "verifying" ? "Verifying RAG grounding..." : "Analyzing media signature..."}
        </p>
      </div>
    </div>
  );
}

function LethalPivot() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl flex items-start gap-4"
        style={{ background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)", border: "1px solid #fecdd3" }}>
        <div className="p-2.5 rounded-xl bg-rose-100 flex-shrink-0">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <p className="font-bold text-rose-900 text-sm">SAFETY PROTOCOL TRIGGERED</p>
          <p className="text-rose-700 text-xs mt-1 leading-relaxed">
            High-voltage capacitor detected. Hazard classification: <strong>LETHAL</strong>. DIY repair is prohibited by safety protocol.
          </p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-xl"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)" }}>
        <div className="px-7 pt-7 pb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Professional Intervention Required</h2>
              <p className="text-indigo-300 text-xs">12 verified technicians near you • Avg rating 4.8★</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Microwave capacitors store lethal electrical charge even when unplugged. This repair requires a licensed appliance technician.
          </p>
          <button className="w-full font-bold py-3.5 rounded-xl text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
            <Zap className="w-4 h-4" />
            Book a Verified Technician — Est. $50 Referral
            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
          </button>
          <p className="text-center text-slate-500 text-[11px] mt-3">Appointments available today • Free cancellation</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{ label: "Technicians Nearby", value: "12", color: "text-blue-600" }, { label: "Avg Rating", value: "4.8★", color: "text-amber-500" }, { label: "Est. Repair Cost", value: "$85–120", color: "text-emerald-600" }].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-xl p-4 text-center shadow-sm">
            <p className={`font-bold text-xl ${stat.color}`}>{stat.value}</p>
            <p className="text-slate-500 text-[10px] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagnosisResult() {
  const [expandedPart, setExpandedPart] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border: "1px solid #bbf7d0" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="text-emerald-600 w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-emerald-900 text-sm">Severity: MEDIUM — DIY Eligible</p>
            <p className="text-[11px] text-emerald-600 font-mono mt-0.5">
              Safety Checksum: <span className="font-semibold">a3f7c...d2e1 ✓ VERIFIED</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Confidence</p>
          <p className="font-mono font-bold text-3xl" style={{ background: "linear-gradient(135deg, #10b981, #059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>94%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Identification</h3>
        </div>
        <Separator className="mb-3" />
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Make / Model</p>
            <p className="text-slate-800 font-semibold">Samsung DV42H5000EW</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Component</p>
            <p className="text-slate-800 font-semibold">Drum Bearing Assembly</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Root Cause</p>
            <p className="text-slate-600 text-xs leading-relaxed">
              Worn drum support bearing producing metallic grinding at 400Hz. Acoustic signature matches OEM manual failure mode #DB-4.
            </p>
          </div>
        </div>
        <div className="mt-3 p-2 rounded-lg text-[10px] font-mono border"
          style={{ background: "linear-gradient(135deg, #eff6ff, #eef2ff)", borderColor: "#c7d2fe" }}>
          <span className="text-indigo-400">RAG Source: </span>
          <span className="text-indigo-700">iFixit Samsung Dryer Guide #120847 · Authority: 0.95 (Level 1)</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
              <Wrench className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Step-by-Step Repair Guide</h3>
          </div>
          <div className="flex gap-2">
            <Badge className="text-[10px] font-semibold bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">Beginner</Badge>
            <Badge variant="outline" className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> 45–60 min
            </Badge>
          </div>
        </div>
        <Separator className="mb-3" />
        <div className="space-y-2.5">
          {REPAIR_STEPS.map((step) => (
            <div key={step.order} className="flex gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors group">
              <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white mt-0.5 shadow-sm"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                {step.order}
              </span>
              <div className="flex-1">
                <p className="text-slate-700 text-sm leading-relaxed">{step.instruction}</p>
                {step.safety_check && (
                  <div className="mt-1.5 text-[11px] rounded-lg px-2.5 py-1.5 flex gap-1.5"
                    style={{ background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e" }}>
                    <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5 text-amber-500" />
                    <span>{step.safety_check}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Required Tools</p>
          <div className="flex flex-wrap gap-1.5">
            {["Phillips #2 Screwdriver", "Putty Knife", "Work Gloves"].map((tool) => (
              <span key={tool} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 font-medium shadow-sm">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
            <ShoppingCart className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Parts Sourcing</h3>
        </div>
        <Separator className="mb-3" />
        <div className="space-y-3">
          {PARTS.map((part, i) => (
            <div key={i} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setExpandedPart(expandedPart === i ? null : i)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="text-left">
                  <p className="font-semibold text-slate-900 text-sm">{part.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">#{part.part_number}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-sm" style={{ color: "#2563eb" }}>From ${part.price.toFixed(2)}</p>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expandedPart === i ? "rotate-90" : ""}`} />
                </div>
              </button>
              {expandedPart === i && (
                <div className="border-t border-slate-100 divide-y divide-slate-50">
                  {part.stores.map((store, si) => (
                    <div key={si} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{store.vendor}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />{store.eta}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${store.in_stock ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-600 border border-rose-200"}`}>
                          {store.in_stock ? "In Stock" : "Backordered"}
                        </span>
                        <p className="font-bold text-slate-900 text-sm">${store.price.toFixed(2)}</p>
                        <button className="p-1.5 text-white rounded-lg transition-all hover:opacity-90"
                          style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                          <ShoppingCart className="w-3.5 h-3.5" />
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
    </div>
  );
}

function UploadScreen({ onStart }: { onStart: (phase: Phase) => void }) {
  const [description, setDescription] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const charLimit = 500;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          style={{ background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)", boxShadow: "0 8px 24px rgba(99,102,241,0.3)" }}>
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Listen & Fix</h1>
        <p className="text-slate-500 text-sm mt-1">AI-powered multimodal appliance diagnostics</p>
      </div>

      <div className="w-full max-w-md border-2 border-dashed border-blue-100 rounded-2xl p-7 text-center hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer group"
        style={{ background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)" }}>
        <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
          <Upload className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
        </div>
        <p className="font-semibold text-slate-700 text-sm">Drop your video or audio here</p>
        <p className="text-xs text-slate-400 mt-1">MP4, MOV, WAV, MP3 • Up to 2GB</p>
        <button className="mt-4 px-5 py-2 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
          Browse Files
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
            Describe the issue
          </label>
          <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 bg-slate-100 rounded-md">Optional</span>
        </div>
        <div className={`relative rounded-xl border transition-all duration-200 ${isFocused ? "border-blue-400 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}
          style={isFocused ? { background: "white", boxShadow: "0 0 0 3px rgba(99,102,241,0.1)" } : {}}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, charLimit))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="e.g. My dryer makes a loud grinding noise when spinning, especially at the start of a cycle..."
            rows={3}
            className="w-full px-4 pt-3 pb-8 text-sm text-slate-700 placeholder:text-slate-300 bg-transparent resize-none outline-none rounded-xl leading-relaxed"
          />
          <div className="absolute bottom-2.5 left-4 right-3 flex items-center justify-between pointer-events-none">
            {description.length > 0 ? (
              <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "#6366f1" }}>
                <Sparkles className="w-3 h-3" />
                <span>Context will refine the AI diagnosis</span>
              </div>
            ) : (
              <span className="text-[10px] text-slate-300">Adding context improves accuracy</span>
            )}
            <span className={`text-[10px] font-mono ${description.length > charLimit * 0.85 ? "text-amber-500" : "text-slate-300"}`}>
              {description.length}/{charLimit}
            </span>
          </div>
        </div>
        {description.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["When does it happen?", "How long has this been going on?", "Any error codes?"].map((hint) => (
              <button key={hint}
                onClick={() => setDescription((prev) => prev.length > 0 ? `${prev} ${hint}` : hint)}
                className="text-[10px] px-2 py-1 rounded-lg border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                + {hint}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 w-full max-w-md">
        <button onClick={() => onStart("analyzing")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #1e293b, #334155)" }}>
          <Play className="w-4 h-4" />
          Demo: Normal Diagnosis
        </button>
        <button onClick={() => onStart("lethal")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #e11d48, #be123c)" }}>
          <ShieldAlert className="w-4 h-4" />
          Demo: Lethal Hazard
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-md text-center">
        {[
          { icon: Mic, label: "Audio Analysis", sub: "44.1kHz acoustic scan", color: "#6366f1" },
          { icon: Video, label: "Video Processing", sub: "Gemini native multimodal", color: "#3b82f6" },
          { icon: ShieldCheck, label: "Safety Verified", sub: "RAG knowledge moat", color: "#10b981" },
        ].map(({ icon: Icon, label, sub, color }) => (
          <div key={label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
              style={{ background: `${color}18` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-xs font-semibold text-slate-700">{label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiagnosticDashboard() {
  const [phase, setPhase] = useState<Phase>("upload");
  const { observations, safetyAlert, isVerified, progress, status } = useSimulatedStream(phase);

  if (phase === "upload") {
    return (
      <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f8faff 0%, #f0f4ff 50%, #fafafa 100%)" }}>
        <header className="border-b border-slate-100 px-8 py-4 flex items-center justify-between bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Listen & Fix</span>
            <Badge className="text-[10px] ml-1 bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-50">Beta</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Safety-First Diagnostics</span>
          </div>
        </header>
        <UploadScreen onStart={setPhase} />
      </div>
    );
  }

  const isLethal = phase === "lethal";
  const showLock = !isLethal && !isVerified;

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      <header className="border-b px-8 py-3.5 flex items-center justify-between sticky top-0 z-50"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", borderColor: "#1e293b" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">Listen & Fix</span>
          <span className="text-slate-600 mx-2">|</span>
          <span className="text-xs font-mono text-slate-400">Case #b4e2f7a1-3c9d</span>
        </div>
        <div className="flex items-center gap-4">
          {!isLethal && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-28 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />
              </div>
              <span className="text-slate-400 font-mono w-8">{progress}%</span>
            </div>
          )}
          <button onClick={() => setPhase("upload")}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <SkipForward className="w-3.5 h-3.5" />
            New Diagnosis
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-12 gap-6">
        <div className="col-span-4 flex flex-col gap-4">
          <div className="rounded-2xl shadow-xl overflow-hidden"
            style={{ background: "linear-gradient(160deg, #0f172a 0%, #0c1628 100%)", border: "1px solid #1e3a5f" }}>
            <div className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "#1e3a5f" }}>
              <div className="flex items-center gap-2">
                <Activity className={`w-3.5 h-3.5 ${isLethal ? "text-rose-400" : "text-cyan-400 animate-pulse"}`} />
                <span className="font-mono text-xs text-slate-300 uppercase tracking-wider">Live Stream</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLethal ? "bg-rose-500" : status === "completed" ? "bg-emerald-500" : "bg-cyan-400"}`} />
                <span className="text-[10px] font-mono uppercase" style={{ color: isLethal ? "#f87171" : status === "completed" ? "#34d399" : "#67e8f9" }}>
                  {isLethal ? "BLOCKED" : status}
                </span>
              </div>
            </div>
            <div className="p-4 h-64 flex flex-col">
              <ObservationStream observations={observations} safetyAlert={safetyAlert} status={isLethal ? "completed" : status} phase={phase} />
            </div>
          </div>

          {!isLethal && (
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Safety Verification
              </p>
              <div className="space-y-2.5">
                {[
                  { label: "Acoustic Analysis", done: progress > 25, color: "#6366f1" },
                  { label: "Knowledge Moat RAG", done: progress > 55, color: "#3b82f6" },
                  { label: "Hazard Registry Check", done: progress > 75, color: "#f59e0b" },
                  { label: "Safety Checksum", done: isVerified, color: "#10b981" },
                ].map(({ label, done, color }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ background: done ? `${color}18` : "#f1f5f9" }}>
                      {done ? (
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color }} />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <span className={`text-xs transition-colors ${done ? "text-slate-700 font-medium" : "text-slate-400"}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLethal && (
            <div className="rounded-2xl p-4" style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}>
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <p className="text-xs font-bold text-rose-600 uppercase tracking-wide">Lethal Hazard</p>
              </div>
              <p className="text-xs text-rose-700/70 leading-relaxed">
                Microwave capacitor stores up to <strong className="text-rose-700">2,100V</strong> even when unplugged. Kill-switch activated.
              </p>
            </div>
          )}
        </div>

        <div className="col-span-8">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-slate-900">Diagnostic Report</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isLethal ? "Microwave — Audio / Video Analysis" : "Samsung Dryer DV42H — Audio Analysis"}
            </p>
          </div>
          <div className="relative">
            {showLock && <SafetyLock status={status} />}
            <div className={showLock ? "blur-md pointer-events-none select-none" : ""}>
              {isLethal ? <LethalPivot /> : <DiagnosisResult />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
