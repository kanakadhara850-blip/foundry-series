"use client";
// src/components/AdminEventEditor.jsx
//
// Full edit form for a single event document. Local form state is
// seeded from the passed-in `event` prop and only written to
// Firestore when "Save Changes" is clicked (announcements are the
// exception — those post immediately, since they're meant to be
// fired off quickly during a live event).

import { useState } from "react";
import { upsertEvent, postAnnouncement } from "@/lib/events";
import { uploadDataset } from "@/lib/storage";
import GlassCard from "./GlassCard";
import NeonButton from "./NeonButton";
import EventQRCode from "./EventQRCode";

function toInputDateTime(value) {
  if (!value) return "";
  const ms = typeof value.toMillis === "function" ? value.toMillis() : value;
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function AdminEventEditor({ event, onClose }) {
  const [form, setForm] = useState({
    title: event.title || "",
    chapter: event.chapter || "",
    type: event.type || "online",
    description: event.description || "",
    problemStatement: event.problemStatement || "",
    rules: (event.rules || []).join("\n"),
    submissionUrl: event.submissionUrl || "",
    startTime: toInputDateTime(event.startTime),
    endTime: toInputDateTime(event.endTime),
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [uploadPct, setUploadPct] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSavedMsg("");
    try {
      await upsertEvent(event.id, {
        title: form.title,
        chapter: form.chapter,
        type: form.type,
        description: form.description,
        problemStatement: form.problemStatement,
        rules: form.rules.split("\n").map((r) => r.trim()).filter(Boolean),
        submissionUrl: form.submissionUrl,
        startTime: new Date(form.startTime).getTime(),
        endTime: new Date(form.endTime).getTime(),
      });
      setSavedMsg("Saved ✓");
    } catch (err) {
      setSavedMsg("Save failed — check console.");
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMsg(""), 2500);
    }
  }

  async function handleDatasetUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadPct(0);
    try {
      await uploadDataset(event.id, file, setUploadPct);
      setSavedMsg("Dataset uploaded ✓");
    } catch (err) {
      console.error(err);
      setSavedMsg("Dataset upload failed.");
    } finally {
      setTimeout(() => setUploadPct(null), 1500);
    }
  }

  async function handlePostAnnouncement() {
    if (!announcement.trim()) return;
    setPostingAnnouncement(true);
    try {
      await postAnnouncement(event.id, announcement.trim());
      setAnnouncement("");
    } finally {
      setPostingAnnouncement(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-start md:items-center justify-center overflow-y-auto p-4">
      <GlassCard className="w-full max-w-3xl my-8" active>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-white">
            Editing: <span className="text-neon">{event.title || event.id}</span>
          </h2>
          <button
            onClick={onClose}
            className="font-mono text-xs text-white/40 hover:text-white"
          >
            ✕ Close
          </button>
        </div>

        <div className="grid md:grid-cols-[1fr_180px] gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title" value={form.title} onChange={(v) => set("title", v)} />
              <Field label="Chapter" value={form.chapter} onChange={(v) => set("chapter", v)} />
            </div>

            <label className="block">
              <span className="block font-mono text-[11px] uppercase tracking-widest text-white/50 mb-1.5">
                Type
              </span>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className="w-full bg-black/40 border border-white/15 focus:border-neon rounded-md px-3 py-2 text-white text-sm outline-none"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </label>

            <TextArea label="Description" value={form.description} onChange={(v) => set("description", v)} />
            <TextArea
              label="Problem Statement"
              value={form.problemStatement}
              onChange={(v) => set("problemStatement", v)}
              rows={5}
            />
            <TextArea
              label="Rules (one per line)"
              value={form.rules}
              onChange={(v) => set("rules", v)}
              rows={4}
            />
            <Field
              label="Submission URL"
              value={form.submissionUrl}
              onChange={(v) => set("submissionUrl", v)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Start Time"
                type="datetime-local"
                value={form.startTime}
                onChange={(v) => set("startTime", v)}
              />
              <Field
                label="End Time"
                type="datetime-local"
                value={form.endTime}
                onChange={(v) => set("endTime", v)}
              />
            </div>

            <div>
              <span className="block font-mono text-[11px] uppercase tracking-widest text-white/50 mb-1.5">
                Upload Dataset
              </span>
              <input
                type="file"
                onChange={handleDatasetUpload}
                className="text-xs text-white/60 font-mono"
              />
              {uploadPct !== null && (
                <p className="text-xs text-neon font-mono mt-1">Uploading… {uploadPct}%</p>
              )}
              {event.datasetUrl && (
                <a
                  href={event.datasetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-white/40 mt-1 hover:text-neon"
                >
                  Current dataset →
                </a>
              )}
            </div>

            <div>
              <span className="block font-mono text-[11px] uppercase tracking-widest text-white/50 mb-1.5">
                Post Announcement
              </span>
              <div className="flex gap-2">
                <input
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="e.g. Dataset v2 uploaded — re-download before submitting"
                  className="flex-1 bg-black/40 border border-white/15 focus:border-neon rounded-md px-3 py-2 text-white text-sm outline-none"
                />
                <NeonButton
                  variant="ghost"
                  onClick={handlePostAnnouncement}
                  disabled={postingAnnouncement}
                >
                  Post
                </NeonButton>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <NeonButton onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </NeonButton>
              {savedMsg && <span className="text-xs font-mono text-neon-bright">{savedMsg}</span>}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 border-l border-white/10 pl-6">
            <EventQRCode slug={event.id} />
            <p className="text-[10px] font-mono text-white/30 text-center">
              Print this for table signage
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="block font-mono text-[11px] uppercase tracking-widest text-white/50 mb-1.5">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/15 focus:border-neon rounded-md px-3 py-2 text-white text-sm outline-none transition-colors"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      <span className="block font-mono text-[11px] uppercase tracking-widest text-white/50 mb-1.5">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/15 focus:border-neon rounded-md px-3 py-2 text-white text-sm outline-none transition-colors resize-none"
      />
    </label>
  );
}
