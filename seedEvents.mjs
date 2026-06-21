// scripts/seedEvents.mjs
//
// Run once after creating your Firebase project to populate the
// `events` collection with all 8 chapters from eventManifest, with
// placeholder copy and start/end times you can edit afterward in
// /admin (or by re-running this script).
//
// Usage:
//   1. Generate a service account key: Firebase Console -> Project
//      Settings -> Service Accounts -> Generate new private key.
//   2. Put the whole JSON (minified, one line) into FIREBASE_SERVICE_ACCOUNT_JSON
//      in .env.local — or just paste the path to the file below.
//   3. node scripts/seedEvents.mjs

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import fs from "fs";

const manifest = [
  { id: "data-blueprint", title: "The Data Blueprint", chapter: "Chapter I", type: "online" },
  { id: "signal-architect", title: "Signal Architect", chapter: "Chapter II", type: "online" },
  { id: "the-synthesis", title: "The Synthesis", chapter: "Chapter III", type: "online" },
  { id: "pareto-protocol", title: "Pareto Protocol", chapter: "Chapter IV", type: "online" },
  { id: "scrub-radius", title: "The Scrub Radius", chapter: "Chapter I", type: "offline" },
  { id: "pixel-strike", title: "Pixel Strike", chapter: "Chapter II", type: "offline" },
  { id: "kinetic-overload", title: "Kinetic Overload", chapter: "Chapter III", type: "offline" },
  { id: "omni-pareto", title: "Omni Pareto", chapter: "Chapter IV", type: "offline" },
];

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) return JSON.parse(raw);
  // Fallback: a local file named serviceAccountKey.json (gitignored)
  const path = "./serviceAccountKey.json";
  if (fs.existsSync(path)) return JSON.parse(fs.readFileSync(path, "utf-8"));
  throw new Error(
    "No service account found. Set FIREBASE_SERVICE_ACCOUNT_JSON or add ./serviceAccountKey.json"
  );
}

const app = initializeApp({ credential: cert(loadServiceAccount()) });
const db = getFirestore(app);

async function seed() {
  const now = Date.now();
  for (const ev of manifest) {
    const ref = db.collection("events").doc(ev.id);
    const existing = await ref.get();
    if (existing.exists) {
      console.log(`↷ Skipping ${ev.id} (already exists)`);
      continue;
    }
    await ref.set({
      id: ev.id,
      title: ev.title,
      chapter: ev.chapter,
      type: ev.type,
      description: `Placeholder description for ${ev.title}. Edit in /admin.`,
      problemStatement: "Problem statement will be published here at start time.",
      rules: ["Rule 1: Edit me in the admin dashboard.", "Rule 2: Add more rules as needed."],
      datasetUrl: "",
      submissionUrl: "",
      startTime: Timestamp.fromMillis(now + 24 * 3600 * 1000),
      endTime: Timestamp.fromMillis(now + 26 * 3600 * 1000),
      announcements: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log(`✓ Seeded ${ev.id}`);
  }
  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
