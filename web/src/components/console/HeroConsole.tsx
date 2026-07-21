"use client";

// Client island boundary (spec 003 §6). "use client": hosts the dynamic
// import that keeps the interactive console (and the whole agent layer) out
// of the initial bundle; ssr:false + a same-size facsimile fallback makes the
// hydration swap zero-CLS.
import dynamic from "next/dynamic";
import type { Locale } from "@/lib/i18n/locale";
import { ConsoleFacsimile } from "./ConsoleFacsimile";

// Two static, module-scope dynamic() calls — one per locale (spec 006 §7
// fix) — instead of one built inside the component. `loading` needs the real
// `locale` to render a matching facsimile, but eslint's
// react-hooks/static-components rule forbids creating a component during
// render even behind useMemo (React can drop that cache and remount). Both
// locales are fixed ahead of time here; HeroConsole just picks between them.
const ConsoleEn = dynamic(
  () => import("./Console").then((module) => module.Console),
  { ssr: false, loading: () => <ConsoleFacsimile locale="en" /> },
);
const ConsoleEs = dynamic(
  () => import("./Console").then((module) => module.Console),
  { ssr: false, loading: () => <ConsoleFacsimile locale="es" /> },
);

export function HeroConsole({ locale }: { locale: Locale }) {
  const Console = locale === "es" ? ConsoleEs : ConsoleEn;
  return <Console locale={locale} />;
}
