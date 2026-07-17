// Display headline (spec 001 typography, spec 002 §4.2). Server component.
// Lead line: white→transparent vertical gradient via background-clip.
// Accent line: gold — "one headline segment" (spec 001 accent discipline).
type GradientHeadlineProps = {
  lead: string;
  accent: string;
};

export function GradientHeadline({ lead, accent }: GradientHeadlineProps) {
  return (
    <h1 className="text-display leading-display tracking-display max-w-3xl font-medium text-balance">
      <span className="block bg-gradient-to-b from-white from-30% to-white/42 bg-clip-text text-transparent">
        {lead}
      </span>
      <span className="text-gold block">{accent}</span>
    </h1>
  );
}
