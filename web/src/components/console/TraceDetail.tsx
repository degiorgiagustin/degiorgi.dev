import { agentConsole } from "@/content/messages";
import type { TraceChunk, TraceMeta } from "@/lib/agent/types";

// Retrieval trace disclosure body (spec 003 §2): chunk rows with gold scores
// plus the latency/token meta line. Meta is Partial because rejection traces
// stop before the LLM stage (the guardrail demo, spec 003 §5).
type TraceDetailProps = {
  trace: { chunks: readonly TraceChunk[]; meta: Partial<TraceMeta> };
};

export function TraceDetail({ trace }: TraceDetailProps) {
  return (
    <div className="border-line animate-rise mt-3 border-t border-dashed pt-2 font-mono text-xs">
      <ul>
        {trace.chunks.map((chunk) => (
          <li
            key={`${chunk.source}-${chunk.section}`}
            className="flex items-baseline justify-between gap-4 py-1"
          >
            <span className="text-text-2 truncate">
              {chunk.source} · {chunk.section}
            </span>
            <span className="text-gold">{chunk.score.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="text-text-3 mt-2">{agentConsole.traceMeta(trace.meta)}</p>
    </div>
  );
}
