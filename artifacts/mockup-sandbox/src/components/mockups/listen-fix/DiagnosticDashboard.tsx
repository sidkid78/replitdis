import { useState, useEffect, useRef } from "react";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Wrench,
  ShoppingCart,
  AlertOctagon,
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
    instruction:
      "Locate the drum support bearing at the rear of the drum. The worn felt seal will be visibly frayed.",
    safety_check: null,
  },
  {
    order: 4,
    instruction:
      "Replace the drum bearing kit (part #DC97-16782A) by sliding the new bearing onto the support shaft.",
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [observations, safetyAlert]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto font-mono text-xs space-y-1.5 pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#334155 transparent" }}>
      {observations.map((text, i) => (
        <div key={i} className="text-slate-300 leading-relaxed flex gap-2">
          <span className="text-cyan-500 mt-0.5 flex-shrink-0">›</span>
          <span>{text}</span>
        </div>
      ))}

      {safetyAlert && (
        <div className="p-2.5 bg-amber-900/30 border border-amber-700/40 rounded-lg text-amber-300 text-xs mt-3 flex gap-2">
          <span>⚠</span>
          <span className="italic">{safetyAlert}</span>
        </div>
      )}

      {status === "analyzing" || status === "verifying" ? (
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-cyan-500">›</span>
          <span className="inline-block w-2 h-4 bg-cyan-500 animate-pulse" />
        </div>
      ) : status === "completed" ? (
        <div className="flex items-center gap-2 mt-3 text-green-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">Analysis complete. Safety verified.</span>
        </div>
      ) : null}

      {phase === "lethal" && (
        <>
          <div className="text-slate-300 leading-relaxed flex gap-2">
            <span className="text-cyan-500 mt-0.5 flex-shrink-0">›</span>
            <span>Processing audio from microwave unit — 120Hz hum detected.</span>
          </div>
          <div className="text-slate-300 leading-relaxed flex gap-2">
            <span className="text-cyan-500 mt-0.5 flex-shrink-0">›</span>
            <span>Microwave internal components identified in frame analysis.</span>
          </div>
          <div className="p-2.5 bg-red-900/30 border border-red-700/40 rounded-lg text-red-300 text-xs mt-3 flex gap-2">
            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span className="italic">
              KILL-SWITCH TRIGGERED: Forbidden imperative detected in stream. Capacitor / high-voltage component
              identified. Pivoting to Professional Referral.
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function SafetyLock({ status, safetyAlert }: { status: string; safetyAlert: string | null }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xs border border-slate-100">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Safety Verification in Progress</h2>
        <p className="text-slate-500 text-xs mb-4 leading-relaxed">
          Cross-referencing against technical manuals and hazard registry. Repair steps remain locked for your protection.
        </p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{
              width: status === "verifying" ? "75%" : "40%",
              animation: "progress-indeterminate 1.8s ease-in-out infinite",
            }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-3 font-mono uppercase tracking-wider">
          {status === "verifying" ? "Verifying RAG grounding..." : "Analyzing media signature..."}
        </p>
      </div>
    </div>
  );
}

function LethalPivot() {
  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-red-100">
          <ShieldAlert className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <p className="font-bold text-red-900 text-sm">SAFETY PROTOCOL TRIGGERED</p>
          <p className="text-red-700 text-xs mt-1 leading-relaxed">
            High-voltage capacitor component detected. Lethal hazard classification: <strong>CRITICAL</strong>. DIY
            repair is prohibited.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-7 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Professional Intervention Required</h2>
            <p className="text-slate-400 text-xs">12 verified technicians near you • Avg rating 4.8★</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Microwave capacitors store lethal electrical charge even when unplugged. This repair must be performed by a
          licensed appliance technician.
        </p>
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
          <Zap className="w-4 h-4" />
          Book a Verified Technician — Est. $50 Referral
          <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
        </button>
        <p className="text-center text-slate-600 text-[11px] mt-3">
          Appointments available today • Free cancellation
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{ label: "Technicians Nearby", value: "12" }, { label: "Avg Rating", value: "4.8★" }, { label: "Est. Repair Cost", value: "$85–120" }].map((stat) => (
          <div key={stat.label} className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
            <p className="font-bold text-slate-900 text-lg">{stat.value}</p>
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
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-green-600 w-5 h-5" />
          <div>
            <p className="font-bold text-green-900 text-sm">Severity: MEDIUM — DIY Eligible</p>
            <p className="text-[11px] text-green-700 font-mono mt-0.5">
              Safety Checksum:{" "}
              <span className="font-semibold">a3f7c...d2e1 ✓ VERIFIED</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Confidence</p>
          <p className="font-mono font-bold text-2xl text-slate-900">94%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <h3 className="font-bold text-slate-900 text-sm">Identification</h3>
        </div>
        <Separator className="my-3" />
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
            <p className="text-slate-700 text-xs leading-relaxed">
              Worn drum support bearing producing metallic grinding at 400Hz. Acoustic signature matches OEM manual
              failure mode #DB-4. Estimated 6–12 months remaining before complete failure.
            </p>
          </div>
        </div>
        <div className="mt-3 text-[10px] text-slate-400 font-mono border-t border-slate-50 pt-3">
          RAG Source:{" "}
          <span className="text-slate-600">
            iFixit Samsung Dryer Guide #120847 · Authority: 0.95
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-slate-400" />
            <h3 className="font-bold text-slate-900 text-sm">Step-by-Step Repair Guide</h3>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px] font-semibold">Beginner</Badge>
            <Badge variant="outline" className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> 45–60 min
            </Badge>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="space-y-3">
          {REPAIR_STEPS.map((step) => (
            <div key={step.order} className="flex gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors group">
              <span className="flex-shrink-0 w-6 h-6 bg-slate-100 group-hover:bg-slate-200 rounded-full flex items-center justify-center text-[11px] font-bold text-slate-500 mt-0.5 transition-colors">
                {step.order}
              </span>
              <div className="flex-1">
                <p className="text-slate-700 text-sm leading-relaxed">{step.instruction}</p>
                {step.safety_check && (
                  <div className="mt-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 flex gap-1.5">
                    <span>⚠</span>
                    <span>{step.safety_check}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Required Tools</p>
          <div className="flex flex-wrap gap-1.5">
            {["Phillips #2 Screwdriver", "Putty Knife", "Work Gloves"].map((tool) => (
              <span key={tool} className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 font-medium">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <ShoppingCart className="w-4 h-4 text-slate-400" />
          <h3 className="font-bold text-slate-900 text-sm">Parts Sourcing</h3>
        </div>
        <Separator className="my-3" />
        <div className="space-y-3">
          {PARTS.map((part, i) => (
            <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedPart(expandedPart === i ? null : i)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3 text-left">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{part.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">#{part.part_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-blue-600 text-sm">From ${part.price.toFixed(2)}</p>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${expandedPart === i ? "rotate-90" : ""}`}
                  />
                </div>
              </button>
              {expandedPart === i && (
                <div className="border-t border-slate-100 divide-y divide-slate-50">
                  {part.stores.map((store, si) => (
                    <div key={si} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{store.vendor}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {store.eta}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            store.in_stock
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {store.in_stock ? "In Stock" : "Backordered"}
                        </span>
                        <p className="font-bold text-slate-900 text-sm">${store.price.toFixed(2)}</p>
                        <button className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
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

  const descriptionHints = [
    "e.g. My dryer makes a loud grinding noise when spinning, especially at the start of a cycle...",
    "e.g. The washing machine vibrates heavily during the spin cycle and sometimes walks forward...",
    "e.g. Strange burning smell coming from the dishwasher after about 10 minutes of running...",
  ];
  const placeholder = descriptionHints[0];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 py-10">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Listen & Fix</h1>
        <p className="text-slate-500 text-sm mt-1">AI-powered multimodal appliance diagnostics</p>
      </div>

      <div className="w-full max-w-md border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group">
        <div className="w-12 h-12 bg-slate-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
          <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>
        <p className="font-semibold text-slate-700 text-sm">Drop your video or audio here</p>
        <p className="text-xs text-slate-400 mt-1">MP4, MOV, WAV, MP3 • Up to 2GB</p>
        <button className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors">
          Browse Files
        </button>
      </div>

      {/* Optional text description */}
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <MessageSquare className="w-3.5 h-3.5" />
            Describe the issue
          </label>
          <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 bg-slate-100 rounded-md">
            Optional
          </span>
        </div>

        <div
          className={`relative rounded-xl border transition-all duration-200 ${
            isFocused
              ? "border-blue-400 ring-2 ring-blue-100 bg-white"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, charLimit))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            rows={3}
            className="w-full px-4 pt-3 pb-8 text-sm text-slate-700 placeholder:text-slate-300 bg-transparent resize-none outline-none rounded-xl leading-relaxed"
          />

          <div className="absolute bottom-2.5 left-4 right-3 flex items-center justify-between pointer-events-none">
            {description.length > 0 ? (
              <div className="flex items-center gap-1 text-[10px] text-blue-500 font-medium">
                <Sparkles className="w-3 h-3" />
                <span>Context will refine the AI diagnosis</span>
              </div>
            ) : (
              <span className="text-[10px] text-slate-300">
                Adding context improves accuracy
              </span>
            )}
            <span
              className={`text-[10px] font-mono transition-colors ${
                description.length > charLimit * 0.85
                  ? description.length >= charLimit
                    ? "text-red-500"
                    : "text-amber-500"
                  : "text-slate-300"
              }`}
            >
              {description.length}/{charLimit}
            </span>
          </div>
        </div>

        {description.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["When does it happen?", "How long has this been going on?", "Any error codes?"].map((hint) => (
              <button
                key={hint}
                onClick={() =>
                  setDescription((prev) =>
                    prev.length > 0 ? `${prev} ${hint}` : hint
                  )
                }
                className="text-[10px] px-2 py-1 rounded-lg border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                + {hint}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 w-full max-w-md">
        <button
          onClick={() => onStart("analyzing")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          <Play className="w-4 h-4" />
          Demo: Normal Diagnosis
        </button>
        <button
          onClick={() => onStart("lethal")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          <ShieldAlert className="w-4 h-4" />
          Demo: Lethal Hazard
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-md text-center">
        {[
          { icon: Mic, label: "Audio Analysis", sub: "44.1kHz acoustic scan" },
          { icon: Video, label: "Video Processing", sub: "Gemini native multimodal" },
          { icon: ShieldCheck, label: "Safety Verified", sub: "RAG knowledge moat" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <Icon className="w-5 h-5 text-slate-400 mx-auto mb-2" />
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

  const handleStart = (p: Phase) => {
    setPhase(p);
  };

  const handleReset = () => setPhase("upload");

  if (phase === "upload") {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Listen & Fix</span>
            <Badge variant="secondary" className="text-[10px] ml-1">Beta</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            <span>Safety-First Diagnostics</span>
          </div>
        </header>
        <UploadScreen onStart={handleStart} />
      </div>
    );
  }

  const diagnosisId = "b4e2f7a1-3c9d";
  const isLethal = phase === "lethal";
  const showLock = !isLethal && !isVerified;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">Listen & Fix</span>
          <span className="text-slate-300 mx-2">|</span>
          <span className="text-xs font-mono text-slate-400">Case #{diagnosisId}</span>
        </div>
        <div className="flex items-center gap-4">
          {!isLethal && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-28 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-slate-400 font-mono w-8">{progress}%</span>
            </div>
          )}
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
            New Diagnosis
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-12 gap-6">
        <div className="col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className={`w-3.5 h-3.5 ${isLethal ? "text-red-400" : "text-cyan-400 animate-pulse"}`} />
                <span className="font-mono text-xs text-slate-300 uppercase tracking-wider">Live Observation Stream</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLethal ? "bg-red-500" : status === "completed" ? "bg-green-500" : "bg-cyan-500"}`} />
                <span className="text-[10px] font-mono text-slate-500 uppercase">
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
                <ShieldCheck className="w-3 h-3" />
                Safety Status
              </p>
              <div className="space-y-2.5">
                {[
                  { label: "Acoustic Analysis", done: progress > 25 },
                  { label: "Knowledge Moat RAG", done: progress > 55 },
                  { label: "Hazard Registry Check", done: progress > 75 },
                  { label: "Safety Checksum", done: isVerified },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-green-100" : "bg-slate-100"}`}>
                      {done ? (
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <span className={`text-xs ${done ? "text-slate-700 font-medium" : "text-slate-400"}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLethal && (
            <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <p className="text-xs font-bold text-red-300 uppercase tracking-wide">Hazard Detected</p>
              </div>
              <p className="text-xs text-red-200/70 leading-relaxed">
                Microwave capacitor identified. Stored charge: up to <strong className="text-red-300">2,100V</strong> even when unplugged. Kill-switch activated.
              </p>
            </div>
          )}
        </div>

        <div className="col-span-8">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-slate-900">Diagnostic Report</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isLethal
                ? "Microwave — Audio / Video Analysis"
                : "Samsung Dryer DV42H — Audio Analysis"}
            </p>
          </div>

          <div className="relative">
            {showLock && <SafetyLock status={status} safetyAlert={safetyAlert} />}
            <div className={showLock ? "blur-md pointer-events-none select-none" : ""}>
              {isLethal ? <LethalPivot /> : <DiagnosisResult />}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-indeterminate {
          0% { width: 20%; transform: translateX(-50%); }
          50% { width: 60%; }
          100% { width: 20%; transform: translateX(500%); }
        }
      `}</style>
    </div>
  );
}
