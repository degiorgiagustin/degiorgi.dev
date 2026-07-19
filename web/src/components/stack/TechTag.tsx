import type { IconSlug } from "@/components/stack/icons";
import { Icon } from "@/components/stack/Icon";
import { Tag } from "@/components/ui/Tag";

// Stack-specific Tag usage (spec 002 §4.5): icon slot + hover brighten.
// Tools without a known icon (icon undefined) render label-only via Tag.
type TechTagProps = {
  name: string;
  icon?: IconSlug;
};

export function TechTag({ name, icon }: TechTagProps) {
  return (
    <Tag interactive icon={icon ? <Icon slug={icon} /> : undefined}>
      {name}
    </Tag>
  );
}
