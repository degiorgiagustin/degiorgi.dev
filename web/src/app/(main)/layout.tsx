import { LocaleLayout } from "@/components/layout/LocaleLayout";

// English route group (spec 006): (main) doesn't affect the URL — this is
// still "/", just organized so the default locale needs no /en prefix,
// while /es gets its own parallel layout. See LocaleLayout for why
// setLocale() has to happen here (an ancestor of Nav) rather than in the
// page itself.
export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LocaleLayout locale="en">{children}</LocaleLayout>;
}
