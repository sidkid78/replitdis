const base = import.meta.env.BASE_URL;

export default function Slide1Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e" }}>
      <video
        src={`${base}animation-1.mp4`}
        poster={`${base}hero.png`}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.55 }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 60%, rgba(0,240,255,0.08) 100%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(0,240,255,0.06) 0%, transparent 60%)" }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #00f0ff, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #ff5f00, transparent)" }}
      />

      <div className="absolute inset-0 flex flex-col justify-center" style={{ paddingLeft: "8vw", paddingRight: "8vw" }}>
        <div
          className="uppercase tracking-widest font-mono mb-6"
          style={{ fontSize: "1.1vw", color: "#00f0ff", letterSpacing: "0.25em" }}
        >
          Replit Build-a-thon 2026
        </div>

        <h1
          className="font-display font-bold leading-none tracking-tight"
          style={{ fontSize: "7.5vw", color: "#e5e2e1", lineHeight: 1.0 }}
        >
          Listen
          <span style={{ color: "#00f0ff" }}> &</span>
          <br />
          Fix
        </h1>

        <div
          className="mt-6"
          style={{ width: "6vw", height: "3px", background: "linear-gradient(to right, #ff5f00, transparent)" }}
        />

        <p
          className="font-display mt-6"
          style={{ fontSize: "2vw", color: "#b9cacb", maxWidth: "42vw", lineHeight: 1.5 }}
        >
          AI-powered mechanical diagnostics. From sound to solution in 60 seconds.
        </p>

        <div className="mt-10 flex items-center gap-6">
          <div style={{ width: "1px", height: "4vh", background: "#00f0ff" }} />
          <span className="font-mono" style={{ fontSize: "1.2vw", color: "#849495" }}>
            Multimodal AI &mdash; Safety-First Protocol &mdash; Repair Intelligence
          </span>
        </div>
      </div>

      <div
        className="absolute bottom-10 right-10 font-mono text-right"
        style={{ fontSize: "1vw", color: "#849495" }}
      >
        <div style={{ color: "#00f0ff" }}>LISTEN&amp;FIX</div>
        <div style={{ fontSize: "0.9vw", opacity: 0.5 }}>v1.0 &mdash; 2026</div>
      </div>
    </div>
  );
}
