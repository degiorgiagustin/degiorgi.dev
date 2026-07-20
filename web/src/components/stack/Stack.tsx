import { stack } from "@/content/messages";
import { PageSection } from "@/components/layout/PageSection";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHead } from "@/components/layout/SectionHead";
import { TechTag } from "@/components/stack/TechTag";

export function Stack() {
  return (
    <PageSection id="stack" className="pt-24 pb-16">
      <SectionHead eyebrow={stack.eyebrow} />
      <div className="space-y-6">
        {stack.categories.map((category) => (
          <Reveal key={category.label}>
            {/* // comment motif, echoing the footnote below (spec 002 §4.5). */}
            <p className="tracking-label text-text-3 font-mono text-xs uppercase">
              {`// ${category.label}`}
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
        <p className="text-text-3 mt-6 font-mono text-xs">{stack.footnote}</p>
      </Reveal>
    </PageSection>
  );
}
