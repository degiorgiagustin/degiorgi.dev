import { agentConsole } from "@/content/messages";
import { t, type Locale } from "@/lib/i18n/locale";
import { ConsoleFrame } from "./ConsoleFrame";

// Static same-size stand-in rendered until the dynamic-imported Console
// hydrates (spec 003 §6, zero CLS). Shows the first placeholder phrase — the
// exact frame the live console starts from, so the swap is invisible.
// Locale-aware (spec 006 §7 fix) via HeroConsole's useMemo — see that file
// for why next/dynamic's `loading` option needed restructuring to pass this
// through at all.
export function ConsoleFacsimile({ locale }: { locale: Locale }) {
  return (
    <ConsoleFrame
      locale={locale}
      placeholder={t(agentConsole.placeholders[0], locale)}
    />
  );
}
