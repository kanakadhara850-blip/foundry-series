"use client";
// src/hooks/useCountdown.js
//
// Drives every time-based behavior on the event page: which mode the
// page is in (pre-start / live / final-five / ended), and the
// formatted time remaining for whichever boundary is next.
//
// Firestore Timestamps, JS Date objects, and millis numbers are all
// accepted for startTime/endTime so this hook works whether data came
// straight from Firestore or from a plain seed object.

import { useEffect, useRef, useState } from "react";

const FINAL_FIVE_MS = 5 * 60 * 1000;

function toMillis(value) {
  if (!value) return null;
  if (typeof value === "number") return value;
  if (value instanceof Date) return value.getTime();
  if (typeof value.toMillis === "function") return value.toMillis(); // Firestore Timestamp
  if (typeof value === "string") return new Date(value).getTime();
  return null;
}

function formatDuration(ms) {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalSeconds };
}

/**
 * @param {number|Date|object} startTime
 * @param {number|Date|object} endTime
 * @returns {{
 *   mode: "loading"|"pre-start"|"live"|"final-five"|"ended",
 *   targetLabel: string,
 *   time: {days,hours,minutes,seconds,totalSeconds},
 *   now: number
 * }}
 */
export function useCountdown(startTime, endTime) {
  const startMs = toMillis(startTime);
  const endMs = toMillis(endTime);
  const [now, setNow] = useState(() => Date.now());
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (!startMs || !endMs) {
    return { mode: "loading", targetLabel: "", time: formatDuration(0), now };
  }

  if (now < startMs) {
    return {
      mode: "pre-start",
      targetLabel: "Event Starts In",
      time: formatDuration(startMs - now),
      now,
    };
  }

  if (now >= endMs) {
    return {
      mode: "ended",
      targetLabel: "Time's Up",
      time: formatDuration(0),
      now,
    };
  }

  const remaining = endMs - now;
  if (remaining <= FINAL_FIVE_MS) {
    return {
      mode: "final-five",
      targetLabel: "Final 5 Minutes",
      time: formatDuration(remaining),
      now,
    };
  }

  return {
    mode: "live",
    targetLabel: "Competition Time Remaining",
    time: formatDuration(remaining),
    now,
  };
}
