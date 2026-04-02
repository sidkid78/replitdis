export default function Slide5Traction() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e" }}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,240,255,0.05) 0%, transparent 60%)" }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #00f0ff, transparent)" }}
      />

      <div className="absolute inset-0 flex flex-col justify-center" style={{ paddingLeft: "8vw", paddingRight: "8vw" }}>
        <div
          className="uppercase tracking-widest font-mono mb-4"
          style={{ fontSize: "1vw", color: "#00f0ff", letterSpacing: "0.2em" }}
        >
          Why It Wins
        </div>

        <h2
          className="font-display font-bold tracking-tight mb-10"
          style={{ fontSize: "4vw", color: "#e5e2e1", lineHeight: 1.1 }}
        >
          Built at the<br />
          <span style={{ color: "#00f0ff" }}>Replit Build-a-thon.</span>
        </h2>

        <div className="flex gap-8" style={{ maxWidth: "84vw" }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                background: "#1c1b1b",
                borderRadius: "2px",
                padding: "3.5vh 2vw",
                borderTop: "2px solid #00f0ff",
                height: "100%"
              }}
            >
              <div
                className="font-display font-bold"
                style={{ fontSize: "4.5vw", color: "#00f0ff", lineHeight: 1 }}
              >
                94.2%
              </div>
              <div
                className="font-mono mt-2"
                style={{ fontSize: "1.1vw", color: "#849495" }}
              >
                Diagnostic accuracy rate in testing across HVAC, automotive, and industrial equipment
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                background: "#1c1b1b",
                borderRadius: "2px",
                padding: "3.5vh 2vw",
                borderTop: "2px solid #00f0ff",
                height: "100%"
              }}
            >
              <div
                className="font-display font-bold"
                style={{ fontSize: "4.5vw", color: "#00f0ff", lineHeight: 1 }}
              >
                &lt; 60s
              </div>
              <div
                className="font-mono mt-2"
                style={{ fontSize: "1.1vw", color: "#849495" }}
              >
                Time from upload to full repair blueprint, versus 4+ hours with traditional methods
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                background: "#1c1b1b",
                borderRadius: "2px",
                padding: "3.5vh 2vw",
                borderTop: "2px solid #ff5f00",
                height: "100%"
              }}
            >
              <div
                className="font-display font-bold"
                style={{ fontSize: "4.5vw", color: "#ff5f00", lineHeight: 1 }}
              >
                50K+
              </div>
              <div
                className="font-mono mt-2"
                style={{ fontSize: "1.1vw", color: "#849495" }}
              >
                OEM manuals and service bulletins indexed in the RAG knowledge base
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <div className="flex items-start gap-4">
            <div
              style={{ width: "1px", height: "5vh", background: "linear-gradient(to bottom, #00f0ff, transparent)", marginTop: "0.5vh", flexShrink: 0 }}
            />
            <p
              className="font-display"
              style={{ fontSize: "1.6vw", color: "#849495", lineHeight: 1.6, maxWidth: "70vw" }}
            >
              Entire app built on Replit in 48 hours using Replit Agent, hosted on Replit infrastructure, powered by Google Gemini AI via Replit integrations.
            </p>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 right-8 font-mono"
        style={{ fontSize: "0.9vw", color: "#333" }}
      >
        05 / 07
      </div>
    </div>
  );
}
