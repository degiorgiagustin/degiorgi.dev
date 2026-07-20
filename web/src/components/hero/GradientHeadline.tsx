// Display headline (spec 001 typography, spec 002 §4.2/§4.6). Server component.
// Lead line: white→transparent vertical gradient via background-clip. Accent
// line is optional — the gold gradient segment (prototype's signature
// treatment, "one headline segment" per accent discipline) only applies where
// a spec calls for it (hero); Contact's headline is plain white per prototype.
type GradientHeadlineProps = {
  lead: string;
  accent?: string;
  as?: "h1" | "h2";
  size?: "lg" | "sm";
  className?: string;
};

const sizeClass: Record<NonNullable<GradientHeadlineProps["size"]>, string> = {
  lg: "text-display leading-display",
  sm: "text-display-sm leading-display",
};

export function GradientHeadline({
  lead,
  accent,
  as: Tag = "h1",
  size = "lg",
  className,
}: GradientHeadlineProps) {
  return (
    <Tag
      className={`${sizeClass[size]} tracking-display max-w-4xl font-medium text-balance ${className ?? ""}`}
    >
      <span className="block bg-gradient-to-b from-white from-30% to-white/42 bg-clip-text text-transparent">
        {lead}
      </span>
      {accent ? (
        <span className="from-gold-light to-gold/55 block bg-gradient-to-b from-20% bg-clip-text text-transparent">
          {accent}
        </span>
      ) : null}
    </Tag>
  );
}
