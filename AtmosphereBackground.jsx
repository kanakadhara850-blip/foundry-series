// src/components/AtmosphereBackground.jsx
//
// Pure-CSS/SVG ambient background: drifting fog, floating data
// particles, and a scanline overlay. Rendered once in the root
// layout so it sits behind every route without re-mounting on
// navigation (it lives in layout.js, outside {children}).

export default function AtmosphereBackground() {
  // Particle positions/durations are deterministic (not Math.random on
  // every render) so server and client markup match and there's no
  // hydration warning.
  const particles = [
    { left: "5%", delay: "0s", dur: "18s" },
    { left: "15%", delay: "3s", dur: "22s" },
    { left: "27%", delay: "1s", dur: "20s" },
    { left: "39%", delay: "6s", dur: "26s" },
    { left: "48%", delay: "2s", dur: "19s" },
    { left: "58%", delay: "5s", dur: "24s" },
    { left: "67%", delay: "0.5s", dur: "21s" },
    { left: "76%", delay: "4s", dur: "23s" },
    { left: "85%", delay: "2.5s", dur: "20s" },
    { left: "93%", delay: "7s", dur: "25s" },
  ];

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-void" />
      <div className="fog-layer">
        <div className="fog-blob animate-drift-slow" />
      </div>
      <div className="particle-field">
        {particles.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: p.left,
              bottom: "-10px",
              animationDelay: p.delay,
              animationDuration: p.dur,
            }}
          />
        ))}
      </div>
      <div className="scanlines" />
    </>
  );
}
