"use client";

// Client island boundary (spec 003 §6). "use client": hosts the dynamic
// import that keeps the interactive console (and the whole agent layer) out
// of the initial bundle; ssr:false + a same-size facsimile fallback makes the
// hydration swap zero-CLS.
import dynamic from "next/dynamic";
import type { Locale } from "@/lib/i18n/locale";
import { ConsoleFacsimile } from "./ConsoleFacsimile";

const Console = dynamic(
  () => import("./Console").then((module) => module.Console),
  { ssr: false, loading: () => <ConsoleFacsimile /> },
);

// The pre-hydration facsimile (loading, above) always shows the English
// placeholder regardless of locale — spec 006 Phase 1: es content equals en
// content right now, so this is invisible; Phase 2 would need the loading
// callback to know locale too, which next/dynamic doesn't support directly
// (it's a fixed function reference, not re-created per render).
export function HeroConsole({ locale }: { locale: Locale }) {
  return <Console locale={locale} />;
}
