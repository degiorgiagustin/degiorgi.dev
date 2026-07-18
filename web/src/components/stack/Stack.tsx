import { stack } from "@/content/messages";
import { PageSection } from "@/components/layout/PageSection";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHead } from "@/components/layout/SectionHead";
import { Tag } from "@/components/ui/Tag";

export function Stack() {
  return (
    <PageSection id="stack" className="pt-24 pb-16">
      <SectionHead eyebrow={stack.eyebrow} />
      <Reveal>
        <ul className="mt-4 flex flex-wrap gap-2">
          {stack.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
        <p className="text-text-3 mt-3.5 font-mono text-xs">{stack.footnote}</p>
      </Reveal>
    </PageSection>
  );
}
