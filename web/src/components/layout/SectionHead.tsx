import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/layout/Reveal";

// Shared section header (spec 002 §4, prototype's .sec-head pattern):
// eyebrow + optional h2 headline + p subline, revealed together on scroll.
// headline/subline are optional so eyebrow-only sections (Stack, spec §4.5)
// use the same component instead of duplicating the eyebrow+Reveal wiring.
// Contact does not use this: its headline is a gradient CTA, not a plain h2
// (see hero/GradientHeadline).
type SectionHeadProps = {
  eyebrow: { index: string; label: string };
  headline?: string;
  subline?: string;
  className?: string;
};

export function SectionHead({
  eyebrow,
  headline,
  subline,
  className,
}: SectionHeadProps) {
  return (
    <header className={className ?? "mb-11"}>
      <Reveal>
        <Eyebrow index={eyebrow.index}>{eyebrow.label}</Eyebrow>
        {headline ? (
          <h2 className="text-text mt-2.5 text-2xl font-medium tracking-tight lg:text-3xl">
            {headline}
          </h2>
        ) : null}
        {subline ? (
          <p className="leading-body text-text-2 mt-4 max-w-xs text-sm">
            {subline}
          </p>
        ) : null}
      </Reveal>
    </header>
  );
}
