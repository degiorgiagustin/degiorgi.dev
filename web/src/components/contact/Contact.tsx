import { contact, links } from "@/content/messages";
import { GradientHeadline } from "@/components/hero/GradientHeadline";
import { PageSection } from "@/components/layout/PageSection";
import { Reveal } from "@/components/layout/Reveal";
import { HttpStatusBadge } from "@/components/contact/HttpStatusBadge";
import { Icon } from "@/components/stack/Icon";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { DownloadIcon } from "@/components/ui/icons";

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
        {/* One visual pill, two click zones: the email text opens a mail
            app, the icon copies. Hand-built rather than Button + CopyButton
            side by side, which read as two unrelated controls. */}
        <span className="rounded-button from-gold-light to-gold text-bg inline-flex items-center bg-gradient-to-b font-mono text-xs font-medium transition hover:brightness-110">
          <a
            href={`mailto:${links.email}`}
            className="inline-flex min-h-11 items-center py-2 pr-3 pl-5"
          >
            {contact.cta.email}
          </a>
          <CopyButton
            value={links.email}
            label={contact.cta.copyEmail}
            copiedLabel={contact.cta.copyEmailCopied}
            className="border-bg/25 hover:bg-bg/10 rounded-r-button inline-flex size-11 shrink-0 items-center justify-center border-l transition-colors"
          />
        </span>
        <Button href={links.cv} variant="ghost" external>
          <span className="inline-flex items-center gap-2">
            <DownloadIcon className="size-3.5" />
            {contact.cta.cv}
          </span>
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
