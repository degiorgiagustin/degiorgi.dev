// Tech/label tag — mono, hairline (spec 001 inventory). Server component.
// Used by the journey timeline (plain) and the stack strip (icon + interactive).
// text-text-2 (not text-3): 7.44:1 contrast on --bg vs text-3's 3.17:1, which
// fails WCAG AA for text this size (spec 001 §6 acceptance criterion).
type TagProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  // Hover brighten — desktop enhancement only (spec 001 §4); touch-safe default.
  interactive?: boolean;
};

export function Tag({ children, icon, interactive }: TagProps) {
  return (
    <span
      className={`rounded-badge border-line bg-surface text-text-2 inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-xs ${
        interactive
          ? "hover:border-line-strong hover:text-text transition-colors"
          : ""
      }`}
    >
      {icon}
      {children}
    </span>
  );
}
