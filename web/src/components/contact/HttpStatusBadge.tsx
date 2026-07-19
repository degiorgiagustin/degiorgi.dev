import { contact } from "@/content/messages";

// Closing "system voice" flourish (spec 002 §4.6, prototype's .http-status):
// the site describing itself as one last API response. Server component.
export function HttpStatusBadge() {
  return (
    <p className="text-text-3 inline-flex items-center gap-2 font-mono text-xs">
      <span>{contact.badge.prefix}</span>
      <span className="text-gold font-medium">{contact.badge.status}</span>
    </p>
  );
}
