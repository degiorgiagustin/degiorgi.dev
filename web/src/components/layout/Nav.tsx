import { site, nav } from "@/content/messages";
import { StatusPill } from "@/components/ui/StatusPill";

// Fixed glass navigation bar (spec 002 §4.1, prototype composition). Server
// component. One backdrop-blur layer (counts toward the 3-blur budget).
// Three zones: wordmark left, anchor links center (desktop only), status
// right. Mobile (<sm): wordmark + status dot only — links are in-page anchors
// reachable by scrolling, so no hamburger in this phase.
export function Nav() {
  return (
    <header className="bg-bg/60 border-line fixed inset-x-0 top-0 z-50 border-b backdrop-blur-lg">
      <nav className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
        <a
          href="#top"
          className="text-text justify-self-start font-mono text-sm font-medium"
        >
          {site.wordmark.name}
          <span className="text-text-3">{site.wordmark.tld}</span>
        </a>

        <ul className="hidden items-center gap-6 sm:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-text-2 hover:text-text inline-flex min-h-11 items-center text-sm transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="col-start-3 justify-self-end">
          <StatusPill label={site.status} />
        </div>
      </nav>
    </header>
  );
}
