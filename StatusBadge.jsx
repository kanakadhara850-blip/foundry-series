// src/components/StatusBadge.jsx
import clsx from "clsx";

const CONFIG = {
  "pre-start": { label: "STANDBY", dot: "bg-white/40", text: "text-white/60" },
  live: { label: "LIVE", dot: "bg-neon-bright animate-pulse", text: "text-neon-bright" },
  "final-five": { label: "FINAL STRETCH", dot: "bg-danger animate-pulse", text: "text-danger" },
  ended: { label: "ENDED", dot: "bg-white/30", text: "text-white/40" },
  loading: { label: "SYNCING", dot: "bg-white/30", text: "text-white/40" },
};

export default function StatusBadge({ mode }) {
  const cfg = CONFIG[mode] || CONFIG.loading;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/40 font-mono text-xs uppercase tracking-widest",
        cfg.text
      )}
    >
      <span className={clsx("w-2 h-2 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}
