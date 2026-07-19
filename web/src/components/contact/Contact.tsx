import { contact, links } from "@/content/messages";
import { GradientHeadline } from "@/components/hero/GradientHeadline";
import { PageSection } from "@/components/layout/PageSection";
import { Reveal } from "@/components/layout/Reveal";
import { HttpStatusBadge } from "@/components/contact/HttpStatusBadge";
import { Icon } from "@/components/stack/Icon";
import { Button } from "@/components/ui/Button";

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

      <Reveal className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button href={`mailto:${links.email}`} variant="gold">
          {contact.cta.email}
        </Button>
        <Button
          href={links.linkedin}
          variant="ghost"
          external
          icon={<Icon slug="linkedin" className="size-4" />}
          label={contact.cta.linkedin}
        />
        <Button
          href={links.github}
          variant="ghost"
          external
          icon={<Icon slug="github" className="size-4" />}
          label={contact.cta.github}
        />
        <Button
          href={links.x}
          variant="ghost"
          external
          icon={<Icon slug="x" className="size-4" />}
          label={contact.cta.x}
        />
      </Reveal>

      <Reveal className="mt-8 inline-block">
        <HttpStatusBadge />
      </Reveal>
    </PageSection>
  );
}
