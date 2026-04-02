export default function Slide6Vision() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e" }}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(0,240,255,0.07) 0%, transparent 55%)" }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #00f0ff, transparent)" }}
      />

      <div className="absolute inset-0 flex" style={{ padding: "7vh 8vw" }}>
        <div className="flex flex-col justify-center" style={{ width: "52%" }}>
          <div
            className="uppercase tracking-widest font-mono mb-4"
            style={{ fontSize: "1vw", color: "#00f0ff", letterSpacing: "0.2em" }}
          >
            Vision
          </div>

          <h2
            className="font-display font-bold tracking-tight"
            style={{ fontSize: "4.5vw", color: "#e5e2e1", lineHeight: 1.1 }}
          >
            The operating system<br />
            <span style={{ color: "#00f0ff" }}>for the physical world.</span>
          </h2>

          <div
            className="mt-6 mb-8"
            style={{ width: "5vw", height: "2px", background: "linear-gradient(to right, #00f0ff, transparent)" }}
          />

          <p
            className="font-display"
            style={{ fontSize: "1.6vw", color: "#b9cacb", lineHeight: 1.7, maxWidth: "38vw" }}
          >
            Every machine that hums, vibrates, or whirs generates diagnostic data. Listen &amp; Fix turns that data into actionable intelligence for the technicians, engineers, and operators who keep the world running.
          </p>
        </div>

        <div className="flex flex-col justify-center" style={{ width: "48%", paddingLeft: "6vw" }}>
          <div className="flex flex-col gap-5">
            <div
              style={{
                background: "#131313",
                border: "1px solid #1e1e1e",
                borderLeft: "3px solid #00f0ff",
                padding: "2.5vh 2vw",
                borderRadius: "2px"
              }}
            >
              <div className="font-display font-bold" style={{ fontSize: "1.5vw", color: "#e5e2e1", marginBottom: "0.8vh" }}>
                Enterprise Fleet Management
              </div>
              <div className="font-mono" style={{ fontSize: "1vw", color: "#849495", lineHeight: 1.5 }}>
                Connect entire equipment fleets. Predictive maintenance before failure occurs.
              </div>
            </div>

            <div
              style={{
                background: "#131313",
                border: "1px solid #1e1e1e",
                borderLeft: "3px solid #00f0ff",
                padding: "2.5vh 2vw",
                borderRadius: "2px"
              }}
            >
              <div className="font-display font-bold" style={{ fontSize: "1.5vw", color: "#e5e2e1", marginBottom: "0.8vh" }}>
                Insurance Integration
              </div>
              <div className="font-mono" style={{ fontSize: "1vw", color: "#849495", lineHeight: 1.5 }}>
                Verified repair logs and audit trails that reduce claims fraud and processing time.
              </div>
            </div>

            <div
              style={{
                background: "#131313",
                border: "1px solid #1e1e1e",
                borderLeft: "3px solid #ff5f00",
                padding: "2.5vh 2vw",
                borderRadius: "2px"
              }}
            >
              <div className="font-display font-bold" style={{ fontSize: "1.5vw", color: "#e5e2e1", marginBottom: "0.8vh" }}>
                OEM Partnership Network
              </div>
              <div className="font-mono" style={{ fontSize: "1vw", color: "#849495", lineHeight: 1.5 }}>
                White-label the diagnostic engine directly into manufacturer apps and portals.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 right-8 font-mono"
        style={{ fontSize: "0.9vw", color: "#333" }}
      >
        06 / 07
      </div>
    </div>
  );
}
