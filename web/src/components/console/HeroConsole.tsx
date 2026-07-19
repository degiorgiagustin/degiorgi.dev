"use client";

// Client island boundary (spec 003 §6). "use client": hosts the dynamic
// import that keeps the interactive console (and the whole agent layer) out
// of the initial bundle; ssr:false + a same-size facsimile fallback makes the
// hydration swap zero-CLS.
import dynamic from "next/dynamic";
import { ConsoleFacsimile } from "./ConsoleFacsimile";

const Console = dynamic(
  () => import("./Console").then((module) => module.Console),
  { ssr: false, loading: () => <ConsoleFacsimile /> },
);

export function HeroConsole() {
  return <Console />;
}
