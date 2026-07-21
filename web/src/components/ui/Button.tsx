// Link-styled CTA (spec 002 §4.6, prototype's .btn-gold/.btn-ghost). Server
// component: every use is a real link (mailto, external profile, in-page
// anchor), never a form action, so it renders as <a> rather than <button>.
// Two shapes: a labeled text button (email CTA), or an icon-only square
// button (social links) — the icon variant requires `label` since it's the
// button's only accessible name.
type BaseProps = {
  href: string;
  variant: "gold" | "ghost";
  external?: boolean;
  onClick?: () => void; // analytics-only side effect; navigation is unchanged
};

type ButtonProps =
  | (BaseProps & { icon?: undefined; children: React.ReactNode })
  | (BaseProps & { icon: React.ReactNode; label: string; children?: never });

const variantClass: Record<BaseProps["variant"], string> = {
  // text-bg (near-black) on the gold gradient — the one large-ish gold
  // surface the accent discipline (spec 001 §2) budgets for per viewport.
  gold: "bg-gradient-to-b from-gold-light to-gold text-bg font-medium hover:brightness-110",
  ghost:
    "border-line text-text-2 hover:border-line-strong hover:text-text border",
};

export function Button(props: ButtonProps) {
  const { href, variant, external, onClick } = props;
  const shapeClass = props.icon
    ? "size-11 shrink-0"
    : "min-h-11 px-5 font-mono text-xs";

  return (
    <a
      href={href}
      aria-label={props.icon ? props.label : undefined}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`rounded-button inline-flex items-center justify-center transition ${shapeClass} ${variantClass[variant]}`}
    >
      {props.icon ?? props.children}
    </a>
  );
}
