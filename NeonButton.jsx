// src/components/NeonButton.jsx
import clsx from "clsx";

/**
 * Primary action button — solid neon fill with glow on hover.
 * Use `variant="ghost"` for secondary actions, `variant="danger"`
 * for destructive admin actions.
 */
export default function NeonButton({
  children,
  variant = "solid",
  disabled = false,
  className,
  as: Tag = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-mono text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    solid:
      "bg-neon text-black hover:shadow-neon-md hover:brightness-110 active:scale-[0.98]",
    ghost:
      "border border-neon/40 text-neon hover:bg-neon/10 hover:border-neon hover:shadow-neon-sm",
    danger:
      "border border-danger/50 text-danger hover:bg-danger/10 hover:shadow-danger-md",
    locked:
      "border border-white/10 text-white/40 cursor-not-allowed bg-white/[0.02]",
  };

  return (
    <Tag
      disabled={disabled}
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
