/*
 * Agent adapter contract — spec 003 §5, verbatim. This is the port both the
 * Phase 1 MockAgentAdapter and the Phase 3 FastAPI/LangGraph service
 * implement; the UI depends only on these types and must not change when the
 * backend becomes real.
 */

import type { Locale } from "@/lib/i18n/locale";

export interface AgentQuery {
  question: string;
  sessionId: string;
  // Which language to answer in (spec 006) — genuinely part of the contract,
  // not a UI-only concern: a real Phase 3 backend needs this too.
  locale: Locale;
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
  sources: string[]; // reserved: no console surface renders this yet
  trace: { chunks: TraceChunk[]; meta: TraceMeta };
  // Set true when this response should end with a hand-off to direct human
  // contact (mailto/social row). Adapter-driven rather than left for the UI
  // to infer from response.text — text is free-form copy, not a stable
  // signal, and Phase 3's real answers will never match the mock's strings.
  showContact?: boolean;
}

export interface AgentRejection {
  kind: "rejection";
  reason: "off_topic" | "rate_limited" | "budget_exhausted" | "unavailable";
  text: string; // human-readable, on-brand
  trace?: { chunks: TraceChunk[]; meta: Partial<TraceMeta> };
  showContact?: boolean;
}

export type AgentResponse = AgentAnswer | AgentRejection;

export interface AgentAdapter {
  ask(q: AgentQuery, onDelta?: (chunk: string) => void): Promise<AgentResponse>;
}
