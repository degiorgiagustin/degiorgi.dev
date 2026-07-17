import type { JourneyStep } from "@/content/messages";
import { Tag } from "@/components/ui/Tag";

// One step of the journey timeline (spec 002 §4.3). Presentational — the node
// and rail live in Timeline, which owns the scroll behavior. Renders inside a
// `group` li whose data-lit state also turns the period label gold (prototype).
type TimelineStepProps = {
  step: JourneyStep;
};

export function TimelineStep({ step }: TimelineStepProps) {
  return (
    <div>
      <p className="tracking-label text-text-3 group-data-[lit=true]:text-gold font-mono text-xs uppercase transition-colors duration-400">
        {step.period}
      </p>
      <h3 className="text-text mt-2 text-xl font-medium">
        {step.role}
        <span className="text-text-3 font-light"> · {step.org}</span>
      </h3>
      <p className="leading-body text-text-2 mt-2 max-w-xl text-sm">
        {step.narrative}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {step.tags.map((tag) => (
          <li key={tag}>
            <Tag>{tag}</Tag>
          </li>
        ))}
      </ul>
    </div>
  );
}
