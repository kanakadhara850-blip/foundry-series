// src/lib/events.js
//
// All Firestore read/write operations for the `events` collection live
// here so components never call Firestore directly. Keeping this in
// one file makes the schema easy to audit and change.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  arrayUnion,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const EVENTS_COLLECTION = "events";

/**
 * Firestore document shape for a single event (see SCHEMA.md):
 * {
 *   id: string,                // also the doc id == slug
 *   title: string,
 *   chapter: string,           // e.g. "Chapter I"
 *   type: "online" | "offline",
 *   description: string,
 *   problemStatement: string,
 *   rules: string[],
 *   datasetUrl: string,
 *   submissionUrl: string,
 *   startTime: Timestamp,
 *   endTime: Timestamp,
 *   announcements: { text: string, postedAt: Timestamp }[],
 *   createdAt: Timestamp,
 *   updatedAt: Timestamp,
 * }
 */

// ---------- READ ----------

export async function getAllEvents() {
  const snap = await getDocs(collection(db, EVENTS_COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getEventBySlug(slug) {
  const ref = doc(db, EVENTS_COLLECTION, slug);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getEventsByType(type) {
  const q = query(collection(db, EVENTS_COLLECTION), where("type", "==", type));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Subscribes to a single event document in real time. This is what
 * powers live announcements / admin edits appearing on the participant
 * screen with no refresh. Returns the unsubscribe function — caller
 * MUST call it on cleanup (e.g. inside useEffect's return).
 */
export function subscribeToEvent(slug, callback) {
  const ref = doc(db, EVENTS_COLLECTION, slug);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
    else callback(null);
  });
}

/** Real-time subscription to all events, used by the admin dashboard. */
export function subscribeToAllEvents(callback) {
  return onSnapshot(collection(db, EVENTS_COLLECTION), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

// ---------- WRITE ----------

/**
 * Creates or fully overwrites an event document. `slug` is used as the
 * document id directly (e.g. "scrub-radius"), which is what makes
 * /event/[slug] -> Firestore lookups a single getDoc call.
 */
export async function upsertEvent(slug, data) {
  const ref = doc(db, EVENTS_COLLECTION, slug);
  const existing = await getDoc(ref);
  const payload = {
    ...data,
    id: slug,
    updatedAt: serverTimestamp(),
    createdAt: existing.exists() ? existing.data().createdAt : serverTimestamp(),
  };
  await setDoc(ref, payload, { merge: true });
  return slug;
}

export async function updateEventFields(slug, fields) {
  const ref = doc(db, EVENTS_COLLECTION, slug);
  await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() });
}

export async function deleteEvent(slug) {
  await deleteDoc(doc(db, EVENTS_COLLECTION, slug));
}

/**
 * Appends a new announcement without overwriting existing ones.
 * arrayUnion is atomic at the Firestore level, so concurrent admin
 * posts never clobber each other.
 */
export async function postAnnouncement(slug, text) {
  const ref = doc(db, EVENTS_COLLECTION, slug);
  await updateDoc(ref, {
    announcements: arrayUnion({
      text,
      // arrayUnion can't contain serverTimestamp(), so we store a
      // client-generated millis timestamp instead — fine for display
      // ordering, which is all this is used for.
      postedAt: Timestamp.now(),
    }),
    updatedAt: serverTimestamp(),
  });
}

export async function setSubmissionUrl(slug, url) {
  await updateEventFields(slug, { submissionUrl: url });
}

export async function setDatasetUrl(slug, url) {
  await updateEventFields(slug, { datasetUrl: url });
}
