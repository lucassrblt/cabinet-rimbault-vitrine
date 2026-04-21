import { Star } from "lucide-react";

export function Rating({ value, max = 5 }: { value: number; max?: number }) {
  const filled = Math.round(value);
  return (
    <span
      className="inline-flex items-center gap-0.5 text-amber-500"
      role="img"
      aria-label={`${value} sur ${max}`}
    >
      {Array.from({ length: max }, (_, i) => (
        <Star
          // biome-ignore lint/suspicious/noArrayIndexKey: decorative, static length
          key={i}
          className="h-4 w-4"
          aria-hidden="true"
          fill={i < filled ? "currentColor" : "none"}
          stroke="currentColor"
        />
      ))}
    </span>
  );
}
