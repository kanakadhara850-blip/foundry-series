// src/lib/auth.js
//
// Thin wrapper around Firebase Auth (email/password) used to gate the
// /admin dashboard. Admin accounts are created manually in the
// Firebase Console -> Authentication -> Users tab — there is no public
// sign-up flow, which is intentional.

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

export function loginAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutAdmin() {
  return signOut(auth);
}

/** Subscribes to auth state; callback receives the Firebase User or null. */
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
