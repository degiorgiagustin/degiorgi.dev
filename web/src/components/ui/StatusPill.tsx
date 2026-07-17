// Availability pill with a pulsing gold dot (spec 002 §4.1).
// Server component. Mobile (<sm): dot only — the label is hidden, per spec.
// The ping is a desktop-safe enhancement: hidden under reduced motion.
type StatusPillProps = {
  label: string;
};

export function StatusPill({ label }: StatusPillProps) {
  return (
    <span className="rounded-pill border-line bg-gold-dim text-text-2 inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-xs">
      <span className="relative flex size-2 shrink-0">
        <span className="rounded-pill bg-gold absolute inline-flex size-full animate-ping opacity-60 motion-reduce:hidden" />
        <span className="rounded-pill bg-gold relative inline-flex size-2" />
      </span>
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}
