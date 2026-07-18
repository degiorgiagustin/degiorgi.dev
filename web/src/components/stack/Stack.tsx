import { stack } from "@/content/messages";
import { Eyebrow } from "../ui/Eyebrow";
import { Tag } from "../ui/Tag";

export function Stack() {
    return (
        <section id="stack" className="mx-auto max-w-6xl scroll-mt-16 px-4 pt-24 pb-16">
            <header className="mb-11">
                <Eyebrow index={stack.eyebrow.index}>{stack.eyebrow.label}</Eyebrow>
                <h2 className="text-text mt-2.5 text-2xl font-medium tracking-tight lg:text-3xl">
                    {stack.headline}
                </h2>
                <p className="leading-body text-text-2 mt-4 max-w-xs text-sm">
                    {stack.subline}
                </p>
            </header>
            <ul className="mt-4 flex flex-wrap gap-2">
                {stack.tags.map((tag) => (
                    <li key={tag}>
                        <Tag>{tag}</Tag>
                    </li>
                ))}
            </ul>
            <p className="text-text-3 mt-3.5 font-mono text-xs">{stack.footnote}</p>
        </section>
    );
}