import { agent } from "./adapter";
import type { AgentResponse } from "./types";

/*
 * AgentSession — spec 003 §4. A plain client-side module (deliberately not a
 * state library): one in-memory session shared by the hero console and the
 * dock. Backend analogy: an application-scoped singleton service with event
 * listeners; the two widgets are controllers subscribed to it via React's
 * built-in useSyncExternalStore. A question asked in either surface counts
 * toward the same cap, and the latest exchange is visible to both.
 */

export type AgentExchange = {
  question: string;
  status: "streaming" | "settled";
  text: string; // accumulated deltas while streaming; authoritative on settle
  response: AgentResponse | null; // present once settled
};

export type AgentSessionState = {
  sessionId: string;
  questionCount: number;
  exchange: AgentExchange | null;
  locked: boolean; // budget_exhausted seen — surfaces render the lockout state
};

const initialState: AgentSessionState = {
  // Node ≥20 and all evergreen browsers provide crypto.randomUUID.
  sessionId: crypto.randomUUID(),
  questionCount: 0,
  exchange: null,
  locked: false,
};

let state = initialState;
const listeners = new Set<() => void>();

function setState(patch: Partial<AgentSessionState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

export const agentSession = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: (): AgentSessionState => state,
  // Stable pre-interaction snapshot for useSyncExternalStore's SSR path.
  getServerSnapshot: (): AgentSessionState => initialState,

  // The one command both surfaces call; orchestration lives here so Console
  // and Dock stay pure views.
  async ask(question: string): Promise<void> {
    const q = question.trim();
    if (!q || state.exchange?.status === "streaming") return;

    setState({
      questionCount: state.questionCount + 1,
      exchange: { question: q, status: "streaming", text: "", response: null },
    });

    const response = await agent.ask(
      { question: q, sessionId: state.sessionId },
      (delta) => {
        const exchange = state.exchange;
        if (!exchange) return;
        setState({ exchange: { ...exchange, text: exchange.text + delta } });
      },
    );

    setState({
      exchange: {
        question: q,
        status: "settled",
        text: response.text,
        response,
      },
      locked:
        state.locked ||
        (response.kind === "rejection" &&
          response.reason === "budget_exhausted"),
    });
  },
};
