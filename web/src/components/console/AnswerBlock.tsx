import { useState } from "react";
import { agentConsole, contact, links } from "@/content/messages";
import type { AgentExchange } from "@/lib/agent/session";
import { TraceDetail } from "./TraceDetail";

/*
 * One question/answer exchange (spec 003 §2): streamed text, then the mono
 * footer (totalMs · chunks + trace disclosure). Shared by the hero console
 * and the dock answer card (spec 003 §3, same footer/trace pattern).
 * aria-live="polite" announces the streamed answer without interrupting.
 * Mount it keyed by question count so disclosure state resets per question.
 */
type AnswerBlockProps = {
  exchange: AgentExchange;
};

export function AnswerBlock({ exchange }: AnswerBlockProps) {
  const [traceOpen, setTraceOpen] = useState(false);

  const settled = exchange.status === "settled";
  const response = exchange.response;
  const trace = response?.trace;
  const lockout =
    response?.kind === "rejection" && response.reason === "budget_exhausted";

  return (
    <div
      aria-live="polite"
      className="border-line animate-rise leading-body text-text-2 border-t px-4 py-4 text-sm"
    >
      <p className="text-text font-medium">{exchange.question}</p>

      {exchange.text ? (
        <p className="mt-3">{exchange.text}</p>
      ) : (
        <p className="text-text-3 mt-3 font-mono text-xs">
          {agentConsole.thinking}
        </p>
      )}

      {/* Friendly lockout points to email/LinkedIn (spec 003 §5). */}
      {settled && lockout && (
        <p className="mt-2 flex flex-wrap gap-x-5 font-mono text-xs">
          <a
            href={`mailto:${links.email}`}
            className="text-gold inline-flex min-h-11 items-center"
          >
            {contact.cta.email}
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-gold inline-flex min-h-11 items-center"
          >
            {contact.cta.linkedin}
          </a>
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
            <button
              type="button"
              aria-expanded={traceOpen}
              onClick={() => setTraceOpen((open) => !open)}
              className="text-gold relative before:absolute before:inset-x-0 before:-inset-y-3"
            >
              {traceOpen
                ? agentConsole.footer.hideTrace
                : agentConsole.footer.showTrace}
            </button>
          </div>
          {traceOpen && <TraceDetail trace={trace} />}
        </>
      )}
    </div>
  );
}
