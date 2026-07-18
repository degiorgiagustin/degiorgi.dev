// Shared page-section shell (spec 002 §4). Server component.
// w-full is load-bearing: <main> is a column flex container, and mx-auto's
// auto cross-axis margins suppress flex stretch (CSS spec), so without an
// explicit width every section would shrink-to-fit its own content instead
// of filling the row before max-width caps it. className carries whatever is
// section-specific (padding, grid layout).
type PageSectionProps = {
  id: string;
  className?: string;
  children: React.ReactNode;
};

export function PageSection({ id, className, children }: PageSectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-6xl scroll-mt-16 px-4 ${className ?? ""}`}
    >
      {children}
    </section>
  );
}
