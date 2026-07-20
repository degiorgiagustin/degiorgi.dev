import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { agentConsole } from "@/content/messages";
import { agentSession } from "@/lib/agent/session";
import { AnswerBlock } from "./AnswerBlock";
import { ConsoleButton } from "./ConsoleButton";
import { PromptInput } from "./PromptInput";
import { TextButton } from "./TextButton";

/*
 * Docked omni-bar (spec 003 §3): the second view over the shared
 * AgentSession. Appears when the hero console leaves the viewport
 * (IntersectionObserver on #hero-console), hides when it returns. Answers
 * open in a floating card above the bar; the card closes on ✕, on Esc, and
 * is replaced by a new question. Focus moves into the card on open and back
 * to the input on close (spec 003 §6).
 */
export function Dock() {
  const session = useSyncExternalStore(
    agentSession.subscribe,
    agentSession.getSnapshot,
    agentSession.getServerSnapshot,
  );
  const [visible, setVisible] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [value, setValue] = useState("");
  const dockRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const busy = session.exchange?.status === "streaming";

  // Appear/hide: the dock exists exactly while the hero console doesn't.
  useEffect(() => {
    const heroConsole = document.getElementById("hero-console");
    if (!heroConsole) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(heroConsole);
    return () => observer.disconnect();
  }, []);

  /*
   * Mobile keyboard (spec 003 §3, explicit test case): when the virtual
   * keyboard opens, iOS Safari keeps position:fixed elements anchored to the
   * layout viewport, which the keyboard can cover. Track the visual viewport
   * and lift the dock by the occluded height via the --kb-offset custom
   * property (runtime-value exception) consumed by the .dock bottom calc.
   */
  useEffect(() => {
    const viewport = window.visualViewport;
    const dock = dockRef.current;
    if (!viewport || !dock) return;
    const update = () => {
      const occluded = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );
      dock.style.setProperty("--kb-offset", `${occluded}px`);
    };
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    update();
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  // Focus management (spec 003 §6): into the card when it opens.
  useEffect(() => {
    if (cardOpen) cardRef.current?.focus();
  }, [cardOpen]);

  const closeCard = () => {
    setCardOpen(false);
    inputRef.current?.focus();
  };

  const submitQuestion = () => {
    const question = value.trim();
    if (!question || busy) return;
    setValue("");
    setCardOpen(true); // new question replaces the previous card content
    void agentSession.ask(question);
  };

  return (
    <div
      ref={dockRef}
      inert={!visible}
      className={visible ? "dock show" : "dock"}
      onKeyDown={(event) => {
        if (event.key === "Escape" && cardOpen) closeCard();
      }}
    >
      {cardOpen && session.exchange && (
        <div
          ref={cardRef}
          tabIndex={-1}
          role="region"
          aria-label={agentConsole.dock.cardAriaLabel}
          className="bg-glass-solid border-line-strong rounded-panel shadow-panel animate-rise mb-2.5 border p-4 text-left outline-none"
        >
          <div className="mb-1 flex justify-end">
            <TextButton tone="muted" onClick={closeCard}>
              {agentConsole.dock.close}
            </TextButton>
          </div>
          <AnswerBlock
            key={session.questionCount}
            exchange={session.exchange}
            variant="card"
          />
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitQuestion();
        }}
        className="bg-glass-solid border-line-strong rounded-pill shadow-panel inset-shadow-bevel flex items-center gap-3 border py-2 pr-2 pl-4 backdrop-blur-lg"
      >
        <span aria-hidden className="text-gold font-mono text-xs select-none">
          ~ %
        </span>
        <PromptInput
          ref={inputRef}
          value={value}
          placeholder={agentConsole.dock.placeholder}
          onValueChange={setValue}
          onSubmitRequest={submitQuestion}
          readOnly={busy}
          disabled={session.locked}
        />
        <ConsoleButton
          variant="solid"
          type="submit"
          disabled={busy || session.locked}
        >
          {agentConsole.dock.send}
        </ConsoleButton>
      </form>
    </div>
  );
}
