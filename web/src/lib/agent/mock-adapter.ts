import type {
  AgentAdapter,
  AgentAnswer,
  AgentQuery,
  AgentResponse,
} from "./types";
import { agentConsole, type CannedAnswer } from "@/content/messages";

const DEFAULT_SESSION_CAP = 10;
// First-token latency window per spec 003 §5 (simulated retrieval + LLM).
const THINK_MS_MIN = 500;
const THINK_MS_MAX = 900;
const STREAM_TICK_MS = 30;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Canned content is deeply readonly in messages.ts; responses are fresh
// per-call objects so callers can treat them as owned values.
function toAnswer(canned: CannedAnswer): AgentAnswer {
  return {
    kind: "answer",
    text: canned.text,
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
          text: agentConsole.rejections.budgetExhausted.text,
        };
        // No thinking delay: the cap check never reaches the pipeline.
        await this.stream(rejection.text, onDelta);
        return rejection;
      }

      const response = this.resolve(q.question);
      await delay(THINK_MS_MIN + Math.random() * (THINK_MS_MAX - THINK_MS_MIN));
      await this.stream(response.text, onDelta);
      return response;
    } catch {
      // Spec 003 §6: errors render as an `unavailable` rejection, never broken UI.
      return {
        kind: "rejection",
        reason: "unavailable",
        text: agentConsole.rejections.unavailable.text,
      };
    }
  }

  private resolve(question: string): AgentResponse {
    const canned = agentConsole.canned.find((c) => c.chip === question);
    if (canned) return toAnswer(canned.answer);

    const { trigger, text, trace } = agentConsole.rejections.offTopic;
    if (question.toLowerCase().includes(trigger)) {
      return {
        kind: "rejection",
        reason: "off_topic",
        text,
        trace: { chunks: [...trace.chunks], meta: { ...trace.meta } },
      };
    }

    return toAnswer(agentConsole.generic);
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
