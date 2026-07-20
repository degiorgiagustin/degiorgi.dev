import { icons, type IconSlug } from "@/components/stack/icons";

// Renders a vendored icon path (icons.ts). fill="currentColor" so color is
// entirely controlled by the parent's text-color utility — token-driven,
// never a hardcoded brand color (spec 001 accent discipline: icons stay
// monochrome, never gold).
type IconProps = {
  slug: IconSlug;
  className?: string;
};

export function Icon({ slug, className }: IconProps) {
  const icon = icons[slug];
  return (
    <svg
      role="img"
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className ?? "size-3.5"}
    >
      <path d={icon.path} />
    </svg>
  );
}
