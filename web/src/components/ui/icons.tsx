type IconProps = { className?: string };

// Hand-built generic UI glyphs, stroke-based, distinct from the vendored
// brand marks in components/stack/icons.ts (spec 002 §4.5). fill="none" +
// stroke="currentColor" so color is entirely controlled by the parent's
// text-color utility, matching the accent discipline (icons stay monochrome).
const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
} as const;

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...strokeProps} className={className ?? "size-4"}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export function CopyIcon({ className }: IconProps) {
  return (
    <svg {...strokeProps} className={className ?? "size-4"}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...strokeProps} className={className ?? "size-4"}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
