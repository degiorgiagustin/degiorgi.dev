// Console-voice text button (trace disclosure, dock close): bare mono text
// with an invisible ::before extension meeting the ≥44px touch floor.
type TextButtonProps = {
  onClick: () => void;
  tone?: "gold" | "muted";
  expanded?: boolean; // set for disclosure buttons — renders aria-expanded
  children: React.ReactNode;
};

const toneClass: Record<NonNullable<TextButtonProps["tone"]>, string> = {
  gold: "text-gold",
  muted: "text-text-3 hover:text-text",
};

export function TextButton({
  onClick,
  tone = "gold",
  expanded,
  children,
}: TextButtonProps) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onClick}
      className={`relative font-mono text-xs transition-colors select-none before:absolute before:inset-x-0 before:-inset-y-3.5 ${toneClass[tone]}`}
    >
      {children}
    </button>
  );
}
