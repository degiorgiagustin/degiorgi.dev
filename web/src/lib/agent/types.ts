/*
 * Agent adapter contract — spec 003 §5, verbatim. This is the port both the
 * Phase 1 MockAgentAdapter and the Phase 3 FastAPI/LangGraph service
 * implement; the UI depends only on these types and must not change when the
 * backend becomes real.
 */

export interface AgentQuery {
  question: string;
  sessionId: string;
}

export interface TraceChunk {
  source: string;
  section: string;
  score: number;
}

export interface TraceMeta {
  embedMs: number;
  searchMs: number;
  llmMs: number;
  totalMs: number;
  tokensIn: number;
  tokensOut: number;
}

export interface AgentAnswer {
  kind: "answer";
  text: string; // may arrive as a stream of deltas
  sources: string[];
  trace: { chunks: TraceChunk[]; meta: TraceMeta };
}

export interface AgentRejection {
  kind: "rejection";
  reason: "off_topic" | "rate_limited" | "budget_exhausted" | "unavailable";
  text: string; // human-readable, on-brand
  trace?: { chunks: TraceChunk[]; meta: Partial<TraceMeta> };
}

export type AgentResponse = AgentAnswer | AgentRejection;

export interface AgentAdapter {
  ask(q: AgentQuery, onDelta?: (chunk: string) => void): Promise<AgentResponse>;
}
