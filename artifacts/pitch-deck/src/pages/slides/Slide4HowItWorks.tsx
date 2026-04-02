const base = import.meta.env.BASE_URL;

export default function Slide4HowItWorks() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e" }}>
      <img
        src={`${base}mechanic-bg.png`}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Mechanical diagnostic background"
        style={{ opacity: 0.25 }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.3) 100%)" }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, #00f0ff, transparent)" }}
      />

      <div className="absolute inset-0 flex flex-col justify-center" style={{ paddingLeft: "8vw", paddingRight: "8vw" }}>
        <div
          className="uppercase tracking-widest font-mono mb-4"
          style={{ fontSize: "1vw", color: "#00f0ff", letterSpacing: "0.2em" }}
        >
          How It Works
        </div>

        <h2
          className="font-display font-bold tracking-tight mb-10"
          style={{ fontSize: "4vw", color: "#e5e2e1", lineHeight: 1.1 }}
        >
          Capture. Analyze. <span style={{ color: "#00f0ff" }}>Repair.</span>
        </h2>

        <div className="flex gap-0" style={{ maxWidth: "80vw" }}>
          <div className="flex flex-col items-center" style={{ width: "25%" }}>
            <div
              style={{
                width: "5.5vw",
                height: "5.5vw",
                border: "2px solid #00f0ff",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,240,255,0.05)",
                marginBottom: "2vh"
              }}
            >
              <span className="font-mono font-bold" style={{ fontSize: "2.5vw", color: "#00f0ff" }}>1</span>
            </div>
            <div className="font-display font-bold text-center" style={{ fontSize: "1.5vw", color: "#e5e2e1", marginBottom: "1vh" }}>
              Capture
            </div>
            <div className="font-mono text-center" style={{ fontSize: "1vw", color: "#849495", lineHeight: 1.6 }}>
              Upload audio, video, or photos of the faulty equipment
            </div>
          </div>

          <div className="flex items-center" style={{ width: "8.33%", paddingBottom: "5vh" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, #00f0ff44, #00f0ff44)" }} />
          </div>

          <div className="flex flex-col items-center" style={{ width: "25%" }}>
            <div
              style={{
                width: "5.5vw",
                height: "5.5vw",
                border: "2px solid #00f0ff",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,240,255,0.05)",
                marginBottom: "2vh"
              }}
            >
              <span className="font-mono font-bold" style={{ fontSize: "2.5vw", color: "#00f0ff" }}>2</span>
            </div>
            <div className="font-display font-bold text-center" style={{ fontSize: "1.5vw", color: "#e5e2e1", marginBottom: "1vh" }}>
              Analyze
            </div>
            <div className="font-mono text-center" style={{ fontSize: "1vw", color: "#849495", lineHeight: 1.6 }}>
              Gemini AI runs the 6-stage diagnostic pipeline in parallel
            </div>
          </div>

          <div className="flex items-center" style={{ width: "8.33%", paddingBottom: "5vh" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, #00f0ff44, #00f0ff44)" }} />
          </div>

          <div className="flex flex-col items-center" style={{ width: "25%" }}>
            <div
              style={{
                width: "5.5vw",
                height: "5.5vw",
                border: "2px solid #ff5f00",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,95,0,0.05)",
                marginBottom: "2vh"
              }}
            >
              <span className="font-mono font-bold" style={{ fontSize: "2.5vw", color: "#ff5f00" }}>3</span>
            </div>
            <div className="font-display font-bold text-center" style={{ fontSize: "1.5vw", color: "#e5e2e1", marginBottom: "1vh" }}>
              Repair
            </div>
            <div className="font-mono text-center" style={{ fontSize: "1vw", color: "#849495", lineHeight: 1.6 }}>
              Receive a step-by-step blueprint with tools, torque specs, and parts
            </div>
          </div>
        </div>

        <div
          className="mt-10 font-mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "1.5vw",
            background: "#131313",
            border: "1px solid #1e1e1e",
            borderLeft: "3px solid #00f0ff",
            padding: "1.5vh 2vw",
            borderRadius: "2px"
          }}
        >
          <span style={{ fontSize: "1vw", color: "#849495" }}>POWERED BY</span>
          <span style={{ fontSize: "1.1vw", color: "#00f0ff", letterSpacing: "0.05em" }}>Google Gemini AI</span>
          <div style={{ width: "1px", height: "2vh", background: "#2a2a2a" }} />
          <span style={{ fontSize: "1vw", color: "#849495" }}>50K+ OEM MANUALS INDEXED</span>
          <div style={{ width: "1px", height: "2vh", background: "#2a2a2a" }} />
          <span style={{ fontSize: "1vw", color: "#849495" }}>SAFETY-FIRST PROTOCOL</span>
        </div>
      </div>

      <div
        className="absolute bottom-8 right-8 font-mono"
        style={{ fontSize: "0.9vw", color: "#333" }}
      >
        04 / 07
      </div>
    </div>
  );
}
