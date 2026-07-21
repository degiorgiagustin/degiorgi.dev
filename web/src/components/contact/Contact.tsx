import { contact } from "@/content/messages";
import { GradientHeadline } from "@/components/hero/GradientHeadline";
import { PageSection } from "@/components/layout/PageSection";
import { Reveal } from "@/components/layout/Reveal";
import { ContactActions } from "@/components/contact/ContactActions";
import { HttpStatusBadge } from "@/components/contact/HttpStatusBadge";
import { ScrollEndTracker } from "@/components/contact/ScrollEndTracker";

// Closing CTA (spec 002 §4.6). Deliberately not built on SectionHead: this is
// a gradient-headline call to action like Hero, not a plain section header.
// pb-40 reserves the dock's footprint (spec 003 §3 "page clearance") so the
// dock never overlaps this content and mounting it causes zero CLS.
export function Contact() {
  return (
    <PageSection id="contact" className="pt-24 pb-40 text-center">
      <Reveal className="mx-auto max-w-2xl">
        <GradientHeadline
          lead={contact.headline}
          as="h2"
          size="sm"
          className="mx-auto"
        />
        <p className="leading-body text-text-2 mx-auto mt-4 max-w-sm text-base text-pretty">
          {contact.subline}
        </p>
      </Reveal>

      {/* One visual pill, two click zones: the email text opens a mail app,
          the icon copies. Hand-built rather than Button + CopyButton side by
          side, which read as two unrelated controls. Tracking lives in the
          client island below (ContactActions), not here — this section is
          otherwise a Server Component. */}
      <Reveal className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <ContactActions />
      </Reveal>

      <Reveal className="mt-8 inline-block">
        <HttpStatusBadge />
      </Reveal>

      <ScrollEndTracker />
    </PageSection>
  );
}
