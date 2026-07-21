import { useImperativeHandle, useLayoutEffect, useRef } from "react";

/*
 * Auto-growing prompt field shared by the hero console and the dock. A
 * textarea rather than <input> so long questions wrap and stay fully
 * readable (Gemini/ChatGPT behavior) instead of scrolling away
 * horizontally. Enter submits, Shift+Enter inserts a newline. Height tracks
 * content through the --prompt-h custom property (runtime-value exception)
 * consumed by .prompt-grow, capped by max-h-40, scrolling beyond.
 * text-base (not text-sm) below sm: iOS Safari auto-zooms the page on focus
 * for any input/textarea with font-size under 16px — text-base is exactly
 * 16px, the smallest size that avoids it. Reverts to text-sm at sm: and up,
 * where that behavior doesn't apply.
 * ariaLabel is a plain string, not Locale/t (spec 006): ConsoleFrame
 * resolves it once and passes it down — this leaf doesn't need to know
 * locale exists.
 */
type PromptInputProps = {
  ariaLabel: string;
  value: string;
  placeholder: string;
  onValueChange?: (value: string) => void;
  onSubmitRequest?: () => void;
  readOnly?: boolean;
  disabled?: boolean;
  ref?: React.Ref<HTMLTextAreaElement>;
};

export function PromptInput({
  ariaLabel,
  value,
  placeholder,
  onValueChange,
  onSubmitRequest,
  readOnly = false,
  disabled = false,
  ref,
}: PromptInputProps) {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => innerRef.current!, []);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (!value) {
      // Empty: rows=1 governs. Never measure the placeholder — the cycling
      // typing animation would pulse the console height otherwise.
      el.style.removeProperty("--prompt-h");
      return;
    }
    // Collapse, then measure: scrollHeight only reports true content height
    // from the collapsed state.
    el.style.setProperty("--prompt-h", "auto");
    el.style.setProperty("--prompt-h", `${el.scrollHeight}px`);
  }, [value]);

  return (
    <textarea
      ref={innerRef}
      rows={1}
      value={value}
      onChange={
        onValueChange ? (event) => onValueChange(event.target.value) : undefined
      }
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          onSubmitRequest?.();
        }
      }}
      readOnly={readOnly}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={ariaLabel}
      autoComplete="off"
      className="prompt-grow text-text placeholder:text-text-3 caret-gold max-h-40 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent font-mono text-base outline-none placeholder:select-none sm:text-sm"
    />
  );
}
