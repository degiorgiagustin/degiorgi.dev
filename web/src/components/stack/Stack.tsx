import { stack } from "@/content/messages";
import { t, type Locale } from "@/lib/i18n/locale";
import { PageSection } from "@/components/layout/PageSection";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHead } from "@/components/layout/SectionHead";
import { TechTag } from "@/components/stack/TechTag";

export function Stack({ locale }: { locale: Locale }) {
  return (
    <PageSection id="stack" className="pt-24 pb-16">
      <SectionHead
        eyebrow={{
          index: stack.eyebrow.index,
          label: t(stack.eyebrow.label, locale),
        }}
      />
      <div className="space-y-6">
        {stack.categories.map((category) => (
          <Reveal key={category.label.en}>
            {/* // comment motif, echoing the footnote below (spec 002 §4.5). */}
            <p className="tracking-label text-text-3 font-mono text-xs uppercase">
              {`// ${t(category.label, locale)}`}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {category.tools.map((tool) => (
                <li key={tool.name}>
                  <TechTag name={tool.name} icon={tool.icon} />
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="text-text-3 mt-6 font-mono text-xs">
          {t(stack.footnote, locale)}
        </p>
      </Reveal>
    </PageSection>
  );
}
