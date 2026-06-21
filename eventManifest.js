// src/lib/eventManifest.js
//
// This is NOT the live data source — Firestore is. This manifest is
// the canonical list of the 8 chapter slugs/titles used to:
//   1. Seed Firestore the first time (scripts/seedEvents.mjs)
//   2. Render the homepage grid even before/without a Firestore read
//   3. Generate QR code target URLs
//
// If you rename an event, update it here AND in Firestore (the admin
// dashboard edits Firestore directly; this file only matters at seed
// time and for the static homepage labels).

export const EVENT_MANIFEST = [
  {
    id: "data-blueprint",
    title: "The Data Blueprint",
    chapter: "Chapter I",
    type: "online",
  },
  {
    id: "signal-architect",
    title: "Signal Architect",
    chapter: "Chapter II",
    type: "online",
  },
  {
    id: "the-synthesis",
    title: "The Synthesis",
    chapter: "Chapter III",
    type: "online",
  },
  {
    id: "pareto-protocol",
    title: "Pareto Protocol",
    chapter: "Chapter IV",
    type: "online",
  },
  {
    id: "scrub-radius",
    title: "The Scrub Radius",
    chapter: "Chapter I",
    type: "offline",
  },
  {
    id: "pixel-strike",
    title: "Pixel Strike",
    chapter: "Chapter II",
    type: "offline",
  },
  {
    id: "kinetic-overload",
    title: "Kinetic Overload",
    chapter: "Chapter III",
    type: "offline",
  },
  {
    id: "omni-pareto",
    title: "Omni Pareto",
    chapter: "Chapter IV",
    type: "offline",
  },
];

export function getManifestEntry(slug) {
  return EVENT_MANIFEST.find((e) => e.id === slug) || null;
}
