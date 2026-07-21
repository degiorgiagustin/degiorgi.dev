import { agentConsole } from "@/content/messages";
import { t } from "@/lib/i18n/locale";
import { ConsoleFrame } from "./ConsoleFrame";

// Static same-size stand-in rendered until the dynamic-imported Console
// hydrates (spec 003 §6, zero CLS). Shows the first placeholder phrase — the
// exact frame the live console starts from, so the swap is invisible.
// English-only regardless of route (spec 006 Phase 1): next/dynamic's
// `loading` option is a fixed function reference, not re-created per render,
// so it can't receive the real locale as a prop. Invisible for now since
// `es` content equals `en` content; Phase 2 (real Spanish) needs a different
// wiring here.
export function ConsoleFacsimile() {
  return (
    <ConsoleFrame
      locale="en"
      placeholder={t(agentConsole.placeholders[0], "en")}
    />
  );
}
