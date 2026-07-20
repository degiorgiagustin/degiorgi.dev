import { MockAgentAdapter } from "./mock-adapter";
import type { AgentAdapter } from "./types";

// The single swap point (spec 003 §8): Phase 3 replaces this export with the
// HTTP client for the real FastAPI/LangGraph service; nothing else changes.
export const agent: AgentAdapter = new MockAgentAdapter();
