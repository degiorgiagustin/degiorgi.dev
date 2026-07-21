import { Tag } from "@/components/ui/Tag";

// One step of the journey timeline (spec 002 §4.3). Presentational — the node
// and rail live in Timeline, which owns the scroll behavior. Renders inside a
// `group` li whose data-lit state also turns the period label gold (prototype).
// Plain resolved strings, not Locale/t (spec 006): Timeline resolves each
// step's translatable fields once and passes plain data down, so this leaf
// (and any future one added under an already-wired section) never needs to
// know locale exists at all.
type TimelineStepProps = {
  period: string;
  role: string;
  org: string;
  narrative: string;
  tags: readonly string[];
};

export function TimelineStep({
  period,
  role,
  org,
  narrative,
  tags,
}: TimelineStepProps) {
  return (
    <div>
      <p className="tracking-label text-text-3 group-data-[lit=true]:text-gold font-mono text-xs uppercase transition-colors duration-400">
        {period}
      </p>
      <h3 className="text-text mt-2 text-xl font-medium">
        {role}
        <span className="text-text-3 font-light"> · {org}</span>
      </h3>
      <p className="leading-body text-text-2 mt-2 max-w-xl text-sm">
        {narrative}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag}>
            <Tag>{tag}</Tag>
          </li>
        ))}
      </ul>
    </div>
  );
}
