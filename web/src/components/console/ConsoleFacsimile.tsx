import { agentConsole } from "@/content/messages";
import { ConsoleFrame } from "./ConsoleFrame";

// Static same-size stand-in rendered until the dynamic-imported Console
// hydrates (spec 003 §6, zero CLS). Shows the first placeholder phrase — the
// exact frame the live console starts from, so the swap is invisible.
export function ConsoleFacsimile() {
  return <ConsoleFrame placeholder={agentConsole.placeholders[0]} />;
}
