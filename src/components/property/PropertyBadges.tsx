import { Badge } from "@/components/ui/Badge";
import type { Property } from "@/lib/api/types";

export function getPropertyBadges(property: Property): {
  label: string;
  tone: "accent" | "warning" | "success" | "muted" | "neutral";
}[] {
  const badges: {
    label: string;
    tone: "accent" | "warning" | "success" | "muted" | "neutral";
  }[] = [];
  if (property.isExclusive)
    badges.push({ label: "Exclusivité", tone: "accent" });
  if (isNew(property)) badges.push({ label: "Nouveauté", tone: "success" });
  if (property.status === "SOUS_COMPROMIS")
    badges.push({ label: "Sous compromis", tone: "warning" });
  if (property.status === "SOUS_OFFRE")
    badges.push({ label: "Sous offre", tone: "warning" });
  return badges;
}

export function PropertyBadgesList({ property }: { property: Property }) {
  const badges = getPropertyBadges(property);
  if (badges.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((b) => (
        <Badge key={b.label} tone={b.tone}>
          {b.label}
        </Badge>
      ))}
    </div>
  );
}

function isNew(property: Property): boolean {
  const since = property.publishedAt ?? property.createdAt;
  if (!since) return false;
  const d = new Date(since);
  if (Number.isNaN(d.getTime())) return false;
  const days = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return days <= 14;
}
