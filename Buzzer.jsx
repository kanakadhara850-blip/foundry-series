"use client";
// src/components/Buzzer.jsx
//
// Fires exactly once when the event transitions into "ended" mode:
// plays a synthesized buzzer tone (Web Audio API — no audio file
// needed, so there's nothing to host or fail to load) and flashes a
// full-screen red warning overlay for a moment.
//
// Synthesized rather than an <audio> file because (a) it keeps the
// repo asset-free and (b) avoids browser autoplay-policy issues with
// pre-loaded audio elements; an AudioContext created from a real user
// interaction earlier in the session (e.g. clicking into the page)
// is allowed to play.

import { useEffect, useRef, useState } from "react";

export default function Buzzer({ active }) {
  const firedRef = useRef(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!active || firedRef.current) return;
    firedRef.current = true;
    setFlash(true);

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      // Three short buzzer pulses, classic "time's up" pattern.
      playTone(440, 0, 0.35);
      playTone(440, 0.45, 0.35);
      playTone(440, 0.9, 0.6);
    } catch (e) {
      // Audio is a nice-to-have; never block the ended-state UI on it.
      console.warn("Buzzer audio unavailable:", e);
    }

    const t = setTimeout(() => setFlash(false), 1800);
    return () => clearTimeout(t);
  }, [active]);

  if (!flash) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none bg-danger/15 animate-pulse-glow" />
  );
}
