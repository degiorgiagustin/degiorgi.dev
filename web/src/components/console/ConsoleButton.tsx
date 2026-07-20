/*
 * Console-voice button (spec 001 "system voice"): the mono micro-controls of
 * the console and dock. Deliberately separate from ui/Button, which is the
 * page-voice CTA and renders <a href> — this one is a real <button> (form
 * submits, chip clicks) with its own typography and hover language. The
 * ::before overlay extends the hit area to ≥44px without inflating the
 * compact visuals (spec 002 §3).
 */
type ConsoleButtonProps = {
  variant: "chip" | "action" | "solid";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

const variantClass: Record<ConsoleButtonProps["variant"], string> = {
  // Curated question chips (spec 003 §2).
  chip: "rounded-pill border-line bg-surface text-text-2 enabled:hover:border-line-strong enabled:hover:text-text border px-3 py-1.5",
  // Secondary action inside the prompt line (hero "ask ↵").
  action:
    "rounded-button border-line bg-surface text-text-2 enabled:hover:border-gold/40 enabled:hover:bg-gold-dim enabled:hover:text-gold border px-3 py-1.5",
  // Primary gold action (dock "ask") — same gradient budget as ui/Button gold.
  solid:
    "rounded-pill from-gold-light to-gold text-bg bg-gradient-to-b px-4 py-2 font-medium enabled:hover:brightness-110",
};

export function ConsoleButton({
  variant,
  type = "button",
  onClick,
  disabled,
  children,
}: ConsoleButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative font-mono text-xs whitespace-nowrap transition select-none before:absolute before:inset-x-0 before:-inset-y-2 ${variantClass[variant]}`}
    >
      {children}
    </button>
  );
}
