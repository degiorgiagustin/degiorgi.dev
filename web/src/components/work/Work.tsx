import { work } from "@/content/messages";
import { Eyebrow } from "../ui/Eyebrow";
import { WorkCard } from "./WorkCard";

export function Work() {
    return (
        <section id="work" className="mx-auto max-w-6xl scroll-mt-16 px-4 pt-24 pb-16">
            <header className="mb-11">
                <Eyebrow index={work.eyebrow.index}>{work.eyebrow.label}</Eyebrow>
                <h2 className="text-text mt-2.5 text-2xl font-medium tracking-tight lg:text-3xl">
                    {work.headline}
                </h2>
                <p className="leading-body text-text-2 mt-4 max-w-xs text-sm">
                    {work.subline}
                </p>
            </header>
            <ul className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
                {work.cards.map((card) => (
                    <li key={card.title}>
                        <WorkCard card={card} linkLabel={work.linkLabel} />
                    </li>
                ))}
            </ul>
        </section>
    );
}
