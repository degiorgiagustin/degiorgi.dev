// Mono uppercase label — the "system voice" (spec 001 typography, §4).
// Server component. Optional gold index prefix (e.g. "01 · The journey").
type EyebrowProps = {
  index?: string;
  children: React.ReactNode;
};

export function Eyebrow({ index, children }: EyebrowProps) {
  return (
    <p className="tracking-label text-text-3 font-mono text-xs uppercase">
      {index ? <span className="text-gold">{index} · </span> : null}
      {children}
    </p>
  );
}
