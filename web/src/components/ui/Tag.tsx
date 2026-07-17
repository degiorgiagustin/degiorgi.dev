// Tech/label tag — mono, hairline (spec 001 inventory). Server component.
// First used by the journey timeline; reused by the stack strip.
type TagProps = {
  children: React.ReactNode;
};

export function Tag({ children }: TagProps) {
  return (
    <span className="rounded-badge border-line bg-surface text-text-3 inline-flex items-center border px-2 py-1 font-mono text-xs">
      {children}
    </span>
  );
}
