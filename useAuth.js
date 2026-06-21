"use client";
// src/hooks/useAuth.js
//
// Client-side hook that exposes the current admin auth state. Used by
// the /admin page to decide whether to show the login form or the
// dashboard, and to redirect on logout.

import { useEffect, useState } from "react";
import { watchAuthState } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = still loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = watchAuthState((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
