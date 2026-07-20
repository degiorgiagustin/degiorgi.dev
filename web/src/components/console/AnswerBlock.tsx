import { useState } from "react";
import { agentConsole, contact, links } from "@/content/messages";
import type { AgentExchange } from "@/lib/agent/session";
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
  const lockout =
    response?.kind === "rejection" && response.reason === "budget_exhausted";

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
