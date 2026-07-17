// Display headline (spec 001 typography, spec 002 §4.2). Server component.
// Lead line: white→transparent vertical gradient via background-clip.
// Accent line: gold gradient (light gold → faded gold), the prototype's
// signature treatment — still "one headline segment" per accent discipline.
type GradientHeadlineProps = {
  lead: string;
  accent: string;
  className?: string;
};

export function GradientHeadline({
  lead,
  accent,
  className,
}: GradientHeadlineProps) {
  return (
    <h1
      className={`text-display leading-display tracking-display max-w-4xl font-medium text-balance ${className ?? ""}`}
    >
      <span className="block bg-gradient-to-b from-white from-30% to-white/42 bg-clip-text text-transparent">
        {lead}
      </span>
      <span className="from-gold-light to-gold/55 block bg-gradient-to-b from-20% bg-clip-text text-transparent">
        {accent}
      </span>
    </h1>
  );
}
