// src/components/AnnouncementFeed.jsx
import GlassCard from "./GlassCard";

function formatTime(postedAt) {
  const ms =
    typeof postedAt?.toMillis === "function" ? postedAt.toMillis() : postedAt;
  if (!ms) return "";
  return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AnnouncementFeed({ announcements = [] }) {
  const sorted = [...announcements].sort((a, b) => {
    const am = typeof a.postedAt?.toMillis === "function" ? a.postedAt.toMillis() : a.postedAt || 0;
    const bm = typeof b.postedAt?.toMillis === "function" ? b.postedAt.toMillis() : b.postedAt || 0;
    return bm - am;
  });

  return (
    <GlassCard className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-neon-bright animate-pulse" />
        <h3 className="font-mono text-sm uppercase tracking-widest text-neon-bright">
          Live Announcements
        </h3>
      </div>

      {sorted.length === 0 ? (
        <p className="text-white/40 text-sm">
          No announcements yet. Updates from the control room will appear here instantly.
        </p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {sorted.map((a, i) => (
            <li
              key={i}
              className="border border-white/10 bg-black/30 rounded-md px-3 py-2 text-sm text-white/85"
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-[10px] font-mono text-neon/70 uppercase tracking-wider">
                  Broadcast
                </span>
                <span className="text-[10px] font-mono text-white/30">
                  {formatTime(a.postedAt)}
                </span>
              </div>
              {a.text}
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
