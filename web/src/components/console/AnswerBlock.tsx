import { useState } from "react";
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
 * aria-live="polite" announces the streamed answer without interrupting.
 * Mount it keyed by question count so disclosure state resets per question.
 */
type AnswerBlockProps = {
  exchange: AgentExchange;
  variant?: "panel" | "card";
};

const variantClass: Record<NonNullable<AnswerBlockProps["variant"]>, string> = {
  panel: "border-line animate-rise border-t px-4 py-4",
  card: "",
};

export function AnswerBlock({ exchange, variant = "panel" }: AnswerBlockProps) {
  const [traceOpen, setTraceOpen] = useState(false);

  const settled = exchange.status === "settled";
  const response = exchange.response;
  const trace = response?.trace;
  // Any response that hands the conversation off to direct human contact:
  // the budget/unavailable rejections, and the mock's own free-text fallback
  // (spec 003 §5 "the mock is honest about being a mock").
  const showContact =
    (response?.kind === "rejection" &&
      (response.reason === "budget_exhausted" ||
        response.reason === "unavailable")) ||
    (response?.kind === "answer" &&
      response.text === agentConsole.generic.text);

  return (
    <div
      aria-live="polite"
      className={`leading-body text-text-2 text-sm wrap-anywhere ${variantClass[variant]}`}
    >
      <p className="text-text font-medium">{exchange.question}</p>

      {exchange.text ? (
        <p className="mt-3">{exchange.text}</p>
      ) : (
        <p className="text-text-3 mt-3 font-mono text-xs">
          {agentConsole.thinking}
        </p>
      )}

      {/* Hands off to direct human contact (spec 003 §5): email is a real
          mailto: link plus a small copy affordance, not buried in prose. */}
      {settled && showContact && (
        <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs">
          <span className="inline-flex items-center gap-1">
            <a
              href={`mailto:${links.email}`}
              className="text-gold inline-flex min-h-11 items-center"
            >
              {contact.cta.email}
            </a>
            <CopyButton
              value={links.email}
              label={contact.cta.copyEmail}
              copiedLabel={contact.cta.copyEmailCopied}
            />
          </span>
          <span className="inline-flex items-center gap-1">
            <IconLink
              href={links.linkedin}
              label={contact.cta.linkedin}
              external
              icon={<Icon slug="linkedin" className="size-4" />}
            />
            <IconLink
              href={links.github}
              label={contact.cta.github}
              external
              icon={<Icon slug="github" className="size-4" />}
            />
            <IconLink
              href={links.x}
              label={contact.cta.x}
              external
              icon={<Icon slug="x" className="size-4" />}
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
