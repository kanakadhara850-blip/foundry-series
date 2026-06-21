// src/components/GlassCard.jsx
import clsx from "clsx";

/**
 * Base glassmorphism card used throughout the portal. Pass `active`
 * to add the neon glow border (used for "this section is live").
 */
export default function GlassCard({ children, className, active = false, as: Tag = "div" }) {
  return (
    <Tag
      className={clsx(
        "glass-panel rounded-xl p-6",
        active && "glass-panel-active",
        className
      )}
    >
      {children}
    </Tag>
  );
}
