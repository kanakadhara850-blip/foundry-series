"use client";
// src/components/TimerPanel.jsx
//
// The sticky right-hand "Competition Timer Panel" described in the
// brief. Pure composition of CountdownDisplay + StatusBadge + Buzzer,
// driven by the mode/time coming from useCountdown in the parent.

import GlassCard from "./GlassCard";
import StatusBadge from "./StatusBadge";
import CountdownDisplay from "./CountdownDisplay";
import Buzzer from "./Buzzer";

export default function TimerPanel({ mode, time, eventTitle }) {
  return (
    <div className="lg:sticky lg:top-6">
      <GlassCard active={mode === "live" || mode === "final-five"} className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 mb-1">
          {eventTitle}
        </p>
        <StatusBadge mode={mode} />

        <div className="mt-5">
          <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-2">
            {mode === "pre-start" && "Event Starts In"}
            {mode === "live" && "Competition Time Remaining"}
            {mode === "final-five" && "Final 5 Minutes"}
            {mode === "ended" && "Status"}
            {mode === "loading" && "Syncing Mission Clock…"}
          </p>
          <CountdownDisplay time={time} mode={mode} />
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 text-left space-y-1.5">
          <Row label="Dataset Access" locked={mode === "pre-start"} />
          <Row label="Submissions" locked={mode === "pre-start" || mode === "ended"} disabledWhenEnded={mode === "ended"} />
        </div>
      </GlassCard>

      <Buzzer active={mode === "ended"} />
    </div>
  );
}

function Row({ label, locked, disabledWhenEnded }) {
  const state = disabledWhenEnded ? "CLOSED" : locked ? "LOCKED" : "OPEN";
  const color = disabledWhenEnded
    ? "text-danger"
    : locked
    ? "text-white/40"
    : "text-neon-bright";
  return (
    <div className="flex items-center justify-between font-mono text-xs">
      <span className="text-white/50">{label}</span>
      <span className={color}>{state}</span>
    </div>
  );
}
