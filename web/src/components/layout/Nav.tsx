import { site, nav } from "@/content/messages";
import { StatusPill } from "@/components/ui/StatusPill";

// Fixed glass navigation bar (spec 002 §4.1). Server component.
// One backdrop-blur layer (counts toward the 3-blur budget, spec 001 §2).
// Mobile (<sm): wordmark + status dot only; nav links are in-page anchors
// reachable by scrolling, so no hamburger is needed in this phase.
export function Nav() {
  return (
    <header className="border-line bg-glass fixed inset-x-0 top-0 z-50 border-b backdrop-blur-lg">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          className="text-text hover:text-gold font-mono text-sm transition-colors"
        >
          {site.wordmark}
        </a>

        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="hidden items-center gap-6 sm:flex">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="tracking-label text-text-2 hover:text-text font-mono text-xs uppercase transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <StatusPill label={site.status} />
        </div>
      </nav>
    </header>
  );
}
