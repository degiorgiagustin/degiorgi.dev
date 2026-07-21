import { LocaleLayout } from "@/components/layout/LocaleLayout";

// Spanish route (spec 006): /es/*. Not yet linked from Nav or added to the
// sitemap — messages.ts's `es` fields are still placeholder copies of `en`
// (Phase 1, infrastructure only). Phase 2 adds real Spanish content and
// makes this route discoverable.
export default function SpanishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LocaleLayout locale="es">{children}</LocaleLayout>;
}
