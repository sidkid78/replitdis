export default function Slide3Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e" }}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 15% 80%, rgba(0,240,255,0.06) 0%, transparent 55%)" }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #00f0ff, transparent)" }}
      />

      <div className="absolute inset-0 flex" style={{ padding: "7vh 8vw" }}>
        <div className="flex flex-col justify-center" style={{ width: "50%" }}>
          <div
            className="uppercase tracking-widest font-mono mb-4"
            style={{ fontSize: "1vw", color: "#00f0ff", letterSpacing: "0.2em" }}
          >
            The Solution
          </div>

          <h2
            className="font-display font-bold tracking-tight"
            style={{ fontSize: "4vw", color: "#e5e2e1", lineHeight: 1.1 }}
          >
            Your AI Foreman,
            <br />
            <span style={{ color: "#00f0ff" }}>on demand.</span>
          </h2>

          <div
            className="mt-5 mb-8"
            style={{ width: "5vw", height: "2px", background: "linear-gradient(to right, #00f0ff, transparent)" }}
          />

          <p
            className="font-display"
            style={{ fontSize: "1.6vw", color: "#b9cacb", lineHeight: 1.7, maxWidth: "36vw" }}
          >
            Listen &amp; Fix uses multimodal AI to analyze acoustic signatures and visual telemetry from any mechanical equipment, then delivers a precision repair blueprint in under 60 seconds.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div style={{ width: "8px", height: "8px", background: "#00f0ff", borderRadius: "50%", flexShrink: 0 }} />
              <span className="font-display" style={{ fontSize: "1.5vw", color: "#e5e2e1" }}>
                Upload audio or video of the fault
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div style={{ width: "8px", height: "8px", background: "#00f0ff", borderRadius: "50%", flexShrink: 0 }} />
              <span className="font-display" style={{ fontSize: "1.5vw", color: "#e5e2e1" }}>
                AI runs a 6-stage diagnostic pipeline
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div style={{ width: "8px", height: "8px", background: "#00f0ff", borderRadius: "50%", flexShrink: 0 }} />
              <span className="font-display" style={{ fontSize: "1.5vw", color: "#e5e2e1" }}>
                Receive step-by-step repair guide with parts
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-end" style={{ width: "50%", paddingLeft: "4vw" }}>
          <div
            style={{
              background: "#131313",
              border: "1px solid #1e1e1e",
              borderRadius: "4px",
              padding: "3vh 2.5vw",
              width: "100%",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(to right, #00f0ff, #00b8c8, transparent)"
              }}
            />
            <div
              className="font-mono mb-6"
              style={{ fontSize: "0.9vw", color: "#00f0ff", letterSpacing: "0.15em" }}
            >
              DIAGNOSTIC PIPELINE
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="font-mono"
                  style={{ fontSize: "0.85vw", color: "#00f0ff", width: "1.8vw", textAlign: "center" }}
                >
                  01
                </div>
                <div style={{ flex: 1, height: "1px", background: "#1e1e1e" }} />
                <div className="font-mono" style={{ fontSize: "0.9vw", color: "#b9cacb" }}>
                  Acoustic Signature Capture
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="font-mono"
                  style={{ fontSize: "0.85vw", color: "#00f0ff", width: "1.8vw", textAlign: "center" }}
                >
                  02
                </div>
                <div style={{ flex: 1, height: "1px", background: "#1e1e1e" }} />
                <div className="font-mono" style={{ fontSize: "0.9vw", color: "#b9cacb" }}>
                  Visual Telemetry Analysis
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="font-mono"
                  style={{ fontSize: "0.85vw", color: "#00f0ff", width: "1.8vw", textAlign: "center" }}
                >
                  03
                </div>
                <div style={{ flex: 1, height: "1px", background: "#1e1e1e" }} />
                <div className="font-mono" style={{ fontSize: "0.9vw", color: "#b9cacb" }}>
                  Safety Checksum Scan
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="font-mono"
                  style={{ fontSize: "0.85vw", color: "#00f0ff", width: "1.8vw", textAlign: "center" }}
                >
                  04
                </div>
                <div style={{ flex: 1, height: "1px", background: "#1e1e1e" }} />
                <div className="font-mono" style={{ fontSize: "0.9vw", color: "#b9cacb" }}>
                  RAG Knowledge Base Query
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="font-mono"
                  style={{ fontSize: "0.85vw", color: "#00f0ff", width: "1.8vw", textAlign: "center" }}
                >
                  05
                </div>
                <div style={{ flex: 1, height: "1px", background: "#1e1e1e" }} />
                <div className="font-mono" style={{ fontSize: "0.9vw", color: "#b9cacb" }}>
                  Precision Repair Blueprint
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="font-mono"
                  style={{ fontSize: "0.85vw", color: "#00f0ff", width: "1.8vw", textAlign: "center" }}
                >
                  06
                </div>
                <div style={{ flex: 1, height: "1px", background: "#1e1e1e" }} />
                <div className="font-mono" style={{ fontSize: "0.9vw", color: "#b9cacb" }}>
                  Parts Sourcing Hub
                </div>
              </div>
            </div>

            <div
              className="mt-6 font-mono text-center"
              style={{ fontSize: "0.85vw", color: "#849495", borderTop: "1px solid #1e1e1e", paddingTop: "2vh" }}
            >
              Total runtime: &lt; 60 seconds
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 right-8 font-mono"
        style={{ fontSize: "0.9vw", color: "#333" }}
      >
        03 / 07
      </div>
    </div>
  );
}
