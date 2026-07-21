import { work } from "@/content/messages";
import { t, type Locale } from "@/lib/i18n/locale";
import { PageSection } from "@/components/layout/PageSection";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHead } from "@/components/layout/SectionHead";
import { WorkCard } from "@/components/work/WorkCard";

export function Work({ locale }: { locale: Locale }) {
  return (
    <PageSection id="work" className="pt-24 pb-16">
      <SectionHead
        eyebrow={{
          index: work.eyebrow.index,
          label: t(work.eyebrow.label, locale),
        }}
        headline={t(work.headline, locale)}
        subline={t(work.subline, locale)}
      />
      <ul className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        {work.cards.map((card) => (
          <li key={card.title} className="h-full">
            <Reveal className="h-full">
              <WorkCard
                kind={t(card.kind, locale)}
                title={card.title}
                summary={t(card.summary, locale)}
              />
            </Reveal>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
