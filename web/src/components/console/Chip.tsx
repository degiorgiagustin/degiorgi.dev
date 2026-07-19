// Curated question chip (spec 003 §2). Visually a compact pill per the
// prototype; the ::before overlay extends the hit area vertically to meet the
// ≥44px touch-target floor without inflating the visual (spec 002 §3).
type ChipProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function Chip({ label, onClick, disabled }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-pill border-line bg-surface text-text-2 enabled:hover:border-line-strong enabled:hover:text-text relative border px-3 py-1.5 font-mono text-xs transition-colors select-none before:absolute before:inset-x-0 before:-inset-y-2"
    >
      {label}
    </button>
  );
}
