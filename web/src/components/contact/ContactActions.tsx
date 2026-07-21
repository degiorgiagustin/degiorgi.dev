"use client";

import { track } from "@vercel/analytics";
import { contact, links } from "@/content/messages";
import { t, type Locale } from "@/lib/i18n/locale";
import { Icon } from "@/components/stack/Icon";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { DownloadIcon } from "@/components/ui/icons";

// Client island for Contact's action row (spec 005): analytics tracking is
// the only reason this needs to be interactive, so it's split out from
// Contact.tsx rather than making the whole section a client component —
// headline/subline/badge stay server-rendered.
export function ContactActions({ locale }: { locale: Locale }) {
  return (
    <>
      <span className="rounded-button from-gold-light to-gold text-bg inline-flex items-center bg-gradient-to-b font-mono text-xs font-medium transition hover:brightness-110">
        <a
          href={`mailto:${links.email}`}
          onClick={() => track("email_open", { surface: "contact" })}
          className="inline-flex min-h-11 items-center py-2 pr-3 pl-5"
        >
          {contact.cta.email}
        </a>
        <CopyButton
          value={links.email}
          label={t(contact.cta.copyEmail, locale)}
          copiedLabel={t(contact.cta.copyEmailCopied, locale)}
          onCopied={() => track("email_copy", { surface: "contact" })}
          className="border-bg/25 hover:bg-bg/10 rounded-r-button inline-flex size-11 shrink-0 items-center justify-center border-l transition-colors"
        />
      </span>

      <Button
        href={t(links.cv, locale)}
        variant="ghost"
        external
        onClick={() => track("cv_download")}
      >
        <span className="inline-flex items-center gap-2">
          <DownloadIcon className="size-3.5" />
          {t(contact.cta.cv, locale)}
        </span>
      </Button>

      <Button
        href={t(links.linkedin, locale)}
        variant="ghost"
        external
        icon={<Icon slug="linkedin" className="size-4" />}
        label={t(contact.cta.linkedin, locale)}
        onClick={() =>
          track("social_click", { network: "linkedin", surface: "contact" })
        }
      />
      <Button
        href={links.github}
        variant="ghost"
        external
        icon={<Icon slug="github" className="size-4" />}
        label={t(contact.cta.github, locale)}
        onClick={() =>
          track("social_click", { network: "github", surface: "contact" })
        }
      />
      <Button
        href={links.x}
        variant="ghost"
        external
        icon={<Icon slug="x" className="size-4" />}
        label={t(contact.cta.x, locale)}
        onClick={() =>
          track("social_click", { network: "x", surface: "contact" })
        }
      />
    </>
  );
}
