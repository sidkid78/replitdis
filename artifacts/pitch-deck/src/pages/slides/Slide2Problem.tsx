export default function Slide2Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e" }}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(255,95,0,0.07) 0%, transparent 55%)" }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #ff5f00, transparent)" }}
      />

      <div className="absolute inset-0 flex flex-col justify-center" style={{ paddingLeft: "8vw", paddingRight: "8vw" }}>
        <div
          className="uppercase tracking-widest font-mono mb-4"
          style={{ fontSize: "1vw", color: "#ff5f00", letterSpacing: "0.2em" }}
        >
          The Problem
        </div>

        <h2
          className="font-display font-bold tracking-tight"
          style={{ fontSize: "4.5vw", color: "#e5e2e1", lineHeight: 1.1 }}
        >
          Equipment breaks. Diagnosis<br />
          <span style={{ color: "#ff5f00" }}>takes too long.</span>
        </h2>

        <div
          className="mt-6 mb-10"
          style={{ width: "5vw", height: "2px", background: "linear-gradient(to right, #ff5f00, transparent)" }}
        />

        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr 1fr", maxWidth: "84vw" }}>
          <div
            style={{ background: "#1c1b1b", borderLeft: "3px solid #ff5f00", padding: "3vh 2vw", borderRadius: "2px" }}
          >
            <div
              className="font-display font-bold"
              style={{ fontSize: "3.5vw", color: "#ff5f00", lineHeight: 1 }}
            >
              $50K
            </div>
            <div
              className="font-mono mt-2"
              style={{ fontSize: "1.1vw", color: "#849495", lineHeight: 1.5 }}
            >
              Average cost per unplanned industrial downtime incident
            </div>
          </div>

          <div
            style={{ background: "#1c1b1b", borderLeft: "3px solid #ff5f00", padding: "3vh 2vw", borderRadius: "2px" }}
          >
            <div
              className="font-display font-bold"
              style={{ fontSize: "3.5vw", color: "#ff5f00", lineHeight: 1 }}
            >
              4+ hrs
            </div>
            <div
              className="font-mono mt-2"
              style={{ fontSize: "1.1vw", color: "#849495", lineHeight: 1.5 }}
            >
              Typical wait time for a qualified technician to identify the root cause
            </div>
          </div>

          <div
            style={{ background: "#1c1b1b", borderLeft: "3px solid #ff5f00", padding: "3vh 2vw", borderRadius: "2px" }}
          >
            <div
              className="font-display font-bold"
              style={{ fontSize: "3.5vw", color: "#ff5f00", lineHeight: 1 }}
            >
              60%
            </div>
            <div
              className="font-mono mt-2"
              style={{ fontSize: "1.1vw", color: "#849495", lineHeight: 1.5 }}
            >
              Of repairs are misdiagnosed on the first attempt, causing repeat visits
            </div>
          </div>
        </div>

        <p
          className="font-display mt-8"
          style={{ fontSize: "1.6vw", color: "#849495", maxWidth: "60vw", lineHeight: 1.6 }}
        >
          Technicians rely on intuition, noisy environments make audio cues hard to interpret, and OEM manuals are buried in filing cabinets or inaccessible PDFs. The result: expensive guesswork.
        </p>
      </div>

      <div
        className="absolute bottom-8 right-8 font-mono"
        style={{ fontSize: "0.9vw", color: "#333" }}
      >
        02 / 07
      </div>
    </div>
  );
}
