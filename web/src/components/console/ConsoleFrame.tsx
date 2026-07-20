import { useRef } from "react";
import { agentConsole } from "@/content/messages";
import { ConsoleButton } from "./ConsoleButton";
import { PromptInput } from "./PromptInput";

/*
 * Presentational console shell (spec 003 §2): label, glass panel, prompt
 * line, chips. Shared by the live Console and the pre-hydration facsimile so
 * both render a pixel-identical footprint — that's what makes the dynamic
 * import swap zero-CLS (spec 003 §6). "Live" is inferred from the presence of
 * onSubmit; without it every control renders inert (disabled) but unchanged
 * visually.
 */
type ConsoleFrameProps = {
  placeholder: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (question: string) => void;
  busy?: boolean; // a question is streaming: submits ignored, input readonly
  locked?: boolean; // session budget exhausted: console goes inert
  children?: React.ReactNode; // answer area (live console only)
};

export function ConsoleFrame({
  placeholder,
  value = "",
  onValueChange,
  onSubmit,
  busy = false,
  locked = false,
  children,
}: ConsoleFrameProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const live = onSubmit !== undefined;
  const inert = !live || locked;

  // Specular border tracking: direct CSS-custom-property writes (--mx/--my,
  // the sanctioned runtime-value exception) instead of React state, so
  // pointer moves never trigger re-renders.
  const trackPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const panel = panelRef.current;
    if (!panel) return;
    const box = panel.getBoundingClientRect();
    panel.style.setProperty("--mx", `${e.clientX - box.left}px`);
    panel.style.setProperty("--my", `${e.clientY - box.top}px`);
  };

  const submitValue = () => {
    if (!busy && value.trim()) onSubmit?.(value.trim());
  };

  return (
    <div className="w-full text-left">
      {/* Terminal chrome (label, caret, controls) is UI, not content — none
          of it is text-selectable; answers remain selectable. */}
      <p className="tracking-label text-text-3 mb-2.5 flex items-center justify-center gap-2 font-mono text-xs uppercase select-none">
        <span aria-hidden className="bg-gold rounded-pill size-1.5" />
        {agentConsole.label}
      </p>

      <div
        ref={panelRef}
        onPointerMove={live ? trackPointer : undefined}
        className="specular-host bg-glass border-line rounded-panel shadow-panel inset-shadow-bevel focus-within:border-gold relative border backdrop-blur-lg"
      >
        {live && <span aria-hidden className="specular" />}

        <form
          className="flex items-center gap-3 px-4 py-3.5"
          onSubmit={(event) => {
            event.preventDefault();
            submitValue();
          }}
        >
          <span aria-hidden className="text-gold font-mono text-sm select-none">
            ~ %
          </span>
          <PromptInput
            value={value}
            placeholder={placeholder}
            onValueChange={onValueChange}
            onSubmitRequest={live ? submitValue : undefined}
            readOnly={busy || !live}
            disabled={inert}
          />
          <ConsoleButton
            variant="action"
            type="submit"
            disabled={inert || busy}
          >
            {agentConsole.ask}
          </ConsoleButton>
        </form>

        <div className="flex flex-wrap justify-center gap-2 px-4 pb-4">
          {agentConsole.canned.map(({ chip }) => (
            <ConsoleButton
              key={chip}
              variant="chip"
              disabled={inert || busy}
              onClick={live ? () => onSubmit?.(chip) : undefined}
            >
              {chip}
            </ConsoleButton>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}
