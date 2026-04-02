const base = import.meta.env.BASE_URL;

export default function Slide7Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e" }}>
      <img
        src={`${base}hero.png`}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Industrial control room"
        style={{ opacity: 0.2 }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 100%)" }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, #00f0ff, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #ff5f00, transparent)" }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ padding: "8vh 8vw" }}>
        <div
          className="uppercase tracking-widest font-mono mb-8"
          style={{ fontSize: "1vw", color: "#00f0ff", letterSpacing: "0.3em" }}
        >
          Built at Replit Build-a-thon 2026
        </div>

        <h1
          className="font-display font-bold tracking-tight"
          style={{ fontSize: "6.5vw", color: "#e5e2e1", lineHeight: 1.0 }}
        >
          Listen
          <span style={{ color: "#00f0ff" }}> &amp; </span>
          Fix
        </h1>

        <div
          className="mt-5"
          style={{ width: "8vw", height: "2px", background: "linear-gradient(to right, transparent, #00f0ff, transparent)", margin: "2vh auto" }}
        />

        <p
          className="font-display"
          style={{ fontSize: "2vw", color: "#b9cacb", marginTop: "2vh", maxWidth: "50vw", lineHeight: 1.5 }}
        >
          From sound to solution in 60 seconds.
        </p>

        <div
          className="mt-10 font-mono"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2vw",
            background: "#131313",
            border: "1px solid #1e1e1e",
            padding: "1.5vh 2.5vw",
            borderRadius: "2px"
          }}
        >
          <span style={{ fontSize: "1.1vw", color: "#00f0ff" }}>listenandfix.replit.app</span>
          <div style={{ width: "1px", height: "3vh", background: "#2a2a2a" }} />
          <span style={{ fontSize: "1.1vw", color: "#849495" }}>Replit Agent</span>
          <div style={{ width: "1px", height: "3vh", background: "#2a2a2a" }} />
          <span style={{ fontSize: "1.1vw", color: "#849495" }}>Google Gemini</span>
          <div style={{ width: "1px", height: "3vh", background: "#2a2a2a" }} />
          <span style={{ fontSize: "1.1vw", color: "#849495" }}>Replit PostgreSQL</span>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <div style={{ flex: 1, height: "1px", background: "#1e1e1e", width: "15vw" }} />
          <span className="font-mono" style={{ fontSize: "1vw", color: "#333" }}>
            The machines are talking. We built the ears.
          </span>
          <div style={{ flex: 1, height: "1px", background: "#1e1e1e", width: "15vw" }} />
        </div>
      </div>

      <div
        className="absolute bottom-8 right-8 font-mono"
        style={{ fontSize: "0.9vw", color: "#333" }}
      >
        07 / 07
      </div>
    </div>
  );
}
