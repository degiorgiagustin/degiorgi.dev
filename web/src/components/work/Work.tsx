import { work } from "@/content/messages";
import { PageSection } from "@/components/layout/PageSection";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHead } from "@/components/layout/SectionHead";
import { WorkCard } from "@/components/work/WorkCard";

export function Work() {
  return (
    <PageSection id="work" className="pt-24 pb-16">
      <SectionHead
        eyebrow={work.eyebrow}
        headline={work.headline}
        subline={work.subline}
      />
      <ul className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        {work.cards.map((card) => (
          <li key={card.title} className="h-full">
            <Reveal className="h-full">
              <WorkCard card={card} />
            </Reveal>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
