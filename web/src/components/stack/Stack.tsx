import { stack } from "@/content/messages";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageSection } from "@/components/layout/PageSection";
import { Reveal } from "@/components/layout/Reveal";
import { Tag } from "@/components/ui/Tag";

export function Stack() {
  return (
    <PageSection id="stack" className="pt-24 pb-16">
      <Reveal>
        <header className="mb-11">
          <Eyebrow index={stack.eyebrow.index}>{stack.eyebrow.label}</Eyebrow>
        </header>
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
