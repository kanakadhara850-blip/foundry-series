"use client";
// src/components/CountdownDisplay.jsx
//
// Renders the big digital countdown numerals. Pure presentation —
// timing logic lives in useCountdown. Switches visual treatment based
// on `mode`: normal neon during pre-start/live, pulsing red during
// final-five, static red during ended.

import clsx from "clsx";

function Unit({ value, label, danger }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={clsx(
          "digit-tick font-display text-3xl md:text-4xl lg:text-5xl tabular-nums px-2 md:px-3 py-1 rounded-md border bg-black/50",
          danger
            ? "text-danger border-danger/50"
            : "text-neon border-neon/30"
        )}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1.5 text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/40">
        {label}
      </span>
    </div>
  );
}

export default function CountdownDisplay({ time, mode }) {
  const danger = mode === "final-five" || mode === "ended";

  if (mode === "ended") {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="font-display text-4xl md:text-5xl text-danger animate-pulse-glow rounded-md px-4 py-2">
          TIME&apos;S UP
        </div>
        <p className="text-white/50 text-sm font-mono">Redirecting to results hub…</p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-center gap-3 md:gap-4 py-2",
        mode === "final-five" && "animate-pulse-glow rounded-lg"
      )}
    >
      {time.days > 0 && <Unit value={time.days} label="Days" danger={danger} />}
      <Unit value={time.hours} label="Hrs" danger={danger} />
      <span className="font-display text-2xl text-white/20 -mt-4">:</span>
      <Unit value={time.minutes} label="Min" danger={danger} />
      <span className="font-display text-2xl text-white/20 -mt-4">:</span>
      <Unit value={time.seconds} label="Sec" danger={danger} />
    </div>
  );
}
