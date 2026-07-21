import { useState } from "react";
import { track } from "@vercel/analytics";
import { agentConsole, contact, links } from "@/content/messages";
import type { AgentExchange } from "@/lib/agent/session";
import { Icon } from "@/components/stack/Icon";
import { CopyButton } from "@/components/ui/CopyButton";
import { IconLink } from "@/components/ui/IconLink";
import { TextButton } from "./TextButton";
import { TraceDetail } from "./TraceDetail";

/*
 * One question/answer exchange (spec 003 §2): streamed text, then the mono
 * footer (totalMs · chunks + trace disclosure). Shared by the hero console
 * and the dock answer card (spec 003 §3, same footer/trace pattern) — the
 * variant only adjusts framing: "panel" separates itself from the console
 * above it, "card" lets the dock card own padding and entrance animation.
 * The Q&A text sits in its own aria-live="polite" region so it's announced
 * as it streams; the contact row and trace footer sit outside it (spec 005)
 * since they're static once settled, not something to re-announce.
 * Mount it keyed by question count so disclosure state resets per question.
 */
type AnswerBlockProps = {
  exchange: AgentExchange;
  variant?: "panel" | "card";
  surface: "hero" | "dock"; // which console instance, for analytics (spec 005)
};

const variantClass: Record<NonNullable<AnswerBlockProps["variant"]>, string> = {
  panel: "border-line animate-rise border-t px-4 py-4",
  card: "",
};

export function AnswerBlock({
  exchange,
  variant = "panel",
  surface,
}: AnswerBlockProps) {
  const [traceOpen, setTraceOpen] = useState(false);

  const settled = exchange.status === "settled";
  const response = exchange.response;
  const trace = response?.trace;
  // Adapter-driven (lib/agent/types.ts), not inferred from response.text:
  // that's free-form copy, not a stable signal, and Phase 3's real answers
  // will never match the mock's strings verbatim.
  const showContact = response?.showContact === true;

  return (
    <div
      className={`leading-body text-text-2 text-sm wrap-anywhere ${variantClass[variant]}`}
    >
      {/* Only the streamed Q&A is live-announced. The contact row and trace
          footer below are static controls once settled — stuffing them into
          the same live region would re-announce a growing pile of focusable
          markup (mailto/copy/social links) on every settle. */}
      <div aria-live="polite">
        <p className="text-text font-medium">{exchange.question}</p>

        {exchange.text ? (
          <p className="mt-3">{exchange.text}</p>
        ) : (
          <p className="text-text-3 mt-3 font-mono text-xs">
            {agentConsole.thinking}
          </p>
        )}
      </div>

      {/* Hands off to direct human contact (spec 003 §5): email is a real
          mailto: link plus a small copy affordance, not buried in prose. */}
      {settled && showContact && (
        <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs">
          <span className="inline-flex items-center gap-1">
            <a
              href={`mailto:${links.email}`}
              onClick={() => track("email_open", { surface })}
              className="text-gold inline-flex min-h-11 items-center"
            >
              {contact.cta.email}
            </a>
            <CopyButton
              value={links.email}
              label={contact.cta.copyEmail}
              copiedLabel={contact.cta.copyEmailCopied}
              onCopied={() => track("email_copy", { surface })}
            />
          </span>
          <span className="inline-flex items-center gap-1">
            <IconLink
              href={links.linkedin}
              label={contact.cta.linkedin}
              external
              icon={<Icon slug="linkedin" className="size-4" />}
              onClick={() =>
                track("social_click", { network: "linkedin", surface })
              }
            />
            <IconLink
              href={links.github}
              label={contact.cta.github}
              external
              icon={<Icon slug="github" className="size-4" />}
              onClick={() =>
                track("social_click", { network: "github", surface })
              }
            />
            <IconLink
              href={links.x}
              label={contact.cta.x}
              external
              icon={<Icon slug="x" className="size-4" />}
              onClick={() => track("social_click", { network: "x", surface })}
            />
          </span>
        </p>
      )}

      {settled && trace && (
        <>
          <div className="text-text-3 mt-3.5 flex items-center gap-4 font-mono text-xs">
            {trace.meta.totalMs !== undefined && (
              <span>
                {agentConsole.footer.stats(
                  trace.meta.totalMs,
                  trace.chunks.length,
                )}
              </span>
            )}
            <TextButton
              expanded={traceOpen}
              onClick={() => setTraceOpen((open) => !open)}
            >
              {traceOpen
                ? agentConsole.footer.hideTrace
                : agentConsole.footer.showTrace}
            </TextButton>
          </div>
          {traceOpen && <TraceDetail trace={trace} />}
        </>
      )}
    </div>
  );
}
