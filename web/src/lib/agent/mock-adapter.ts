import type {
  AgentAdapter,
  AgentAnswer,
  AgentQuery,
  AgentResponse,
} from "./types";
import { agentConsole, type CannedAnswer } from "@/content/messages";
import { t, type Locale } from "@/lib/i18n/locale";

const DEFAULT_SESSION_CAP = 10;
// First-token latency window per spec 003 §5 (simulated retrieval + LLM).
const THINK_MS_MIN = 500;
const THINK_MS_MAX = 900;
const STREAM_TICK_MS = 30;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Canned content is deeply readonly in messages.ts; responses are fresh
// per-call objects so callers can treat them as owned values. text is
// Localized in messages.ts but AgentAnswer.text is a resolved string (the
// port contract stays locale-agnostic, spec 003 §5) — t() resolves it here,
// at the boundary, using the locale carried on the query (spec 006: no
// hidden global, locale flows as an explicit value end to end).
function toAnswer(canned: CannedAnswer, locale: Locale): AgentAnswer {
  return {
    kind: "answer",
    text: t(canned.text, locale),
    sources: [...canned.sources],
    trace: {
      chunks: [...canned.trace.chunks],
      meta: { ...canned.trace.meta },
    },
  };
}

export class MockAgentAdapter implements AgentAdapter {
  // Per-session question tally. Client-side here by design: Phase 3 moves
  // enforcement to the server with identical client-visible behavior.
  private readonly asked = new Map<string, number>();

  constructor(private readonly sessionCap = DEFAULT_SESSION_CAP) {}

  async ask(
    q: AgentQuery,
    onDelta?: (chunk: string) => void,
  ): Promise<AgentResponse> {
    try {
      const count = (this.asked.get(q.sessionId) ?? 0) + 1;
      this.asked.set(q.sessionId, count);

      if (count > this.sessionCap) {
        const rejection: AgentResponse = {
          kind: "rejection",
          reason: "budget_exhausted",
          text: t(agentConsole.rejections.budgetExhausted.text, q.locale),
          showContact: true,
        };
        // No thinking delay: the cap check never reaches the pipeline.
        await this.stream(rejection.text, onDelta);
        return rejection;
      }

      const response = this.resolve(q.question, q.locale);
      await delay(THINK_MS_MIN + Math.random() * (THINK_MS_MAX - THINK_MS_MIN));
      await this.stream(response.text, onDelta);
      return response;
    } catch {
      // Spec 003 §6: errors render as an `unavailable` rejection, never broken UI.
      return {
        kind: "rejection",
        reason: "unavailable",
        text: t(agentConsole.rejections.unavailable.text, q.locale),
        showContact: true,
      };
    }
  }

  private resolve(question: string, locale: Locale): AgentResponse {
    // question arrives already resolved to the current locale's chip text
    // (ConsoleFrame resolves it before calling onSubmit), so comparing
    // against t(c.chip, locale) — not the raw Localized object — is what matches.
    const canned = agentConsole.canned.find(
      (c) => t(c.chip, locale) === question,
    );
    if (canned) return toAnswer(canned.answer, locale);

    const { trigger, text, trace } = agentConsole.rejections.offTopic;
    if (question.toLowerCase().includes(trigger)) {
      return {
        kind: "rejection",
        reason: "off_topic",
        text: t(text, locale),
        trace: { chunks: [...trace.chunks], meta: { ...trace.meta } },
      };
    }

    return { ...toAnswer(agentConsole.generic, locale), showContact: true };
  }

  private async stream(text: string, onDelta?: (chunk: string) => void) {
    if (!onDelta) return;
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      onDelta(i === 0 ? words[i] : ` ${words[i]}`);
      await delay(STREAM_TICK_MS);
    }
  }
}
