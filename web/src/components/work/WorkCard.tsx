import type { WorkCard as WorkCardData } from "@/content/messages";

// Selected-work card (spec 002 §4.4). Server component — the whole card is the
// link (stub href in Phase 1). Glass + backdrop blur on mobile only (nav + one
// card ≤ 2 blur layers); lg+ uses --glass-solid on all three cards so nav blur
// stays within the 3-layer GPU budget (spec 001 §2).
type WorkCardProps = {
  card: WorkCardData;
  linkLabel: string;
};

export function WorkCard({ card, linkLabel }: WorkCardProps) {
  return (
    <a
      href={card.href}
      className="group border-line bg-glass rounded-panel lg:bg-glass-solid hover:border-line-strong block border p-6 backdrop-blur-md transition-[border-color,transform] duration-200 ease-out motion-safe:hover:-translate-y-0.5 lg:backdrop-blur-none"
    >
      <p className="tracking-label text-gold font-mono text-xs uppercase">
        {card.kind}
      </p>
      <h3 className="text-text mt-3 text-lg font-medium">{card.title}</h3>
      <p className="leading-body text-text-2 mt-2 text-sm">{card.summary}</p>
      <span className="text-text-3 group-hover:text-gold mt-4 block font-mono text-xs transition-colors">
        {linkLabel}
      </span>
    </a>
  );
}
