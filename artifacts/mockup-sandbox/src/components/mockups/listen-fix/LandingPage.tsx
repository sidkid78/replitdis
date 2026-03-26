import React, { useState, useEffect } from "react";
import { 
  Activity, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Wrench, 
  Upload, 
  CheckCircle2, 
  Cpu, 
  Database, 
  AlertOctagon, 
  Search, 
  BookOpen, 
  Star,
  ChevronRight,
  ShieldAlert,
  Link2,
  FileCheck,
  PhoneCall,
  Zap,
  HardDrive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const FAKE_STREAM_LINES = [
  "> INITIALIZING MULTIMODAL PIPELINE...",
  "> PROCESSING AUDIO SIGNATURE: 44.1kHz...",
  "> ⚠️ ANOMALY DETECTED: 400Hz METALLIC GRINDING",
  "> CROSS-REFERENCING OEM KNOWLEDGE BASE...",
  "> MATCH: SAMSUNG DRYER BEARING ASSEMBLY (0.94 CONFIDENCE)",
  "> INITIATING DETERMINISTIC SAFETY CHECKSUM...",
  "> SAFETY SCAN: PASSED (NO HIGH-VOLTAGE HAZARD DETECTED)",
  "> DECRYPTING REPAIR GUIDE...",
];

export function LandingPage() {
  const [heroLines, setHeroLines] = useState<string[]>([]);
  
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < FAKE_STREAM_LINES.length) {
        setHeroLines((prev) => [...prev, FAKE_STREAM_LINES[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-24 pb-32">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Listen & Fix</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl">
              <Badge variant="outline" className="mb-6 border-indigo-500/30 text-indigo-300 bg-indigo-500/10 px-3 py-1 text-xs">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse mr-2"></span>
                v2.0 Early Access Live
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                Your Appliance Speaks.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">We Translate.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light">
                Upload a video or audio clip. Get a safety-verified repair guide in under 120 seconds. AI-powered diagnostics built for zero liability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-0 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all">
                  Start Free Diagnosis <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" className="h-14 px-8 text-base font-semibold border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent">
                  See How It Works
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/50 py-1.5 px-3">
                  <Cpu className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                  Powered by Gemini 2.0 Flash
                </Badge>
              </div>
            </div>

            {/* Terminal Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl blur opacity-20 animate-pulse"></div>
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[400px]">
                <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <div className="ml-4 text-xs font-mono text-slate-500">observation-stream.sh</div>
                </div>
                <div className="p-6 font-mono text-sm flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                  {heroLines.filter(Boolean).map((line, i) => (
                    <div key={i} className={`mb-3 ${line.includes('⚠️') ? 'text-amber-400' : line.includes('PASSED') ? 'text-emerald-400' : 'text-cyan-400'} opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]`}>
                      {line}
                    </div>
                  ))}
                  {heroLines.length < FAKE_STREAM_LINES.length && (
                    <div className="w-2 h-4 bg-cyan-400 animate-pulse mt-2"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Trusted by 12,000+ homeowners
          </div>
          <div className="flex gap-8 items-center text-slate-400 font-bold text-xl opacity-60 grayscale filter">
            <span>iFixit</span>
            <span>NHTSA</span>
            <span>RepairClinic</span>
            <span>OEM Manuals</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800">4.9</span>
              <span className="text-sm text-slate-500">Average Rating</span>
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-bold">Zero Lethal Incidents</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Diagnosis in Three Steps</h2>
            <p className="text-slate-600 text-lg">No manuals to dig through. No guesswork. Just point, shoot, and fix.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-emerald-200 z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl border border-blue-100 flex items-center justify-center mb-6 relative group-hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute inset-0 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 absolute -top-2 -right-2 flex items-center justify-center font-bold border-2 border-white">1</div>
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Media</h3>
              <p className="text-slate-600 text-sm leading-relaxed px-4">
                Drag and drop a short video or audio clip of the sound or symptom. We handle any format.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl border border-indigo-100 flex items-center justify-center mb-6 relative group-hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute inset-0 rounded-full bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors"></div>
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 absolute -top-2 -right-2 flex items-center justify-center font-bold border-2 border-white">2</div>
                <Cpu className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI Analyzes</h3>
              <p className="text-slate-600 text-sm leading-relaxed px-4">
                Our multimodal engine cross-references the signature against 50,000+ indexed repair manuals.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl border border-emerald-100 flex items-center justify-center mb-6 relative group-hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute inset-0 rounded-full bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 absolute -top-2 -right-2 flex items-center justify-center font-bold border-2 border-white">3</div>
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Guide Unlocked</h3>
              <p className="text-slate-600 text-sm leading-relaxed px-4">
                Receive a step-by-step verified repair guide, but only after deterministic safety checks pass.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE DEMO PREVIEW */}
      <section className="py-24 bg-slate-900 text-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 mb-4 border border-indigo-500/30">Architecture</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Dual-Track System</h2>
            <p className="text-slate-400 text-lg">
              Speed means nothing without safety. Our AI identifies the problem instantly, while our deterministic logic gate holds the repair guide hostage until safety is guaranteed.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* LEFT: Terminal */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
              <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <span className="font-mono text-xs text-indigo-400 font-semibold tracking-wider uppercase flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" />
                  Track 1: Observation Stream
                </span>
              </div>
              <div className="p-6 font-mono text-xs text-slate-400 space-y-3 flex-1">
                <div className="flex gap-3"><span className="text-indigo-500">→</span><span>[14:02:11] Audio ingestion complete (3.2s clip)</span></div>
                <div className="flex gap-3"><span className="text-indigo-500">→</span><span>[14:02:11] Extracting FFT spectrogram...</span></div>
                <div className="flex gap-3"><span className="text-indigo-500">→</span><span className="text-cyan-400">Match found: Motor hum at 120Hz.</span></div>
                <div className="flex gap-3"><span className="text-indigo-500">→</span><span>[14:02:12] Querying RAG vector DB (N=50k docs)</span></div>
                <div className="flex gap-3"><span className="text-indigo-500">→</span><span>[14:02:12] Identified: Refrigerator Compressor Starter Relay</span></div>
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-800"><span className="text-amber-500 animate-pulse">!</span><span className="text-amber-500">Awaiting Track 2 Clearance...</span></div>
              </div>
            </div>

            {/* RIGHT: Blurred Repair Guide */}
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden relative shadow-2xl">
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <span className="font-sans text-xs text-slate-500 font-bold tracking-wider uppercase flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-slate-400" />
                  Track 2: Actionable Guide
                </span>
              </div>
              
              {/* Fake content, heavily blurred */}
              <div className="p-6 space-y-4 blur-[6px] opacity-40 pointer-events-none select-none">
                <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-4 w-full bg-slate-100 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                <div className="flex gap-4 mt-6">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-slate-200 rounded"></div>
                    <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Lock Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/5 backdrop-blur-sm z-10">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 max-w-xs text-center transform scale-100 animate-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Safety Verification in Progress</h4>
                  <p className="text-xs text-slate-500 mb-4">Unlocks automatically once our Knowledge Moat confirms the repair does not involve lethal hazards.</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-2/3 animate-pulse rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES GRID */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Enterprise-Grade Intelligence</h2>
            <p className="text-slate-600">Consumer simplicity backed by industrial-strength architecture.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Multimodal AI</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ingests audio signatures, video frames, and text simultaneously to form a complete diagnostic picture.
              </p>
            </Card>

            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">RAG Knowledge Moat</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Vector-indexed against 50,000+ OEM manuals, iFixit teardowns, and verified technician forums.
              </p>
            </Card>

            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Regex Kill-Switch</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hardcoded logical overrides prevent any dangerous instructions (e.g., microwave capacitors) from leaking.
              </p>
            </Card>

            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Safety Checksum</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every generated guide produces an immutable audit trail proving deterministic safety criteria were met.
              </p>
            </Card>

            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Parts Sourcing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Live price comparison and inventory checks across multiple vendors for the exact required components.
              </p>
            </Card>

            <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Professional Pivot</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automatically routes lethal or complex hazards to a curated list of licensed local technicians.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. SAFETY-FIRST SECTION */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider mb-6">
              <HardDrive className="w-3.5 h-3.5" />
              SHA-256 VERIFIED
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Built for Zero Liability.</h2>
            <p className="text-lg text-slate-400 font-light">
              LLMs hallucinate. Physics does not. Our architecture relies on deterministic logic gates, not probabilistic generation, to guarantee user safety.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-rose-400 mb-5" />
              <h3 className="text-xl font-bold mb-3 text-slate-200">Hazard Registry</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A hardcoded database of known lethal components (magnetrons, gas valves, high-voltage capacitors) that triggers an immediate blackout of DIY instructions.
              </p>
            </div>
            
            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl">
              <Link2 className="w-8 h-8 text-indigo-400 mb-5" />
              <h3 className="text-xl font-bold mb-3 text-slate-200">Immutable Ledger</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every diagnostic output is hashed and logged, creating a verifiable chain of custody that proves the system adhered strictly to OEM safety guidelines.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl">
              <AlertOctagon className="w-8 h-8 text-emerald-400 mb-5" />
              <h3 className="text-xl font-bold mb-3 text-slate-200">Kill-Switch Override</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                If the confidence score of the diagnosis falls below 0.90, the system automatically aborts the guide generation and recommends professional intervention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-600">Start diagnosing for free. Upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="p-8 border border-slate-200 bg-white flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <p className="text-sm text-slate-600 mb-8 h-10">Perfect for the occasional home repair.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 3 diagnoses per month
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Multimodal analysis
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Standard safety checks
                </li>
              </ul>
              
              <Button variant="outline" className="w-full">Get Started</Button>
            </Card>

            {/* Pro */}
            <Card className="p-8 border-2 border-indigo-500 bg-white shadow-xl relative flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$19</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <p className="text-sm text-slate-600 mb-8 h-10">For landlords, flippers, and heavy DIYers.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Unlimited diagnoses
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Live parts sourcing
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Priority processing
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Repair history saving
                </li>
              </ul>
              
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Start 7-Day Trial</Button>
            </Card>

            {/* Enterprise */}
            <Card className="p-8 border border-slate-200 bg-white flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Custom</span>
              </div>
              <p className="text-sm text-slate-600 mb-8 h-10">For warranty providers and parts retailers.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> API Access
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> White-label widget
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> Custom integrations
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> Dedicated support
                </li>
              </ul>
              
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* 8. CTA FOOTER */}
      <footer className="bg-slate-950 pt-24 pb-12 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Stop Guessing. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Start Fixing.</span></h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join 12,000+ homeowners using AI to diagnose appliance issues safely and accurately.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-20">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="h-12 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
            />
            <Button className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold whitespace-nowrap">
              Get Early Access
            </Button>
          </div>

          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold text-slate-400">Listen & Fix</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
            <p className="max-w-xl text-center md:text-right">
              Disclaimer: Listen & Fix provides educational diagnostic guidance. All repairs are undertaken at the user's own risk. High-voltage and gas appliances require licensed professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
