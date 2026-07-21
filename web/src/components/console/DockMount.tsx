"use client";

// Client island boundary (spec 003 §6). "use client": hosts the dynamic
// import for the dock, which renders nothing until hydration by definition
// (invisible at load), so ssr:false with no fallback is exactly right.
import dynamic from "next/dynamic";
import type { Locale } from "@/lib/i18n/locale";

const Dock = dynamic(() => import("./Dock").then((module) => module.Dock), {
  ssr: false,
});

export function DockMount({ locale }: { locale: Locale }) {
  return <Dock locale={locale} />;
}
