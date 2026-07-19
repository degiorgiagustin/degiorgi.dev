import { useState, useSyncExternalStore } from "react";
import { agentConsole } from "@/content/messages";
import { agentSession } from "@/lib/agent/session";
import { AnswerBlock } from "./AnswerBlock";
import { ConsoleFrame } from "./ConsoleFrame";
import { useTypingPlaceholder } from "./useTypingPlaceholder";

/*
 * Live hero console (spec 003 §2): a thin view over the shared AgentSession.
 * useSyncExternalStore subscribes this component to the session singleton —
 * any exchange (even one asked from the dock) re-renders here, which is what
 * makes the two surfaces "two views over one session" (spec 003 §4).
 */
export function Console() {
  const session = useSyncExternalStore(
    agentSession.subscribe,
    agentSession.getSnapshot,
    agentSession.getServerSnapshot,
  );
  const [value, setValue] = useState("");
  const placeholder = useTypingPlaceholder(agentConsole.placeholders);
  const busy = session.exchange?.status === "streaming";

  const submit = (question: string) => {
    setValue(question); // chips fill the input like the prototype
    void agentSession.ask(question);
  };

  return (
    <ConsoleFrame
      placeholder={placeholder}
      value={value}
      onValueChange={setValue}
      onSubmit={submit}
      busy={busy}
      locked={session.locked}
    >
      {session.exchange && (
        <AnswerBlock key={session.questionCount} exchange={session.exchange} />
      )}
    </ConsoleFrame>
  );
}
