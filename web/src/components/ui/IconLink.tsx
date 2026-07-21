import type { ReactNode } from "react";

// Borderless icon-only link, sized to the 44px touch floor. Distinct from
// Button's ghost icon variant (bordered, square, built for spacious CTA rows
// like Contact) — this one matches CopyButton's minimal treatment for
// compact contexts like the console's inline contact row.
type IconLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
  onClick?: () => void; // analytics-only side effect; navigation is unchanged
};

export function IconLink({
  href,
  label,
  icon,
  external,
  onClick,
}: IconLinkProps) {
  return (
    <a
      href={href}
      aria-label={label}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="text-text-3 hover:text-gold inline-flex size-11 shrink-0 items-center justify-center transition-colors"
    >
      {icon}
    </a>
  );
}
