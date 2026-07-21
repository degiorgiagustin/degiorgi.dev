export type Locale = "en" | "es";
export type Localized = { en: string; es: string };

/*
 * Plain, explicit — no React Context, no cache(), no hidden global (spec
 * 006, third revision). Both previous approaches failed empirically:
 * cache()-based memoization raced across Next.js's static build workers
 * (verified: /es's generated HTML mixed correct and stale locale values),
 * and Context read via use() errored outright ("Cannot use() an already
 * resolved Client Reference") when a Server Component tried to consume a
 * Context object that had crossed a "use client" boundary. Threading
 * `locale` as an explicit prop through every component that needs it is
 * more verbose but has no failure mode to find — it's just data flow.
 */
export function t(field: Localized, locale: Locale): string {
  return field[locale];
}
