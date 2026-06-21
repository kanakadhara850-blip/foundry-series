"use client";
// src/app/admin/page.js
//
// Gated by useAuth: shows AdminLoginForm until a Firebase Auth user
// is present, then shows the live dashboard (subscribeToAllEvents)
// listing all 8 chapters with edit access.

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { subscribeToAllEvents, upsertEvent } from "@/lib/events";
import { logoutAdmin } from "@/lib/auth";
import { EVENT_MANIFEST } from "@/lib/eventManifest";
import AdminLoginForm from "@/components/AdminLoginForm";
import AdminEventEditor from "@/components/AdminEventEditor";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import StatusBadge from "@/components/StatusBadge";

function deriveMode(ev) {
  if (!ev?.startTime || !ev?.endTime) return "loading";
  const start = ev.startTime.toMillis ? ev.startTime.toMillis() : ev.startTime;
  const end = ev.endTime.toMillis ? ev.endTime.toMillis() : ev.endTime;
  const now = Date.now();
  if (now < start) return "pre-start";
  if (now >= end) return "ended";
  if (end - now <= 5 * 60 * 1000) return "final-five";
  return "live";
}

export default function AdminPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [editingSlug, setEditingSlug] = useState(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubscribe = subscribeToAllEvents(setEvents);
    return () => unsubscribe();
  }, [isAuthenticated]);

  if (loading) return <CenteredText text="Verifying clearance…" />;
  if (!isAuthenticated) return <AdminLoginForm />;

  // Merge manifest with whatever already exists in Firestore so the
  // dashboard always shows all 8 chapters, even before first seed.
  const merged = EVENT_MANIFEST.map((m) => {
    const existing = events.find((e) => e.id === m.id);
    return existing || m;
  });

  async function handleInitializeMissing() {
    setSeeding(true);
    try {
      for (const m of EVENT_MANIFEST) {
        const exists = events.find((e) => e.id === m.id);
        if (exists) continue;
        const now = Date.now();
        await upsertEvent(m.id, {
          title: m.title,
          chapter: m.chapter,
          type: m.type,
          description: "",
          problemStatement: "",
          rules: [],
          datasetUrl: "",
          submissionUrl: "",
          startTime: now + 3600000,
          endTime: now + 2 * 3600000,
          announcements: [],
        });
      }
    } finally {
      setSeeding(false);
    }
  }

  const editingEvent = merged.find((e) => e.id === editingSlug);

  return (
    <main className="min-h-screen px-6 py-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-neon mb-1">
            Control Room
          </p>
          <h1 className="font-display text-3xl text-white">Admin Dashboard</h1>
          <p className="text-white/40 text-xs font-mono mt-1">{user?.email}</p>
        </div>
        <div className="flex gap-3">
          <NeonButton variant="ghost" onClick={handleInitializeMissing} disabled={seeding}>
            {seeding ? "Initializing…" : "Initialize Missing Events"}
          </NeonButton>
          <NeonButton variant="danger" onClick={logoutAdmin}>
            Log Out
          </NeonButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {merged.map((ev) => (
          <GlassCard key={ev.id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] text-white/40 uppercase tracking-widest">
                {ev.chapter} · {ev.type}
              </p>
              <h3 className="font-display text-lg text-white mt-0.5">{ev.title}</h3>
              <div className="mt-2">
                <StatusBadge mode={deriveMode(ev)} />
              </div>
            </div>
            <NeonButton variant="ghost" onClick={() => setEditingSlug(ev.id)}>
              Edit
            </NeonButton>
          </GlassCard>
        ))}
      </div>

      {editingEvent && (
        <AdminEventEditor event={editingEvent} onClose={() => setEditingSlug(null)} />
      )}
    </main>
  );
}

function CenteredText({ text }) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-neon text-sm uppercase tracking-widest animate-pulse">
        {text}
      </p>
    </main>
  );
}
