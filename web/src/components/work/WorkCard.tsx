// Selected-work card (spec 002 §4.4, revised spec 005). Server component,
// static — no case-study page exists yet, so this renders as a plain panel
// rather than a link promising a destination that isn't there. Glass +
// backdrop blur on mobile only (nav + one card ≤ 2 blur layers); lg+ uses
// --glass-solid on all three cards so nav blur stays within the 3-layer GPU
// budget (spec 001 §2).
// Plain resolved strings, not Locale/t (spec 006): Work resolves each card's
// translatable fields once and passes plain data down — same "resolve at
// the boundary" pattern as TimelineStep.
type WorkCardProps = {
  kind: string;
  title: string;
  summary: string;
};

export function WorkCard({ kind, title, summary }: WorkCardProps) {
  return (
    <div className="border-line bg-glass rounded-panel lg:bg-glass-solid h-full border p-6 backdrop-blur-md lg:backdrop-blur-none">
      <p className="tracking-label text-gold font-mono text-xs uppercase">
        {kind}
      </p>
      <h3 className="text-text mt-3 text-lg font-medium">{title}</h3>
      <p className="leading-body text-text-2 mt-2 text-sm">{summary}</p>
    </div>
  );
}
