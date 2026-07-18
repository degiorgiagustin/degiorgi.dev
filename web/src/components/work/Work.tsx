import { work } from "@/content/messages";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageSection } from "@/components/layout/PageSection";
import { Reveal } from "@/components/layout/Reveal";
import { WorkCard } from "@/components/work/WorkCard";

export function Work() {
  return (
    <PageSection id="work" className="pt-24 pb-16">
      <Reveal>
        <header className="mb-11">
          <Eyebrow index={work.eyebrow.index}>{work.eyebrow.label}</Eyebrow>
          <h2 className="text-text mt-2.5 text-2xl font-medium tracking-tight lg:text-3xl">
            {work.headline}
          </h2>
          <p className="leading-body text-text-2 mt-4 max-w-xs text-sm">
            {work.subline}
          </p>
        </header>
      </Reveal>
      <ul className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        {work.cards.map((card) => (
          <li key={card.title}>
            <Reveal>
              <WorkCard card={card} linkLabel={work.linkLabel} />
            </Reveal>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
